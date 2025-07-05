
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Applications.Interfaces;
using IMSIntrim.Controllers;
using IMSIntrim.Shared.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

public class ClaimsControllerTests
{
    private readonly Mock<IClaimServices> _mockClaimService;
    private readonly ClaimsController _controller;
    private readonly Mock<ITokenService> _mockTokenService;

    public ClaimsControllerTests()
    {
        _mockTokenService = new Mock<ITokenService>();
        _mockClaimService = new Mock<IClaimServices>();
        _mockTokenService.Setup(t => t.GetCustomerIdFromCurrentRequest()).Returns(123);
        _controller = new ClaimsController(null, _mockClaimService.Object, _mockTokenService.Object);
    }

    [Fact]
    public async Task GetAllClaims_ReturnsOk_WhenSuccess()
    {
        var dto = new ClaimStatusResponseDtoForAdmin
        {
            Status = "Pending",
            PolicyName = "",
            CustomerName = ""
        };
        var response = OperationResult<PagedResult<ClaimStatusResponseDtoForAdmin>>.Success(
            new PagedResult<ClaimStatusResponseDtoForAdmin>
            {
                Items = new List<ClaimStatusResponseDtoForAdmin> { dto },
                PageNumber = 1,
                PageSize = 10,
                TotalCount = 1
            });
        _mockClaimService.Setup(s => s.GetAllClaimsAsync(1, 10)).ReturnsAsync(response);
        var result = await _controller.GetAllClaims(1, 10);
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task ApproveClaim_ReturnsOk_WhenSuccess()
    {
        var response = OperationResult<bool>.Success(true, "Approved");
        _mockClaimService.Setup(s => s.ApproveClaimAsync(1)).ReturnsAsync(response);
        var result = await _controller.ApproveClaim(1);
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task RejectClaim_ReturnsOk_WhenSuccess()
    {
        var response = OperationResult<bool>.Success(true, "Rejected");
        _mockClaimService.Setup(s => s.RejectClaimAsync(1)).ReturnsAsync(response);
        var result = await _controller.RejectClaim(1);
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task GetClaimsByCustomerId_ReturnsOk_WhenFound()
    {
        var dto = new ClaimsFiledByCustomerResponseDtoForAdmin
        {
            PolicyName = "",
            Status = "Approved"
        };
        var response = OperationResult<IEnumerable<ClaimsFiledByCustomerResponseDtoForAdmin>>.Success(
            new List<ClaimsFiledByCustomerResponseDtoForAdmin> { dto });
        _mockClaimService.Setup(s => s.GetClaimsByCustomerIdAsync(1)).ReturnsAsync(response);
        var result = await _controller.GetClaimsByCustomerId(1);
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task GetFiledClaims_ReturnsOk_WhenSuccess()
    {
        var dto = new ClaimStatusResponseDtoForAgent
        {
            PolicyName = "",
            Status = "Filed",
            CustomerName = ""
        };
        var response = OperationResult<IEnumerable<ClaimStatusResponseDtoForAgent>>.Success(
            new List<ClaimStatusResponseDtoForAgent> { dto });
        _mockClaimService.Setup(s => s.GetFiledClaimsAsync()).ReturnsAsync(response);
        var result = await _controller.GetFiledClaims();
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task FileClaimAsAgent_ReturnsOk_WhenSuccess()
    {
        _mockTokenService.Setup(s => s.GetAgentIdFromCurrentRequest()).Returns(123);
        var agentClaims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, "123"),
            new Claim(ClaimTypes.Role, Roles.Agent)
        };
        var identity = new ClaimsIdentity(agentClaims, "TestAuthType");
        var principal = new ClaimsPrincipal(identity);
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = principal }
        };
        var dto = new ClaimFilingRequestDtoForAgent
        {
            PolicyId = 101,
            AgentId = 123
        };
        var response = OperationResult<bool>.Success(true, "Filed");
        _mockClaimService.Setup(s => s.FileClaimAsync(dto)).ReturnsAsync(response);
        var result = await _controller.FileClaimAsAgent(dto);
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    //[Fact]
    //public async Task FileClaimAsCustomer_ReturnsOk_WhenSuccess()
    //{
    //    var dto = new ClaimFilingRequestDtoForCustomer
    //    {
    //        PolicyName = ""
    //    };
    //    var response = OperationResult<bool>.Success(true, "Filed");
    //    _mockClaimService.Setup(s => s.FileClaimAsync(dto)).ReturnsAsync(response);
    //    var result = await _controller.FileClaimAsCustomer(dto);
    //    var okResult = Assert.IsType<OkObjectResult>(result);
    //    Assert.Equal(response, okResult.Value);
    //}

    [Fact]
    public async Task FileClaimAsCustomer_ReturnsOk_WhenSuccess()
    {
        // Arrange
        var customerId = 123;
        var dto = new ClaimFilingRequestDtoForCustomer
        {
            PolicyName = "TestPolicy",
            CustomerId = customerId
        };

        var response = OperationResult<bool>.Success(true, "Filed");

        _mockTokenService.Setup(s => s.GetCustomerIdFromCurrentRequest()).Returns(customerId);

        _mockClaimService
            .Setup(s => s.FileClaimAsync(It.Is<ClaimFilingRequestDtoForCustomer>(d =>
                d.PolicyName == dto.PolicyName && d.CustomerId == dto.CustomerId)))
            .ReturnsAsync(response);

        // Act
        var result = await _controller.FileClaimAsCustomer(dto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }





    [Fact]
    public async Task GetMyClaims_ReturnsOk_WhenSuccess()
    {
        var dto = new ClaimStatusResponseDtoForCustomer
        {
            PolicyName = "",
            Status = "Pending",
            CustomerName = ""
        };
        var response = OperationResult<IEnumerable<ClaimStatusResponseDtoForCustomer>>.Success(
            new List<ClaimStatusResponseDtoForCustomer> { dto });
        _mockClaimService.Setup(s => s.GetMyClaimsAsync()).ReturnsAsync(response);
        var result = await _controller.GetMyClaims();
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }
}

