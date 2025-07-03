using AutoMapper;
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.AspNetCore.Identity;
using IMSIntrim.Applications.Services;
using Microsoft.AspNetCore.Mvc;
using IMSIntrim.Applications.Interfaces;

namespace IMSIntrim.Application.Services
{
    public class AgentServices : IAgentServices
    {
        private readonly ICustomerRepository _customerRepo;
        private readonly IAgentRepository _agentRepo;
        private readonly IAvailablePolicyRepository _availablePolicyRepo;
        private readonly IPolicyRequestRepository _policyRequestRepo;
        private readonly IClaimRepository _claimRepo;
        private readonly IPolicyRepository _policyRepo;
        private readonly IUserRepository _userRepo;
        private readonly IRoleRepository _roleRepo;
        private readonly IUserRoleRepository _userRoleRepo;
        private readonly IPasswordHasherService _passwordHasher;
        private readonly IAuthServices _authService;
        private readonly IMapper _mapper;
        //private readonly ILogger<AgentServices> _logger;
        private readonly INotificationRepository _notificationRepo;
        private readonly ITokenService _tokenService;

        public AgentServices(
            ICustomerRepository customerRepo,
            IAgentRepository agentRepo,
            IAvailablePolicyRepository availablePolicyRepo,
            IPolicyRequestRepository policyRequestRepo,
            IClaimRepository claimRepo,
            IPolicyRepository policyRepo,
            IAuthServices authService,
            IUserRepository userRepository,
            IPasswordHasherService passwordHasher,
            IRoleRepository roleRepository,
            IUserRoleRepository userRoleRepository,
            IAgentRepository agentRepository,
           INotificationRepository notificationRepository,
           ITokenService tokenService,
       //    ITokenService tokenService,
          // ILogger<AdminService> logger,

           IMapper mapper
            )
        {
            _customerRepo = customerRepo;
            _agentRepo = agentRepo;
            _availablePolicyRepo = availablePolicyRepo;
            _policyRequestRepo = policyRequestRepo;
            _claimRepo = claimRepo;
            _policyRepo = policyRepo;
            _authService = authService;
            _userRepo = userRepository;
            _passwordHasher = passwordHasher;
            _roleRepo = roleRepository;
            _userRoleRepo = userRoleRepository;
            _agentRepo = agentRepository;
            _notificationRepo = notificationRepository;
            _mapper = mapper;
            _tokenService = tokenService;
            //_logger = logger;

        }
        public async Task<OperationResult<AgentRegisterResponseDto>> AddAgentAsync(AgentRegisterRequestDto dto)
        {
            var existingUser = await _userRepo.GetByUsernameAsync(dto.UserName);
            if (!existingUser.IsSuccess)
            {
                return OperationResult<AgentRegisterResponseDto>.Failure(existingUser.Message);
            }

            var user = _mapper.Map<User>(dto);
            user.Id = Guid.NewGuid();
            user.IsDeleted = false;
            user.PasswordHash = _passwordHasher.HashPassword(dto.Password);

            var userAddingResult = await _userRepo.AddAsync(user);

            if (!userAddingResult.IsSuccess)
            {
                return OperationResult<AgentRegisterResponseDto>.Failure(userAddingResult.Message);
            }

            var role = await _roleRepo.GetByNameAsync("Agent");
            if (role?.Data == null)
            {
                return OperationResult<AgentRegisterResponseDto>.Failure("Agent role missing");
            }
            var userRole = _mapper.Map<UserRole>(user);
            _mapper.Map(role.Data, userRole);

            var userRoleResult = await _userRoleRepo.AddAsync(userRole);
            if (!userRoleResult.IsSuccess)
            {
                return OperationResult<AgentRegisterResponseDto>.Failure(userRoleResult.Message);
            }

            var agent = _mapper.Map<Agent>(dto);
            _mapper.Map(user, agent);

            var agentResult = await _agentRepo.AddAsync(agent);
            if (!agentResult.IsSuccess)
            {
                return OperationResult<AgentRegisterResponseDto>.Failure(agentResult.Message);
            }
            var notification = new Notification
            {
                CustomerId = null,
                AgentId = user.Agent.AgentId,
                Message = $"You have been registered by an admin. Welcome to the team, {dto.Name}! 🎉 We're excited to have you on board.",
                CreatedAt = DateTime.UtcNow
            };
            await _notificationRepo.AddAsync(notification);

            return OperationResult<AgentRegisterResponseDto>.Success(new AgentRegisterResponseDto { Message = "Agent added successfully" });

        }

        //public Task<IActionResult> DeleteAgent(int id)
        //{
        //    throw new NotImplementedException();
        //}


        public async Task<OperationResult<AgentProfileResponseDto>> GetAgentByIdAsync(int agentId)
        {
            var agent = await _agentRepo.GetByIdAsync(agentId);
            if (!agent.IsSuccess)
            {
                return OperationResult<AgentProfileResponseDto>.Failure($"  Failed To fetch the Agent of Id{agentId}");

            }
            var agentresult = agent.Data;
            var result = _mapper.Map<AgentProfileResponseDto>(agentresult);

            return OperationResult<AgentProfileResponseDto>.Success(result);
        }

        public async Task<OperationResult<PagedResult<AgentProfileResponseDto>>> GetAllAgentsAsync(int page, int size)
        {
            var result = await _agentRepo.GetAllAsync();

            if (!result.IsSuccess)
            {
                return OperationResult<PagedResult<AgentProfileResponseDto>>.Failure(" Failed To fetch the Agent");
            }

            var all = result.Data?.ToList();
            if (all == null)
            {
                return OperationResult<PagedResult<AgentProfileResponseDto>>.Failure(" No Data Avaiable in the Agent List");
            }

            var paged = all.Skip((page - 1) * size).Take(size).ToList();



            if (paged != null && paged.Any())
            {
                var agentResult = new PagedResult<AgentProfileResponseDto>
                {
                    Items = paged.Select(a => _mapper.Map<AgentProfileResponseDto>(a)),
                    PageNumber = page,
                    PageSize = size,
                    TotalCount = all.Count
                };

                return OperationResult<PagedResult<AgentProfileResponseDto>>.Success(agentResult);
            }
            return OperationResult<PagedResult<AgentProfileResponseDto>>.Failure("There is no Agent in the specific page");


        }

        public async Task<OperationResult<AgentProfileResponseDto>> GetProfileAsync()
        {
            int? agentId = _tokenService.GetAgentIdFromCurrentRequest();
            if (agentId == null)
            {
                return OperationResult<AgentProfileResponseDto>.Failure("Unable to Get the AgentId from the Jwt Token");
            }
            var agent = await _agentRepo.GetByUserIdAsync((int)agentId);
            if (agent.Data == null)
            {
                return OperationResult<AgentProfileResponseDto>.Failure("Agent Profile not found");
            }

            var result = _mapper.Map<AgentProfileResponseDto>(agent.Data);
            return OperationResult<AgentProfileResponseDto>.Success(result);
        }

        public async Task<OperationResult<bool>> UpdateProfileAsync(AgentProfileUpdateRequestDto updateAgentProfileDto)
        {
            int? agentId = _tokenService.GetAgentIdFromCurrentRequest();
            if (agentId == null)
            {
                return OperationResult<bool>.Failure("Unable to Fetch the AgentId from The Token ");
            }
            var agent = _mapper.Map<Agent>(updateAgentProfileDto);

            await _agentRepo.UpdateAsync(agent, (int)agentId);
            return OperationResult<bool>.Success(true, "Profile Updated Successfully");
        }
    }
}
