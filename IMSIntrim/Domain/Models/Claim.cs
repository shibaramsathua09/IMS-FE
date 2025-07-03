namespace IMSIntrim.Domain.Models
{
    public class Claim
    {
        public int ClaimId { get; set; }
        public decimal ClaimAmount { get; set; }
        public string Status { get; set; } = "Pending";

        public int PolicyId { get; set; }
        public required Policy Policy { get; set; }

        public int CustomerId { get; set; }
        public required Customer Customer { get; set; }

        public int? AgentId { get; set; } 
        public Agent? Agent { get; set; }
        public DateTime FiledDate { get; internal set; }
    }

}


