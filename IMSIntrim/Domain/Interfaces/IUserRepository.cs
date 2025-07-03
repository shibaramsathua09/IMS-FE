using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;

namespace IMSIntrim.Domain.Interfaces
{
    public interface IUserRepository 
    {
        public Task<OperationResult<User?>> GetByUsernameAsync(string username);
        public Task<OperationResult<User?>> GetByIdAsync(Guid id);
        public Task<OperationResult<IEnumerable<User>>> GetAllAsync();
        public Task<OperationResult<bool>> AddAsync(User user);
        public Task<OperationResult<IEnumerable<User>>> GetAllWithRolesAsync();
        public Task<OperationResult<bool>> SoftDeleteUserAsync(Guid userId);
    }
}
