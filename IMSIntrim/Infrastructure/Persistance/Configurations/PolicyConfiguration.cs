using IMSIntrim.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IMSIntrim.Infrastructure.Persistance.Configurations
{
    public class PolicyConfiguration : IEntityTypeConfiguration<Policy>
    {
        public void Configure(EntityTypeBuilder<Policy> builder)
        {
            builder.HasKey(p => p.PolicyId);

            builder.HasOne(p => p.Customer)
                   .WithMany(c => c.Policies)
                   .HasForeignKey(p => p.CustomerId)
                   .OnDelete(DeleteBehavior.Restrict)
                   .IsRequired(); 

            builder.HasOne(p => p.Agent)
                   .WithMany(a => a.AssignedPolicies)
                   .HasForeignKey(p => p.AgentId)
                   .OnDelete(DeleteBehavior.Restrict)
                   .IsRequired();

            builder.HasOne(p => p.AvailablePolicy)
                   .WithMany(ap => ap.IssuedPolicies)
                   .HasForeignKey(p => p.AvailablePolicyId)
                   .OnDelete(DeleteBehavior.Restrict)
                   .IsRequired();

        }

    }
}
