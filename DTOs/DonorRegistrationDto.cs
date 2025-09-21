using BloodBankManagement.Models;
using System.ComponentModel.DataAnnotations;

namespace BloodBankManagement.DTOs
{
    public class DonorRegistrationDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        public BloodGroup BloodGroup { get; set; }

        public DateTime? LastDonationDate { get; set; }

        [Required]
        public ContactInfoDto ContactInfo { get; set; } = new ContactInfoDto();

        [StringLength(1000)]
        public string MedicalHistory { get; set; } = string.Empty;
    }

    public class ContactInfoDto
    {
        [Required]
        [Phone]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string City { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string State { get; set; } = string.Empty;

        [Required]
        [StringLength(10)]
        public string ZipCode { get; set; } = string.Empty;

        [StringLength(50)]
        public string Country { get; set; } = "USA";
    }
}