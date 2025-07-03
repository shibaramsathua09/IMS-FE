using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using IMSIntrim.Controllers;
using IMSIntrim.Application.Interfaces;
using IMSIntrim.Applications.DTOs;
using IMSIntrim.Shared.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class AgentControllerTests
{
    private readonly Mock<IAgentServices> _mockAgentService;
    private readonly AgentController _controller;

    public AgentControllerTests()
    {
        _mockAgentService = new Mock<IAgentServices>();
        _controller = new AgentController(null, _mockAgentService.Object);
    }

    [Fact]
    public async Task GetAllAgents_ReturnsOk_WhenSuccess()
    {
        var agentDto = new AgentProfileResponseDto
        {
            Name = "Test Agent",
            ContactInfo = "test@example.com",
            AgentId=1,
            Username=""

        };

        var pagedResult = new PagedResult<AgentProfileResponseDto>
        {
            Items = new List<AgentProfileResponseDto> { agentDto },
            PageNumber = 1,
            PageSize = 10,
            TotalCount = 1
        };

        var response = OperationResult<PagedResult<AgentProfileResponseDto>>.Success(pagedResult);
        _mockAgentService.Setup(s => s.GetAllAgentsAsync(1, 10)).ReturnsAsync(response);

        var result = await _controller.GetAllAgents(1, 10);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task AddAgent_ReturnsOk_WhenSuccess()
    {
        var dto = new AgentRegisterRequestDto
        {
            Name = "New Agent",
            Email = "test@example.com",
            UserName = "newagent",
            ContactInfo = "",
            Password = "password123"
        };

        var response = OperationResult<AgentRegisterResponseDto>.Success(new AgentRegisterResponseDto
        {
            Message = "Agent added successfully"
        });

        _mockAgentService.Setup(s => s.AddAgentAsync(dto)).ReturnsAsync(response);

        var result = await _controller.AddAgent(dto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task GetAgentById_ReturnsOk_WhenFound()
    {
        var agentDto = new AgentProfileResponseDto
        {
            Name = "Agent One",
            ContactInfo = "agent1@example.com",
            AgentId = 1,
            Username = ""
        };

        var response = OperationResult<AgentProfileResponseDto>.Success(agentDto);
        _mockAgentService.Setup(s => s.GetAgentByIdAsync(1)).ReturnsAsync(response);

        var result = await _controller.GetAgentById(1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task GetProfile_ReturnsOk_WhenFound()
    {
        var profileDto = new AgentProfileResponseDto
        {
            Name = "Profile Agent",
            ContactInfo = "profile@example.com",
            AgentId = 1,
            Username = ""
        };

        var response = OperationResult<AgentProfileResponseDto>.Success(profileDto);
        _mockAgentService.Setup(s => s.GetProfileAsync()).ReturnsAsync(response);

        var result = await _controller.GetProfile();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task UpdateProfile_ReturnsOk_WhenSuccess()
    {
        var dto = new AgentProfileUpdateRequestDto
        {
            Name = "Updated Agent",
            ContactInfo = "updated@example.com"
        };

        var response = OperationResult<bool>.Success(true, "Profile Updated Successfully");
        _mockAgentService.Setup(s => s.UpdateProfileAsync(dto)).ReturnsAsync(response);

        var result = await _controller.UpdateProfile(dto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }
}
