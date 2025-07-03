using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.EntityFrameworkCore;

namespace IMSIntrim.Infrastructure.Persistance.Repositories
{
    public class ClaimRepository : IClaimRepository
    {
        private readonly InsuranceDbContext _context; 
        public ClaimRepository(InsuranceDbContext context)
        {
            _context = context;
        }

        public async Task<OperationResult<IEnumerable<Claim>>> GetAllAsync()
        {
            //var claim = await _context.Claims.Include(p=>p.Policy).ThenInclude(ap=>ap.AvailablePolicy).ToListAsync();
            var claims = await _context.Claims
    .Include(c => c.Customer)
    .Include(c => c.Agent)
    .Include(c => c.Policy)
        .ThenInclude(p => p.AvailablePolicy)
    .ToListAsync();

            return OperationResult<IEnumerable<Claim>>.Success(claims);
        }

        public async Task<OperationResult<Claim?>> GetByIdAsync(int id)
        {
            var claim= await _context.Claims.FindAsync(id);
            if (claim == null)
            {
                return OperationResult<Claim?>.Failure("Claim does not exist");
            }
            return OperationResult<Claim?>.Success(claim);
        }

        public async Task<OperationResult<IEnumerable<Claim>>> GetByCustomerIdAsync(int customerId)
        {
            var claim= await _context.Claims.Include(p=>p.Policy).ThenInclude(ap=>ap.AvailablePolicy)
                .Where(c => c.CustomerId == customerId).ToListAsync();
            if (claim == null)
            {
                return OperationResult<IEnumerable<Claim>>.Failure("Claim does not exist");

            }
            return OperationResult<IEnumerable<Claim>>.Success(claim);
        }

        public async Task<OperationResult<IEnumerable<Claim>>> GetByAgentIdAsync(int agentId)
        {
            var claim= await _context.Claims.Include(c=>c.Customer).Include(p=>p.Policy).ThenInclude(ap => ap.AvailablePolicy).Where(c => c.AgentId == agentId).ToListAsync();
            if (claim == null)
            {
                return OperationResult<IEnumerable<Claim>>.Failure("Claim does not exist");

            }
            return OperationResult<IEnumerable<Claim>>.Success(claim);
        }

        public async Task<OperationResult<bool>> AddAsync(Claim claim)
        {

            var claims=await _context.Claims.AddAsync(claim);
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success("Added successfully");
        }

        public async Task<OperationResult<bool>>UpdateStatusAsync(int claimId, string status)
        {
            var claim = await _context.Claims.FindAsync(claimId);
            if (claim == null)
            {
                return OperationResult<bool>.Failure("Claim does not exist");

            }
                claim.Status = status;
                _context.Claims.Update(claim);
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success(true, "updated successfully");
        }

    }
}
