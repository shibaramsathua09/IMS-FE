using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IMSIntrim.Domain.Models;
using IMSIntrim.Infrastructure.Persistance;
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;

namespace IMSIntrim.Controllers
{
    [Route("api/customers")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly InsuranceDbContext _context;
        private readonly ICustomerServices _customerService;

        public CustomersController(InsuranceDbContext context, ICustomerServices customerServices)
        {
            _context = context;
            _customerService = customerServices;
        }

        [HttpGet]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<PagedResult<CustomerProfileResponseDto>>> GetAllCustomers(int page = 1, int size = 10)
        {
            var result = await _customerService.GetAllCustomersAsync(page, size);
            if (!result.IsSuccess) return NotFound(result);
            return Ok(result);
        }

        [HttpPost("register")]
        //[Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> AddCustomer([FromBody] CustomerRegisterRequestDto dto)
        {
            var result = await _customerService.AddCustomerAsync(dto);
            if (!result.IsSuccess) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("{customerId}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<CustomerProfileResponseDto>> GetCustomerByIdAsync(int customerId)
        {
            var result = await _customerService.GetCustomerByIdAsync(customerId);
            if (result == null) return NotFound(result);
            return Ok(result);
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var profile = await _customerService.GetProfileAsync();
            if (profile == null) return NotFound("Customer profile not found.");
            return Ok(profile);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] CustomerProfileUpdateRequestDto dto)
        {
            var result = await _customerService.UpdateProfileAsync(dto);
            if (result == null) return NotFound("Customer not found");
            return Ok(result);
        }

        [HttpDelete("delete-account")]
        [Authorize(Roles = $"{Roles.Admin},{Roles.Customer}")]
        public async Task<IActionResult> DeleteAccountAsync()
        {
            var result = await _customerService.DeleteAccountAsync();

            if (!result.IsSuccess)
                return BadRequest(result.Message);

            return Ok(result);
        }
    }
}
