using System.ComponentModel.DataAnnotations;

namespace BloodBankManagement.Models
{
    public class ContactInfo
    {
        [Phone]
        public string Phone { get; set; } = string.Empty;

        [StringLength(200)]
        public string Address { get; set; } = string.Empty;

        [StringLength(50)]
        public string City { get; set; } = string.Empty;

        [StringLength(50)]
        public string State { get; set; } = string.Empty;

        [StringLength(10)]
        public string ZipCode { get; set; } = string.Empty;

        [StringLength(50)]
        public string Country { get; set; } = string.Empty;
    }
}