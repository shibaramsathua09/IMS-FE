using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Infrastructure.Persistance;
using System.Threading.Tasks;
using IMSIntrim.Applications.MiddleWares;

using IMSIntrim.Domain.Models;


namespace IMSIntrim.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgentController : ControllerBase
    {
        private readonly InsuranceDbContext _context;
        private readonly IAgentServices _agentService;

        public AgentController(InsuranceDbContext context, IAgentServices agentService)
        {
            _context = context;
            _agentService = agentService;
        }

        [HttpGet("admin/agents")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> GetAllAgents(int page = 1, int size = 10)
        {
            var result = await _agentService.GetAllAgentsAsync(page, size);
            if (!result.IsSuccess) return NotFound(result);
            return Ok(result);
        }

        [HttpPost("admin/add")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> AddAgent([FromBody] AgentRegisterRequestDto dto)
        {
            var result = await _agentService.AddAgentAsync(dto);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("admin/{agentId}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> GetAgentById(int agentId)
        {
            var result = await _agentService.GetAgentByIdAsync(agentId);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("profile")]
        [Authorize(Roles = Roles.Agent)]
        public async Task<IActionResult> GetProfile()
        {
            var profile = await _agentService.GetProfileAsync();
            if (profile == null) return NotFound("Agent profile not found");
            return Ok(profile);
        }

        [HttpPut("profile")]
        [Authorize(Roles = Roles.Agent)]
        public async Task<IActionResult> UpdateProfile([FromBody] AgentProfileUpdateRequestDto dto)
        {
            var result = await _agentService.UpdateProfileAsync(dto);
            if (result == null) return NotFound("Agent not found");
            return Ok(result);
        }

        //[HttpGet("test-exception")]
        //public IActionResult TestException()
        //{
        //    throw new Exception("This is a test exception!");
        //}

       

    }
}