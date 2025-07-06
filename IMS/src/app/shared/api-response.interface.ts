export interface ApiResponse<T = any>{
    isSuccess : boolean;//indicated if the api call was success
    message: string;//a message from the server
    data: T;//the actual data returned from the api
}
/*Ensures consistent structure for all API responses.
Makes it easier to handle success and error cases.
Improves type safety in your Angular app.*/
