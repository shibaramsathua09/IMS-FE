using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using IMSIntrim.Applications.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace IMSIntrim.Applications.Utils
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;
        //private readonly IJwtService _jwtHelper;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            //_configuration = configuration;
            //_jwtHelper = jwtHelper;
        }

        public string GenerateJwtToken(Guid userId, string role, int customerId = 0, int agentId = 0, Guid adminId = new())
        {
            var secretKey = _configuration["JwtSettings:SecretKey"];
            if (string.IsNullOrEmpty(secretKey))
            {
                throw new ArgumentNullException(nameof(secretKey), "Secret key cannot be null or empty.");
            }

            var key = Encoding.UTF8.GetBytes(secretKey);
            var tokenHandler = new JwtSecurityTokenHandler();
            var claims = new List<Claim>
            {
                new Claim("userId", userId.ToString()),
                new Claim("role", role)
            };

            if (role == "Customer")
            {
                claims.Add(new Claim("customerId", customerId.ToString()));
            }
            else if (role == "Agent")
            {
                claims.Add(new Claim("agentId", agentId.ToString()));
            }
            else if (role == "Admin")
            {
                claims.Add(new Claim("adminId", adminId.ToString()));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public ClaimsPrincipal ValidateJwtToken(string token)
        {
            var secretKey = _configuration["JwtSettings:SecretKey"];
            var key = Encoding.UTF8.GetBytes(secretKey);

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken validatedToken);
                return principal;
            }
            catch
            {
                return null;
            }
        }
        
    }
}