using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BloodBankManagement.Data;
using BloodBankManagement.Models;
using BloodBankManagement.DTOs;
using System.Security.Claims;

namespace BloodBankManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DonorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DonorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/donors
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<DonorDto>>> GetDonors()
        {
            var donors = await _context.Donors
                .Include(d => d.User)
                .Select(d => new DonorDto
                {
                    DonorId = d.DonorId,
                    UserId = d.UserId,
                    UserName = d.User.Name,
                    UserEmail = d.User.Email,
                    BloodGroup = d.BloodGroup,
                    BloodGroupDisplay = d.BloodGroup.ToString(),
                    LastDonationDate = d.LastDonationDate,
                    MedicalHistory = d.MedicalHistory,
                    ContactInfo = new ContactInfoDto
                    {
                        Phone = d.ContactInfo.Phone,
                        Address = d.ContactInfo.Address
                    },
                    IsEligibleToDonate = d.IsEligibleToDonate,
                    NextEligibleDonationDate = d.NextEligibleDonationDate,
                    DaysSinceLastDonation = d.LastDonationDate.HasValue ? 
                        (int)(DateTime.UtcNow - d.LastDonationDate.Value).TotalDays : 0
                })
                .ToListAsync();

            return Ok(donors);
        }

        // GET: api/donors/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<DonorDto>> GetDonor(int id)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            var donor = await _context.Donors
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.DonorId == id);

            if (donor == null)
            {
                return NotFound(new { message = "Donor not found" });
            }

            // Check authorization - only admin or the donor themselves can access
            if (currentUserRole != "Admin" && donor.UserId != currentUserId)
            {
                return Forbid();
            }

            var donorDto = new DonorDto
            {
                DonorId = donor.DonorId,
                UserId = donor.UserId,
                UserName = donor.User.Name,
                UserEmail = donor.User.Email,
                BloodGroup = donor.BloodGroup,
                BloodGroupDisplay = donor.BloodGroup.ToString(),
                LastDonationDate = donor.LastDonationDate,
                MedicalHistory = donor.MedicalHistory,
                ContactInfo = new ContactInfoDto
                {
                    Phone = donor.ContactInfo.Phone,
                    Address = donor.ContactInfo.Address
                },
                IsEligibleToDonate = donor.IsEligibleToDonate,
                NextEligibleDonationDate = donor.NextEligibleDonationDate,
                DaysSinceLastDonation = donor.LastDonationDate.HasValue ? 
                    (int)(DateTime.UtcNow - donor.LastDonationDate.Value).TotalDays : 0
            };

            return Ok(donorDto);
        }

        // POST: api/donors
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DonorDto>> CreateDonor(DonorRegistrationDto donorRegistrationDto)
        {
            // Check if user exists and has Donor role
            var user = await _context.Users.FindAsync(donorRegistrationDto.UserId);
            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }

            if (user.Role != UserRole.Donor)
            {
                return BadRequest(new { message = "User must have Donor role" });
            }

            // Check if donor already exists for this user
            var existingDonor = await _context.Donors.FirstOrDefaultAsync(d => d.UserId == donorRegistrationDto.UserId);
            if (existingDonor != null)
            {
                return BadRequest(new { message = "Donor profile already exists for this user" });
            }

            var donor = new Donor
            {
                UserId = donorRegistrationDto.UserId,
                BloodGroup = donorRegistrationDto.BloodGroup,
                LastDonationDate = donorRegistrationDto.LastDonationDate,
                MedicalHistory = donorRegistrationDto.MedicalHistory,
                ContactInfo = new ContactInfo
                {
                    Phone = donorRegistrationDto.ContactInfo.Phone,
                    Address = donorRegistrationDto.ContactInfo.Address
                }
            };

            _context.Donors.Add(donor);
            await _context.SaveChangesAsync();

            // Reload with user data
            await _context.Entry(donor)
                .Reference(d => d.User)
                .LoadAsync();

            var donorDto = new DonorDto
            {
                DonorId = donor.DonorId,
                UserId = donor.UserId,
                UserName = donor.User.Name,
                UserEmail = donor.User.Email,
                BloodGroup = donor.BloodGroup,
                BloodGroupDisplay = donor.BloodGroup.ToString(),
                LastDonationDate = donor.LastDonationDate,
                MedicalHistory = donor.MedicalHistory,
                ContactInfo = new ContactInfoDto
                {
                    Phone = donor.ContactInfo.Phone,
                    Address = donor.ContactInfo.Address
                },
                IsEligibleToDonate = donor.IsEligibleToDonate,
                NextEligibleDonationDate = donor.NextEligibleDonationDate,
                DaysSinceLastDonation = donor.LastDonationDate.HasValue ? 
                    (int)(DateTime.UtcNow - donor.LastDonationDate.Value).TotalDays : 0
            };

            return CreatedAtAction(nameof(GetDonor), new { id = donor.DonorId }, donorDto);
        }

        // PUT: api/donors/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDonor(int id, DonorUpdateDto donorUpdateDto)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            var donor = await _context.Donors.FindAsync(id);
            if (donor == null)
            {
                return NotFound(new { message = "Donor not found" });
            }

            // Check authorization - only admin or the donor themselves can update
            if (currentUserRole != "Admin" && donor.UserId != currentUserId)
            {
                return Forbid();
            }

            // Update fields
            if (donorUpdateDto.BloodGroup.HasValue)
            {
                donor.BloodGroup = donorUpdateDto.BloodGroup.Value;
            }

            if (donorUpdateDto.LastDonationDate.HasValue)
            {
                donor.LastDonationDate = donorUpdateDto.LastDonationDate;
            }

            if (!string.IsNullOrEmpty(donorUpdateDto.MedicalHistory))
            {
                donor.MedicalHistory = donorUpdateDto.MedicalHistory;
            }

            if (donorUpdateDto.ContactInfo != null)
            {
                if (!string.IsNullOrEmpty(donorUpdateDto.ContactInfo.Phone))
                {
                    donor.ContactInfo.Phone = donorUpdateDto.ContactInfo.Phone;
                }

                if (!string.IsNullOrEmpty(donorUpdateDto.ContactInfo.Address))
                {
                    donor.ContactInfo.Address = donorUpdateDto.ContactInfo.Address;
                }
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/donors/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDonor(int id)
        {
            var donor = await _context.Donors.FindAsync(id);
            if (donor == null)
            {
                return NotFound(new { message = "Donor not found" });
            }

            _context.Donors.Remove(donor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/donors/{id}/eligibility
        [HttpGet("{id}/eligibility")]
        public async Task<ActionResult<DonorEligibilityDto>> GetDonorEligibility(int id)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            var donor = await _context.Donors
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.DonorId == id);

            if (donor == null)
            {
                return NotFound(new { message = "Donor not found" });
            }

            // Check authorization - only admin or the donor themselves can access
            if (currentUserRole != "Admin" && donor.UserId != currentUserId)
            {
                return Forbid();
            }

            var eligibilityDto = new DonorEligibilityDto
            {
                DonorId = donor.DonorId,
                DonorName = donor.User.Name,
                IsEligible = donor.IsEligibleToDonate,
                LastDonationDate = donor.LastDonationDate,
                NextEligibleDate = donor.NextEligibleDonationDate,
                DaysSinceLastDonation = donor.LastDonationDate.HasValue ? 
                    (int)(DateTime.UtcNow - donor.LastDonationDate.Value).TotalDays : 0,
                DaysUntilEligible = donor.IsEligibleToDonate ? 0 : 
                    donor.NextEligibleDonationDate.HasValue ? 
                        (int)(donor.NextEligibleDonationDate.Value - DateTime.UtcNow).TotalDays : 0,
                EligibilityMessage = GetEligibilityMessage(donor)
            };

            return Ok(eligibilityDto);
        }

        // GET: api/donors/{id}/nextdonation
        [HttpGet("{id}/nextdonation")]
        public async Task<ActionResult<object>> GetNextDonationDate(int id)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            var donor = await _context.Donors
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.DonorId == id);

            if (donor == null)
            {
                return NotFound(new { message = "Donor not found" });
            }

            // Check authorization - only admin or the donor themselves can access
            if (currentUserRole != "Admin" && donor.UserId != currentUserId)
            {
                return Forbid();
            }

            var response = new
            {
                DonorId = donor.DonorId,
                UserName = donor.User.Name,
                BloodGroup = donor.BloodGroup.ToString(),
                LastDonationDate = donor.LastDonationDate,
                NextEligibleDonationDate = donor.NextEligibleDonationDate,
                IsEligibleNow = donor.IsEligibleToDonate,
                DaysUntilEligible = donor.IsEligibleToDonate ? 0 : 
                    donor.NextEligibleDonationDate.HasValue ? 
                        (int)(donor.NextEligibleDonationDate.Value - DateTime.UtcNow).TotalDays : 0
            };

            return Ok(response);
        }

        // GET: api/donors/{id}/history
        [HttpGet("{id}/history")]
        public async Task<ActionResult<DonationHistoryDto>> GetDonationHistory(int id)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            var donor = await _context.Donors
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.DonorId == id);

            if (donor == null)
            {
                return NotFound(new { message = "Donor not found" });
            }

            // Check authorization - only admin or the donor themselves can access
            if (currentUserRole != "Admin" && donor.UserId != currentUserId)
            {
                return Forbid();
            }

            var historyDto = new DonationHistoryDto
            {
                DonorId = donor.DonorId,
                DonorName = donor.User.Name,
                LastDonationDate = donor.LastDonationDate,
                TotalDonations = donor.LastDonationDate.HasValue ? 1 : 0, // Simple count for now
                DonationRecords = donor.LastDonationDate.HasValue ? 
                    new List<DonationRecordDto> 
                    { 
                        new DonationRecordDto 
                        { 
                            DonationDate = donor.LastDonationDate.Value,
                            Location = "Blood Bank",
                            Notes = "Donation recorded"
                        } 
                    } : new List<DonationRecordDto>()
            };

            return Ok(historyDto);
        }

        // POST: api/donors/{id}/donate
        [HttpPost("{id}/donate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RecordDonation(int id)
        {
            var donor = await _context.Donors.FindAsync(id);
            if (donor == null)
            {
                return NotFound(new { message = "Donor not found" });
            }

            if (!donor.IsEligibleToDonate)
            {
                return BadRequest(new { message = "Donor is not eligible to donate at this time" });
            }

            // Record the donation
            donor.LastDonationDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Donation recorded successfully", nextEligibleDate = donor.NextEligibleDonationDate });
        }

        // GET: api/donors/eligible
        [HttpGet("eligible")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<DonorDto>>> GetEligibleDonors()
        {
            var eligibleDonors = await _context.Donors
                .Include(d => d.User)
                .Where(d => d.LastDonationDate == null || d.LastDonationDate <= DateTime.UtcNow.AddDays(-90))
                .Select(d => new DonorDto
                {
                    DonorId = d.DonorId,
                    UserId = d.UserId,
                    UserName = d.User.Name,
                    UserEmail = d.User.Email,
                    BloodGroup = d.BloodGroup,
                    BloodGroupDisplay = d.BloodGroup.ToString(),
                    LastDonationDate = d.LastDonationDate,
                    MedicalHistory = d.MedicalHistory,
                    ContactInfo = new ContactInfoDto
                    {
                        Phone = d.ContactInfo.Phone,
                        Address = d.ContactInfo.Address
                    },
                    IsEligibleToDonate = true,
                    NextEligibleDonationDate = d.NextEligibleDonationDate,
                    DaysSinceLastDonation = d.LastDonationDate.HasValue ? 
                        (int)(DateTime.UtcNow - d.LastDonationDate.Value).TotalDays : 0
                })
                .ToListAsync();

            return Ok(eligibleDonors);
        }

        // GET: api/donors/bloodgroup/{bloodGroup}
        [HttpGet("bloodgroup/{bloodGroup}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<DonorDto>>> GetDonorsByBloodGroup(string bloodGroup)
        {
            if (!Enum.TryParse<BloodGroup>(bloodGroup, out var parsedBloodGroup))
            {
                return BadRequest(new { message = "Invalid blood group" });
            }

            var donors = await _context.Donors
                .Include(d => d.User)
                .Where(d => d.BloodGroup == parsedBloodGroup)
                .Select(d => new DonorDto
                {
                    DonorId = d.DonorId,
                    UserId = d.UserId,
                    UserName = d.User.Name,
                    UserEmail = d.User.Email,
                    BloodGroup = d.BloodGroup,
                    BloodGroupDisplay = d.BloodGroup.ToString(),
                    LastDonationDate = d.LastDonationDate,
                    MedicalHistory = d.MedicalHistory,
                    ContactInfo = new ContactInfoDto
                    {
                        Phone = d.ContactInfo.Phone,
                        Address = d.ContactInfo.Address
                    },
                    IsEligibleToDonate = d.IsEligibleToDonate,
                    NextEligibleDonationDate = d.NextEligibleDonationDate,
                    DaysSinceLastDonation = d.LastDonationDate.HasValue ? 
                        (int)(DateTime.UtcNow - d.LastDonationDate.Value).TotalDays : 0
                })
                .ToListAsync();

            return Ok(donors);
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        private string GetCurrentUserRole()
        {
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            return roleClaim?.Value ?? "";
        }

        private string GetEligibilityMessage(Donor donor)
        {
            if (donor.LastDonationDate == null)
            {
                return "No previous donations recorded. Eligible to donate.";
            }

            var daysSinceLastDonation = (DateTime.UtcNow - donor.LastDonationDate.Value).TotalDays;
            
            if (daysSinceLastDonation >= 90)
            {
                return $"Eligible to donate. Last donation was {(int)daysSinceLastDonation} days ago.";
            }
            else
            {
                var daysUntilEligible = 90 - (int)daysSinceLastDonation;
                return $"Not eligible to donate. Must wait {daysUntilEligible} more days. Last donation was {(int)daysSinceLastDonation} days ago.";
            }
        }
    }
}