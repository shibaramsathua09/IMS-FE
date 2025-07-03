using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Infrastructure.Persistance;
using IMSIntrim.Domain.Models;
using IMSIntrim.Applications.Interfaces;

namespace IMSIntrim.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClaimsController : ControllerBase
    {
        private readonly InsuranceDbContext _context;
        private readonly IClaimServices _claimService;
        private readonly ITokenService _tokenService;

        public ClaimsController(InsuranceDbContext context, IClaimServices claimServices,ITokenService tokenService)
        {
            _context = context;
            _claimService = claimServices;
            _tokenService = tokenService;
        }

        [HttpGet("admin/claims")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> GetAllClaims(int page = 1, int size = 10)
        {
            var result = await _claimService.GetAllClaimsAsync(page, size);
            if (!result.IsSuccess) return NotFound(result);
            return Ok(result);
        }

        [HttpPost("admin/{claimId}/approve")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> ApproveClaim(int claimId)
        {
            var result = await _claimService.ApproveClaimAsync(claimId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("admin/{claimId}/reject")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> RejectClaim(int claimId)
        {
            var result = await _claimService.RejectClaimAsync(claimId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("admin/{customerId}/claims")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> GetClaimsByCustomerId(int customerId)
        {
            var claims = await _claimService.GetClaimsByCustomerIdAsync(customerId);
            if (claims == null) return NotFound();
            return Ok(claims);
        }

        [HttpGet("agent/filed-claims")]
        [Authorize(Roles = Roles.Agent)]
        public async Task<IActionResult> GetFiledClaims()
        {
            var claims = await _claimService.GetFiledClaimsAsync();
            if (!claims.IsSuccess) return NotFound(claims);
            return Ok(claims);
        }

        [HttpPost("agent/file")]
        [Authorize(Roles = Roles.Agent)]
        public async Task<IActionResult> FileClaimAsAgent([FromBody] ClaimFilingRequestDtoForAgent dto)
        {
            var loggedInAgentId = _tokenService.GetAgentIdFromCurrentRequest();
            if (loggedInAgentId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            if (dto.AgentId != loggedInAgentId)
            {
                return BadRequest("Invalid Agent or unauthoritized Request");
            }
            var result = await _claimService.FileClaimAsync(dto);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("customer/file")]
        [Authorize(Roles = Roles.Customer)]
        public async Task<IActionResult> FileClaimAsCustomer([FromBody] ClaimFilingRequestDtoForCustomer dto)
        {
            var loggedInCustomerId = _tokenService.GetCustomerIdFromCurrentRequest();
            if (loggedInCustomerId == null)
            {
                return Unauthorized("User ID not found in token.");
            }

            if (dto.CustomerId != loggedInCustomerId)
            {
                return BadRequest("Invalid claim or unauthoritized Request");
            }
            var result = await _claimService.FileClaimAsync(dto);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("customer/my-claims")]
        [Authorize(Roles = Roles.Customer)]
        public async Task<IActionResult> GetMyClaims()
        {
            var claims = await _claimService.GetMyClaimsAsync();
            if (!claims.IsSuccess) return NotFound(claims);
            return Ok(claims);
        }
    }
    public static class Roles
    {
        public const string Admin = "Admin";
        public const string Agent = "Agent";
        public const string Customer = "Customer";
    }
}