namespace BloodBankManagement.DTOs
{
    public class DonationHistoryDto
    {
        public int DonorId { get; set; }
        public string DonorName { get; set; } = string.Empty;
        public DateTime? LastDonationDate { get; set; }
        public int TotalDonations { get; set; }
        public List<DonationRecordDto> DonationRecords { get; set; } = new List<DonationRecordDto>();
    }

    public class DonationRecordDto
    {
        public DateTime DonationDate { get; set; }
        public string Location { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }

    public class NextDonationDto
    {
        public int DonorId { get; set; }
        public string DonorName { get; set; } = string.Empty;
        public DateTime? NextEligibleDate { get; set; }
        public bool CanDonateToday { get; set; }
        public int DaysUntilEligible { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}