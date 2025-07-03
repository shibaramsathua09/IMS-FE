namespace IMSIntrim.Applications.DTOs
{
    public class UserWithRoleResponseDto
    {
        public Guid UserId { get; set; }
        public required string Username { get; set; }
        public required string Role { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
