using IMSIntrim.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IMSIntrim.Infrastructure.Persistance.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.HasKey(n => n.NotificationId);

            builder.HasOne(n => n.Customer)//a notification can be assigned to one customer
                   .WithMany(c => c.Notifications)//but a customer can have many notification
                   .HasForeignKey(n => n.CustomerId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(n => n.Agent)//one notification can be assigned to an agent
                   .WithMany(a => a.Notifications)//but an agent can have many notifications
                   .HasForeignKey(n => n.AgentId)
                   .OnDelete(DeleteBehavior.Restrict);
        }

    }
}
