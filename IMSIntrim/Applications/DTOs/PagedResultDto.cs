namespace IMSIntrim.Applications.DTOs
{
    public class PagedResult<T>
    {
        /*IEnumerable<T>//it will accept any input as if any data type
        Namespace: System.Collections.Generic
        Purpose: Represents a sequence of elements that can be iterated over (like a list, array, etc.).
        Use Case: When you want to return a collection of items without needing advanced querying capabilities.
         */
        /*IQueryable<T>
        Namespace: System.Linq
        Purpose: Represents a queryable collection that can be used to build LINQ queries, especially for databases.
        Use Case: Used with Entity Framework to defer execution and build SQL queries dynamically.
        */
        /*Task<T>
        Namespace: System.Threading.Tasks
        Purpose: Represents an asynchronous operation that returns a result.
        //to handle the asynchronous opearation we are declaring this method's returntype as Task 
        Use Case: Used in async methods to avoid blocking the main thread.*/
        /*IActionResult
        Namespace: Microsoft.AspNetCore.Mvc
        Purpose: Represents the result of an action method in ASP.NET Core MVC or API.
        Use Case: Used to return different types of HTTP responses (e.g., OK, NotFound, BadRequest).*/
        public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
    }

}
