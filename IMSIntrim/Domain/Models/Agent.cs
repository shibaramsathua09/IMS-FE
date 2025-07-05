using Microsoft.AspNetCore.Http.HttpResults;

namespace IMSIntrim.Domain.Models
{
    public class Agent
    {
        //EF core automatically configure this as the unique identifier 
        public int AgentId { get; set; }
        //must be provided because we have delcared required here
        public required string Name { get; set; }

        public required string ContactInfo { get; set; }

        //this is a foreign key which link the agent to the user.
        public Guid UserId { get; set; }

        //This is the navigation property for the relationship with the User entity.
        //It allows you to access the related user object directly from the agent.
        public required User User { get; set; }

        /*Represents a one-to-many relationship: an agent can be assigned to multiple policies.
        ICollection is used for navigation — you can access all policies assigned to this agent*/
        public ICollection<Policy>? AssignedPolicies { get; set; }
        /*Represents another one-to-many relationship: an agent can file multiple claims.
        Useful for tracking which claims were handled by which agent.*/
        public ICollection<Claim>? FiledClaims { get; set; }
        /**/

        public ICollection<Notification>? Notifications { get; set; }


        //these are the convention based configuration by using there name ef core autometically configure this


    }
}

