namespace IMSIntrim.Domain.Models
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public required string Name { get; set; }
        
        public DateTime DateOfBirth { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public required string Address { get; set; }

        public Guid UserId { get; set; }
        public required User User { get; set; }

     
        public ICollection<Policy>? Policies { get; set; }
        public ICollection<PolicyRequest>? PolicyRequests { get; set; }
        public ICollection<Claim>? Claims { get; set; }
        public ICollection<Notification>? Notifications { get; set; }

    }
}

