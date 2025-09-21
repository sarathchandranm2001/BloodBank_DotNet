using BloodBankManagement.Models;

namespace BloodBankManagement.Services
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user);
        bool ValidateToken(string token);
    }
}