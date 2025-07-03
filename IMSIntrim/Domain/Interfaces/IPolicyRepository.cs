using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;

namespace IMSIntrim.Domain.Interfaces
{
    public interface IPolicyRepository
    { 
        public Task<OperationResult<IEnumerable<Policy>>> GetAllAsync();
        public Task<OperationResult<Policy?>> GetByIdAsync(int id); 
        public Task<OperationResult<IEnumerable<Policy>>> GetByCustomerIdAsync(int customerId); 
        public Task<OperationResult<IEnumerable<Policy>>> GetByAgentIdAsync(int agentId);
        public Task<OperationResult<bool>> AddAsync(Policy policy); 
        public Task<OperationResult<bool>> UpdateAsync(Policy policy); 
        public Task<OperationResult<bool>> DeleteAsync(int id); 
    }
}
