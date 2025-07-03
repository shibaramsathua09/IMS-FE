using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.EntityFrameworkCore;

namespace IMSIntrim.Infrastructure.Persistance.Repositories
{
    public class AvailablePolicyRepository : IAvailablePolicyRepository
    {
        private readonly InsuranceDbContext _context;
        public AvailablePolicyRepository(InsuranceDbContext context)
        {
            _context = context;
        }

        public async Task<OperationResult<IEnumerable<AvailablePolicy>>> GetAllAsync()
        {
            var policy= await _context.AvailablePolicies.ToListAsync();
            return OperationResult<IEnumerable<AvailablePolicy>>.Success(policy);
        }

        public async Task<OperationResult<AvailablePolicy?>> GetByIdAsync(int id)
        {
            var policy = await _context.AvailablePolicies.FindAsync(id);
            if (policy == null)
            {
                return OperationResult<AvailablePolicy?>.Failure("policy does not exist");
            }
            return OperationResult<AvailablePolicy?>.Success(policy);
        }

        public async Task<OperationResult<bool>> AddAsync(AvailablePolicy policy)
        {
            var addPolicy=await _context.AvailablePolicies.AddAsync(policy);
            if(addPolicy==null)
            {
                return OperationResult<bool>.Failure("Unable to Add the Policy");
            }
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success(true, " policy added successfully");



        }

        public async Task<OperationResult<bool>> UpdateAsync(AvailablePolicy policy, int policyId)
        {
           
            var policyDetail = await _context.FindAsync<AvailablePolicy>(policyId);
            if (policyDetail == null)
            {
                return OperationResult<bool>.Failure("Policy Not found");
            }
            
                policyDetail.Name = policy.Name;
                policyDetail.CoverageDetails = policy.CoverageDetails;
                policyDetail.BasePremium = policy.BasePremium;
                policyDetail.ValidityPeriod = policy.ValidityPeriod;
                
                _context.AvailablePolicies.Update(policyDetail);
                await _context.SaveChangesAsync();
            return OperationResult<bool>.Success(true, "Updated successfully");
            
        }

        public async Task<OperationResult<bool>> DeleteAsync(int id)
        {
            
            var policy = await _context.AvailablePolicies.FindAsync(id);
            if (policy == null)
            {
                return OperationResult<bool>.Failure("Policy does not exist");
            }

            _context.AvailablePolicies.Remove(policy);
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success(true, "Deleted Successfully");
        }

    }
}
