    namespace IMSIntrim.Applications.DTOs
{
    public class ClaimStatusResponseDtoForCustomer 
    { 
        public int ClaimId { get; set; } 
        public required string PolicyName { get; set; } 
        public decimal ClaimAmount { get; set; }
        public required string Status { get; set; }
        public required string CustomerName { get; set; }
        public DateTime FiledDate { get; set; }
    }
}
