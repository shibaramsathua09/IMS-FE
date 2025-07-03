using AutoMapper;
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Applications.Interfaces;
using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Infrastructure.Persistance.Repositories;
using IMSIntrim.Shared.Common;

namespace IMSIntrim.Application.Services
{
    public class AuthServices:IAuthServices
    {
        private readonly IUserRepository _userRepository;

        private readonly IRoleRepository _roleRepository;

        private readonly ICustomerRepository _customerRepository;

        private readonly IPasswordHasherService _passwordHasher;
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly ITokenService _tokenService;
        private readonly IAgentRepository _agentRepository;
        private readonly IMapper _mapper;
        public AuthServices(
             IUserRepository userRepository,

            IRoleRepository roleRepository,

            ICustomerRepository customerRepository,

            IPasswordHasherService passwordHasher,

            IUserRoleRepository userRoleRepository,
            ITokenService tokenService,
            IAgentRepository agentRepository,
        IMapper mapper
            )
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;

            _customerRepository = customerRepository;

            _passwordHasher = passwordHasher;
            _userRoleRepository = userRoleRepository;
            _tokenService = tokenService;
            _agentRepository = agentRepository;
            _mapper = mapper;
        }

        public async Task<OperationResult<IEnumerable<UserWithRoleResponseDto>>> GetAllUsersAsync()
        {
            
            var users = await _userRepository.GetAllWithRolesAsync();
            if (!users.IsSuccess)
            {
                return OperationResult<IEnumerable<UserWithRoleResponseDto>>.Failure("Failed to Fetch all the Users");
            }
            var userResult = users.Data;
            if (userResult == null)
            {
               
                return OperationResult<IEnumerable<UserWithRoleResponseDto>>.Failure("There is no data found in the list");
            }

            var result = userResult.Select(u => _mapper.Map<UserWithRoleResponseDto>(u));
            return OperationResult<IEnumerable<UserWithRoleResponseDto>>.Success(result);
        }

        public async Task<OperationResult<LoginResponseDto>> LoginAsync(LoginRequestDto dto)

        {
            var user = await _userRepository.GetByUsernameAsync(dto.Username);
            var login = user.Data;

            if (login == null || login.IsDeleted)

            {

                return OperationResult<LoginResponseDto>.Failure("UserName Not found");

            }

            var verified = _passwordHasher.VerifyPassword(dto.Password, login.PasswordHash);

            if (!verified)

            {

                return OperationResult<LoginResponseDto>.Failure(" Invalid Password or username");

            }

            var userId = login.Id;
            var role = login.UserRole?.Role?.Name ?? "Unknown";



            int? id = 0;
            if (role == Roles.Customer.ToString())
            {
                var response = await _customerRepository.GetCustomerIdFromUserIdAsync(userId);
                if (!response.IsSuccess)
                {
                    return OperationResult<LoginResponseDto>.Failure(response.Message);
                }
                id = response.Data;
            }
            else if (role == Roles.Agent.ToString())
            {
                var response = await _agentRepository.GetAgentIdFromUserIdAsync(userId);
                if (!response.IsSuccess)
                {
                    return OperationResult<LoginResponseDto>.Failure(response.Message);
                }
                id = response.Data;

            }
            if (role == Roles.Admin.ToString())
            {
                id = null;
            }


            var jwtToken = _tokenService.GenerateToken(userId, role, id);

            var log = new LoginResponseDto
            {
                Success = true,
                Role = role,
                Message = "Login successful",
                Token = jwtToken
            };

            return OperationResult<LoginResponseDto>.Success(log);


        }

        public async Task<OperationResult<CustomerRegisterResponseDto>> RegisterAsync(CustomerRegisterRequestDto dto)
        {
            var result = await _roleRepository.GetByNameAsync("Customer"); // or dto.Role if dynamic
            if (result?.Data == null)
            {
                return OperationResult<CustomerRegisterResponseDto>.Failure("Customer Role Not found");
            }
            var existingUserResult = await _userRepository.GetByUsernameAsync(dto.Username);

            if (!existingUserResult.IsSuccess)
            {
                return OperationResult<CustomerRegisterResponseDto>.Failure(existingUserResult.Message);
            }

            var user = _mapper.Map<User>(dto);
            user.Id = Guid.NewGuid();
            user.IsDeleted = false;
            user.PasswordHash = _passwordHasher.HashPassword(dto.Password);

            var addUserResult = await _userRepository.AddAsync(user);

            if (!addUserResult.IsSuccess)
            {
                return OperationResult<CustomerRegisterResponseDto>.Failure(addUserResult.Message);
            }



            var role = result.Data;



            var userRole = _mapper.Map<UserRole>(user);
            _mapper.Map(role, userRole);


            var userRoleResult = await _userRoleRepository.AddAsync(userRole);
            if (!userRoleResult.IsSuccess)
            {
                return OperationResult<CustomerRegisterResponseDto>.Failure(userRoleResult.Message);

            }



            var customer = _mapper.Map<Customer>(dto);
            _mapper.Map(user, customer);


            var addCustomerResult = await _customerRepository.AddAsync(customer);
            if (!addCustomerResult.IsSuccess)
            {
                return OperationResult<CustomerRegisterResponseDto>.Failure(addCustomerResult.Message);

            }


            return OperationResult<CustomerRegisterResponseDto>.Success(" Registered successfully");
        }

        public OperationResult<string> GetRoleService()
        {
            var role = _tokenService.GetRoleFromCurrentRequest();
            if (role == null)
            {
                return OperationResult<string>.Failure("Please login");
            }
            return OperationResult<string>.Success(role);
        }

    }
}
