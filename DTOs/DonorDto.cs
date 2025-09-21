using BloodBankManagement.Models;

namespace BloodBankManagement.DTOs
{
    public class DonorDto
    {
        public int DonorId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public BloodGroup BloodGroup { get; set; }
        public string BloodGroupDisplay { get; set; } = string.Empty;
        public DateTime? LastDonationDate { get; set; }
        public ContactInfoDto ContactInfo { get; set; } = new ContactInfoDto();
        public string MedicalHistory { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Eligibility information
        public bool IsEligibleToDonate { get; set; }
        public DateTime? NextEligibleDonationDate { get; set; }
        public int DaysSinceLastDonation { get; set; }
    }
}