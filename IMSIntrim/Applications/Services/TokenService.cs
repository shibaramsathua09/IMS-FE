using System.Security.Claims;
using IMSIntrim.Applications.Interfaces;
using IMSIntrim.Applications.Utils;

namespace IMSIntrim.Applications.Services
{

    public class TokenService : ITokenService

    {
        private readonly IJwtService _jwtHelper;

        private readonly IHttpContextAccessor _httpContextAccessor;

        public TokenService(IConfiguration configuration, IJwtService jwtHelper, IHttpContextAccessor httpContextAccessor)

        {
            _jwtHelper = jwtHelper ?? throw new ArgumentNullException(nameof(jwtHelper)); //new JwtService(configuration,jwtHelper);

            _httpContextAccessor = httpContextAccessor;

        }

        public IJwtService JwtHelper => _jwtHelper;

        public IHttpContextAccessor HttpContextAccessor => _httpContextAccessor;

        public string GenerateToken(Guid userId, string role, int? id = null)
        {
            Guid adminId = role == "Admin" ? userId : Guid.Empty;
            int customerId = role == "Customer" ? id.GetValueOrDefault() : 0;
            int agentId = role == "Agent" ? id.GetValueOrDefault() : 0;

            return JwtHelper.GenerateJwtToken(userId, role, customerId, agentId, adminId);
        }

        public ClaimsPrincipal? ValidateCurrentToken()

        {

            var token = _httpContextAccessor.HttpContext?

                           .Request.Headers["Authorization"]

                           .FirstOrDefault()?.Split(" ").Last();

            if (string.IsNullOrEmpty(token))

                return null;

            return _jwtHelper.ValidateJwtToken(token);

        }

        public Guid? GetUserIdFromCurrentRequest()

        {

            var principal = ValidateCurrentToken();

            if (principal == null) return null;

            var idClaim = principal.FindFirst("userId")?.Value;

            return Guid.TryParse(idClaim, out var id) ? id : null;

        }

        public int? GetCustomerIdFromCurrentRequest()

        {

            var principal = ValidateCurrentToken();

            if (principal == null) return null;

            var idClaim = principal.FindFirst("customerId")?.Value;

            return int.TryParse(idClaim, out var id) ? id : null;

        }

        public int? GetAgentIdFromCurrentRequest()

        {

            var principal = ValidateCurrentToken();

            if (principal == null) return null;

            var idClaim = principal.FindFirst("agentId")?.Value;

            return int.TryParse(idClaim, out var id) ? id : null;

        }

        public string? GetRoleFromCurrentRequest()

        {

            var principal = ValidateCurrentToken();

            return principal?.FindFirst("role")?.Value;

        }

    }

}

