using Amazon.Lambda.Core;
using Amazon.Lambda.Annotations;
using Amazon.Lambda.Annotations.APIGateway;
using Services;
using ShopifyClone.Cs.ProtoCs.Shop.Types;
using ShopifyClone.Services.ShopService.src.Config;

[assembly: LambdaSerializer(typeof(CustomLambdaJsonSerializer))]
// [assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace shop_service;

public class ApiEndpoints
{
    private readonly IShopService _shopService;
    public ApiEndpoints(IShopService shopService)
    {
        _shopService = shopService;
    }

    [LambdaFunction()]
    [HttpApi(LambdaHttpMethod.Post, "/")]
    public async Task<CreateShopResponse> CreateShop([FromBody] CreateShopRequest req, ILambdaContext context)
    {
        // TODO fake userId to remove when auth is working
        var userId = new Guid("5549c55e-a7f7-4c30-935a-22eeeef2264f");
        var res = await _shopService.CreateAsync(req, userId);
        return res;
    }

    // [Authorize]
    [LambdaFunction()]
    [HttpApi(LambdaHttpMethod.Get, "/")]
    public async Task<GetShopsResponse> GetShops(
        ILambdaContext context,
        [FromQuery] IEnumerable<int>? types,
        [FromQuery] string? searchTerm,
        [FromQuery] int? sortBy,
        [FromQuery] int? pageIndex,
        [FromQuery] int? pageSize,
        [FromQuery] bool? activeOnly,
        [FromQuery] bool? sortDescending
    )
    {
        var req = CreateGetShopsRequest(types, searchTerm, sortBy, pageIndex, pageSize, activeOnly, sortDescending);
        // TODO fake userId to remove when auth is working
        var userId = new Guid("5549c55e-a7f7-4c30-935a-22eeeef2264f");
        var res = await _shopService.GetShops(req, userId);
        return res;
    }

    private static GetShopsRequest CreateGetShopsRequest(
        IEnumerable<int>? types,
        string? searchTerm,
        int? sortBy,
        int? pageIndex,
        int? pageSize,
        bool? activeOnly,
        bool? sortDescending
    )
    {
        var validPageSize = pageSize == null || (pageSize != 10 && pageSize != 25 && pageSize != 50) ? 10 : pageSize.Value;
        // useless because default switch will fallback to updatedAt but better safe than sorry if i update the GetShops method
        var safeSortBy = (ShopSortBy?)sortBy ?? ShopSortBy.UpdatedAt;
        if (sortBy.HasValue && !Enum.IsDefined(typeof(ShopSortBy), safeSortBy))
        {
            safeSortBy = ShopSortBy.UpdatedAt;
        }
        var req = new GetShopsRequest
        {
            ActiveOnly = activeOnly ?? false,
            SortBy = safeSortBy,
            SearchTerm = searchTerm ?? "",
            PageIndex = pageIndex ?? 0,
            PageSize = validPageSize,
            SortDescending = sortDescending ?? false,
        };
        if (types != null && types.Any())
        {
            // Filter out wrong enum indexes
            var validTypes = types.Where(t => Enum.IsDefined(typeof(ShopType), t)).Select(t => (ShopType)t);
            req.Types_.AddRange(validTypes);
        }
        return req;
    }

    //     /// <summary>
    //     /// Root route that provides information about the other requests that can be made.
    //     /// </summary>
    //     /// <returns>API descriptions.</returns>
    //     [LambdaFunction()]
    //     [HttpApi(LambdaHttpMethod.Get, "/")]
    //     public string Default()
    //     {
    //         var docs = @"Lambda shop Home:
    // You can make the following requests to invoke other Lambda functions perform shop operations:
    // /add/{x}/{y}
    // /subtract/{x}/{y}
    // /multiply/{x}/{y}
    // /divide/{x}/{y}
    // ";
    //         return docs;
    //     }

    //     /// <summary>
    //     /// Perform x + y
    //     /// </summary>
    //     /// <param name="x">Left hand operand of the arithmetic operation.</param>
    //     /// <param name="y">Right hand operand of the arithmetic operation.</param>
    //     /// <returns>Sum of x and y.</returns>
    //     [LambdaFunction()]
    //     [HttpApi(LambdaHttpMethod.Get, "/add/{x}/{y}")]
    //     public int Add(int x, int y, ILambdaContext context)
    //     {
    //         var sum = _shopService.Add(x, y);

    //         context.Logger.LogInformation($"{x} plus {y} is {sum}");
    //         return sum;
    //     }
}