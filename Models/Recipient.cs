using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBankManagement.Models
{
    public class Recipient
    {
        [Key]
        public int RecipientId { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string HospitalName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string DoctorName { get; set; } = string.Empty;

        [Required]
        public ContactInfo ContactInfo { get; set; } = new ContactInfo();

        [StringLength(500)]
        public string MedicalCondition { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation property for blood requests
        public ICollection<BloodRequest> BloodRequests { get; set; } = new List<BloodRequest>();
    }
}