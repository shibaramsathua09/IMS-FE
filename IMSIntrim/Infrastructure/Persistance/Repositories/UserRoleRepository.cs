using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.EntityFrameworkCore;

namespace IMSIntrim.Infrastructure.Persistance.Repositories
{

    public class UserRoleRepository : IUserRoleRepository

    {
        private readonly InsuranceDbContext _context;

        public UserRoleRepository(InsuranceDbContext context)
        {
            _context = context;
        }

        public async Task<OperationResult<bool>>AddAsync(UserRole userRole)
        {
            await _context.UserRoles.AddAsync(userRole);
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success(true, "added successfully");
        }
    }


}
