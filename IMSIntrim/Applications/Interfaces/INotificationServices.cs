using IMSIntrim.Applications.DTOs;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.AspNetCore.Mvc;

namespace IMSIntrim.Application.Interfaces
{
    public interface INotificationServices
    {
        public Task<OperationResult<IEnumerable<NotificationResponseDto>>> GetMyNotificationsAsync();

       
    }
}