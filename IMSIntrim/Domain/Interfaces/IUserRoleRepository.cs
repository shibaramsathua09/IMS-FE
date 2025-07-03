using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;

namespace IMSIntrim.Domain.Interfaces
{
    public interface IUserRoleRepository
    {
        public Task<OperationResult<bool>> AddAsync(UserRole userRole);
    }
}
