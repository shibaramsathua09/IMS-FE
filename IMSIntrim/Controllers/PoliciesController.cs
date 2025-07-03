using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Domain.Models;
using IMSIntrim.Infrastructure.Persistance;
using IMSIntrim.Applications.Interfaces;

namespace IMSIntrim.Controllers
{
    [Route("api/policies")]
    [ApiController]
    public class PoliciesController : ControllerBase
    {
        private readonly InsuranceDbContext _context;
        private readonly IPolicyServices _policyService;
        private readonly ITokenService _tokenService;

        public PoliciesController(InsuranceDbContext context, IPolicyServices policyServices,ITokenService tokenService)
        {
            _context = context;
            _policyService = policyServices;
            _tokenService = tokenService;
        }

        [HttpGet("available")]
        public async Task<ActionResult<PagedResult<AvailablePolicyResponseDto>>> GetAllAvailablePolicies(int page = 1, int size = 10)
        {
            var result = await _policyService.GetAllAvailablePoliciesAsync(page, size);
            if (!result.IsSuccess) return NotFound(result);
            return Ok(result);
        }

        //[HttpGet("requests/admin")]
        //[Authorize(Roles = Roles.Admin)]
        //public async Task<ActionResult<PagedResult<PolicyRequestStatusResponseDto>>> GetAllPolicyRequests([FromQuery] int page, [FromQuery] int size)
        //{
        //    var result = await _policyService.GetAllPolicyRequestsAsync(page, size);
        //    if (!result.IsSuccess) return NotFound(result);
        //    return Ok(result);
        //}

        //new code
        [HttpGet("requests/admin")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> GetPolicyRequests([FromQuery] int page, [FromQuery] int size)
        {
            var result = await _policyService.GetAllPolicyRequestsAsync(page, size);

            if (!result.IsSuccess)
                return BadRequest(result.Message);

            return Ok(result);
        }

        [HttpPost("available")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> AddAvailablePolicy([FromBody] AvailablePolicyRequestDto dto)
        {
            var result = await _policyService.AddAvailablePolicyAsync(dto);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpPut("{policyId}/available")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> UpdateAvailablePolicy([FromBody] AvailablePolicyRequestDto dto, int policyId)
        {
            var result = await _policyService.UpdateAvailablePolicyAsync(dto, policyId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("{id}/available")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> DeleteAvailablePolicy(int id)
        {
            var result = await _policyService.DeleteAvailablePolicyAsync(id);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpPut("{requestId}/approve")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> ApprovePolicyRequest([FromBody] AssignAgentRequestDto dto, int requestId)
        {
            var result = await _policyService.ApprovePolicyRequestAsync(dto, requestId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("{requestId}/reject")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> RejectPolicyRequest(int requestId)
        {
            var result = await _policyService.RejectPolicyRequestAsync(requestId);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("available/{policyId}")]
        public async Task<ActionResult<AvailablePolicyResponseDto>> GetAvailablePolicyByIdAsync(int policyId)
        {
            var result = await _policyService.GetAvailablePolicyByIdAsync(policyId);
            if (!result.IsSuccess) return NotFound(result);
            return Ok(result);
        }

        [HttpGet("assigned")]
        [Authorize(Roles = Roles.Agent)]
        public async Task<IActionResult> GetAssignedPolicies()
        {
            var policies = await _policyService.GetAssignedPoliciesAsync();
            if (!policies.IsSuccess) return NotFound(policies);
            return Ok(policies);
        }

        [HttpGet("customer-registered")]
        [Authorize(Roles = Roles.Customer)]
        public async Task<IActionResult> GetRegisteredPolicies()
        {
            var policies = await _policyService.GetRegisteredPoliciesAsync();
            return Ok(policies);
        }

        [HttpGet("customer-requests")]
        [Authorize(Roles = Roles.Customer)]
        public async Task<IActionResult> GetPolicyRequests()
        {
            var requests = await _policyService.GetPolicyRequestsAsync();
            if (!requests.IsSuccess) return NotFound(requests);
            return Ok(requests);
        }

        [HttpPost("request")]
        [Authorize(Roles = Roles.Customer)]
        public async Task<IActionResult> RequestPolicy([FromBody] PolicyRequestDto requestDto)
        {
            var loggedInCustomerId=_tokenService.GetCustomerIdFromCurrentRequest();
            if (loggedInCustomerId==null)
            {
                return Unauthorized("User ID not found in token.");
            }

            if (requestDto.CustomerId != loggedInCustomerId)
            {
                return BadRequest("Invalid policy or unauthoritized Request");
            }

            //var existingPolicy = await _policyService.GetExistingPolicyAsync(requestDto.CustomerId, requestDto.AvailablePolicyName);
            var existingPolicy = await _policyService.GetExistingPolicyByNameAsync(
            requestDto.CustomerId,
            requestDto.AvailablePolicyName);
            if (existingPolicy != null)
            {
                return Conflict("Policy request already exists for this customer.");
            }

            var result = await _policyService.RequestPolicyAsync(requestDto);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("request/{requestId}")]
        [Authorize(Roles = Roles.Customer)]
        public async Task<ActionResult<PolicyRequestStatusResponseDto>> GetPolicyRequestByIdAsync(int requestId)
        {
            var result = await _policyService.GetPolicyRequestByIdAsync(requestId);
            if (!result.IsSuccess) return NotFound(result);
            return Ok(result);
        }
    }
}
