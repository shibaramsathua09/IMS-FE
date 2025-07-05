
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Applications.Interfaces;
using IMSIntrim.Controllers;
using IMSIntrim.Shared.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestPlatform.Common;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class PoliciesControllerTests
{
    private readonly Mock<IPolicyServices> _mockPolicyService;
    private readonly PoliciesController _controller;
    private readonly Mock<ITokenService> _mockTokenService;

    public PoliciesControllerTests()
    {
        _mockTokenService = new Mock<ITokenService>();
        _mockPolicyService = new Mock<IPolicyServices>();
        _mockTokenService.Setup(t => t.GetCustomerIdFromCurrentRequest()).Returns(123);
        _controller = new PoliciesController(null, _mockPolicyService.Object, _mockTokenService.Object);
    }

    [Fact]
    public async Task GetAllAvailablePolicies_ReturnsOk_WhenSuccess()
    {
        var dto = new AvailablePolicyResponseDto { Name = "", CoverageDetails = "" };
        var response = OperationResult<PagedResult<AvailablePolicyResponseDto>>.Success(
            new PagedResult<AvailablePolicyResponseDto>
            {
                Items = new List<AvailablePolicyResponseDto> { dto },
                PageNumber = 1,
                PageSize = 10,
                TotalCount = 1
            });

        _mockPolicyService.Setup(s => s.GetAllAvailablePoliciesAsync(1, 10)).ReturnsAsync(response);

        var result = await _controller.GetAllAvailablePolicies(1, 10);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task AddAvailablePolicy_ReturnsOk_WhenSuccess()
    {
        var dto = new AvailablePolicyRequestDto { Name = "", CoverageDetails = "" };
        var response = OperationResult<bool>.Success(true, "New Policy Launched Successfully");

        _mockPolicyService.Setup(s => s.AddAvailablePolicyAsync(dto)).ReturnsAsync(response);

        var result = await _controller.AddAvailablePolicy(dto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task UpdateAvailablePolicy_ReturnsOk_WhenSuccess()
    {
        var dto = new AvailablePolicyRequestDto { Name = "UpdatedPolicy", CoverageDetails = "UpdatedCoverage" };
        var response = OperationResult<bool>.Success(true, "Policy updated successfully");

        _mockPolicyService.Setup(s => s.UpdateAvailablePolicyAsync(dto, 1)).ReturnsAsync(response);

        var result = await _controller.UpdateAvailablePolicy(dto, 1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task DeleteAvailablePolicy_ReturnsOk_WhenSuccess()
    {
        var response = OperationResult<bool>.Success(true, "Policy deleted successfully");

        _mockPolicyService.Setup(s => s.DeleteAvailablePolicyAsync(1)).ReturnsAsync(response);

        var result = await _controller.DeleteAvailablePolicy(1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task ApprovePolicyRequest_ReturnsOk_WhenSuccess()
    {
        var dto = new AssignAgentRequestDto { AgentId = 101 };
        var response = OperationResult<bool>.Success(true, "Policy approved");

        _mockPolicyService.Setup(s => s.ApprovePolicyRequestAsync(dto, 1)).ReturnsAsync(response);

        var result = await _controller.ApprovePolicyRequest(dto, 1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task RejectPolicyRequest_ReturnsOk_WhenSuccess()
    {
        var response = OperationResult<bool>.Success(true, "Policy request rejected");

        _mockPolicyService.Setup(s => s.RejectPolicyRequestAsync(1)).ReturnsAsync(response);

        var result = await _controller.RejectPolicyRequest(1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task GetAvailablePolicyByIdAsync_ReturnsOk_WhenSuccess()
    {
        var dto = new AvailablePolicyResponseDto { Name = "", CoverageDetails = "" };
        var response = OperationResult<AvailablePolicyResponseDto>.Success(dto);

        _mockPolicyService.Setup(s => s.GetAvailablePolicyByIdAsync(1)).ReturnsAsync(response);

        var result = await _controller.GetAvailablePolicyByIdAsync(1);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(response, okResult.Value);
    }
   
    [Fact]
    public async Task RequestPolicy_ReturnsOk_WhenSuccess()
    {
        var dto = new PolicyRequestDto { CustomerId = 123, AvailablePolicyName = "Test" };
        var response = OperationResult<bool>.Success(true, "Request Submitted Successfully");

        _mockPolicyService.Setup(s => s.GetExistingPolicyByNameAsync(123, "Test"));
                          // Adjust type if needed

        _mockPolicyService.Setup(s => s.RequestPolicyAsync(dto)).ReturnsAsync(response);

        var result = await _controller.RequestPolicy(dto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }


    [Fact]
    public async Task GetPolicyRequestByIdAsync_ReturnsOk_WhenSuccess()
    {
        var dto = new PolicyRequestStatusResponseDto { Status = "Pending", AvailablePolicyName = "Test", CustomerName = "Test" };
        var response = OperationResult<PolicyRequestStatusResponseDto>.Success(dto);

        _mockPolicyService.Setup(s => s.GetPolicyRequestByIdAsync(1)).ReturnsAsync(response);

        var result = await _controller.GetPolicyRequestByIdAsync(1);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task GetAssignedPolicies_ReturnsOk_WhenSuccess()
    {
        var response = OperationResult<IEnumerable<AgentAssignedPolicyResponseDto>>.Success(new List<AgentAssignedPolicyResponseDto>());

        _mockPolicyService.Setup(s => s.GetAssignedPoliciesAsync()).ReturnsAsync(response);

        var result = await _controller.GetAssignedPolicies();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task GetRegisteredPolicies_ReturnsOk_WhenSuccess()
    {
        var response = OperationResult<IEnumerable<CustomerPoliciesResponseDto>>.Success(new List<CustomerPoliciesResponseDto>());

        _mockPolicyService.Setup(s => s.GetRegisteredPoliciesAsync()).ReturnsAsync(response);

        var result = await _controller.GetRegisteredPolicies();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task GetPolicyRequests_ReturnsOk_WhenSuccess()
    {
        var response = OperationResult<IEnumerable<PolicyRequestStatusResponseDto>>.Success(new List<PolicyRequestStatusResponseDto>());

        _mockPolicyService.Setup(s => s.GetPolicyRequestsAsync()).ReturnsAsync(response);

        var result = await _controller.GetPolicyRequests();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

}

