using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;

namespace IMSIntrim.Domain.Interfaces
{
    public interface ICustomerRepository 
    {
        public Task<OperationResult<IEnumerable<Customer>>> GetAllAsync();
        public Task<OperationResult<Customer?>> GetByIdAsync(int id); 
        public Task<OperationResult<Customer?>> GetByUserIdAsync(int customerId); 
        public Task<OperationResult<bool>> AddAsync(Customer customer); 
        public Task<OperationResult<bool>> UpdateAsync(Customer customer, int customerId);
        public Task<OperationResult<int?>> GetCustomerIdFromUserIdAsync(Guid? userId);
    }
}
