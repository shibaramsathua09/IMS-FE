using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.EntityFrameworkCore;

namespace IMSIntrim.Infrastructure.Persistance.Repositories
{
    public class PolicyRepository : IPolicyRepository
    {
        private readonly InsuranceDbContext _context; 
        public PolicyRepository(InsuranceDbContext context)
        {
            _context = context;
        }

        public async Task<OperationResult<IEnumerable<Policy>>> GetAllAsync()
        {
            var policy = await _context.Policies.
                Include(a=>a.Agent).
                Include(c=>c.Customer).
                Include(ap=>ap.AvailablePolicy).
                ToListAsync();
            return OperationResult<IEnumerable<Policy>>.Success(policy);

        }

        public async Task<OperationResult<Policy?>> GetByIdAsync(int id)
        {
            var getpolicy = await _context.Policies.FindAsync(id);
            
            if (getpolicy == null)
            {
                return OperationResult<Policy?>.Failure("policy not found");
            }
            return OperationResult<Policy?>.Success(getpolicy);
        }

        public async Task<OperationResult<IEnumerable<Policy>>> GetByCustomerIdAsync(int customerId)
        {
            var policy = await _context.Policies.Include(a=>a.Agent).
                Include(ap=>ap.AvailablePolicy).
                Where(p=>p.CustomerId==customerId).
                ToListAsync();
            if (policy == null)
            {
                return OperationResult<IEnumerable<Policy>>.Failure("policy not found");

            }
            return OperationResult<IEnumerable<Policy>>.Success(policy);
        }

        public async Task<OperationResult<IEnumerable<Policy>>> GetByAgentIdAsync(int agentId)
        {
            var policy =  await _context.Policies
                .Include(a=>a.AvailablePolicy)
                .Include(c=>c.Customer)
                .Include(c=>c.Agent)
                .Where(p => p.AgentId == agentId)
                .ToListAsync();
            if (policy == null)
            {
                return OperationResult<IEnumerable<Policy>>.Failure("policy not found");

            }
            return OperationResult<IEnumerable<Policy>>.Success(policy);
        }

        public async Task<OperationResult<bool>> AddAsync(Policy policy)
        {
            await _context.Policies.AddAsync(policy);
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success(true, "policy added successfully");
        }


        public async  Task<OperationResult<bool>> UpdateAsync(Policy policy)
        {
              _context.Policies.Update(policy);
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success(true, "updated successfully");

            

        }

        public async Task<OperationResult<bool>> DeleteAsync(int id)
        {
            var policy = await _context.Policies.FindAsync(id);
            if (policy == null)
            {
                return OperationResult<bool>.Failure("policy Not found");
            }
            _context.Policies.Remove(policy);
            return OperationResult<bool>.Success(true,"policy Deleted successully");
        }

    }
}
