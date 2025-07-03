using IMSIntrim.Applications.DTOs;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.AspNetCore.Mvc;

namespace IMSIntrim.Application.Interfaces
{
    public interface ICustomerServices
    {
        public Task<OperationResult<CustomerProfileResponseDto>> GetProfileAsync();
        public Task<OperationResult<bool>> UpdateProfileAsync(CustomerProfileUpdateRequestDto updateCustomerProfile);
        public Task<OperationResult<PagedResult<CustomerProfileResponseDto>>> GetAllCustomersAsync(int page, int size);
        public Task<OperationResult<CustomerProfileResponseDto>> GetCustomerByIdAsync(int customerId);
        public Task<OperationResult<CustomerRegisterResponseDto>> AddCustomerAsync(CustomerRegisterRequestDto dto);

        public Task<OperationResult<bool>> DeleteAccountAsync();

        //Task<IActionResult> DeleteCustomer(int id);
        //Task<ActionResult<Customer>> GetCustomer(int id);
        //Task<ActionResult<IEnumerable<Customer>>> GetCustomers();
        //Task<ActionResult<Customer>> PostCustomer(Customer customer);
        //Task<IActionResult> PutCustomer(int id, Customer customer);
    }
}