using System;

namespace Services.ProductService;

public interface IProductService
{
    public object CreateAsync();
    public object UpdateAsync(Guid id);
    public object DeleteAsync(Guid id);
    public object GetByShopAsync(Guid shopId);
}
