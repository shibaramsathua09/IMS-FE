namespace IMSIntrim.Domain.Models
{
    public class Notification
    {
        
        public int NotificationId { get; set; }

        public int? CustomerId { get; set; }
        public  Customer? Customer { get; set; }
        public int? AgentId { get; set; }
        public Agent? Agent { get; set; }

        public required string Message { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
    
}

