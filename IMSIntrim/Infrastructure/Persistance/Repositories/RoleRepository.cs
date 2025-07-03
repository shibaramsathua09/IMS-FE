using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.EntityFrameworkCore;

namespace IMSIntrim.Infrastructure.Persistance.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly InsuranceDbContext _context;
        public RoleRepository(InsuranceDbContext context)
        {
            _context = context;

        }
       public async Task<OperationResult<IEnumerable<Role>>> GetAllAsync()
        {
            var role= await _context.Roles.ToListAsync();
            return OperationResult<IEnumerable<Role>>.Success(role);
        }

        public async Task<OperationResult<Role?>> GetByNameAsync(string name)
        {
            var role= await _context.Roles.FirstOrDefaultAsync(r => r.Name == name);
            if (role == null)
            {
                return OperationResult<Role?>.Failure("Role did not exist");
            }
            return OperationResult<Role?>.Success(role);
        }

        public async Task<OperationResult<bool>>AddAsync(Role role)
        {
            await _context.Roles.AddAsync(role);
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success(true," Role Added successfully");
        }

    }
}
