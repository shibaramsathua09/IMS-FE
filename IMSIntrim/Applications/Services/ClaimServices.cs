using AutoMapper;
using Humanizer;
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Applications.Interfaces;
using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Infrastructure.Persistance;
using IMSIntrim.Infrastructure.Persistance.Repositories;
using IMSIntrim.Shared.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace IMSIntrim.Application.Services
{
    public class ClaimServices : IClaimServices
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
        private readonly IPasswordHasherService _passwordHasher;
        private readonly IAuthServices _authService;
        private readonly IMapper _mapper;
        //private readonly ILogger<AdminService> _logger;
        private readonly INotificationRepository _notificationRepo;
        private readonly InsuranceDbContext _context;

        public ClaimServices(
            InsuranceDbContext context,
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
            _passwordHasher = passwordHasher;
            _roleRepo = roleRepository;
            _userRoleRepo = userRoleRepository;
            _agentRepo = agentRepository;
            _notificationRepo = notificationRepository;
            _mapper = mapper;
            _tokenService = tokenService;
            _context = context;
            //    _logger = logger;
        }

        public async Task<OperationResult<bool>> IsFiledByAgentAsync(int claimId)
        {
            var claim = await _claimRepo.GetByIdAsync(claimId);
            var agentClaimResult = claim.Data;
            if (agentClaimResult == null)
            {
                return OperationResult<bool>.Failure("No Agnet claim found");
            }
            var result = agentClaimResult.AgentId.HasValue;
            return OperationResult<bool>.Success(result);
        }

        public async Task<OperationResult<bool>> ApproveClaimAsync(int claimId)
        {
            if (claimId <= 0)
            {
                return OperationResult<bool>.Failure("Invalid claim ID.");
            }

            await _claimRepo.UpdateStatusAsync(claimId, "Approved");

            var claim = await _claimRepo.GetByIdAsync(claimId);
            if (claim == null || !claim.IsSuccess)
            {
                return OperationResult<bool>.Failure("Claim not found.");
            }

            var policyId = claim.Data?.PolicyId;
            var customerId = claim.Data?.CustomerId;

            var isFiledByAgentResult = await IsFiledByAgentAsync(claimId);
            if (!isFiledByAgentResult.IsSuccess)
            {
                return OperationResult<bool>.Failure("Failed to determine if claim was filed by an agent.");
            }

            if (!isFiledByAgentResult.Data)
            {
                var notification = new Notification
                {
                    CustomerId = customerId,
                    AgentId = null,
                    Message = $"Great news! Your claim for Policy ID {policyId} has been successfully approved. Thank you for your patience.",
                    CreatedAt = DateTime.UtcNow
                };
                await _notificationRepo.AddAsync(notification);
            }
            else
            {

                var agentNotification = new Notification
                {
                    AgentId = claim.Data?.AgentId,
                    CustomerId = null,
                    Message = $"Good news! The claim associated with Policy ID {policyId} for Customer ID {customerId} has been approved. Thank you for your diligent work.",
                    CreatedAt = DateTime.UtcNow
                };
                await _notificationRepo.AddAsync(agentNotification);


                var customerNotification = new Notification
                {
                    CustomerId = customerId,
                    AgentId = null,
                    Message = $"Great news! Your claim for Policy ID {policyId} has been successfully approved. Thank you for your patience.",
                    CreatedAt = DateTime.UtcNow
                };
                await _notificationRepo.AddAsync(customerNotification);
            }



            return OperationResult<bool>.Success(true, "Policy claim approved and notifications sent.");

        }

        public async Task<OperationResult<bool>> FileClaimAsync(ClaimFilingRequestDtoForAgent claimDto)
        {
            var claim = _mapper.Map<Claim>(claimDto);
            claim.Status = "Pending";
            claim.FiledDate = DateTime.UtcNow;

            await _claimRepo.AddAsync(claim);
            return OperationResult<bool>.Success(true, "Claim filed Succesfully");
        }

        public async Task<OperationResult<bool>> FileClaimAsync(ClaimFilingRequestDtoForCustomer claimDto)
        {
            var policy = await _context.Policies
                .Include(p => p.AvailablePolicy)
                .Include(p => p.Customer) // Ensure Customer is included  
                .FirstOrDefaultAsync(p =>
                    p.CustomerId == claimDto.CustomerId &&
                    p.AvailablePolicy.Name == claimDto.PolicyName);

            if (policy == null)
            {
                return OperationResult<bool>.Failure("No matching policy found for the customer.");
            }

            var claim = new Claim
            {
                PolicyId = policy.PolicyId,
                Policy = policy, // Set the required Policy property  
                CustomerId = claimDto.CustomerId,
                Customer = policy.Customer, // Set the required Customer property  
                ClaimAmount = claimDto.ClaimAmount,
                Status = "Pending",
                FiledDate = DateTime.UtcNow
            };

            await _claimRepo.AddAsync(claim);

            return OperationResult<bool>.Success(true, "Claim filed successfully.");
        }

        //public async Task<OperationResult<bool>> FileClaimAsync(ClaimFilingRequestDtoForCustomer claimDto)
        //{

        //    var claim = _mapper.Map<Claim>(claimDto);
        //    claim.Status = "Pending";
        //    claim.FiledDate = DateTime.UtcNow;

        //    await _claimRepo.AddAsync(claim);
        //    return OperationResult<bool>.Success(true, "Claim filed Successfully ");
        //}

        //public async Task<OperationResult<PagedResult<ClaimStatusResponseDtoForAdmin>>> GetAllClaimsAsync(int page, int size)
        //{
        //    var allClaims = await _claimRepo.GetAllAsync();
        //    if (!allClaims.IsSuccess)
        //    {
        //        return OperationResult<PagedResult<ClaimStatusResponseDtoForAdmin>>.Failure(" Failed To fetch the Claims");
        //    }
        //    var allClaimsList = allClaims.Data?.ToList();
        //    if (allClaimsList == null)
        //    {
        //        return OperationResult<PagedResult<ClaimStatusResponseDtoForAdmin>>.Failure(" No Data Available in the Claims List");
        //    }

        //    var paged = allClaimsList.Skip((page - 1) * size).Take(size).ToList();
        //    if (paged != null && paged.Any())
        //    {
        //        var claimResult = new PagedResult<ClaimStatusResponseDtoForAdmin>
        //        {
        //            Items = paged.Select(c => _mapper.Map<ClaimStatusResponseDtoForAdmin>(c)),
        //            PageNumber = page,
        //            PageSize = size,
        //            TotalCount = allClaimsList.Count
        //        };
        //        return OperationResult<PagedResult<ClaimStatusResponseDtoForAdmin>>.Success(claimResult);


        //    }
        //}

        public async Task<OperationResult<IEnumerable<ClaimsFiledByCustomerResponseDtoForAdmin>>> GetClaimsByCustomerIdAsync(int customerId)
        {
            var claims = await _claimRepo.GetByCustomerIdAsync(customerId);

            if (!claims.IsSuccess)
            {
                return OperationResult<IEnumerable<ClaimsFiledByCustomerResponseDtoForAdmin>>.Failure("Cannot retrive Claims");
            }
            var claimsDto = claims.Data;
            if (claimsDto == null)
            {
                return OperationResult<IEnumerable<ClaimsFiledByCustomerResponseDtoForAdmin>>.Failure("Claims Not Found ");
            }
            var myClaims = claimsDto.Select(c => _mapper.Map<ClaimsFiledByCustomerResponseDtoForAdmin>(c)
            );
            return OperationResult<IEnumerable<ClaimsFiledByCustomerResponseDtoForAdmin>>.Success(myClaims);

        }

        public async Task<OperationResult<IEnumerable<ClaimStatusResponseDtoForAgent>>> GetFiledClaimsAsync()
        {
            int? agentId = _tokenService.GetAgentIdFromCurrentRequest();

            if (agentId == null)
            {
                return OperationResult<IEnumerable<ClaimStatusResponseDtoForAgent>>.Failure("Unable to Get the AgentId from the Jwt Token");
            }

            var result = await _claimRepo.GetByAgentIdAsync((int)agentId);
            if (result.Data?.Any() != true)
            {
                return OperationResult<IEnumerable<ClaimStatusResponseDtoForAgent>>.Failure("No claims found for the specified agent.");
            }
            var claims = result.Data;
            if (claims?.Any() != true)
            {
                return OperationResult<IEnumerable<ClaimStatusResponseDtoForAgent>>.Failure("No claims found.");
            }

            var filedClaims = claims.Select(c => _mapper.Map<ClaimStatusResponseDtoForAgent>(c));

            return OperationResult<IEnumerable<ClaimStatusResponseDtoForAgent>>.Success(filedClaims);

        }

        public async Task<OperationResult<IEnumerable<ClaimStatusResponseDtoForCustomer>>> GetMyClaimsAsync()
        {
            int? customerId = _tokenService.GetCustomerIdFromCurrentRequest();
            if (customerId == null)
            {
                return OperationResult<IEnumerable<ClaimStatusResponseDtoForCustomer>>.Failure("Unable to Get the CustomerId from the Jwt Token");
            }
            var claims = await _claimRepo.GetByCustomerIdAsync((int)customerId);

            if (!claims.IsSuccess)
            {
                return OperationResult<IEnumerable<ClaimStatusResponseDtoForCustomer>>.Failure("Failed to retrive the Claims ");
            }
            var claimsDto = claims.Data;
            if (claimsDto == null)
            {
                return OperationResult<IEnumerable<ClaimStatusResponseDtoForCustomer>>.Failure("Claims Not Found  ");
            }
            var myClaims = claimsDto.Select(c => _mapper.Map<ClaimStatusResponseDtoForCustomer>(c));
            return OperationResult<IEnumerable<ClaimStatusResponseDtoForCustomer>>.Success(myClaims);
        }

        public async Task<OperationResult<bool>> RejectClaimAsync(int claimId)
        {
            if (claimId <= 0)
            {
                return OperationResult<bool>.Failure("Invalid claim ID.");
            }

            var result = await _claimRepo.UpdateStatusAsync(claimId, "Rejected");
            if (result == null)
            {
                return OperationResult<bool>.Failure("Policy not found.");
            }

            var claim = await _claimRepo.GetByIdAsync(claimId);
            if (claim == null || !claim.IsSuccess)
            {
                return OperationResult<bool>.Failure("Claim not found.");
            }

            var policyId = claim.Data?.PolicyId;
            var customerId = claim.Data?.CustomerId;

            var isFiledByAgentResult = await IsFiledByAgentAsync(claimId);
            if (!isFiledByAgentResult.IsSuccess)
            {
                return OperationResult<bool>.Failure("Failed to determine if claim was filed by an agent.");
            }

            if (isFiledByAgentResult.Data)
            {
                var agentNotification = new Notification
                {
                    AgentId = claim.Data?.AgentId,
                    CustomerId = null,
                    Message = $"Unfortunately, the claim associated with Policy ID {policyId} for Customer ID {customerId} has been rejected. Please review the details and take necessary actions.",
                    CreatedAt = DateTime.UtcNow
                };
                await _notificationRepo.AddAsync(agentNotification);


                var customerNotification = new Notification
                {
                    CustomerId = customerId,
                    AgentId = null,
                    Message = $"We regret to inform you that your claim for Policy ID {policyId} has been rejected. Please contact us for further assistance.",
                    CreatedAt = DateTime.UtcNow
                };
                await _notificationRepo.AddAsync(customerNotification);
            }
            else
            {
                var notification = new Notification
                {
                    CustomerId = customerId,
                    AgentId = null,
                    Message = $"We regret to inform you that your claim for Policy ID {policyId} has been rejected. Please contact us for further assistance.",
                    CreatedAt = DateTime.UtcNow
                };
                await _notificationRepo.AddAsync(notification);
            }

            return OperationResult<bool>.Success(true, "Policy claim rejected and notifications sent.");

        }
        public async Task<OperationResult<PagedResult<ClaimStatusResponseDtoForAdmin>>> GetAllClaimsAsync(int page, int size)
        {
            var allClaims = await _claimRepo.GetAllAsync();
            if (!allClaims.IsSuccess)
            {
                return OperationResult<PagedResult<ClaimStatusResponseDtoForAdmin>>.Failure(" Failed To fetch the Claims");
            }
            var allClaimsList = allClaims.Data?.ToList();
            if (allClaimsList == null)
            {
                return OperationResult<PagedResult<ClaimStatusResponseDtoForAdmin>>.Failure(" No Data Available in the Claims List");
            }

            var paged = allClaimsList.Skip((page - 1) * size).Take(size).ToList();
            if (paged != null && paged.Any())
            {
                var claimResult = new PagedResult<ClaimStatusResponseDtoForAdmin>
                {
                    Items = paged.Select(c => _mapper.Map<ClaimStatusResponseDtoForAdmin>(c)),
                    PageNumber = page,
                    PageSize = size,
                    TotalCount = allClaimsList.Count
                };
                return OperationResult<PagedResult<ClaimStatusResponseDtoForAdmin>>.Success(claimResult);

            }
            return OperationResult<PagedResult<ClaimStatusResponseDtoForAdmin>>.Failure(" Claims not Found in the specific page");


        }

        //public Task<OperationResult<PagedResult<ClaimStatusResponseDtoForAdmin>>> GetAllClaimsAsync(int page, int size)
        //{
        //    throw new NotImplementedException();
        //}
    }
}
