namespace IMSIntrim.Domain.Models
{
    public class Policy
    {
        public int PolicyId { get; set; }

        public int AvailablePolicyId { get; set; }
        public required AvailablePolicy AvailablePolicy { get; set; }

        public int CustomerId { get; set; }
        public required Customer Customer { get; set; }

        public int AgentId { get; set; }
        public required Agent Agent { get; set; }

        public DateTime IssuedDate { get; set; }
        public DateTime ExpiryDate { get; set; }

        
        public ICollection<Claim>? Claims { get; set; }

    }

}


