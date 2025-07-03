using IMSIntrim.Applications.DTOs;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.AspNetCore.Mvc;

namespace IMSIntrim.Application.Interfaces
{
    public interface IAgentServices
    {
        //Task<IActionResult> DeleteAgent(int id);

        public Task<OperationResult<AgentProfileResponseDto>> GetProfileAsync();

        public Task<OperationResult<PagedResult<AgentProfileResponseDto>>> GetAllAgentsAsync(int page, int size);
        public Task<OperationResult<bool>> UpdateProfileAsync(AgentProfileUpdateRequestDto updateAgentProfileDto);
        public Task<OperationResult<AgentRegisterResponseDto>> AddAgentAsync(AgentRegisterRequestDto dto);
        public Task<OperationResult<AgentProfileResponseDto>> GetAgentByIdAsync(int agentId);
        


    }
}