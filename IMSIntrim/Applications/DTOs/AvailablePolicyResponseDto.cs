namespace IMSIntrim.Applications.DTOs
{
    public class AvailablePolicyResponseDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string CoverageDetails { get; set; }
        public decimal BasePremium { get; set; }
        public int ValidityPeriod { get; set; }
    }
}
