using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBankManagement.Models
{
    public class Donor
    {
        [Key]
        public int DonorId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public BloodGroup BloodGroup { get; set; }

        public DateTime? LastDonationDate { get; set; }

        [Required]
        public ContactInfo ContactInfo { get; set; } = new ContactInfo();

        [StringLength(1000)]
        public string MedicalHistory { get; set; } = string.Empty;

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation property
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        // Calculated properties
        [NotMapped]
        public bool IsEligibleToDonate => 
            LastDonationDate == null || 
            (DateTime.UtcNow - LastDonationDate.Value).TotalDays >= 90;

        [NotMapped]
        public DateTime? NextEligibleDonationDate => 
            LastDonationDate?.AddDays(90);

        [NotMapped]
        public int DaysSinceLastDonation => 
            LastDonationDate == null ? 0 : 
            (int)(DateTime.UtcNow - LastDonationDate.Value).TotalDays;
    }
}