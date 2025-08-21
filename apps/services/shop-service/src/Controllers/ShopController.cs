using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopifyClone.Cs.ProtoCs.Shop.Types;
using ShopifyClone.Services.ShopService.src.Services.Interfaces;

namespace shop_service.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShopController : ControllerBase
    {
        private readonly IShopService _shopService;
        public ShopController(IShopService shopService)
        {
            _shopService = shopService;
        }

        [HttpPost("")]
        public async Task<IActionResult> Create(CreateShopRequest req)
        {
            var userId = Guid.CreateVersion7().ToString();
            var res = await _shopService.CreateAsync(req, userId);
            return Ok(res);
        }
    }
}
