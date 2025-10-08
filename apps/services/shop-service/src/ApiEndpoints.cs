using Amazon.Lambda.Core;
using Amazon.Lambda.Annotations;
using Amazon.Lambda.Annotations.APIGateway;
using ShopifyClone.Services.ShopService.src.Services;
using ShopifyClone.Cs.ProtoCs.Shop.Types;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

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
        var userId = Guid.NewGuid().ToString();
        var res = await _shopService.CreateAsync(req, userId);
        return res;
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

    //     /// <summary>
    //     /// Perform x - y.
    //     /// </summary>
    //     /// <param name="x">Left hand operand of the arithmetic operation.</param>
    //     /// <param name="y">Right hand operand of the arithmetic operation.</param>
    //     /// <returns>x subtract y</returns>
    //     [LambdaFunction()]
    //     [HttpApi(LambdaHttpMethod.Get, "/subtract/{x}/{y}")]
    //     public int Subtract(int x, int y, ILambdaContext context)
    //     {
    //         var difference = _shopService.Subtract(x, y);

    //         context.Logger.LogInformation($"{x} subtract {y} is {difference}");
    //         return difference;
    //     }

    //     /// <summary>
    //     /// Perform x * y.
    //     /// </summary>
    //     /// <param name="x">Left hand operand of the arithmetic operation.</param>
    //     /// <param name="y">Right hand operand of the arithmetic operation.</param>
    //     /// <returns>x multiply y</returns>
    //     [LambdaFunction()]
    //     [HttpApi(LambdaHttpMethod.Get, "/multiply/{x}/{y}")]
    //     public int Multiply(int x, int y, ILambdaContext context)
    //     {
    //         var product = _shopService.Multiply(x, y);

    //         context.Logger.LogInformation($"{x} multiplied by {y} is {product}");
    //         return product;
    //     }

    //     /// <summary>
    //     /// Perform x / y.
    //     /// </summary>
    //     /// <param name="x">Left hand operand of the arithmetic operation.</param>
    //     /// <param name="y">Right hand operand of the arithmetic operation.</param>
    //     /// <returns>x divide y</returns>
    //     [LambdaFunction()]
    //     [HttpApi(LambdaHttpMethod.Get, "/divide/{x}/{y}")]
    //     public int Divide(int x, int y, ILambdaContext context)
    //     {
    //         var quotient = _shopService.Divide(x, y);

    //         context.Logger.LogInformation($"{x} divided by {y} is {quotient}");
    //         return quotient;
    //     }
}