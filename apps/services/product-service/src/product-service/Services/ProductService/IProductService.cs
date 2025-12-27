using System;
using ShopifyClone.ProtoCs.Product.Types;

namespace Services.ProductService;

public interface IProductService
{
    public Task<CreateProductResponse> CreateProductAsync(CreateProductRequest req, Guid shopId);
    public Task<GetProductsResponse> GetProductsAsync(GetProductsRequest req, Guid shopId);
}
