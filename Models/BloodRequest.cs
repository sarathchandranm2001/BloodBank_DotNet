using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBankManagement.Models
{
    public enum RequestStatus
    {
        Pending = 1,
        Approved = 2,
        Fulfilled = 3,
        Rejected = 4,
        Cancelled = 5
    }

    public enum UrgencyLevel
    {
        Low = 1,
        Medium = 2,
        High = 3,
        Critical = 4
    }

    public class BloodRequest
    {
        [Key]
        public int RequestId { get; set; }

        [Required]
        public int RecipientId { get; set; }

        [ForeignKey("RecipientId")]
        public Recipient Recipient { get; set; } = null!;

        [Required]
        public BloodGroup BloodGroup { get; set; }

        [Required]
        [Range(1, 20)]
        public int UnitsRequested { get; set; }

        [Required]
        public UrgencyLevel Urgency { get; set; }

        [Required]
        public RequestStatus Status { get; set; } = RequestStatus.Pending;

        [StringLength(500)]
        public string RequestReason { get; set; } = string.Empty;

        [StringLength(1000)]
        public string DoctorNotes { get; set; } = string.Empty;

        public DateTime RequestDate { get; set; } = DateTime.UtcNow;

        public DateTime? RequiredByDate { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public DateTime? FulfilledDate { get; set; }

        public int? ApprovedBy { get; set; }

        [ForeignKey("ApprovedBy")]
        public User? ApprovedByUser { get; set; }

        public int? FulfilledBy { get; set; }

        [ForeignKey("FulfilledBy")]
        public User? FulfilledByUser { get; set; }

        [StringLength(500)]
        public string AdminNotes { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}