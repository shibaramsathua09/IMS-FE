namespace IMSIntrim.Applications.DTOs
{
    public class PolicyRequestDto 
    {
        //public int AvailablePolicyId { get; set; }
        public required string AvailablePolicyName { get; set; }
        public int CustomerId { get; set; } 
    }
}
