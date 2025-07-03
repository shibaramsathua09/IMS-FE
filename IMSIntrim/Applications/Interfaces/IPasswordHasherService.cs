namespace IMSIntrim.Applications.Interfaces
{
    public interface IPasswordHasherService
    {
        string HashPassword(string password);
        bool VerifyPassword(string enteredPassword, string storedHash);
    }
}
