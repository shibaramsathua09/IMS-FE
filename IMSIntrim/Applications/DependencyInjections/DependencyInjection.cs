

using IMSIntrim.Application.Interfaces;
using IMSIntrim.Application.Services;
using IMSIntrim.Applications.Interfaces;
using IMSIntrim.Applications.Services;
using IMSIntrim.Applications.Utils;
using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Infrastructure.Persistance.Repositories;

namespace IMSIntrim.Applications.DependencyInjections
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IJwtService,JwtService>();
            //services.AddScoped<IAuthService, AuthServices>();
            services.AddScoped<ICustomerServices, CustomerServices>();
            services.AddScoped<IAgentServices, AgentServices>();
            //services.AddScoped<IAdminServices, AdminServices>();
            services.AddScoped<IPasswordHasherService, PasswordHasherService>();
            services.AddScoped<ITokenService, TokenService>();
            
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<IAgentRepository, AgentRepository>();
            services.AddScoped<IAvailablePolicyRepository, AvailablePolicyRepository>();
            services.AddScoped<IPolicyRequestRepository, PolicyRequestRepository>();
            services.AddScoped<IClaimRepository, ClaimRepository>();
            services.AddScoped<IPolicyRepository, PolicyRepository>();
            services.AddScoped<IAuthServices, AuthServices>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IUserRoleRepository, UserRoleRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<IPolicyServices, PolicyServices>();
            services.AddScoped<IClaimServices, ClaimServices>();
            services.AddScoped<INotificationServices, NotificationServices>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();


            return services;
        }

    }
}
