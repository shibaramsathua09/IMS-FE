using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.EntityFrameworkCore;

namespace IMSIntrim.Infrastructure.Persistance.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly InsuranceDbContext _context; 
        public CustomerRepository(InsuranceDbContext context)
        {
            _context = context;
        }

        public async Task<OperationResult<IEnumerable<Customer>>> GetAllAsync()
        {
            //var customer = await _context.Customers.ToListAsync();
            var customers = await _context.Customers
            .Include(c => c.User)
            .ToListAsync();
            return OperationResult<IEnumerable<Customer>>.Success(customers);
        }

        public async Task<OperationResult<Customer?>> GetByIdAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return OperationResult<Customer?>.Failure("Customer Not Found");
            }
            return OperationResult<Customer?>.Success(customer);
        }

        public async Task<OperationResult<Customer?>> GetByUserIdAsync(int customerId)
        {
            var customer = await _context.Customers
    .Include(c => c.User)
    .FirstOrDefaultAsync(c => c.CustomerId == customerId);


            if (customer == null)
            {
                return OperationResult<Customer?>.Failure("Customer Not Found");
            }

            return OperationResult<Customer?>.Success(customer);
        }

        public async Task<OperationResult<bool>> AddAsync(Customer customer)
        {
            var customers = await _context.Customers.AddAsync(customer);
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success(true, "customer added successfully");
        }

        public async Task<OperationResult<bool>> UpdateAsync(Customer customer, int customerId)
        {
            var customerDetail = await _context.FindAsync<Customer>(customerId);

            if (customerDetail == null)
            {
                return OperationResult<bool>.Failure("Customer Not Found");
            }

            customerDetail.Name = customer.Name;
            customerDetail.Email = customer.Email;
            customerDetail.Phone= customer.Phone;
            customerDetail.Address = customer.Address;

            _context.Customers.Update(customerDetail);
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success(true,"customer updated successfully");
        }
        public async Task<OperationResult<int?>> GetCustomerIdFromUserIdAsync(Guid? userId)
        {
            if (userId == null)
            {
                return OperationResult<int?>.Failure("User ID is null");
            }

            var user = await _context.Customers.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                return OperationResult<int?>.Failure("User or Customer Not Found");
            }

            int customerId = user.CustomerId;
            return OperationResult<int?>.Success(customerId);
        }
    }
}
