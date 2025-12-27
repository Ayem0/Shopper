using System;
using Amazon.DynamoDBv2.DataModel;
using ShopifyClone.ProtoCs.Shop.Types;

namespace authz_service.Models;

[DynamoDBTable("Authz")]
public class Authz
{
    [DynamoDBHashKey]
    public required string ShopId { get; set; }

    [DynamoDBRangeKey]
    public required string UserId { get; set; }

    public ShopUserType ShopUserType { get; set; }
}
