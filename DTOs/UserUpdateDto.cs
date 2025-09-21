using BloodBankManagement.Models;
using System.ComponentModel.DataAnnotations;

namespace BloodBankManagement.DTOs
{
    public class UserUpdateDto
    {
        [StringLength(100, MinimumLength = 2)]
        public string? Name { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [StringLength(100, MinimumLength = 6)]
        public string? Password { get; set; }

        public UserRole? Role { get; set; }
    }
}