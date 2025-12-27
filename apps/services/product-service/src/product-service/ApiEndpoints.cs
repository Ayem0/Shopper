using Amazon.Lambda.Core;
using Amazon.Lambda.Annotations;
using Amazon.Lambda.Annotations.APIGateway;
using Services.ProductCategoryService;
using ShopifyClone.ProtoCs.Product.Types;
using ShopifyClone.Cs.Shared.src.Infra.Auth;
using ShopifyClone.ProtoCs.Authz.Types;
using ShopifyClone.ProtoCs.Common.Types;
using ShopifyClone.Cs.Shared.src.Infra.AWS;
using Services.ProductService;
using product_service.DTO;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http.Features;

[assembly: LambdaSerializer(typeof(CustomLambdaJsonSerializer))]

namespace product_service;

/// <summary>
/// A collection of sample Lambda functions that provide a REST api for doing simple math calculations. 
/// </summary>
public class ApiEndpoints
{
    private readonly IProductCategoryService _productCategoryService;
    private readonly IProductService _productService;
    private readonly AuthzClient _authzClient;
    private readonly ILogger<ApiEndpoints> _logger;
    public ApiEndpoints(
ILogger<ApiEndpoints> logger,
        IProductCategoryService productCategoryService,
        IProductService productService,
        AuthzClient authzClient
    )
    {
        _productCategoryService = productCategoryService;
        _productService = productService;
        _authzClient = authzClient;
        _logger = logger;
    }

    [LambdaFunction()]
    [HttpApi(LambdaHttpMethod.Post, "/product")]
    public async Task<CreateProductResponse> CreateProduct([FromBody] CreateProductRequestDTO req, ILambdaContext context)
    {
        // TODO fake userId to remove when auth is working
        var userId = new Guid("5549c55e-a7f7-4c30-935a-22eeeef2264f");
        var authzRes = await _authzClient.Authorize(new AuthorizeRequest { ShopId = req.ShopId, UserId = "5549c55e-a7f7-4c30-935a-22eeeef2264f" });
        if (!authzRes.IsAllowed)
        {
            context.Logger.LogInformation("NOT ALLOWED");
        }
        var res = await _productService.CreateAsync(DtoToProto(req));
        return res;
    }

    [LambdaFunction()]
    [HttpApi(LambdaHttpMethod.Post, "/product-category")]
    public async Task<CreateProductCategoryResponse> CreateProductCategory([FromBody] CreateProductCategoryRequest req, ILambdaContext context)
    {
        // TODO fake userId to remove when auth is working
        var userId = new Guid("5549c55e-a7f7-4c30-935a-22eeeef2264f");
        var authzRes = await _authzClient.Authorize(new AuthorizeRequest { ShopId = req.ShopId, UserId = "5549c55e-a7f7-4c30-935a-22eeeef2264f" });
        if (!authzRes.IsAllowed)
        {
            context.Logger.LogInformation("NOT ALLOWED");
        }
        var res = await _productCategoryService.CreateProductCategoryAsync(req, userId);
        return res;
    }

    [LambdaFunction()]
    [HttpApi(LambdaHttpMethod.Get, "/product-category")]
    public async Task<GetProductCategoriesResponse> GetProductCategories(
        ILambdaContext context,
        [FromQuery] string? shopId,
        [FromQuery] string? search,
        [FromQuery] IEnumerable<int>? status,
        [FromQuery] bool? desc,
        [FromQuery] int? sortBy,
        [FromQuery] int? pageIndex,
        [FromQuery] int? pageSize
    )
    {
        // TODO fake userId to remove when auth is working
        var userId = new Guid("5549c55e-a7f7-4c30-935a-22eeeef2264f");
        if (shopId == null)
            throw new Exception("SHOPID is REQUIRED");
        var authzRes = await _authzClient.Authorize(new AuthorizeRequest { ShopId = shopId, UserId = "5549c55e-a7f7-4c30-935a-22eeeef2264f" });
        if (!authzRes.IsAllowed)
        {
            context.Logger.LogInformation("NOT ALLOWED");
        }
        var req = CreateGetProductCategoriesRequest(status, search, sortBy, pageIndex, pageSize, desc, shopId);
        var res = await _productCategoryService.GetProductCategoriesAsync(req);
        return res;
    }

    private CreateProductRequest DtoToProto(CreateProductRequestDTO dto)
    {
        _logger.LogInformation("DTO : name '{}', status '{}', shopId '{}', categoryIds '{}', options '{}'", dto.Name, dto.Status, dto.ShopId, dto.CategoryIds, dto.VariantOptions);

        var res = new CreateProductRequest
        {
            CategoryIds = { dto.CategoryIds },
            Name = dto.Name,
            ShopId = dto.ShopId,
            Status = dto.Status,
            VariantOptions = { dto.VariantOptions.Select(vo => new VariantOption
            {
                Name = vo.Name,
                Values = {vo.Values}
            }) }
        };
        if (dto.Descr == null)
        {
            res.ClearDescr();
        }
        else
        {
            res.Descr = dto.Descr;
        }
        return res;
    }

    private static GetProductCategoriesRequest CreateGetProductCategoriesRequest(
        IEnumerable<int>? status,
        string? search,
        int? sortBy,
        int? pageIndex,
        int? pageSize,
        bool? desc,
        string shopId
    )
    {
        var validPageSize = pageSize == null || (pageSize != 10 && pageSize != 25 && pageSize != 50) ? 10 : pageSize.Value;
        // useless because default switch will fallback to updatedAt but better safe than sorry if i update the GetShops method
        var safeSortBy = (ProductCategorySortBy?)sortBy ?? ProductCategorySortBy.UpdatedAt;
        if (sortBy.HasValue && !Enum.IsDefined(typeof(ProductCategorySortBy), safeSortBy))
        {
            safeSortBy = ProductCategorySortBy.UpdatedAt;
        }
        var req = new GetProductCategoriesRequest
        {
            Desc = desc ?? false,
            SortBy = safeSortBy,
            Search = search ?? "",
            PageIndex = pageIndex ?? 0,
            PageSize = validPageSize,
            ShopId = shopId
        };
        if (status != null && status.Any())
        {
            // Filter out wrong enum indexes
            var validStatus = status.Where(t => Enum.IsDefined(typeof(ActiveStatus), t)).Select(t => (ActiveStatus)t);
            req.Status.AddRange(validStatus);
        }
        return req;
    }
}