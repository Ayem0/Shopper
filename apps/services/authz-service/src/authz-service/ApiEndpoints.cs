using System.Net;
using System.Text.Json;
using Amazon.Lambda.Annotations;
using Amazon.Lambda.Annotations.APIGateway;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using authz_service.Services.AuthzService;
using ShopifyClone.Cs.Shared.src.Infra.AWS;
using ShopifyClone.ProtoCs.Shop.Types;

[assembly: LambdaSerializer(typeof(CustomLambdaJsonSerializer))]

namespace authz_service;

public class ApiEndpoints
{
    private readonly IAuthzService _authzService;
    public ApiEndpoints(IAuthzService authzService)
    {
        _authzService = authzService;
    }

    [LambdaFunction()]
    [HttpApi(LambdaHttpMethod.Get, "/authorize")]
    public async Task<APIGatewayHttpApiV2ProxyResponse> Authorize([FromQuery] string shopId, [FromQuery] string userId, [FromQuery] int? type, ILambdaContext context)
    {
        context.Logger.Log("GET Authorize shopId: {shopId}, userId :{userId}, type :{type}", shopId, userId, type);
        if (type.HasValue && !Enum.IsDefined(typeof(ShopUserType), type))
        {
            var body = new Microsoft.AspNetCore.Mvc.ProblemDetails
            {
                Title = "Invalid type",
            };
            return new APIGatewayHttpApiV2ProxyResponse
            {
                StatusCode = (int)HttpStatusCode.BadRequest,
                Body = JsonSerializer.Serialize(body)
            };
        }
        var res = await _authzService.Authorize(shopId, userId, (ShopUserType?)type);
        return new APIGatewayHttpApiV2ProxyResponse
        {
            StatusCode = (int)HttpStatusCode.OK,
            Body = JsonSerializer.Serialize(res)
        };
    }
}