using IMSIntrim.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IMSIntrim.Infrastructure.Persistance.Configurations
{
    public class AvailablePolicyConfiguration : IEntityTypeConfiguration<AvailablePolicy>
    {
        public void Configure(EntityTypeBuilder<AvailablePolicy> builder)
        {
            builder.HasKey(p => p.AvailablePolicyId);
            builder.Property(p => p.Name).IsRequired();
            builder.Property(p => p.BasePremium).IsRequired();
            builder.Property(p => p.BasePremium).HasPrecision(10,2);//total digits:10 and 2 digits after decimal point

            builder.Property(p => p.CoverageDetails).IsRequired();
        }
    }
}
