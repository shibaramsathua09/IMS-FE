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

            builder.HasOne(n => n.Customer)
                   .WithMany(c => c.Notifications)
                   .HasForeignKey(n => n.CustomerId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(n => n.Agent)
                   .WithMany(a => a.Notifications)
                   .HasForeignKey(n => n.AgentId)
                   .OnDelete(DeleteBehavior.Restrict);
        }

    }
}
