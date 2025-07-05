namespace IMSIntrim.Domain.Models
{
    public class UserRole
    {
        public Guid UserId { get; set; }
        public  User? User { get; set; }

        public int RoleId { get; set; }
        public   Role? Role { get; set; }

        /*No additional fields like CreatedDate, IsActive, etc.
        Just foreign keys and navigation properties.
        This is typical for a pure join table.*/
    }
}
