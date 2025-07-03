using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.EntityFrameworkCore;

namespace IMSIntrim.Infrastructure.Persistance.Repositories
{
    public class AgentRepository : IAgentRepository
    {
        private readonly InsuranceDbContext _context;
        public AgentRepository(InsuranceDbContext context)
        {
            _context = context;
        }

        public async Task<OperationResult<IEnumerable<Agent>>> GetAllAsync()
        {

            // var agent= await _context.Agents.ToListAsync();
            var agents = await _context.Agents
            .Include(a => a.User)
            .ToListAsync();


            return OperationResult<IEnumerable<Agent>>.Success(agents);
        }

        public async Task<OperationResult<Agent?>> GetByIdAsync(int id)
        {
            var agent = await _context.Agents.FindAsync(id);
            if (agent == null)
            {
                return OperationResult<Agent?>.Failure("Agent not exist");
            }
            return OperationResult<Agent?>.Success(agent);
        }

        public async Task<OperationResult<Agent>> GetByUserIdAsync(int agentId)
        {
            //var agent = await _context.Agents.FirstOrDefaultAsync(a => a.AgentId == agentId);
            //if (agent == null)
            //{
            //    return OperationResult<Agent>.Failure("Agent not exist");
            //}
            //return OperationResult<Agent>.Success(agent);
            var agent = await _context.Agents
        .Include(a => a.User)
        .FirstOrDefaultAsync(a => a.AgentId == agentId);

            if (agent == null)
            {
                return OperationResult<Agent>.Failure("Agent not exist");
            }

            return OperationResult<Agent>.Success(agent);
        }

        public async Task<OperationResult<bool>> AddAsync(Agent agent)
        {
            var addAgent= await _context.Agents.AddAsync(agent);
            if (addAgent==null)
            {
                return OperationResult<bool>.Failure("Agent not added");
            }
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success(true,"Agent added successfully");
        }

        public async Task<OperationResult<bool>>UpdateAsync(Agent agent, int agentId)
        {
           var agentDetail = await _context.FindAsync<Agent>(agentId);

            if (agentDetail == null)
            {
                return OperationResult<bool>.Failure("Agent does not exist");
            }

            agentDetail.Name = agent.Name;
            agentDetail.ContactInfo = agent.ContactInfo;

            _context.Agents.Update(agentDetail);
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success(true," Agent record updated successfully");
        }

        

        public async Task<OperationResult<bool>> DeleteAsync(int id)
        {
            var agent = await _context.Agents.FindAsync(id);

            if(agent == null)
            {
                return OperationResult<bool>.Failure("Agent record does not exist");
            }

            _context.Agents.Remove(agent);
            await _context.SaveChangesAsync();

            return OperationResult<bool>.Success("Agent has been removed successfully");
        }
        public async Task<OperationResult<int?>> GetAgentIdFromUserIdAsync(Guid? userId)
        {
            if (userId == null)
            {
                return OperationResult<int?>.Failure("User ID is null");
            }

            var user = await _context.Agents.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                return OperationResult<int?>.Failure("User or Customer Not Found");
            }

            int agentId = user.AgentId;
            return OperationResult<int?>.Success(agentId);
        }

    }
}
