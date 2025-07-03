using IMSIntrim.Domain.Models;

namespace IMSIntrim.Applications.DTOs
{
    public class AgentProfileResponseDto 
    {
        public required string Name { get; set; } 
        public required string ContactInfo { get; set; } 
        public required int AgentId { get; set; }
        public required string Username { get; set; }

        public Guid UserId { get; set; }
    }
}
