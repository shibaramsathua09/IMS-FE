namespace IMSIntrim.Applications.DTOs
{
    public class PolicyRequestDto 
    {
        //public int AvailablePolicyId { get; set; }
        //because we are showing our AvailablePolicyName so we are using name
        public required string AvailablePolicyName { get; set; }
        public int CustomerId { get; set; } 
    }
}
