using BloodBankManagement.Models;
using System.ComponentModel.DataAnnotations;

namespace BloodBankManagement.DTOs
{
    public class RecipientRegistrationDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string HospitalName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string DoctorName { get; set; } = string.Empty;

        [Required]
        public ContactInfoDto ContactInfo { get; set; } = new ContactInfoDto();

        [StringLength(500)]
        public string MedicalCondition { get; set; } = string.Empty;
    }

    public class RecipientDto
    {
        public int RecipientId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string HospitalName { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public ContactInfoDto ContactInfo { get; set; } = new ContactInfoDto();
        public string MedicalCondition { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int TotalRequests { get; set; }
        public int PendingRequests { get; set; }
    }

    public class RecipientUpdateDto
    {
        [StringLength(100)]
        public string? HospitalName { get; set; }

        [StringLength(100)]
        public string? DoctorName { get; set; }

        public ContactInfoDto? ContactInfo { get; set; }

        [StringLength(500)]
        public string? MedicalCondition { get; set; }
    }
}