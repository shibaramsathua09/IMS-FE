using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;

namespace IMSIntrim.Domain.Interfaces
{
    public interface IAgentRepository
    { 
        public Task<OperationResult<IEnumerable<Agent>>> GetAllAsync();
        public Task<OperationResult<Agent?>> GetByIdAsync(int id); 
        public Task<OperationResult<Agent>> GetByUserIdAsync(int agentId);
        public Task<OperationResult<bool>> AddAsync(Agent agent);
        public  Task<OperationResult<bool>> UpdateAsync(Agent agent, int agentId);
        public Task<OperationResult<bool>> DeleteAsync(int id);
        public  Task<OperationResult<int?>> GetAgentIdFromUserIdAsync(Guid? userId);
    }
}
