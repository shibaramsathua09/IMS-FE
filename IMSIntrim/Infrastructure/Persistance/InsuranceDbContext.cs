using IMSIntrim.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace IMSIntrim.Infrastructure.Persistance
{
    public class InsuranceDbContext : DbContext
    {
        public InsuranceDbContext(DbContextOptions<InsuranceDbContext> options) : base(options) { }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Policy> Policies { get; set; }
        public DbSet<Claim> Claims { get; set; }
        public DbSet<Agent> Agents { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<AvailablePolicy> AvailablePolicies { get; set; }
        public DbSet<PolicyRequest> PolicyRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Role>().HasData(
                new Role {Id =1, Name = "Admin" },
                new Role {Id =2, Name = "Customer" },
                new Role {Id=3 , Name = "Agent" }
                );
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = new Guid("5AADD958-329A-4F30-8075-C13F484F8476"),
                    Username = "Akash_1",
                    PasswordHash = "$2a$11$HVMna.tWj8AO7CLHlqacJeZw1QFxjyDwxTtq2YkFX.o5soa4ipgcu"
                });
            modelBuilder.Entity<UserRole>().HasData(
                 new UserRole
                 {
                     UserId = new Guid("5AADD958-329A-4F30-8075-C13F484F8476"),
                     RoleId = 1
                 });
           modelBuilder.ApplyConfigurationsFromAssembly(typeof(InsuranceDbContext).Assembly);
        }

    }
}
