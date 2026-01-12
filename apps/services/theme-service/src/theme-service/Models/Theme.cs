using System;
using Amazon.DynamoDBv2.DataModel;

namespace theme_service.Models;

[DynamoDBTable("Theme")]
public class Theme
{
    [DynamoDBHashKey]
    public required string ShopId { get; set; }
    public required string Styles { get; set; }
}
