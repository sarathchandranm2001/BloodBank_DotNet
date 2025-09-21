using System.ComponentModel.DataAnnotations;

namespace BloodBankManagement.Models
{
    public class BloodInventory
    {
        [Key]
        public int InventoryId { get; set; }

        [Required]
        public BloodGroup BloodGroup { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int AvailableUnits { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int ReservedUnits { get; set; }

        public int TotalUnits => AvailableUnits + ReservedUnits;

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        [StringLength(200)]
        public string Location { get; set; } = "Main Storage";

        [StringLength(500)]
        public string Notes { get; set; } = string.Empty;

        // Expiry tracking
        public DateTime? OldestUnitExpiry { get; set; }

        public DateTime? NewestUnitExpiry { get; set; }
    }
}