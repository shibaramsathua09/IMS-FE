namespace IMSIntrim.Applications.DTOs
{
    public class CustomerPoliciesResponseDto 
    {
        public int PolicyId { get; set; }
        
        public required string AvailablePolicyName { get; set; }
        public required string AgentName { get; set; }
        public DateTime IssuedDate { get; set; } 
        public DateTime ExpiryDate { get; set; }
        public required decimal PremiumAmount { get; set; }
        //public int AgentId { get; set; } 
        public required string AgentContact { get; set; } 
    }
}
