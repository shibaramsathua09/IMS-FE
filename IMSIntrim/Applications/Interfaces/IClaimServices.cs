using IMSIntrim.Applications.DTOs;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.AspNetCore.Mvc;

namespace IMSIntrim.Application.Interfaces
{
    public interface IClaimServices
    {
        public Task<OperationResult<IEnumerable<ClaimsFiledByCustomerResponseDtoForAdmin>>> GetClaimsByCustomerIdAsync(int customerId);
        public Task<OperationResult<PagedResult<ClaimStatusResponseDtoForAdmin>>> GetAllClaimsAsync(int page, int size);
        public Task<OperationResult<bool>> ApproveClaimAsync(int claimId);
        public Task<OperationResult<bool>> RejectClaimAsync(int claimId);

        public Task<OperationResult<IEnumerable<ClaimStatusResponseDtoForAgent>>> GetFiledClaimsAsync();
        public Task<OperationResult<bool>> FileClaimAsync(ClaimFilingRequestDtoForAgent claimDto);
        public Task<OperationResult<bool>> FileClaimAsync(ClaimFilingRequestDtoForCustomer claimDto);
        public Task<OperationResult<IEnumerable<ClaimStatusResponseDtoForCustomer>>> GetMyClaimsAsync();
        //Task<IActionResult> DeleteClaim(int id);
        //Task<ActionResult<Claim>> GetClaim(int id);
        //Task<ActionResult<IEnumerable<Claim>>> GetClaims();
        //Task<ActionResult<Claim>> PostClaim(Claim claim);
        //Task<IActionResult> PutClaim(int id, Claim claim);

        // public Task<OperationResult<PagedResult<ClaimStatusResponseDtoForCustomer>>> GetAllClaimsAsync(int page, int size);
        // public Task<OperationResult<bool>> ApproveClaimAsync(int claimId);
        // public Task<OperationResult<bool>> RejectClaimAsync(int claimId);
        // public Task<List<ClaimStatusResponseDtoForCustomer>> GetClaimsByCustomerIdAsync(int customerId);
        // public Task<OperationResult<bool>> FileClaimAsync(ClaimFilingRequestDtoForAgent dto);
        // public Task<OperationResult<bool>> FileClaimAsync(ClaimFilingRequestDtoForCustomer dto);
        //public  Task<OperationResult<List<ClaimStatusResponseDtoForCustomer>>> GetFiledClaimsAsync();
        // public Task<OperationResult<List<ClaimStatusResponseDtoForCustomer>>> GetMyClainsAsync();
    }
}