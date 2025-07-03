
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.AspNetCore.Authorization;
    using IMSIntrim.Domain.Models;
    using IMSIntrim.Infrastructure.Persistance;
    using IMSIntrim.Application.Interfaces;
    using IMSIntrim.Applications.DTOs;

    namespace IMSIntrim.Controllers
    {
        [Route("api/notifications")]
        [ApiController]
        public class NotificationsController : ControllerBase
        {
            private readonly InsuranceDbContext _context;
            private readonly INotificationServices _notificationService;

            public NotificationsController(InsuranceDbContext context, INotificationServices notificationService)
            {
                _context = context;
                _notificationService = notificationService;
            }

            [HttpGet("user")]
        [Authorize(Roles = $"{Roles.Customer},{Roles.Agent}")]
        public async Task<IActionResult> GetMyNotifications()
            {
                var notes = await _notificationService.GetMyNotificationsAsync();
                if (!notes.IsSuccess) return NotFound(notes);
                return Ok(notes);
            }
        }
    }