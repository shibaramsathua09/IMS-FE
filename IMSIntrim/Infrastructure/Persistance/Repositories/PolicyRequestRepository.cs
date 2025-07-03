using System.Drawing;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.EntityFrameworkCore;

namespace IMSIntrim.Infrastructure.Persistance.Repositories
{
    public class PolicyRequestRepository : IPolicyRequestRepository
    {
        private readonly InsuranceDbContext _context;
        public PolicyRequestRepository(InsuranceDbContext context)
        {
            _context = context;
        }

        public async Task<OperationResult<PagedResult<PolicyRequest>>> GetAllPagedAsync(int page, int size)
        {

            var totalCount = await _context.PolicyRequests.CountAsync();

            var items = await _context.PolicyRequests
                .Include(p => p.Customer)
                .Include(p => p.AvailablePolicy)
                .OrderBy(p => p.RequestId)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            var paged = new PagedResult<PolicyRequest>
            {
                Items = items,
                PageNumber = page,
                PageSize = size,
                TotalCount = totalCount
            };
            Console.WriteLine($"Page {page} has {items.Count} items");
            Console.WriteLine($"First RequestId on page: {items.FirstOrDefault()?.RequestId}");


            return OperationResult<PagedResult<PolicyRequest>>.Success(paged);
        }


        public async Task<OperationResult<IEnumerable<PolicyRequest>>> GetAllAsync(int page, int size)
        {
            //var request = await _context.PolicyRequests.ToListAsync();
            var allPolicyRequestList = await _context.PolicyRequests
     .Include(pr => pr.Customer)
        .Include(pr => pr.AvailablePolicy)
        .OrderBy(pr => pr.RequestId) // ensure deterministic order
        .Skip((page - 1) * size)
        .Take(size)
        .ToListAsync();
            var totalBeforePaging = await _context.PolicyRequests.CountAsync();
            Console.WriteLine($"Total requests: {totalBeforePaging}");

            var items = await _context.PolicyRequests
                .Include(p => p.Customer)
                .Include(p => p.AvailablePolicy)
                .OrderBy(p => p.RequestId)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            Console.WriteLine($"Returned items count: {items.Count}");



            return OperationResult<IEnumerable<PolicyRequest>>.Success(allPolicyRequestList);
        }

        public async Task<int> GetTotalCountAsync()
        {
            return await _context.PolicyRequests.CountAsync();
        }


        public async Task<OperationResult<IEnumerable<PolicyRequest>>> GetByCustomerIdAsync(int customerId)
        {
            var request =  await _context.PolicyRequests.Include(a=>a.AvailablePolicy).Where(pr => pr.CustomerId == customerId).ToListAsync();
            if (!request.Any())
            {
                return OperationResult<IEnumerable<PolicyRequest>>.Failure("Id not found");
            }
            return OperationResult<IEnumerable<PolicyRequest>>.Success(request);
 
        }

        public async Task<OperationResult<PolicyRequest?>> GetByIdAsync(int requestId)
        {
            var request = await _context.PolicyRequests.Include(a => a.AvailablePolicy).FirstOrDefaultAsync(r=>r.RequestId == requestId);
            if (request == null)
            {
                return OperationResult<PolicyRequest?>.Failure("Id not found");
            }
            return OperationResult<PolicyRequest?>.Success(request);


        }

        public async Task<OperationResult<bool>> AddAsync(PolicyRequest request)
        {
          var requests =  await _context.PolicyRequests.AddAsync(request);
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success(true, "requested policy successfully");
        }

        public async Task<OperationResult<bool>> UpdateStatusAsync(int requestId, string status)
        {
            var request = await _context.PolicyRequests.FindAsync(requestId);
            if (request == null)
            {
                return OperationResult<bool>.Failure("not found");
            }
            
                request.Status = status;
                _context.PolicyRequests.Update(request);
            
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success(true,"updated successfully");
        }

    }
}
