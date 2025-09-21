using System.ComponentModel.DataAnnotations;

namespace BloodBankManagement.Models
{
    public class BloodStock
    {
        [Key]
        public int StockId { get; set; }

        [Required]
        public BloodGroup BloodGroup { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Units available must be non-negative")]
        public int UnitsAvailable { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }

        public DateTime DateAdded { get; set; } = DateTime.UtcNow;

        [StringLength(100)]
        public string DonorBatch { get; set; } = string.Empty;

        [StringLength(200)]
        public string StorageLocation { get; set; } = "Main Storage";

        [StringLength(500)]
        public string Notes { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Computed properties
        public bool IsExpired => ExpiryDate <= DateTime.UtcNow;

        public bool IsExpiringSoon => ExpiryDate <= DateTime.UtcNow.AddDays(7) && !IsExpired;

        public int DaysUntilExpiry => Math.Max(0, (int)(ExpiryDate - DateTime.UtcNow).TotalDays);

        public bool IsLowStock => UnitsAvailable < 5;
    }
}