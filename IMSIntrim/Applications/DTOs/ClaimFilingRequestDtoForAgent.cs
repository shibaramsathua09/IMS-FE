namespace IMSIntrim.Applications.DTOs
{
    public class ClaimFilingRequestDtoForAgent
    {
        public int PolicyId { get; set; }
        public int CustomerId { get; set; }
        public int AgentId { get; set; }
        public decimal ClaimAmount { get; set; }
    }
}
