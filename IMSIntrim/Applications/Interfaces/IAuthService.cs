using IMSIntrim.Applications.DTOs;
using IMSIntrim.Shared.Common;
using Microsoft.AspNetCore.Mvc;

namespace IMSIntrim.Application.Interfaces
{
    public interface IAuthServices
    {
        Task<OperationResult<LoginResponseDto>> LoginAsync(LoginRequestDto dto);
        public Task<OperationResult<IEnumerable<UserWithRoleResponseDto>>> GetAllUsersAsync();
        Task<OperationResult<CustomerRegisterResponseDto>> RegisterAsync(CustomerRegisterRequestDto dto);
        public OperationResult<string> GetRoleService();
    }
}
