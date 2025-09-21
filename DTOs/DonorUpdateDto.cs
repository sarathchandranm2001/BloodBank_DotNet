using BloodBankManagement.Models;

namespace BloodBankManagement.DTOs
{
    public class DonorUpdateDto
    {
        public BloodGroup? BloodGroup { get; set; }
        public DateTime? LastDonationDate { get; set; }
        public ContactInfoDto? ContactInfo { get; set; }
        public string? MedicalHistory { get; set; }
    }
}