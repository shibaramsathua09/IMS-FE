using IMSIntrim.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IMSIntrim.Infrastructure.Persistance.Configurations
{
    public class PolicyRequestConfiguration : IEntityTypeConfiguration<PolicyRequest>
    {
        public void Configure(EntityTypeBuilder<PolicyRequest> builder)
        {
            builder.HasKey(pr => pr.RequestId);

            builder.HasOne(pr => pr.Customer)
                   .WithMany(c => c.PolicyRequests)
                   .HasForeignKey(pr => pr.CustomerId);

            builder.HasOne(pr => pr.AvailablePolicy)
                   .WithMany(ap => ap.PolicyRequests)
                   .HasForeignKey(pr => pr.AvailablePolicyId);
        }
    }
}
