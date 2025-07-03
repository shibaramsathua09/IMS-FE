namespace IMSIntrim.Applications.DTOs
{
    public class AvailablePolicyRequestDto
    {
        
     
        public required string Name { get; set; }
        public required string CoverageDetails { get; set; }
        public decimal BasePremium { get; set; } 
        public int ValidityPeriod { get; set; } 
        
    }
}
