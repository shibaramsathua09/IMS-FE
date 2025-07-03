namespace IMSIntrim.Applications.DTOs
{
    public class NotificationResponseDto
    {
        public required string Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public int NotificationId { get; set; }

    }

}
