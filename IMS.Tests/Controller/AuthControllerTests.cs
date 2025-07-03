using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using IMSIntrim.Controllers;
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Shared.Common;
using System.Threading.Tasks;

public class AuthControllerTests
{
    private readonly Mock<IAuthServices> _mockAuthService;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _mockAuthService = new Mock<IAuthServices>();
        _controller = new AuthController(_mockAuthService.Object);
    }

    [Fact]
    public async Task Register_ReturnsOk_WhenSuccess()
    {
        var request = new CustomerRegisterRequestDto
        {
            Username = "testuser",
            Password = "password123",
            Phone = "",
            Address = "",
            Name = "Test User",
            Email = "test@example.com"
        };

        var response = OperationResult<CustomerRegisterResponseDto>.Success("Registered successfully");

        _mockAuthService.Setup(s => s.RegisterAsync(request)).ReturnsAsync(response);

        var result = await _controller.Register(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenRequestIsNull()
    {
        var result = await _controller.Register(null);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Customer Request null", badRequest.Value);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenServiceFails()
    {
        var request = new CustomerRegisterRequestDto
        {
            Username = "testuser",
            Password = "password123",
            Phone = "",
            Address = "",
            Name = "Test User",
            Email = "test@example.com"
        };

        var response = OperationResult<CustomerRegisterResponseDto>.Failure("Username already exists");

        _mockAuthService.Setup(s => s.RegisterAsync(request)).ReturnsAsync(response);

        var result = await _controller.Register(request);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(response, badRequest.Value);
    }

    [Fact]
    public async Task Login_ReturnsOk_WhenSuccess()
    {
        var request = new LoginRequestDto
        {
            Username = "testuser",
            Password = "password123"
        };

        var loginResponse = new LoginResponseDto
        {
            Success = true,
            Role = "Customer",
            Message = "Login successful",
            Token = "mock-jwt-token"
        };

        var response = OperationResult<LoginResponseDto>.Success(loginResponse);

        _mockAuthService.Setup(s => s.LoginAsync(request)).ReturnsAsync(response);

        var result = await _controller.Login(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_WhenServiceFails()
    {
        var request = new LoginRequestDto
        {
            Username = "testuser",
            Password = "wrongpassword"
        };

        var response = OperationResult<LoginResponseDto>.Failure("Invalid credentials");

        _mockAuthService.Setup(s => s.LoginAsync(request)).ReturnsAsync(response);

        var result = await _controller.Login(request);

        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal(response, unauthorized.Value);
    }
}

