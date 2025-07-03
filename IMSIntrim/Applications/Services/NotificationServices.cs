using AutoMapper;
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Applications.Interfaces;
using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Infrastructure.Persistance.Repositories;
using IMSIntrim.Shared.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IMSIntrim.Application.Services
{
    public class NotificationServices : INotificationServices
    {
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly INotificationRepository _notificationRepo;
        public NotificationServices(
INotificationRepository notificationRepository,
 ITokenService tokenService,
        

        IMapper mapper
            )
        {
            _notificationRepo = notificationRepository;
            _mapper = mapper;
            _tokenService = tokenService;
         //   _logger = logger;
        }

        public async Task<OperationResult<IEnumerable<NotificationResponseDto>>> GetMyNotificationsAsync()
        {
            int? agentId = _tokenService.GetAgentIdFromCurrentRequest();
            int? customerId = _tokenService.GetCustomerIdFromCurrentRequest();

            if (customerId == null && agentId == null)
            {
                return OperationResult<IEnumerable<NotificationResponseDto>>.Failure("Unable to retrieve notifications; no valid user ID found.");
            }
            IEnumerable<Notification> notifications;
            if (customerId.HasValue)
            {
                // Fetch notifications related to the customer
                var notes = await _notificationRepo.GetByCustomerIdAsync(customerId.Value);
                notifications = notes.Data;
            }
            else if (agentId.HasValue)
            {
                // Fetch notifications related to the agent
                var notes = await _notificationRepo.GetByAgentIdAsync(agentId.Value);
                notifications = notes.Data;
            }
            else
            {
                return OperationResult<IEnumerable<NotificationResponseDto>>.Failure("No notifications found.");
            }
            if (notifications == null || !notifications.Any())
            {
                return OperationResult<IEnumerable<NotificationResponseDto>>.Failure("No notifications found for the specified user.");
            }

            var result = notifications.Select(n => _mapper.Map<NotificationResponseDto>(n));
            return OperationResult<IEnumerable<NotificationResponseDto>>.Success(result);

            //if (customerId == null || agentId==null)
            //{
            //    return OperationResult<IEnumerable<NotificationResponseDto>>.Failure("Unable to Get the AgentId or CustomerId from the Jwt Token");
            //}
            //var notes = await _notificationRepo.GetByAgentIdAsync((int)customerId);
            //if (notes.Data?.Any() != true)
            //{
            //    return OperationResult<IEnumerable<NotificationResponseDto>>.Failure("No notifications found for the specified agent.");
            //}

            //var notifications = notes.Data;
            //if (notifications?.Any() != true)
            //{
            //    return OperationResult<IEnumerable<NotificationResponseDto>>.Failure(" No notifications Found");
            //}


            //var result = notifications.Select(n => _mapper.Map<NotificationResponseDto>(n));

            //return OperationResult<IEnumerable<NotificationResponseDto>>.Success(result);
        }

       
    }
}
