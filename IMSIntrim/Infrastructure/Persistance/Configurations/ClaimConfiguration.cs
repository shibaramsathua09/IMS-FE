using IMSIntrim.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IMSIntrim.Infrastructure.Persistance.Configurations
{
    public class ClaimConfiguration : IEntityTypeConfiguration<Claim>
    {
        public void Configure(EntityTypeBuilder<Claim> builder)
        {

            builder.HasKey(c => c.ClaimId);
            builder.Property(c => c.ClaimAmount).IsRequired();
            builder.Property(c => c.ClaimAmount).HasPrecision(10,2);

            builder.Property(c => c.Status).IsRequired();


            builder.HasOne(c => c.Policy)
                   .WithMany(p => p.Claims)
                   .HasForeignKey(c => c.PolicyId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(c => c.Customer)
                   .WithMany(cu => cu.Claims)
                   .HasForeignKey(c => c.CustomerId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(c => c.Agent)
                   .WithMany(a => a.FiledClaims)
                   .HasForeignKey(c => c.AgentId)
                   .OnDelete(DeleteBehavior.Restrict)
                   .IsRequired(false);
        }

    }
}
