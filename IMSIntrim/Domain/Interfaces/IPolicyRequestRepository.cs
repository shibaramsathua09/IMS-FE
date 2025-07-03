using IMSIntrim.Applications.DTOs;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;

namespace IMSIntrim.Domain.Interfaces
{
    public interface IPolicyRequestRepository 
    {
        Task<OperationResult<PagedResult<PolicyRequest>>> GetAllPagedAsync(int page, int size);

        public Task<OperationResult<IEnumerable<PolicyRequest>>> GetAllAsync(int page, int size); 
        public Task<OperationResult<PolicyRequest?>> GetByIdAsync(int requestId);
        public Task<OperationResult<IEnumerable<PolicyRequest>>> GetByCustomerIdAsync(int customerId); 
        public Task<OperationResult<bool>> AddAsync(PolicyRequest request); 
        public Task<OperationResult<bool>> UpdateStatusAsync(int requestId, string status);
        public Task<int> GetTotalCountAsync();
    }
}
