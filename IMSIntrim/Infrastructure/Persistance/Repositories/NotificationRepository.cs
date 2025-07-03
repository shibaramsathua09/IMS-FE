using IMSIntrim.Domain.Interfaces;
using IMSIntrim.Domain.Models;
using IMSIntrim.Shared.Common;
using Microsoft.EntityFrameworkCore;
namespace IMSIntrim.Infrastructure.Persistance.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly InsuranceDbContext _context;
        public NotificationRepository(InsuranceDbContext context)
        {
            _context = context;
        }

        public async Task<OperationResult<IEnumerable<Notification>>> GetAllAsync()
        {
            var notifications= await _context.Notifications.ToListAsync();
            return OperationResult<IEnumerable<Notification>>.Success(notifications);
        }

        public async Task<OperationResult<IEnumerable<Notification>>> GetByCustomerIdAsync(int customerId)
        {
            var notifications= await _context.Notifications.Where(n => n.CustomerId == customerId).ToListAsync();
            if (notifications == null)
            {

                return OperationResult<IEnumerable<Notification>>.Failure("Not found");
            }
            return OperationResult<IEnumerable<Notification>>.Success(notifications);
            
        }

        public async Task<OperationResult<IEnumerable<Notification>>> GetByAgentIdAsync(int agentId)
        {
            var notifications= await _context.Notifications.Where(n => n.AgentId == agentId).ToListAsync();
            if (notifications == null)
            {

                return OperationResult<IEnumerable<Notification>>.Failure("Not found");
            }

            return OperationResult<IEnumerable<Notification>>.Success(notifications);
        }

        public async Task<OperationResult<bool>> AddAsync(Notification notification)
        {
           var notifications= await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();
            return OperationResult<bool>.Success("Added successfully");
        }

    }
}
