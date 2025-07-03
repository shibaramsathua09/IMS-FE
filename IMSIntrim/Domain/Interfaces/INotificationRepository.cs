using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;

namespace IMSIntrim.Domain.Interfaces
{
    public interface INotificationRepository
    {
        public Task<OperationResult<IEnumerable<Notification>>> GetAllAsync();
        public Task<OperationResult<IEnumerable<Notification>>> GetByCustomerIdAsync(int customerId);
        public Task<OperationResult<IEnumerable<Notification>>> GetByAgentIdAsync(int agentId);             
        public Task<OperationResult<bool>> AddAsync(Notification notification);
    }
}
