using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.EntityFrameworkCore;

namespace IMSIntrim.Infrastructure.Persistance.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly InsuranceDbContext _context;
        public UserRepository(InsuranceDbContext context)
        {
            _context = context;
        }

        public async Task<OperationResult<bool>> AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success(true, "User added successfully");
        }

        public async Task<OperationResult<IEnumerable<User>>> GetAllAsync()
        {
            var user= await _context.Users
                .Include(r => r.UserRole)
                .ThenInclude(ur => ur.Role)
                .ToListAsync();


            return OperationResult<IEnumerable<User>>.Success(user);
        }

        public async Task<OperationResult<User?>> GetByIdAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return OperationResult<User?>.Failure("User Not found");
            }
            return OperationResult<User?>.Success(user);
        }



        public async Task<OperationResult<User?>> GetByUsernameAsync(string username)
        {

            var user = await _context.Users
                .Include(u => u.UserRole)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user != null)
            {
                OperationResult<User?>.Failure("Username already exist");
            }

            return OperationResult<User?>.Success(user);
        }
        public async Task<OperationResult<IEnumerable<User>>> GetAllWithRolesAsync()
        {
            var users = await _context.Users
                .Include(u => u.UserRole)
                    .ThenInclude(ur => ur.Role).ToListAsync();

            if (!users.Any())
                return OperationResult<IEnumerable<User>>.Failure("No users found");

            return OperationResult<IEnumerable<User>>.Success(users);
        }
        public async Task<OperationResult<bool>> SoftDeleteUserAsync(Guid userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return OperationResult<bool>.Failure("User not found");

            if (user.IsDeleted)
                return OperationResult<bool>.Failure("User already deleted");

            user.IsDeleted = true;
            await _context.SaveChangesAsync();

            return OperationResult<bool>.Success(true, "User soft deleted");
        }

    }
}
