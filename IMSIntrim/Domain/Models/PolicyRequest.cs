namespace IMSIntrim.Domain.Models
{
    public class PolicyRequest
    {
        public int RequestId { get; set; }
        public int CustomerId { get; set; }
        public required Customer Customer { get; set; }

        public int AvailablePolicyId { get; set; }
        public required AvailablePolicy AvailablePolicy { get; set; }

        public string Status { get; set; } = "Pending"; 
        public DateTime RequestedOn { get; set; } = DateTime.UtcNow;

    }
}