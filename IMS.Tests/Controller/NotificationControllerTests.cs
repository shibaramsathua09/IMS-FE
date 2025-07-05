using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using IMSIntrim.Controllers;
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Shared.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

public class NotificationsControllerTests
{
    private readonly Mock<INotificationServices> _mockNotificationService;
    private readonly NotificationsController _controller;

    public NotificationsControllerTests()
    {
        _mockNotificationService = new Mock<INotificationServices>();
        _controller = new NotificationsController(null, _mockNotificationService.Object);
    }

    [Fact]
    public async Task GetMyNotifications_ReturnsOk_WhenSuccess()
    {
        var dto = new NotificationResponseDto
        {

            Message = "Your policy has been approved.",
            CreatedAt = System.DateTime.UtcNow

        };

        var response = OperationResult<IEnumerable<NotificationResponseDto>>.Success(
            new List<NotificationResponseDto> { dto });

        _mockNotificationService.Setup(s => s.GetMyNotificationsAsync()).ReturnsAsync(response);

        var result = await _controller.GetMyNotifications();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }
}
