using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IMSIntrim.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthServices _authService;

        public AuthController(IAuthServices authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CustomerRegisterRequestDto request)
        {

            if (request == null)
            {
                return BadRequest("Customer Request null");
            }

            var response = await _authService.RegisterAsync(request);

            if (!response.IsSuccess)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        /// <summary>
        ///rathna        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {


            var response = await _authService.LoginAsync(request);

            if (!response.IsSuccess)
            {
                return Unauthorized(response);
            }

            return Ok(response);
        }

        /// <summary>
        /// Retrieves a list of all users with their roles.
        /// </summary>
        /// <returns>
        /// Returns an <see cref="ActionResult{T}"/> containing a list of users with their roles.
        /// If successful, returns an <see cref="OkObjectResult"/> with the list of users.
        /// If no users are found, returns a <see cref="NotFoundObjectResult"/>.
        /// </returns>
        /// <remarks>
        /// This endpoint is accessible only to users with the Admin role.
        /// </remarks>
        [HttpGet("users")]
        [Authorize(Roles = Roles.Admin)]
        [ProducesResponseType(typeof(OperationResult<IEnumerable<UserWithRoleResponseDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(OperationResult<IEnumerable<UserWithRoleResponseDto>>), StatusCodes.Status404NotFound)]
        [Authorize(Roles = Roles.Admin)]

        public async Task<ActionResult<IEnumerable<UserWithRoleResponseDto>>> GetAllUsers()
        {
            var result = await _authService.GetAllUsersAsync();
            if (!result.IsSuccess)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        /// <summary>
        /// Logs out the current user by deleting the authentication cookie.
        /// </summary>
        /// <returns>
        /// An <see cref="OperationResult{T}"/> containing a success message.
        /// </returns>
        /// 
        /// <remarks>
        /// Deletes the JWT authentication cookie to log the user out.
        /// The cookie is set to expire immediately.
        /// </remarks>
        [HttpPost("Logout")]
        [ProducesResponseType(typeof(OperationResult<string>), StatusCodes.Status200OK)]
        public ActionResult<OperationResult<string>> Logout()
        {
            Response.Cookies.Delete("jwt", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddHours(-1)
            });

            return Ok(OperationResult<string>.Success("User logged out successfully"));
        }


        /// <summary>
        /// Retrieves the role information for the current user or system.
        /// </summary>
        /// <returns>
        /// An <see cref="ActionResult"/> containing an <see cref="OperationResult{T}"/> of the role data.
        /// Returns 200 OK with the role information if successful.
        /// Returns 400 Bad Request if the retrieval fails (e.g., service error, no role found).
        /// </returns>
        /// <remarks>
        /// This endpoint requires the user to have one of the following roles:
        /// 'MaintenanceEngineer', 'Developer', 'NetworkEngineer', 'DevOpsEngineer',
        /// 'DatabaseAdministrator', 'Tester', or 'Manager'.
        /// It delegates the retrieval of role information to the employee service.
        /// </remarks>

        [Authorize(Roles = $"{Roles.Customer},{Roles.Admin},{Roles.Agent}")]
        [HttpGet("getRole")]
        public ActionResult GetRole()
        {
            var res = _authService.GetRoleService();
            if (!res.IsSuccess)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }


    }
}
