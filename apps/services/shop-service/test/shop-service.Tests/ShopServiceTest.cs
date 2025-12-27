using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Data;
using Services;
using Xunit;
using Models.Generated;

namespace shop_service.Tests;

public class ShopServiceTest
{
    // private readonly ShopService _shopService;
    // public ShopServiceTest()
    // {
    //     var options = new DbContextOptionsBuilder<ShopDbContext>()
    //         .UseModel(ShopDbContextModel.Instance)
    //         .UseNpgsql("Host=localhost;Port=5434;Database=shop-database;Username=root;Password=root",
    //             opt => opt.SetPostgresVersion(17, 0))
    //         .Options;
    //     _shopService = new ShopService(new ShopDbContext(options), new NullLogger<ShopService>());
    // }
    // [Fact]
    // public async Task TestShopQuery()
    // {
    // // Given
    // var sw = Stopwatch.StartNew();
    // var req = await _shopService.GetShops(new ShopifyClone.Cs.ProtoCs.Shop.Types.GetShopsRequest
    // {
    //     ActiveOnly = false,
    //     PageIndex = 0,
    //     PageSize = 10,
    //     SearchTerm = "",
    //     SortBy = ShopifyClone.Cs.ProtoCs.Shop.Types.ShopSortBy.UpdatedAt,
    //     SortDescending = false,
    // }, new Guid("5549c55e-a7f7-4c30-935a-22eeeef2264f"));
    // sw.Stop();
    // Console.WriteLine($"Query without searchTerm took : {sw.ElapsedMilliseconds} ms");
    // sw.Restart();
    // var req2 = await _shopService.GetShops(new ShopifyClone.Cs.ProtoCs.Shop.Types.GetShopsRequest
    // {
    //     ActiveOnly = false,
    //     PageIndex = 0,
    //     PageSize = 10,
    //     SearchTerm = "nike",
    //     SortBy = ShopifyClone.Cs.ProtoCs.Shop.Types.ShopSortBy.UpdatedAt,
    //     SortDescending = false,
    // }, new Guid("5549c55e-a7f7-4c30-935a-22eeeef2264f"));
    // sw.Stop();
    // Console.WriteLine($"Query with searchTerm took : {sw.ElapsedMilliseconds} ms");
    // sw.Restart();
    // var req3 = await _shopService.GetShops(new ShopifyClone.Cs.ProtoCs.Shop.Types.GetShopsRequest
    // {
    //     ActiveOnly = false,
    //     PageIndex = 0,
    //     PageSize = 10,
    //     SearchTerm = "",
    //     SortBy = ShopifyClone.Cs.ProtoCs.Shop.Types.ShopSortBy.UpdatedAt,
    //     SortDescending = false,
    // }, new Guid("5549c55e-a7f7-4c30-935a-22eeeef2264f"));
    // sw.Stop();
    // Console.WriteLine($"Query without searchTerm took : {sw.ElapsedMilliseconds} ms");
    // When
    // Then
    // }
}
