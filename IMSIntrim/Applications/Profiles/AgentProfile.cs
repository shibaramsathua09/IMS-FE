using AutoMapper;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Domain.Models;
namespace IMSIntrim.Applications.Profiles
{
    public class AgentProfile : Profile
    {
        public AgentProfile() {
            //CreateMap<Agent, AgentProfileResponseDto>().ReverseMap();
            CreateMap<Agent, AgentProfileResponseDto>()
    .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username));


            CreateMap<Domain.Models.Claim, ClaimStatusResponseDtoForAgent>().
                ForMember(dest => dest.PolicyName, opt => opt.MapFrom(src => src.Policy.AvailablePolicy.Name))
                .ReverseMap();

            CreateMap<ClaimFilingRequestDtoForAgent,Domain.Models.Claim>().ReverseMap();

            CreateMap<Policy ,AgentAssignedPolicyResponseDto>().
                ForMember(dest => dest.CustomerEmail, opt => opt.MapFrom(src => src.Customer.Email)).
                ForMember(dest=> dest.Phone,opt=>opt.MapFrom(src=> src.Customer.Phone)).ReverseMap();

            CreateMap<AgentProfileUpdateRequestDto,Agent>().ReverseMap();

            CreateMap<AvailablePolicy, AvailablePolicyResponseDto>().
                ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.AvailablePolicyId))
                .ReverseMap();

            CreateMap<Notification, NotificationResponseDto>().ReverseMap();

           
        }
    }
}
