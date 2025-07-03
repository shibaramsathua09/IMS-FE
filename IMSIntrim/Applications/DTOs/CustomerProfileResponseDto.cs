namespace IMSIntrim.Applications.DTOs
{
    public class CustomerProfileResponseDto
    {
        public required string Name { get; set; }
       
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public  required string Address { get; set; } 
        public required int CustomerId { get; set; }
        public required string Username { get; set; }
        public Guid UserId { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}
