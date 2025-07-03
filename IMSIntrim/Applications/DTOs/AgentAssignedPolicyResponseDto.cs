namespace IMSIntrim.Applications.DTOs
{
    public class AgentAssignedPolicyResponseDto 
    {
        public int AvailablePolicyId { get; set; }
        public int PolicyId { get; set; }
        public required string AvailablePolicyName { get; set; }
        public int CustomerId { get; set; }
        public required string Phone { get; set; }
        public required string? CustomerName { get; set; }
        public string? CustomerEmail { get; set; } 
        public DateTime IssuedDate { get; set; } 
        public DateTime ExpiryDate { get; set; }
    }
}
