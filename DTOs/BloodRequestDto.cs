using BloodBankManagement.Models;
using System.ComponentModel.DataAnnotations;

namespace BloodBankManagement.DTOs
{
    public class BloodRequestCreateDto
    {
        [Required]
        public BloodGroup BloodGroup { get; set; }

        [Required]
        [Range(1, 20)]
        public int UnitsRequested { get; set; }

        [Required]
        public UrgencyLevel Urgency { get; set; }

        [Required]
        [StringLength(500)]
        public string RequestReason { get; set; } = string.Empty;

        [StringLength(1000)]
        public string DoctorNotes { get; set; } = string.Empty;

        public DateTime? RequiredByDate { get; set; }
    }

    public class BloodRequestDto
    {
        public int RequestId { get; set; }
        public int RecipientId { get; set; }
        public string RecipientName { get; set; } = string.Empty;
        public string HospitalName { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public string BloodGroup { get; set; } = string.Empty;
        public int UnitsRequested { get; set; }
        public string Urgency { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string RequestReason { get; set; } = string.Empty;
        public string DoctorNotes { get; set; } = string.Empty;
        public DateTime RequestDate { get; set; }
        public DateTime? RequiredByDate { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public DateTime? FulfilledDate { get; set; }
        public string? ApprovedByName { get; set; }
        public string? FulfilledByName { get; set; }
        public string AdminNotes { get; set; } = string.Empty;
        public int DaysUntilRequired { get; set; }
        public bool IsUrgent => Urgency == "High" || Urgency == "Critical";
    }

    public class BloodRequestUpdateDto
    {
        [Range(1, 20)]
        public int? UnitsRequested { get; set; }

        public UrgencyLevel? Urgency { get; set; }

        [StringLength(500)]
        public string? RequestReason { get; set; }

        [StringLength(1000)]
        public string? DoctorNotes { get; set; }

        public DateTime? RequiredByDate { get; set; }
    }

    public class BloodRequestStatusUpdateDto
    {
        [Required]
        public RequestStatus Status { get; set; }

        [StringLength(500)]
        public string AdminNotes { get; set; } = string.Empty;
    }

    public class BloodAvailabilityDto
    {
        public string BloodGroup { get; set; } = string.Empty;
        public int AvailableUnits { get; set; }
        public int ReservedUnits { get; set; }
        public int TotalUnits { get; set; }
        public string Location { get; set; } = string.Empty;
        public DateTime LastUpdated { get; set; }
        public DateTime? OldestUnitExpiry { get; set; }
        public DateTime? NewestUnitExpiry { get; set; }
        public bool IsLowStock => AvailableUnits < 10;
        public bool HasExpiringSoon => OldestUnitExpiry.HasValue && OldestUnitExpiry.Value <= DateTime.UtcNow.AddDays(7);
    }
}