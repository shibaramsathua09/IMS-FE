using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;

namespace IMSIntrim.Domain.Interfaces
{
    public interface IClaimRepository 
    { 
        public Task<OperationResult<IEnumerable<Claim>>> GetAllAsync(); 
        public Task<OperationResult<Claim?>> GetByIdAsync(int id); 
        public Task<OperationResult<IEnumerable<Claim>>> GetByCustomerIdAsync(int customerId);
        public Task<OperationResult<IEnumerable<Claim>>> GetByAgentIdAsync(int agentId); 
        public Task<OperationResult<bool>> AddAsync(Claim claim); 
        public Task<OperationResult<bool>>UpdateStatusAsync(int claimId, string status); 
    }
}
