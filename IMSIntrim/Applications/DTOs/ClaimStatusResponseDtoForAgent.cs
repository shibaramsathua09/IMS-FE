namespace IMSIntrim.Applications.DTOs
{
    public class ClaimStatusResponseDtoForAgent
    {
        public int ClaimId { get; set; }
        public required string PolicyName { get; set; }
        public decimal ClaimAmount { get; set; }
        public required string Status { get; set; }
        public int CustomerId { get; set; }
        public required string CustomerName { get; set; }
    }
}
