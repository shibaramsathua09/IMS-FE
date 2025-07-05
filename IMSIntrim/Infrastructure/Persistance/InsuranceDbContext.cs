using IMSIntrim.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace IMSIntrim.Infrastructure.Persistance
{
    public class InsuranceDbContext : DbContext
    {
        public InsuranceDbContext(DbContextOptions<InsuranceDbContext> options) : base(options) { }

        //basically it defines the database tables that the application will interact with.
        /*
        Maps a C# class to a database table.
        Lets you perform operations like:
        context.Customers.ToList() → get all customers
        context.Policies.Add(newPolicy) → add a new policy
        context.SaveChanges() → save changes to the database
        Each T is a model class here
        and the whole line represents the table of database
        */
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

            //is used in Entity Framework Core to automatically apply entity configurations from your project.
            /*modelBuilder is used inside the OnModelCreating method
             it helps to define how your entities map to database tables - including things like constraints, relationship keys

            -----ApplyConfigurationsFromAssembly(...) do?-------
            It scans the entire assembly (your project) for classes that implement IEntityTypeConfiguration<T>.
            These classes contain custom configuration rules for your entities. Instead of writing all configurations inside OnModelCreating,
            you can organize them in separate files.
            Automatically apply all entity configurations from your project.
             */
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(InsuranceDbContext).Assembly);
        }

    }
}
