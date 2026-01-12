using System.Linq.Expressions;
using AutoMapper;
using Data;
using Google.Protobuf;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models;
using product_service.DTO;
using Services.ProductCategoryService;
using ShopifyClone.Cs.Shared.src.Core.Models;
using ShopifyClone.Cs.Shared.src.Infra.EFCore;
using ShopifyClone.ProtoCs.Product.Events;
using ShopifyClone.ProtoCs.Product.Types;

namespace Services.ProductService;

public class ProductService : IProductService
{
    private readonly ILogger<IProductService> _logger;
    private readonly ProductDbContext _context;
    private readonly IEFCoreQueryAdapter _efAdapter;
    private readonly IMapper _mapper;
    private readonly IProductCategoryService _productCategoryService;
    private const string _topic = nameof(ProductEvent);
    private static readonly Dictionary<ProductSortBy, Expression<Func<ProductVariantDTO, object?>>> _sortMap =
        new()
        {
            { ProductSortBy.Name, s => s.Name},
            { ProductSortBy.UpdatedAt, s => s.UpdatedAt },
            {ProductSortBy.Unspecified, s => s.UpdatedAt }
        };

    public ProductService(
        ProductDbContext context,
        ILogger<ProductService> logger,
        IEFCoreQueryAdapter efAdapter,
        IProductCategoryService productCategoryService,
        IMapper mapper
    )
    {
        _efAdapter = efAdapter;
        _context = context;
        _logger = logger;
        _productCategoryService = productCategoryService;
        _mapper = mapper;
    }

    public async Task<CreateProductResponse> CreateProductAsync(CreateProductRequest req, Guid shopId)
    {
        _logger.LogInformation("Creating product with request: {}", req);
        List<ProductCategory>? categories = null;
        if (req.CategoryIds.Count > 0)
        {
            categories = [];
            foreach (var categoryId in req.CategoryIds)
            {
                var categoryGuid = new Guid(categoryId);
                var category = await _productCategoryService.GetProductCategoryAsync(categoryGuid, shopId)
                    ?? throw new Exception("Category not found");
                categories.Add(category);
            }
        }
        return await CreateProductAsync(req, shopId, categories);
    }

    public async Task<GetProductsResponse> GetProductsAsync(GetProductsRequest req, Guid shopId)
    {
        try
        {
            var (items, totalResults, maxPageIndex, pageIndex, pageSize) = await _context.ProductVariants
               .Where(p => p.ShopId == shopId)
               // TODO voir si les fields selected match le proto
               .Select(pv => new ProductVariantDTO
               {
                   Id = pv.Id,
                   Name = pv.Name,
                   ShopId = pv.ShopId,
                   Status = pv.Status,
                   UpdatedAt = pv.UpdatedAt,
                   Product = new ProductDTO
                   {
                       Id = pv.Product.Id,
                       Name = pv.Product.Name,
                       Descr = pv.Product.Name,
                       ShopId = pv.Product.ShopId,
                       Status = pv.Product.Status,
                       UpdatedAt = pv.Product.UpdatedAt,
                       Categories = pv.Product.Categories.Select(c => new ProductCategoryDTO
                       {
                           Id = c.Id,
                           Name = c.Name,
                           ShopId = c.ShopId,
                       }).ToList(),
                   },
                   CreatedAt = pv.CreatedAt,
                   VariantOptionValues = pv.VariantOptionValues.Select(vov => new VariantOptionValueDTO
                   {
                       Id = vov.Id,
                       Value = vov.Value,
                       OptionId = vov.VariantOptionId,
                       ShopId = vov.ShopId,
                       OptionName = vov.VariantOption.Name
                   }).ToList()
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
            var res = new GetProductsResponse
            {
                PageIndex = pageIndex,
                PageSize = pageSize,
                TotalResults = totalResults,
                MaxPageIndex = maxPageIndex,
                Items = { _mapper.Map<ProductVariantData[]>(items) }
            };
            return res;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "ERROR GETTING CATEGORIES WITH REQ: '{}', {}", req, ex.Message);
            throw;
        }
    }

    private async Task<CreateProductResponse> CreateProductAsync(CreateProductRequest req, Guid shopId, List<ProductCategory>? categories)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var product = new Product()
            {
                Name = req.Name,
                Status = req.Status,
                ShopId = shopId,
                Categories = categories ?? [],
            };

            if (req.VariantOptions.Count > 0)
            {
                product.ProductVariants = CreateProductVariants(req.VariantOptions, product);
            }
            else
            {
                product.ProductVariants = [new ProductVariant {
                    Product = product,
                    ProductId = product.Id,
                    ShopId = shopId,
                    Status = req.Status,
                    Name = product.Name
                }];
            }

            var productId = product.Id.ToString();
            var payload = new ProductEvent()
            {
                Created = new ProductCreated()
                {
                    ProductId = productId,
                }
            };
            var msg = new OutboxMessage()
            {
                EventType = nameof(ProductCreated),
                AggregateId = productId,
                AggregateType = _topic,
                Payload = payload.ToByteArray(),
                Timestamp = DateTime.UtcNow
            };
            _context.Products.Add(product);
            _context.OutboxMessage.Add(msg);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return new()
            {
                ProductId = productId
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating shop : {message}, {data}", ex.Message, ex.Data);
            await transaction.RollbackAsync();
            throw;
        }
    }

    private static List<ProductVariant> CreateProductVariants(
        IEnumerable<ShopifyClone.ProtoCs.Product.Types.VariantOption> options,
        Product product)
    {
        // Create VariantOptions + Values
        var variantOptions = CreateVariantOptions(options, product);

        // Cartesian product
        var variantOptionsValues = CreateVariantOptionsValues(variantOptions);

        // Create ProductVariants
        return [.. variantOptionsValues.Select(variantOptionValues => new ProductVariant
        {
            Product = product,
            ShopId = product.ShopId,
            Name = product.Name,
            VariantOptionValues = variantOptionValues
        })];
    }

    private static IEnumerable<Models.VariantOption> CreateVariantOptions(IEnumerable<ShopifyClone.ProtoCs.Product.Types.VariantOption> options,
        Product product)
    {
        return options.Select(option =>
        {
            var vo = new Models.VariantOption
            {
                Name = option.Name,
                ShopId = product.ShopId,
            };

            vo.VariantOptionValues = [.. option.Values
                .Select(v => new VariantOptionValue
                {
                    Value = v,
                    ShopId = product.ShopId,
                    VariantOption = vo
                })];

            return vo;
        });
    }

    private static List<List<VariantOptionValue>> CreateVariantOptionsValues(IEnumerable<Models.VariantOption> variantOptions)
    {
        List<List<VariantOptionValue>> results = [[]];

        foreach (var option in variantOptions)
        {
            var next = new List<List<VariantOptionValue>>();

            foreach (var existing in results)
            {
                foreach (var value in option.VariantOptionValues)
                {
                    var combination = new List<VariantOptionValue>(existing)
                    {
                        value
                    };

                    next.Add(combination);
                }
            }
            results = next;
        }

        return results;
    }
}
