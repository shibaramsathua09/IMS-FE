using AutoMapper;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Domain.Models;
namespace IMSIntrim.Applications.Profiles
{
    public class AgentProfile : Profile
    {
    //In AutoMapper, a Profile is where you define mapping rules.
    /*ForMember(...)
This method is used to configure how a specific destination property should be mapped from the source object.
dest => dest.CustomerEmail: Refers to the CustomerEmail property in the destination DTO (AgentAssignedPolicyResponseDto).
opt => opt.MapFrom(...): Specifies how to get the value for CustomerEmail.
src => src.Customer.Email: Tells AutoMapper to take the Email property from the nested Customer object in the source model (Policy).
So, this line maps:

Policy.Customer.Email → AgentAssignedPolicyResponseDto.CustomerEmail
✅ Second Line

Maps the Phone property in the DTO from the Customer.Phone in the domain model.
So, this line maps:

Policy.Customer.Phone → AgentAssignedPolicyResponseDto.Phone
*/
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
