using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;

namespace IMSIntrim.Domain.Interfaces
{
    public interface IAvailablePolicyRepository 
    {
        public Task<OperationResult<IEnumerable<AvailablePolicy>>> GetAllAsync();
        public Task<OperationResult<AvailablePolicy?>> GetByIdAsync(int id); 
        public Task<OperationResult<bool>> AddAsync(AvailablePolicy policy); 
        public Task<OperationResult<bool>> UpdateAsync(AvailablePolicy policy,int policyId); 
        public Task<OperationResult<bool>>DeleteAsync(int id); 
    }
}
