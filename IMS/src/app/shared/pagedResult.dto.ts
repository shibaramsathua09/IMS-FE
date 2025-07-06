export interface PagedResult<T> {

    items: T[];//the actual data items on the current page
  
    pageNumber: number;//the current page number
  
    pageSize: number;//how many items are shown per page
  
    totalCount: number;//Total number of items across all  pages
  
  }
   /*This is a generic interface used to represent paginated data 
   — data that is split across multiple pages (like search results, product listings, etc.).
   This interface helps you:

Standardize how paginated data is handled across your app.
Easily manage pagination logic in your frontend.
Communicate clearly with APIs that return paginated results.

When you call an API that returns paginated data, you use PagedResult<T> to type the response.
   */
