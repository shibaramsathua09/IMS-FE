using IMSIntrim.Domain.Models;
using AutoMapper;
using IMSIntrim.Applications.DTOs;

namespace IMSIntrim.Applications.Profiles
{
    public class AdminProfile:Profile
    {
        public AdminProfile() 
        {
            CreateMap<AvailablePolicy,AvailablePolicyResponseDto>().
                ForMember(dest=> dest.Id,opt => opt.MapFrom(src =>src.AvailablePolicyId)).ReverseMap();
            CreateMap<Agent, AgentProfileResponseDto>().ReverseMap();
            CreateMap<Customer, CustomerProfileResponseDto>().ReverseMap();
            //CreateMap<PolicyRequest,PolicyRequestStatusResponseDto>().ReverseMap();
            CreateMap<PolicyRequest, PolicyRequestStatusResponseDto>()
    .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer.Name))
    .ForMember(dest => dest.AvailablePolicyName, opt => opt.MapFrom(src => src.AvailablePolicy.Name));

            //CreateMap<Claim,ClaimStatusResponseDtoForAdmin>().
            //    ForMember(dest=>dest.PolicyName,opt =>opt.MapFrom(src =>src.Policy.AvailablePolicy.Name)).ReverseMap();
            CreateMap<Claim, ClaimStatusResponseDtoForAdmin>()
    .ForMember(dest => dest.PolicyName, opt => opt.MapFrom(src => src.Policy.AvailablePolicy.Name))
    .ForMember(dest => dest.AgentName, opt => opt.MapFrom(src => src.Agent.Name))
    .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer.Name))
    .ReverseMap();
            CreateMap<AvailablePolicyRequestDto, AvailablePolicy>().ReverseMap();
            CreateMap<AssignAgentRequestDto, Policy>().ReverseMap();
            CreateMap<PolicyRequest, Policy>().ReverseMap();
            //CreateMap<User, UserWithRoleResponseDto>()
            //    .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.UserRole.Role.Name ?? "Unknown"))
            //    .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
            //    .ReverseMap();

            CreateMap<AgentRegisterRequestDto, User>().ReverseMap();
            CreateMap<User, UserRole>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id)).ReverseMap();

            CreateMap<Role, UserRole>()
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.Id)).ReverseMap();

            CreateMap<AgentRegisterRequestDto, Agent>().ReverseMap();

            CreateMap<User, Agent>().ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id)).ReverseMap();


            CreateMap<Agent, AgentProfileResponseDto>().ReverseMap();
            CreateMap<Claim, ClaimsFiledByCustomerResponseDtoForAdmin>().ReverseMap();
        }

    }
}
