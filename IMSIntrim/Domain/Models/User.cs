namespace IMSIntrim.Domain.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string Username { get; set; }
        public required string PasswordHash { get; set; }
        public bool IsDeleted { get; set; } = false;


        public UserRole? UserRole { get; set; }
        public Customer? Customer { get; set; }
        public Agent? Agent { get; set; }

    }
}
