using BloodBankManagement.Models;
using System.ComponentModel.DataAnnotations;

namespace BloodBankManagement.DTOs
{
    public class BloodStockCreateDto
    {
        [Required]
        public BloodGroup BloodGroup { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Units available must be greater than 0")]
        public int UnitsAvailable { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }

        [StringLength(100)]
        public string DonorBatch { get; set; } = string.Empty;

        [StringLength(200)]
        public string StorageLocation { get; set; } = "Main Storage";

        [StringLength(500)]
        public string Notes { get; set; } = string.Empty;
    }

    public class BloodStockDto
    {
        public int StockId { get; set; }
        public string BloodGroup { get; set; } = string.Empty;
        public int UnitsAvailable { get; set; }
        public DateTime ExpiryDate { get; set; }
        public DateTime DateAdded { get; set; }
        public string DonorBatch { get; set; } = string.Empty;
        public string StorageLocation { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Computed properties
        public bool IsExpired { get; set; }
        public bool IsExpiringSoon { get; set; }
        public int DaysUntilExpiry { get; set; }
        public bool IsLowStock { get; set; }
        public string ExpiryStatus => IsExpired ? "Expired" : IsExpiringSoon ? "Expiring Soon" : "Fresh";
        public string StockStatus => IsLowStock ? "Low Stock" : "Adequate";
    }

    public class BloodStockUpdateDto
    {
        [Range(0, int.MaxValue, ErrorMessage = "Units available must be non-negative")]
        public int? UnitsAvailable { get; set; }

        public DateTime? ExpiryDate { get; set; }

        [StringLength(100)]
        public string? DonorBatch { get; set; }

        [StringLength(200)]
        public string? StorageLocation { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }
    }

    public class BloodStockSummaryDto
    {
        public string BloodGroup { get; set; } = string.Empty;
        public int TotalUnits { get; set; }
        public int FreshUnits { get; set; }
        public int ExpiringSoonUnits { get; set; }
        public int ExpiredUnits { get; set; }
        public DateTime? OldestExpiryDate { get; set; }
        public DateTime? NewestExpiryDate { get; set; }
        public bool HasLowStock { get; set; }
        public bool HasExpiringSoon { get; set; }
        public bool HasExpired { get; set; }
    }

    public class LowStockAlertDto
    {
        public string BloodGroup { get; set; } = string.Empty;
        public int CurrentUnits { get; set; }
        public int MinimumThreshold { get; set; } = 5;
        public int UnitsNeeded => Math.Max(0, MinimumThreshold - CurrentUnits);
        public string AlertLevel => CurrentUnits == 0 ? "Critical" : CurrentUnits < 3 ? "High" : "Medium";
        public DateTime LastUpdated { get; set; }
    }
}