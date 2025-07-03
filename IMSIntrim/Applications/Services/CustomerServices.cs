using AutoMapper;
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Applications.Interfaces;
using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Infrastructure.Persistance.Repositories;
using IMSIntrim.Shared.Common;
using Microsoft.AspNetCore.Identity;

namespace IMSIntrim.Application.Services
{
    public class CustomerServices : ICustomerServices
    {
        private readonly ITokenService _tokenService;

        private readonly ICustomerRepository _customerRepo;
        private readonly IAgentRepository _agentRepo;
        private readonly IAvailablePolicyRepository _availablePolicyRepo;
        private readonly IPolicyRequestRepository _policyRequestRepo;
        private readonly IClaimRepository _claimRepo;
        private readonly IPolicyRepository _policyRepo;
        private readonly IUserRepository _userRepo;
        private readonly IRoleRepository _roleRepo;
        private readonly IUserRoleRepository _userRoleRepo;
        private readonly IPasswordHasherService _passwordHasherService;
        private readonly IAuthServices _authService;
        private readonly IMapper _mapper;

        //private readonly ILogger<AdminService> _logger;
        private readonly INotificationRepository _notificationRepo;

        public CustomerServices
            (
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
        //ILogger<AdminService> logger,

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
            _passwordHasherService = passwordHasher;
            _roleRepo = roleRepository;
            _userRoleRepo = userRoleRepository;
            _agentRepo = agentRepository;
            _notificationRepo = notificationRepository;
            _mapper = mapper;
            _tokenService = tokenService;
          //  _logger = logger;
        }
        public async Task<OperationResult<CustomerRegisterResponseDto>> AddCustomerAsync(CustomerRegisterRequestDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            return result.IsSuccess
                ? OperationResult<CustomerRegisterResponseDto>.Success("Customer added.")
                : OperationResult<CustomerRegisterResponseDto>.Failure(result.Message);
        }

        public async Task<OperationResult<bool>> DeleteAccountAsync()
        {
            Guid? userId = _tokenService.GetUserIdFromCurrentRequest();
            if (userId == null)
            {
                return OperationResult<bool>.Failure("Unable to Get the UserId from the Jwt Token");
            }
            var result = await _userRepo.SoftDeleteUserAsync((Guid)userId);
            return result.IsSuccess
                ? OperationResult<bool>.Success(true, "Customer account deleted")
                : OperationResult<bool>.Failure(result.Message);
        }

        public async Task<OperationResult<PagedResult<CustomerProfileResponseDto>>> GetAllCustomersAsync(int page, int size)
        {
            var allcustomer = await _customerRepo.GetAllAsync();
            if (!allcustomer.IsSuccess)
            {
                return OperationResult<PagedResult<CustomerProfileResponseDto>>.Failure("Failed To fetch the details of all  Customer");
            }
            var allCustomersList = allcustomer.Data?.ToList();
            if (allCustomersList == null)
            {
                return OperationResult<PagedResult<CustomerProfileResponseDto>>.Failure("There is no data found in the List");
            }
            var paged = allCustomersList.Skip((page - 1) * size).Take(size).ToList();

            if (paged != null && paged.Any())
            {
                var result = new PagedResult<CustomerProfileResponseDto>
                {
                    Items = paged.Select(c => _mapper.Map<CustomerProfileResponseDto>(c)
                    ).ToList(),
                    PageNumber = page,
                    PageSize = size,
                    TotalCount = allCustomersList.Count
                };
                return OperationResult<PagedResult<CustomerProfileResponseDto>>.Success(result);
            }
            return OperationResult<PagedResult<CustomerProfileResponseDto>>.Failure("There is no customers in the specific page");
        }

        public async Task<OperationResult<CustomerProfileResponseDto>> GetCustomerByIdAsync(int customerId)
        {
            var customer = await _customerRepo.GetByIdAsync(customerId);
            if (!customer.IsSuccess)
            {
                return OperationResult<CustomerProfileResponseDto>.Failure($"  Failed To fetch the Customer of Id{customerId}");

            }
            var customerResult = customer.Data;
            var result = _mapper.Map<CustomerProfileResponseDto>(customerResult);
            return OperationResult<CustomerProfileResponseDto>.Success(result);
        }

        public async Task<OperationResult<CustomerProfileResponseDto>> GetProfileAsync()
        {
            int? customerId = _tokenService.GetCustomerIdFromCurrentRequest();
            if (customerId == null)
            {
                return OperationResult<CustomerProfileResponseDto>.Failure("Unable to Get the CustomerId from the Jwt Token");
            }
            var customer = await _customerRepo.GetByUserIdAsync((int)customerId);
            if (customer == null)
            {
                return OperationResult<CustomerProfileResponseDto>.Failure("Customer profile not found for the specified user ID.");
            }
            var profile = customer.Data;


            var result = _mapper.Map<CustomerProfileResponseDto>(profile);

            return OperationResult<CustomerProfileResponseDto>.Success(result);
        }

        public async Task<OperationResult<bool>> UpdateProfileAsync(CustomerProfileUpdateRequestDto updateCustomerProfile)
        {
            int? customerId = _tokenService.GetCustomerIdFromCurrentRequest();

            if (customerId == null)
            {
                return OperationResult<bool>.Failure("Failed To Fetch the CustomerId from the Jwt Token");

            }

            var customer = _mapper.Map<Customer>(updateCustomerProfile);

            await _customerRepo.UpdateAsync(customer, (int)customerId);


            return OperationResult<bool>.Success(true, "Profile updated successfully");
        }
    }
}
