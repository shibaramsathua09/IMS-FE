namespace IMSIntrim.Domain.Models
{
    public class AvailablePolicy
    {
        public int AvailablePolicyId { get; set; }
        public  required string Name { get; set; }
        public  decimal BasePremium { get; set; }
        public  required string CoverageDetails { get; set; }
        public  int ValidityPeriod { get; set; }
      


        public ICollection<Policy>? IssuedPolicies { get; set; }
        public ICollection<PolicyRequest>? PolicyRequests { get; set; }

    }
}
