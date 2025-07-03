using System.Security.Claims;

namespace IMSIntrim.Applications.Interfaces
{
    public interface IJwtService
    {

        string GenerateJwtToken(Guid userId, string role, int customerId = 0, int agentId = 0, Guid adminId = new());
        ClaimsPrincipal ValidateJwtToken(string token);

    }
}
