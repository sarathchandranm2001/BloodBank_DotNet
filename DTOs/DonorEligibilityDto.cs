namespace BloodBankManagement.DTOs
{
    public class DonorEligibilityDto
    {
        public int DonorId { get; set; }
        public string DonorName { get; set; } = string.Empty;
        public bool IsEligible { get; set; }
        public DateTime? LastDonationDate { get; set; }
        public DateTime? NextEligibleDate { get; set; }
        public int DaysSinceLastDonation { get; set; }
        public int DaysUntilEligible { get; set; }
        public string EligibilityMessage { get; set; } = string.Empty;
    }
}