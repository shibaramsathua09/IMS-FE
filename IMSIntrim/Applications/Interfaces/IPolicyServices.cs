using IMSIntrim.Applications.DTOs;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.AspNetCore.Mvc;

namespace IMSIntrim.Application.Interfaces
{
    public interface IPolicyServices
    {
        public Task<OperationResult<PagedResult<AvailablePolicyResponseDto>>> GetAllAvailablePoliciesAsync(int page, int size);
        public Task<OperationResult<bool>> AddAvailablePolicyAsync(AvailablePolicyRequestDto dto);
        public Task<OperationResult<bool>> UpdateAvailablePolicyAsync(AvailablePolicyRequestDto dto, int policyId);
        public Task<OperationResult<bool>> DeleteAvailablePolicyAsync(int id);
        public Task<OperationResult<PagedResult<PolicyRequestStatusResponseDto>>> GetAllPolicyRequestsAsync(int page, int size);
        public Task<OperationResult<bool>> ApprovePolicyRequestAsync(AssignAgentRequestDto dto, int requestId);
        public Task<OperationResult<bool>> RejectPolicyRequestAsync(int requestId);
        public Task<OperationResult<AvailablePolicyResponseDto>> GetAvailablePolicyByIdAsync(int policyId);
        public Task<OperationResult<IEnumerable<AgentAssignedPolicyResponseDto>>> GetAssignedPoliciesAsync();

        public Task<OperationResult<IEnumerable<CustomerPoliciesResponseDto>>> GetRegisteredPoliciesAsync();
        public Task<OperationResult<IEnumerable<PolicyRequestStatusResponseDto>>> GetPolicyRequestsAsync();
        public Task<OperationResult<bool>> RequestPolicyAsync(PolicyRequestDto requestDto);
        public Task<OperationResult<PolicyRequestStatusResponseDto>> GetPolicyRequestByIdAsync(int requestId);
        public Task<Policy?> GetExistingPolicyAsync(int customerId, int policyId);

        Task<Policy?> GetExistingPolicyByNameAsync(int customerId, string policyName);


        // public Task<OperationResult<PagedResult<AvailablePolicyResponseDto>>> GetAllAvailablePoliciesAsync(int page, int size);

    }
}