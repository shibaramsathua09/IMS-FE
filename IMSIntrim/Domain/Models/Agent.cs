namespace IMSIntrim.Domain.Models
{
    public class Agent
    {
        public int AgentId { get; set; }
        public required string Name { get; set; }
        public required string ContactInfo { get; set; }

        public Guid UserId { get; set; }
        public required User User { get; set; }

        
        public ICollection<Policy>? AssignedPolicies { get; set; }
        public ICollection<Claim>? FiledClaims { get; set; }

        public ICollection<Notification>? Notifications { get; set; }

    }
}

