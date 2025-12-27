using Data;
using Microsoft.Extensions.Logging;
using Models;
using ShopifyClone.ProtoCs.Product.Types;
using ShopifyClone.ProtoCs.Product.Events;
using ShopifyClone.Cs.Shared.src.Core.Models;
using Microsoft.EntityFrameworkCore;
using Google.Protobuf;
using ShopifyClone.Cs.Shared.src.Infra.EFCore;
using System.Linq.Expressions;
using product_service.DTO;
using product_service.Infra;
using AutoMapper;

namespace Services.ProductCategoryService;

public class ProductCategoryService : IProductCategoryService
{
    private readonly ILogger<ProductCategoryService> _logger;
    private readonly ProductDbContext _context;
    private readonly IMapper _mapper;
    private readonly IEFCoreQueryAdapter _efAdapter;
    private const string _topic = nameof(ProductCategoryEvent);
    private const int _maxDepth = 8;
    private static readonly Dictionary<ProductCategorySortBy, Expression<Func<ProductCategoryDTO, object?>>> _sortMap =
        new()
        {
            { ProductCategorySortBy.Name, s => s.Name},
            { ProductCategorySortBy.UpdatedAt, s => s.UpdatedAt },
            {ProductCategorySortBy.Unspecified, s => s.UpdatedAt }
        };

    public ProductCategoryService(
        ProductDbContext context,
        ILogger<ProductCategoryService> logger,
        IEFCoreQueryAdapter efAdapter,
        IMapper mapper
    )
    {
        _efAdapter = efAdapter;
        _context = context;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<CreateProductCategoryResponse> CreateProductCategoryAsync(CreateProductCategoryRequest req, Guid shopId)
    {
        ProductCategory? parent = null;
        if (req.HasParentCategoryId)
        {
            var parentId = new Guid(req.ParentCategoryId);
            parent = await GetProductCategoryAsync(parentId, shopId)
                ?? throw new Exception("Parent category not found");
            var depth = await GetCategoryDepthSqlAsync(parentId);
            if (depth >= _maxDepth)
                throw new Exception("Max depth reached");
        }
        return await CreateProductCategoryAsync(req, shopId, parent);
    }

    private async Task<CreateProductCategoryResponse> CreateProductCategoryAsync(CreateProductCategoryRequest req, Guid shopId, ProductCategory? parent)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var productCategory = new ProductCategory()
            {
                Name = req.Name,
                Status = req.Status,
                ShopId = shopId,
                ParentCategory = parent,
                ParentCategoryId = parent?.Id
            };
            var productCategoryId = productCategory.Id.ToString();
            var payload = new ProductCategoryEvent()
            {
                Created = new ProductCategoryCreated()
                {
                    ProductCategoryId = productCategoryId,
                }
            };
            var msg = new OutboxMessage()
            {
                EventType = nameof(ProductCategoryCreated),
                AggregateId = productCategoryId,
                AggregateType = _topic,
                Payload = payload.ToByteArray(),
                Timestamp = DateTime.UtcNow
            };
            _context.ProductCategories.Add(productCategory);
            _context.OutboxMessage.Add(msg);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return new CreateProductCategoryResponse
            {
                CategoryId = productCategoryId
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating shop : {message}, {data}", ex.Message, ex.Data);
            await transaction.RollbackAsync();
            throw;
        }
    }

    private async Task<int> GetCategoryDepthSqlAsync(Guid categoryId)
    {
        var sql = @"
            WITH RECURSIVE parent_chain AS (
                SELECT 
                    ""Id"",
                    ""ParentCategoryId"",
                    1 AS depth
                FROM ""ProductCategories""
                WHERE ""Id"" = @Id

                UNION ALL

                SELECT 
                    pc.""Id"",
                    pc.""ParentCategoryId"",
                    parent_chain.depth + 1
                FROM ""ProductCategories"" pc
                INNER JOIN parent_chain ON pc.""Id"" = parent_chain.""ParentCategoryId""
            )
            SELECT MAX(depth) AS ""Value""
            FROM parent_chain
        ";

        var idParam = new Npgsql.NpgsqlParameter("Id", categoryId);

        var result = await _context.Database
            .SqlQueryRaw<int>(sql, idParam)
            .FirstAsync();

        return result;
    }

    public async Task<ProductCategory?> GetProductCategoryAsync(Guid id, Guid shopId)
    {
        try
        {
            return await _context.ProductCategories
                .Where(x => x.Id == id && x.ShopId == shopId)
                .Include(x => x.ParentCategory)
                .FirstOrDefaultAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting product category with id : '{}', {}, {}", id, ex.Message, ex.Data);
            return null;
        }
    }

    public async Task<GetProductCategoriesResponse> GetProductCategoriesAsync(GetProductCategoriesRequest req, Guid shopId)
    {
        try
        {
            var (items, totalResults, maxPageIndex, pageIndex, pageSize) = await _context.ProductCategories
               .Where(pc => pc.ShopId == shopId)
               .Select(pc => new ProductCategoryDTO
               {
                   Id = pc.Id,
                   Name = pc.Name,
                   Status = pc.Status,
                   ShopId = pc.ShopId,
                   ParentCategoryId = pc.ParentCategoryId,
                   UpdatedAt = pc.UpdatedAt,
                   ParentCategory = pc.ParentCategory == null ? null : new ProductCategoryDTO
                   {
                       Id = pc.ParentCategory.Id,
                       Name = pc.ParentCategory.Name,
                       Status = pc.ParentCategory.Status,
                       ShopId = pc.ParentCategory.ShopId,
                       UpdatedAt = pc.ParentCategory.UpdatedAt,
                       ParentCategoryId = pc.ParentCategory.ParentCategoryId,
                       ParentCategory = null
                   }
               })
               .TableQuery(new()
               {
                   Desc = req.Desc,
                   Filters = [
                        req.Status.Count != 0 ? pc => req.Status.Contains(pc.Status) : null,
                        !string.IsNullOrWhiteSpace(req.Search) ? pc => EF.Functions.ILike(pc.Name, $"%{req.Search}%") : null
                    ],
                   PrimarySortingSelector = _sortMap[req.SortBy],
                   SecondarySortingSelector = pc => pc.Id,
                   ReqPageIndex = req.PageIndex,
                   ReqPageSize = req.PageSize,
               },
                _efAdapter);
            var res = new GetProductCategoriesResponse
            {
                PageIndex = pageIndex,
                PageSize = pageSize,
                TotalResults = totalResults,
                MaxPageIndex = maxPageIndex,
                Items = { items.Select(pc => _mapper.Map<ProductCategoryData>(pc)) }
            };
            return res;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "ERROR GETTING CATEGORIES WITH REQ: '{}', {}", req, ex.Message);
            throw;
        }
    }
}
