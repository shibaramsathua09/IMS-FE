using IMSIntrim.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IMSIntrim.Infrastructure.Persistance.Configurations
{
    public class ClaimConfiguration : IEntityTypeConfiguration<Claim>
    {
        public void Configure(EntityTypeBuilder<Claim> builder)
        {
            //fluent api help to define the properties of the claim entity,
            //how should be mapped with the database.
            builder.HasKey(c => c.ClaimId);
            builder.Property(c => c.ClaimAmount).IsRequired();
            builder.Property(c => c.ClaimAmount).HasPrecision(10,2);

            builder.Property(c => c.Status).IsRequired();


            builder.HasOne(c => c.Policy)//each claim has one policy
                   .WithMany(p => p.Claims)//each policy can have many claims
                   .HasForeignKey(c => c.PolicyId)
                   .OnDelete(DeleteBehavior.Restrict);
            
            builder.HasOne(c => c.Customer)//each claim has one customer
                   .WithMany(cu => cu.Claims)//each customer can have many claims
                   .HasForeignKey(c => c.CustomerId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(c => c.Agent)//claim may be filed by one agent
                   .WithMany(a => a.FiledClaims)//but an agent can filed many claims
                   .HasForeignKey(c => c.AgentId)
                   .OnDelete(DeleteBehavior.Restrict)
                   .IsRequired(false);//isRequired(false) means this relationship is optional a claim can exist with oout an agent
        }

    }
}
