namespace IMSIntrim.Applications.DTOs
{
    public class ClaimsFiledByCustomerResponseDtoForAdmin
    {
        public int ClaimId { get; set; }
        public required string PolicyName { get; set; }
        public decimal ClaimAmount { get; set; }
        public required string Status { get; set; }
      
        public int? AgentId { get; set; }
    }
}
