namespace IMSIntrim.Applications.DTOs
{
    public class ClaimFilingRequestDtoForCustomer
    {
        //we can add the PolicyId 
        public required string PolicyName { get; set; }
       // public int PolicyId { get; set; }
        public int CustomerId { get; set; }
      
        public decimal ClaimAmount { get; set; }
    }
}
