using IMSIntrim.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Security.Policy;

public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        //This is a strong indicator that UserRole is a join table between User and Role.
        //A join table typically has a composite key made up of foreign keys from two other tables.
        builder.HasKey(ur => new { ur.UserId, ur.RoleId });

        builder.HasOne(ur => ur.User)//one userRole can contain one user
               .WithOne(u => u.UserRole)//one user can only have one userRole
               .HasForeignKey<UserRole>(ur => ur.UserId);

        builder.HasOne(ur => ur.Role)//one userRole can contain one role
               .WithMany(r => r.UserRoles)//on role can have many user
               .HasForeignKey(ur => ur.RoleId);
        /*This sets a composite primary key for the UserRole table.
        It means that each combination of UserId and RoleId must be unique.
        Prevents duplicate entries like assigning the same role to the same user more than once.
        */
    }


}