using AutoMapper;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Domain.Models;
namespace IMSIntrim.Applications.Profiles
{
    public class CustomerProfile:Profile
    {
        public CustomerProfile()
        {
            //CreateMap<Customer, CustomerProfileResponseDto>().ReverseMap();
            CreateMap<Customer, CustomerProfileResponseDto>()
    .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username));

            CreateMap<Policy, CustomerPoliciesResponseDto>().
                ForMember(dest => dest.AgentContact, opt => opt.MapFrom(src => src.Agent.ContactInfo)).ReverseMap();
            CreateMap<PolicyRequest, PolicyRequestStatusResponseDto>().ReverseMap();
            CreateMap<Domain.Models.Claim, ClaimStatusResponseDtoForCustomer>().
                ForMember(dest => dest.PolicyName, opt => opt.MapFrom(src => src.Policy.AvailablePolicy.Name)).ReverseMap();
            CreateMap<PolicyRequestDto, PolicyRequest>().ReverseMap();
            CreateMap<Notification, NotificationResponseDto>().ReverseMap();
            CreateMap<CustomerProfileUpdateRequestDto, Customer>().ReverseMap();
            CreateMap<AvailablePolicy, AvailablePolicyResponseDto>().ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.AvailablePolicyId)).ReverseMap();
            CreateMap<ClaimFilingRequestDtoForCustomer, Domain.Models.Claim>().ReverseMap();
        }
    }
}
