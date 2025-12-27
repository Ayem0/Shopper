using product_service.DTO;
using AutoMapper;
using ShopifyClone.ProtoCs.Product.Types;

namespace product_service.Utils;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<ProductCategoryDTO, ProductCategoryData>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(s => s.Id.ToString()))
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.ParentCategoryId, opt => opt.Ignore())
            .AfterMap((src, dest) =>
            {
                if (src.ParentCategoryId == null)
                {
                    dest.ClearParentCategoryId();
                }
                else
                {
                    dest.ParentCategoryId = src.ParentCategoryId.ToString();
                }

                if (src.UpdatedAt == null)
                {
                    dest.ClearUpdatedAt();
                }
                else
                {
                    dest.UpdatedAt = src.UpdatedAt.ToString();
                }
            });

        CreateMap<VariantOptionValueDTO, VariantOptionValueData>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(s => s.OptionId.ToString()))
            .ForMember(dest => dest.ShopId, opt => opt.MapFrom(s => s.ShopId.ToString()))
            .ForMember(dest => dest.OptionValueId, opt => opt.MapFrom(s => s.Id.ToString()))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(s => s.OptionName))
            .ForMember(dest => dest.Value, opt => opt.MapFrom(s => s.Value));

        CreateMap<ProductVariantDTO, ProductVariantData>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(s => s.Id.ToString()))
            .ForMember(dest => dest.ShopId, opt => opt.MapFrom(s => s.ShopId.ToString()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(s => s.Status))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(s => s.Name))
            .ForMember(dest => dest.VariantOptionValues, opt =>
                {
                    opt.MapFrom(s => s.VariantOptionValues);
                    opt.UseDestinationValue();
                }
            );

        CreateMap<ProductDTO, ProductData>()
           .ForMember(dest => dest.Id, opt => opt.MapFrom(s => s.Id.ToString()))
           .ForMember(dest => dest.ShopId, opt => opt.MapFrom(s => s.ShopId.ToString()))
           .ForMember(dest => dest.Descr, opt => opt.Ignore())
           .ForMember(dest => dest.Categories, opt =>
                {
                    opt.MapFrom(s => s.Categories);
                    opt.UseDestinationValue();
                }
            )
            .ForMember(dest => dest.Variants, opt =>
                {
                    opt.MapFrom(s => s.ProductVariants);
                    opt.UseDestinationValue();
                }
            )
           .AfterMap((src, dest) =>
           {
               if (src.Descr == null)
               {
                   dest.ClearDescr();
               }
               else
               {
                   dest.Descr = src.Descr;
               }
           });
    }
}