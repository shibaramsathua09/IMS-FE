

using IMSIntrim.Domain.Models;
using  AutoMapper;
using IMSIntrim.Applications.DTOs;

namespace IMSIntrim.Applications.Profiles
{
    public class AuthProfile:Profile
    {
        public AuthProfile()
        {
            CreateMap<CustomerRegisterRequestDto, User>().ReverseMap();

            CreateMap<User, UserRole>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id)).ReverseMap();
            CreateMap<Role, UserRole>()
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.Id)).ReverseMap();


            CreateMap<CustomerRegisterRequestDto, Customer>().ReverseMap();
            CreateMap<User, Customer>().ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id)).ReverseMap();
            CreateMap<User, UserWithRoleResponseDto>()
    .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.UserRole.Role.Name ?? "Unknown"))
    .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
    .ReverseMap();
        }
    }
}
