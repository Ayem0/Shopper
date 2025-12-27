using Google.Protobuf;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShopifyClone.ProtoCs.Shop.Events;
using ShopifyClone.ProtoCs.Shop.Types;
using ShopifyClone.Cs.Shared.src.Core.Models;
using Data;
using DTO;
using Models;

namespace Services;

public class ShopService : IShopService
{
    private readonly ShopDbContext _dbContext;
    private const string _topic = nameof(ShopEvent);
    private readonly ILogger<ShopService> _logger;
    public ShopService(
        ShopDbContext dbContext,
        ILogger<ShopService> logger
    )
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    /// <summary>
    /// Create a new shop and adds the user as the owner
    /// </summary>
    /// <param name="req">The create shop request</param>
    /// <param name="userId">Keycloack userId</param>
    /// <returns>The create shop response</returns>
    public async Task<CreateShopResponse> CreateAsync(CreateShopRequest req, Guid userId)
    {
        _logger.LogInformation("CREATING SHOP WITH REQ - name: '{name}', type: '{type}'", req.Name, req.Type);
        using var transaction = await _dbContext.Database.BeginTransactionAsync();
        try
        {
            var shop = new Shop()
            {
                Name = req.Name,
                Type = req.Type,
            };
            var shopOwner = new ShopUser()
            {
                Shop = shop,
                ShopUserType = ShopUserType.Owner,
                UserId = userId,
            };
            var payload = new ShopEvent()
            {
                Created = new ShopCreated()
                {
                    ShopId = shop.Id.ToString(),
                    ShopType = shop.Type
                }
            };
            var msg = new OutboxMessage()
            {
                EventType = nameof(ShopCreated),
                AggregateId = shop.Id.ToString(),
                AggregateType = _topic,
                Payload = payload.ToByteArray(),
                Timestamp = DateTime.UtcNow
            };
            _dbContext.Shop.Add(shop);
            _dbContext.ShopUser.Add(shopOwner);
            _dbContext.OutboxMessage.Add(msg);
            await _dbContext.SaveChangesAsync();
            await transaction.CommitAsync();
            return new CreateShopResponse
            {
                ShopId = shop.Id.ToString()
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating shop : {message}, {data}", ex.Message, ex.Data);
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<GetShopMemberResponse> GetShopMember(GetShopMemberRequest req)
    {
        _logger.LogInformation("GETTING SHOP MEMBER REQ - shopId: '{s}', userId: '{u}'", req.ShopId, req.UserId);
        var userId = new Guid(req.UserId);
        var shopId = new Guid(req.ShopId);
        try
        {
            var res = await _dbContext.ShopUser
                .AsNoTracking()
                .Where(su => su.UserId == userId && su.ShopId == shopId)
                .Select(su => new { su.ShopId, su.UserId, su.ShopUserType })
                .FirstOrDefaultAsync();
            _logger.LogInformation("DATA FOUND: {data}", res);
            if (res == null)
                return new GetShopMemberResponse
                {
                    ShopMember = null
                };
            _logger.LogInformation("ROW FOUND");
            return new GetShopMemberResponse
            {
                ShopMember = new ShopMemberData
                {
                    ShopId = res.ShopId.ToString(),
                    UserId = res.UserId.ToString(),
                    ShopUserType = res.ShopUserType,
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting shop member for shopId '{sid}', userId: '{uId}' : {message}, {data}", shopId, userId, ex.Message, ex.Data);
            throw;
        }
    }

    public async Task<GetShopsResponse> GetShops(GetShopsRequest req, Guid userId)
    {
        _logger.LogInformation("GETTING SHOPS WITH REQ - searchTerm: '{searchTerm}', isActive: '{isActive}', orderBy: '{orderBy}', pageIndex: '{pageIndex}', pageSize: '{pageSize}', sortDesc: '{sortDesc}', typefilter: '{typefilter}' count {count}",
            req.SearchTerm,
            req.ActiveOnly,
            req.SortBy,
            req.PageIndex,
            req.PageSize,
            req.SortDescending,
            req.Types_,
            req.Types_.Count);
        try
        {
            var baseQuery = _dbContext.ShopUser
                .AsNoTracking()
                .Where(su => su.UserId == userId)
                .Select(su => new ShopDataDto
                {
                    Id = su.Shop.Id,
                    Name = su.Shop.Name,
                    IsActive = su.Shop.IsActive,
                    Type = su.Shop.Type,
                    UpdatedAt = su.Shop.UpdatedAt
                });
            var filteredQuery = ApplyQueryFilters(baseQuery, req);
            int totalResults = await filteredQuery.CountAsync();
            // Set max page index
            int maxPageIndex = 0;
            if (totalResults > 0)
                maxPageIndex = (int)Math.Ceiling((double)totalResults / req.PageSize) - 1;
            // Fix req page index if needed
            if (req.PageIndex > maxPageIndex)
                req.PageIndex = 0;
            var sortedQuery = ApplyQuerySorting(filteredQuery, req);
            var paginatedQuery = ApplyQueryPagination(sortedQuery, req);
            var shops = await paginatedQuery.ToArrayAsync();
            var res = new GetShopsResponse
            {
                PageIndex = req.PageIndex,
                PageSize = req.PageSize,
                TotalResults = totalResults,
                MaxPageIndex = maxPageIndex
            };
            res.Items.AddRange([.. shops.Select(s =>
            {
                var obj = new ShopData
                {
                    Id = s.Id.ToString(),
                    IsActive = s.IsActive,
                    Name = s.Name,
                    Type = s.Type,
                };
                if (s.UpdatedAt == null)
                    obj.ClearUpdatedAt();
                else
                    obj.UpdatedAt = s.UpdatedAt.ToString();
                return obj;
            })]);

            return res;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting shops for userid '{id}' : {message}, {data}", userId, ex.Message, ex.Data);
            throw;
        }
    }


    private static IQueryable<ShopDataDto> ApplyQueryFilters(IQueryable<ShopDataDto> query, GetShopsRequest req)
    {
        if (req.ActiveOnly)
            query = query.Where(s => s.IsActive);
        if (req.Types_.Count != 0)
            query = query.Where(s => req.Types_.Contains(s.Type));
        if (!string.IsNullOrWhiteSpace(req.SearchTerm))
            query = query.Where(s => EF.Functions.ILike(s.Name, $"%{req.SearchTerm}%"));
        return query;
    }

    private static IOrderedQueryable<ShopDataDto> ApplyQuerySorting(IQueryable<ShopDataDto> query, GetShopsRequest req)
    {
        return req.SortBy switch
        {
            ShopSortBy.Name => req.SortDescending
                ? query.OrderByDescending(s => s.Name).ThenBy(s => s.Id)
                : query.OrderBy(s => s.Name).ThenBy(s => s.Id),
            _ => req.SortDescending
                ? query.OrderByDescending(s => s.UpdatedAt).ThenBy(s => s.Id)
                : query.OrderBy(s => s.UpdatedAt).ThenBy(s => s.Id),
        };
    }

    private static IQueryable<ShopDataDto> ApplyQueryPagination(IQueryable<ShopDataDto> query, GetShopsRequest req)
    {
        return query.Skip(req.PageIndex * req.PageSize).Take(req.PageSize);
    }
}
