using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using IMSIntrim.Controllers;
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Shared.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

public class CustomersControllerTests
{
    private readonly Mock<ICustomerServices> _mockCustomerService;
    private readonly CustomersController _controller;

    public CustomersControllerTests()
    {
        _mockCustomerService = new Mock<ICustomerServices>();
        _controller = new CustomersController(null, _mockCustomerService.Object);
    }

    [Fact]
    public async Task GetAllCustomers_ReturnsOk_WhenSuccess()
    {
        var dto = new CustomerProfileResponseDto
        {
            Name = "John Doe",
            Email = "john@example.com",
            Phone = "",
            Address = "",
            CustomerId = 1,
            Username = "Test",
            DateOfBirth = DateTime.UtcNow

        };

        var response = OperationResult<PagedResult<CustomerProfileResponseDto>>.Success(
            new PagedResult<CustomerProfileResponseDto>
            {
                Items = new List<CustomerProfileResponseDto> { dto },
                PageNumber = 1,
                PageSize = 10,
                TotalCount = 1
            });

        _mockCustomerService.Setup(s => s.GetAllCustomersAsync(1, 10)).ReturnsAsync(response);

        var result = await _controller.GetAllCustomers(1, 10);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task AddCustomer_ReturnsOk_WhenSuccess()
    {
        var dto = new CustomerRegisterRequestDto
        {
            Username = "johndoe",
            Password = "password123",
            Name = "John Doe",
            Email = "john@example.com",
            Phone = "",
            Address = ""
        };

        var response = OperationResult<CustomerRegisterResponseDto>.Success("Customer added by admin");

        _mockCustomerService.Setup(s => s.AddCustomerAsync(dto)).ReturnsAsync(response);

        var result = await _controller.AddCustomer(dto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task GetCustomerByIdAsync_ReturnsOk_WhenFound()
    {
        var dto = OperationResult<CustomerProfileResponseDto>.Success(new CustomerProfileResponseDto
        {
            Name = "Jane Smith",
            Email = "jane@example.com",
            Phone = "",
            Address = "",
            CustomerId = 1,
            Username = "Test",
            DateOfBirth = DateTime.UtcNow

        });

        _mockCustomerService.Setup(s => s.GetCustomerByIdAsync(1)).ReturnsAsync(dto);

        var result = await _controller.GetCustomerByIdAsync(1);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(dto, okResult.Value);
    }

    [Fact]
    public async Task GetProfile_ReturnsOk_WhenFound()
    {
        var dto = OperationResult<CustomerProfileResponseDto>.Success(new CustomerProfileResponseDto
        {
            Name = "Alice",
            Email = "alice@example.com",
            Phone = "",
            Address = "",
            CustomerId = 1,
            Username = "Test",
            DateOfBirth = DateTime.UtcNow
        });

        _mockCustomerService.Setup(s => s.GetProfileAsync()).ReturnsAsync(dto);

        var result = await _controller.GetProfile();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(dto, okResult.Value);
    }

    [Fact]
    public async Task UpdateProfile_ReturnsOk_WhenSuccess()
    {
        var updateDto = new CustomerProfileUpdateRequestDto
        {
            Name = "Updated Name",
            Email = "updated@example.com",
            Phone = "",
            Address = ""
        };

        var response = OperationResult<bool>.Success(true, "Profile updated successfully");

        _mockCustomerService.Setup(s => s.UpdateProfileAsync(updateDto)).ReturnsAsync(response);

        var result = await _controller.UpdateProfile(updateDto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }
}

