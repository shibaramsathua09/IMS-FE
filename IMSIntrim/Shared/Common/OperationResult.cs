namespace IMSIntrim.Shared.Common
{
    //this class is a generic wrappe for returning results from operations 
    //commonly used in buisness logic layers or services layer.
    /*It allows flexibility to return any data type display any data type*/
    public class OperationResult<T>
    {
        public bool IsSuccess { get; private set; }
        public string Message { get; private set; }
        public T? Data { get; private set; }

        private OperationResult(bool isSuccess, string message, T? data = default)
        {
            IsSuccess = isSuccess;
            Message = message;
            Data = data;
        }

        public static OperationResult<T> Success(T data, string message = "Operation succeeded")
        {
            return new OperationResult<T>(true, message, data);
        }

        public static OperationResult<T> Success(string message = "Operation succeeded")
        {
            return new OperationResult<T>(true, message);
        }



        public static OperationResult<T> Failure(string message)
        {
            return new OperationResult<T>(false, message, default(T));
        }
    }
}
