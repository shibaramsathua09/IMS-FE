namespace IMSIntrim.Applications.DTOs
{
    public class ClaimFilingRequestDtoForCustomer
    {
        public required string PolicyName { get; set; }
       // public int PolicyId { get; set; }
        public int CustomerId { get; set; }
      
        public decimal ClaimAmount { get; set; }
    }
}
