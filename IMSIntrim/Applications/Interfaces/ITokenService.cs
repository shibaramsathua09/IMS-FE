using System.Security.Claims;

namespace IMSIntrim.Applications.Interfaces

{

    public interface ITokenService

    {

        string GenerateToken(Guid userId, string role, int? id);

        Guid? GetUserIdFromCurrentRequest();

        int? GetCustomerIdFromCurrentRequest();

        int? GetAgentIdFromCurrentRequest();

        string GetRoleFromCurrentRequest();

        ClaimsPrincipal? ValidateCurrentToken();


    }

}

