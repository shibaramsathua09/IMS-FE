using AutoMapper;
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Applications.Interfaces;
using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Infrastructure.Persistance;
using IMSIntrim.Infrastructure.Persistance.Repositories;
using IMSIntrim.Shared.Common;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace IMSIntrim.Application.Services
{
    public class PolicyServices : IPolicyServices
    {
        private readonly ITokenService _tokenService;
        private readonly InsuranceDbContext _dbContext;

      private readonly IPolicyRequestRepository _requestRepo;
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
        public PolicyServices
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
            InsuranceDbContext dbContext,
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
            _passwordHasherService = passwordHasher;
            _roleRepo = roleRepository;
            _userRoleRepo = userRoleRepository;
            _agentRepo = agentRepository;
            _notificationRepo = notificationRepository;
            _mapper = mapper;
            _tokenService = tokenService;
            _dbContext = dbContext;
         //   _logger = logger;
        }
        public async Task<OperationResult<bool>> AddAvailablePolicyAsync(AvailablePolicyRequestDto dto)
        {
            var policy = _mapper.Map<AvailablePolicy>(dto);

            await _availablePolicyRepo.AddAsync(policy);
            return OperationResult<bool>.Success(true, "New Policy Launched Successfully");

        }

        public async Task<OperationResult<bool>> ApprovePolicyRequestAsync(AssignAgentRequestDto dto, int requestId)
        {
            var result = await _policyRequestRepo.GetByIdAsync(requestId);


            if (!result.IsSuccess)
            {
                return OperationResult<bool>.Failure($"Policy request with ID '{requestId}' not found.");
            }

            PolicyRequest? policyRequest = result.Data;


            var updateResult = await _policyRequestRepo.UpdateStatusAsync(requestId, "Approved");

            if (!updateResult.IsSuccess)
            {
                return OperationResult<bool>.Failure($"Failed to update the status of policy request with ID '{requestId}' to 'Approved'.");
            }

            if (policyRequest != null && policyRequest.AvailablePolicy != null)
            {
                var newPolicy = _mapper.Map<Policy>(dto);
                newPolicy.IssuedDate = DateTime.UtcNow;
                newPolicy.ExpiryDate = DateTime.UtcNow.AddYears(policyRequest.AvailablePolicy.ValidityPeriod);
                _mapper.Map(policyRequest, newPolicy);

                var response = await _policyRepo.AddAsync(newPolicy);

                if (!response.IsSuccess)
                {
                    return OperationResult<bool>.Failure($"Failed to register a new policy for Customer ID '{policyRequest.CustomerId}' and Available Policy ID '{policyRequest.AvailablePolicyId}'.");
                }


                var customerNotification = new Notification
                {
                    CustomerId = policyRequest.CustomerId,
                    AgentId = null,
                    Message = $"Congratulations! Your policy request for Registering a new policy of Available Policy ID {policyRequest.AvailablePolicyId} with Request ID {policyRequest.RequestId} has been approved and Assigned with an Agent{dto.AgentId}. Please review the details and proceed with the next steps.",
                    CreatedAt = DateTime.UtcNow
                };

                var agentNotification = new Notification
                {
                    CustomerId = null,
                    AgentId = dto.AgentId,
                    Message = $"Dear Agent, you have been assigned a new policy for Customer ID {policyRequest.CustomerId}. The details are as follows:Available Policy ID: {policyRequest.AvailablePolicyId}, Policy Request ID: {policyRequest.RequestId}. Please review and take the necessary actions."
,
                    CreatedAt = DateTime.UtcNow
                };


                var customerNotificationResult = await _notificationRepo.AddAsync(customerNotification);
                var agentNotificationResult = await _notificationRepo.AddAsync(agentNotification);

                if (!customerNotificationResult.IsSuccess || !agentNotificationResult.IsSuccess)
                {
                    return OperationResult<bool>.Failure("Failed to add notifications");
                }
            }


            return OperationResult<bool>.Success(true, "policy added and Notification Sent");

        }

        public async Task<OperationResult<bool>> DeleteAvailablePolicyAsync(int id)
        {
            await _availablePolicyRepo.DeleteAsync(id);
            return OperationResult<bool>.Success(true, "Available Policy deleted successfully");

        }

        public async Task<OperationResult<PagedResult<AvailablePolicyResponseDto>>> GetAllAvailablePoliciesAsync(int page, int size)
        {
            //_logger.LogInformation("GetAllAvailablePoliciesAsync started");
            var allAvailablePolicies = await _availablePolicyRepo.GetAllAsync();

            if (!allAvailablePolicies.IsSuccess)
            {
                return OperationResult<PagedResult<AvailablePolicyResponseDto>>.Failure("  Failed To fetch the Available Policy");
            }

            var allAvailablePoliciesList = allAvailablePolicies.Data?.ToList();

            if (allAvailablePoliciesList == null)
            {
                return OperationResult<PagedResult<AvailablePolicyResponseDto>>.Failure(" There is no data  in the Available Policy List");
            }


            var paged = allAvailablePoliciesList.Skip((page - 1) * size).Take(size).ToList();
            if (paged != null && paged.Any())
            {
                var policyResult = new PagedResult<AvailablePolicyResponseDto>
                {

                    Items = paged.Select(p => _mapper.Map<AvailablePolicyResponseDto>(p)),

                    PageNumber = page,
                    PageSize = size,
                    TotalCount = allAvailablePoliciesList.Count

                };
                return OperationResult<PagedResult<AvailablePolicyResponseDto>>.Success(policyResult);



            }
            return OperationResult<PagedResult<AvailablePolicyResponseDto>>.Failure(" There is no Available Policy in the specific page");

        }

        //public async Task<OperationResult<PagedResult<PolicyRequestStatusResponseDto>>> GetAllPolicyRequestsAsync(int page, int size)
        //{
        //    var allpolicyRequests = await _policyRequestRepo.GetAllAsync(page, size);
        //    if (!allpolicyRequests.IsSuccess)
        //    {
        //        return OperationResult<PagedResult<PolicyRequestStatusResponseDto>>.Failure("Failed to fetch all the Policy requests");
        //    }

        //    var allPolicyRequestList = allpolicyRequests.Data?.ToList();
        //    if (allPolicyRequestList == null || !allPolicyRequestList.Any())
        //    {
        //        return OperationResult<PagedResult<PolicyRequestStatusResponseDto>>.Failure("No Policy Requests found in the List");
        //    }

        //    var paged = allPolicyRequestList.Skip((page - 1) * size).Take(size).ToList();
        //    if (paged.Any())
        //    {
        //        var policyRequestResult = new PagedResult<PolicyRequestStatusResponseDto>
        //        {
        //            Items = paged.Select(r => _mapper.Map<PolicyRequestStatusResponseDto>(r)),
        //            PageNumber = page,
        //            PageSize = size,
        //            TotalCount = allPolicyRequestList.Count
        //        };
        //        return OperationResult<PagedResult<PolicyRequestStatusResponseDto>>.Success(policyRequestResult);
        //    }

        //    return OperationResult<PagedResult<PolicyRequestStatusResponseDto>>.Failure("Policy Requests not found in the specific page");
        //}
        //    return OperationResult<PagedResult<PolicyRequestStatusResponseDto>>.Failure("Policy Requests not Found in the specific page");

        //}
        //public async Task<OperationResult<PagedResult<PolicyRequestStatusResponseDto>>> GetAllPolicyRequestsAsync(int page, int size)
        //{
        //    var allpolicyRequests = await _policyRequestRepo.GetAllAsync(page,size);
        //    if (!allpolicyRequests.IsSuccess)
        //    {
        //        return OperationResult<PagedResult<PolicyRequestStatusResponseDto>>.Failure("Failed to fetch policy requests");
        //    }

        //    var allPolicyRequestList = allpolicyRequests.Data?.ToList();
        //    if (allPolicyRequestList == null || !allPolicyRequestList.Any())
        //    {
        //        return OperationResult<PagedResult<PolicyRequestStatusResponseDto>>.Failure("No policy requests found");
        //    }

        //    var paged = allPolicyRequestList.Skip((page - 1) * size).Take(size).ToList();

        //    var mapped = _mapper.Map<List<PolicyRequestStatusResponseDto>>(paged);

        //    var policyRequestResult = new PagedResult<PolicyRequestStatusResponseDto>
        //    {
        //        Items = mapped,
        //        PageNumber = page,
        //        PageSize = size,
        //        TotalCount = allPolicyRequestList.Count
        //    };
        //    Console.WriteLine($"Fetching page {page} with size {size}");

        //    return OperationResult<PagedResult<PolicyRequestStatusResponseDto>>.Success(policyRequestResult);
        //}
        //public async Task<OperationResult<PagedResult<PolicyRequestStatusResponseDto>>> GetAllPolicyRequestsAsync(int page, int size)
        //{
        //    var allpolicyRequests = await _policyRequestRepo.GetAllAsync(page, size);
        //    if (!allpolicyRequests.IsSuccess)
        //    {
        //        return OperationResult<PagedResult<PolicyRequestStatusResponseDto>>.Failure("Failed to fetch policy requests");
        //    }

        //    var paged = allpolicyRequests.Data?.ToList();
        //    if (paged == null || !paged.Any())
        //    {
        //        return OperationResult<PagedResult<PolicyRequestStatusResponseDto>>.Failure("No policy requests found");
        //    }

        //    var mapped = _mapper.Map<List<PolicyRequestStatusResponseDto>>(paged);

        //    var totalCount = await _policyRequestRepo.GetTotalCountAsync(); // You'll implement this

        //    var policyRequestResult = new PagedResult<PolicyRequestStatusResponseDto>
        //    {
        //        Items = mapped,
        //        PageNumber = page,
        //        PageSize = size,
        //        TotalCount = totalCount
        //    };

        //    Console.WriteLine($"Fetching page {page} with size {size}, returned {mapped.Count} items of total {totalCount}");

        //    return OperationResult<PagedResult<PolicyRequestStatusResponseDto>>.Success(policyRequestResult);
        //}

        public async Task<OperationResult<PagedResult<PolicyRequestStatusResponseDto>>> GetAllPolicyRequestsAsync(int page, int size)
        {
            var pagedRequests = await _policyRequestRepo.GetAllPagedAsync(page, size);
            if (!pagedRequests.IsSuccess || pagedRequests.Data == null)
            {
                return OperationResult<PagedResult<PolicyRequestStatusResponseDto>>.Failure("Failed to fetch policy requests");
            }

            var mapped = _mapper.Map<List<PolicyRequestStatusResponseDto>>(pagedRequests.Data.Items);

            var result = new PagedResult<PolicyRequestStatusResponseDto>
            {
                Items = mapped,
                PageNumber = page,
                PageSize = size,
                TotalCount = pagedRequests.Data.TotalCount
            };

            return OperationResult<PagedResult<PolicyRequestStatusResponseDto>>.Success(result);
        }

        public async Task<OperationResult<IEnumerable<AgentAssignedPolicyResponseDto>>> GetAssignedPoliciesAsync()
        {
            int? agentId = _tokenService.GetAgentIdFromCurrentRequest();

            if (agentId == null)
            {
                return OperationResult<IEnumerable<AgentAssignedPolicyResponseDto>>.Failure("Unable to Get the AgentId from the Jwt Token");
            }
            var result = await _policyRepo.GetByAgentIdAsync((int)agentId);
            if (result.Data?.Any() != true)
            {
                return OperationResult<IEnumerable<AgentAssignedPolicyResponseDto>>.Failure("No policies found for the specified agent.");
            }
            var policies = result.Data;
            if (policies?.Any() != true)
            {
                return OperationResult<IEnumerable<AgentAssignedPolicyResponseDto>>.Failure("No Policies Found");
            }
            var assignedPolicies = policies.Select(p => _mapper.Map<AgentAssignedPolicyResponseDto>(p)).ToList();

            return OperationResult<IEnumerable<AgentAssignedPolicyResponseDto>>.Success(assignedPolicies);

        }

        public async Task<OperationResult<AvailablePolicyResponseDto>> GetAvailablePolicyByIdAsync(int policyId)
        {
            var availablePolicy = await _availablePolicyRepo.GetByIdAsync(policyId);
            if (!availablePolicy.IsSuccess)
            {
                return OperationResult<AvailablePolicyResponseDto>.Failure($"  Failed To fetch the Available Policy of Id{policyId}");

            }
            var availablePolicyResult = availablePolicy.Data;
            var result = _mapper.Map<AvailablePolicyResponseDto>(availablePolicyResult);
            return OperationResult<AvailablePolicyResponseDto>.Success(result);
        }

        public async Task<OperationResult<PolicyRequestStatusResponseDto>> GetPolicyRequestByIdAsync(int requestId)
        {
            var loggedInCustomerId = _tokenService.GetCustomerIdFromCurrentRequest();
            if (loggedInCustomerId == null)
            {
                return OperationResult<PolicyRequestStatusResponseDto>.Failure("Unauthorized: Customer ID not found.");
            }

            // Fetch the request details
            var request = await _policyRequestRepo.GetByIdAsync(requestId);
            if (!request.IsSuccess)
            {
                return OperationResult<PolicyRequestStatusResponseDto>.Failure($"Failed to fetch the request with ID {requestId}");
            }

            var requestResult = request.Data;

            // Validate ownership: Ensure request belongs to logged-in customer
            if (requestResult.CustomerId != loggedInCustomerId)
            {
                return OperationResult<PolicyRequestStatusResponseDto>.Failure("Unauthorized: You can only access your own policy requests.");
            }
            // Map and return response
            var result = _mapper.Map<PolicyRequestStatusResponseDto>(requestResult);
            return OperationResult<PolicyRequestStatusResponseDto>.Success(result);
        }

        public async Task<OperationResult<IEnumerable<PolicyRequestStatusResponseDto>>> GetPolicyRequestsAsync()
        {
            int? customerId = _tokenService.GetCustomerIdFromCurrentRequest();
            if (customerId == null)
            {
                return OperationResult<IEnumerable<PolicyRequestStatusResponseDto>>.Failure("Unable to Get the CustomerId from the Jwt Token");
            }
            var requests = await _policyRequestRepo.GetByCustomerIdAsync((int)customerId);
            if (!requests.IsSuccess)
            {
                return OperationResult<IEnumerable<PolicyRequestStatusResponseDto>>.Failure("Failed to retrieve policy requests .");
            }
            var result = requests.Data;
            if (result == null)
            {
                return OperationResult<IEnumerable<PolicyRequestStatusResponseDto>>.Failure("No policy requests found.");
            }

            var policyRequests = result.Select(r => _mapper.Map<PolicyRequestStatusResponseDto>(r));

            return OperationResult<IEnumerable<PolicyRequestStatusResponseDto>>.Success(policyRequests);

        }

        public async Task<OperationResult<IEnumerable<CustomerPoliciesResponseDto>>> GetRegisteredPoliciesAsync()
        {
            int? customerId = _tokenService.GetCustomerIdFromCurrentRequest();
            if (customerId == null)
            {
                return OperationResult<IEnumerable<CustomerPoliciesResponseDto>>.Failure("Unable to Get the CustomerId from the Jwt Token");
            }
            var existingPolicies = await _policyRepo.GetByCustomerIdAsync((int)customerId);
            if (!existingPolicies.IsSuccess)
            {
                return OperationResult<IEnumerable<CustomerPoliciesResponseDto>>.Failure("Failed to retrieve Registered policies for the customer .");
            }
            var policyResult = existingPolicies.Data;
            if (policyResult == null)
            {
                return OperationResult<IEnumerable<CustomerPoliciesResponseDto>>.Failure("Registered Policies not found .");
            }

            var Registeredpolicies = policyResult.Select(p => _mapper.Map<CustomerPoliciesResponseDto>(p));
            Registeredpolicies = policyResult.Select(p => new CustomerPoliciesResponseDto
            {
                PolicyId = p.PolicyId,
                AvailablePolicyName = p.AvailablePolicy.Name,
                AgentName = p.Agent.Name,
                AgentContact = p.Agent.ContactInfo,
                IssuedDate = p.IssuedDate,
                ExpiryDate = p.ExpiryDate,
                PremiumAmount = p.AvailablePolicy.BasePremium // ← magic line!
            });


            return OperationResult<IEnumerable<CustomerPoliciesResponseDto>>.Success(Registeredpolicies);
        }

        public async Task<OperationResult<bool>> RejectPolicyRequestAsync(int requestId)
        {
            var updateResult = await _policyRequestRepo.UpdateStatusAsync(requestId, "Rejected");

            if (!updateResult.IsSuccess)
            {
                return OperationResult<bool>.Failure("Failed to update the policy request status");
            }

            var result = await _policyRequestRepo.GetByIdAsync(requestId);

            if (!result.IsSuccess)
            {
                return OperationResult<bool>.Failure("Policy request not found");
            }

            PolicyRequest? policyRequest = result.Data;

            if (policyRequest != null)
            {
                var customerNotification = new Notification
                {
                    CustomerId = policyRequest.CustomerId,
                    AgentId = null,
                    Message = $"Your policy request For the AvailablePolicyId {policyRequest.AvailablePolicyId} with ID {policyRequest.RequestId} has been rejected.",
                    CreatedAt = DateTime.UtcNow
                };

                var notificationResult = await _notificationRepo.AddAsync(customerNotification);

                if (!notificationResult.IsSuccess)
                {
                    return OperationResult<bool>.Failure("Failed to add notification");
                }
            }

            return OperationResult<bool>.Success(true, "Policy request rejected and notification sent");

        }

        public async Task<OperationResult<bool>> RequestPolicyAsync(PolicyRequestDto requestDto)
        {
            // Step 1: Lookup the actual AvailablePolicy entity  
            var policy = await _dbContext.AvailablePolicies
                .Include(p => p.IssuedPolicies)
                .Include(p => p.PolicyRequests)
                .FirstOrDefaultAsync(p => p.Name == requestDto.AvailablePolicyName);

            if (policy == null)
            {
                return OperationResult<bool>.Failure("No policy found with the specified name.");
            }

            // Step 2: Lookup the actual Customer entity  
            var customer = await _dbContext.Customers
                .FirstOrDefaultAsync(c => c.CustomerId == requestDto.CustomerId);

            if (customer == null)
            {
                return OperationResult<bool>.Failure("No customer found with the specified ID.");
            }

            // Step 3: Check for existing requests by CustomerId + AvailablePolicyId  
            var exists = await _dbContext.PolicyRequests.AnyAsync(r =>
                r.CustomerId == requestDto.CustomerId &&
                r.AvailablePolicyId == policy.AvailablePolicyId);

            if (exists)
            {
                return OperationResult<bool>.Failure("Policy request already exists for this customer.");
            }

            // Step 4: Create and save the new request  
            var newRequest = new PolicyRequest
            {
                CustomerId = requestDto.CustomerId,
                Customer = customer,
                AvailablePolicyId = policy.AvailablePolicyId,
                AvailablePolicy = policy,
                RequestedOn = DateTime.UtcNow,
                Status = "Pending"
            };

            await _policyRequestRepo.AddAsync(newRequest);

            return OperationResult<bool>.Success(true, "Request submitted successfully.");
        }


        //public async Task<OperationResult<bool>> RequestPolicyAsync(PolicyRequestDto requestDto)
        //{
        //    //var customerId = int.Parse(User.FirstMethodOrDefault("CustomerId").Value);

        //    //var result = await _policyRepo.requestPolicyAsync(requestDto, customerId);

        //    //if (result.IsSucess)
        //    //    return Ok(result);
        //    //return BadRequest(result);




        //    var request = _mapper.Map<PolicyRequest>(requestDto);
        //    request.RequestedOn = DateTime.UtcNow;
        //    request.Status = "Pending";

        //    //var customerExists = await _customerRepo.ExistsAsync(requestDto.CustomerId);

        //    //if (!customerExists)
        //    //{
        //    //    return OperationResult<bool>.Failure("Customer does not exist.");
        //    //}


        //    await _policyRequestRepo.AddAsync(request);
        //    return OperationResult<bool>.Success(true, "Request Submitted Successfully");
        //}

        public async Task<OperationResult<bool>> UpdateAvailablePolicyAsync(AvailablePolicyRequestDto dto, int policyId)
        {
            var availablePolicy = await _availablePolicyRepo.GetByIdAsync(policyId);
            if (!availablePolicy.IsSuccess)
            {
                return OperationResult<bool>.Failure($"Failed to fetch the available policy of Id{policyId}");
            }

            var policy = _mapper.Map<AvailablePolicy>(dto);

            await _availablePolicyRepo.UpdateAsync(policy, policyId);
            return OperationResult<bool>.Success(true, "Available Policy updated successfully");

        }

        public async Task<Policy?> GetExistingPolicyAsync(int customerId, int policyId)
        {
            return await _dbContext.Policies.FirstOrDefaultAsync(p => p.CustomerId == customerId && p.PolicyId == policyId);
        }

        public async Task<Policy?> GetExistingPolicyByNameAsync(int customerId, string policyName)
        {
            return await _dbContext.Policies
                .Include(p => p.AvailablePolicy)
                .FirstOrDefaultAsync(p =>
                    p.CustomerId == customerId &&
                    p.AvailablePolicy.Name == policyName);
        }


    }
}
