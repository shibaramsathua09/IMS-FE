using IMSIntrim.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace IMSIntrim.Infrastructure.Persistance.Configurations
{
    public class AgentConfiguration : IEntityTypeConfiguration<Agent>
    {
        public void Configure(EntityTypeBuilder<Agent> builder)
        {
            //these are the fluent api configuration
            //how the propertie of agent class should be mapped with the database
            /*Explicitly sets AgentId as the primary key.
            In the model class, EF Core would infer this automatically
            because of the naming convention (AgentId).*/
            builder.HasKey(a => a.AgentId);
            /*Specifies the name can not be null in model class we have declared required annotation or validation*/
            builder.Property(a => a.Name).IsRequired();

            builder.HasOne(a => a.User)//each agent associated with one user
                   .WithOne(u=>u.Agent)//each user associated with one agent
                   .HasForeignKey<Agent>(a => a.UserId)//foreign key for th relationship
                   .OnDelete(DeleteBehavior.Restrict);//Prevents deletion of User if Agent is linked
        }


    }
}
