using Models;
using ShopifyClone.ProtoCs.Product.Types;

namespace Services.ProductCategoryService;

public interface IProductCategoryService
{
    public Task<CreateProductCategoryResponse> CreateProductCategoryAsync(CreateProductCategoryRequest request, Guid shopId);
    public Task<GetProductCategoriesResponse> GetProductCategoriesAsync(GetProductCategoriesRequest request, Guid shopId);
    public Task<ProductCategory?> GetProductCategoryAsync(Guid id, Guid shopId);
}
