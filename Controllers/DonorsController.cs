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

        // GET: api/donors/profile
        [HttpGet("profile")]
        public async Task<ActionResult<DonorDto>> GetDonorProfile()
        {
            var currentUserId = GetCurrentUserId();
            
            var donor = await _context.Donors
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.UserId == currentUserId);

            if (donor == null)
            {
                return NotFound(new { message = "Donor profile not found" });
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
                    Address = donor.ContactInfo.Address,
                    City = donor.ContactInfo.City,
                    State = donor.ContactInfo.State,
                    ZipCode = donor.ContactInfo.ZipCode,
                    Country = donor.ContactInfo.Country
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
        public async Task<ActionResult<DonorStatisticsDto>> GetDonationHistory(int id)
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

            var donations = await _context.Donations
                .Where(d => d.DonorId == id)
                .OrderBy(d => d.DonationDate)
                .ToListAsync();

            var today = DateTime.UtcNow.Date;
            var thisMonth = new DateTime(today.Year, today.Month, 1);
            var thisYear = new DateTime(today.Year, 1, 1);

            var historyDto = new DonorStatisticsDto
            {
                DonorId = donor.DonorId,
                DonorName = donor.User.Name,
                BloodGroup = donor.BloodGroup.ToString(),
                TotalDonations = donations.Count,
                TotalVolumeContributed = donations.Sum(d => d.VolumeCollected),
                FirstDonationDate = donations.FirstOrDefault()?.DonationDate,
                LastDonationDate = donations.LastOrDefault()?.DonationDate,
                DaysSinceLastDonation = donor.DaysSinceLastDonation,
                AverageDaysBetweenDonations = donations.Count > 1 ? 
                    (donations.Last().DonationDate - donations.First().DonationDate).TotalDays / (donations.Count - 1) : 0,
                IsCurrentlyEligible = donor.IsEligibleToDonate,
                NextEligibleDate = donor.NextEligibleDonationDate,
                ConsecutiveDonations = donations.Count,
                DonationsThisYear = donations.Count(d => d.DonationDate >= thisYear),
                DonationsThisMonth = donations.Count(d => d.DonationDate >= thisMonth),
                YearlyStats = donations
                    .GroupBy(d => d.DonationDate.Year)
                    .Select(g => new YearlyDonationStatsDto
                    {
                        Year = g.Key,
                        Count = g.Count(),
                        Volume = g.Sum(d => d.VolumeCollected)
                    })
                    .OrderBy(y => y.Year)
                    .ToList()
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

        // GET: api/donors/dashboard/stats
        [HttpGet("dashboard/stats")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DonorDashboardStatsDto>> GetDonorDashboardStats()
        {
            var today = DateTime.UtcNow.Date;
            var thisMonth = new DateTime(today.Year, today.Month, 1);
            var thisYear = new DateTime(today.Year, 1, 1);

            var stats = new DonorDashboardStatsDto
            {
                TotalActiveDonors = await _context.Donors.CountAsync(),
                EligibleDonors = await _context.Donors.CountAsync(d => d.IsEligibleToDonate),
                DonationsThisMonth = await _context.Donations.CountAsync(d => d.DonationDate >= thisMonth),
                DonationsThisYear = await _context.Donations.CountAsync(d => d.DonationDate >= thisYear),
                TotalVolumeThisMonth = await _context.Donations
                    .Where(d => d.DonationDate >= thisMonth)
                    .SumAsync(d => (int?)d.VolumeCollected) ?? 0,
                TotalVolumeThisYear = await _context.Donations
                    .Where(d => d.DonationDate >= thisYear)
                    .SumAsync(d => (int?)d.VolumeCollected) ?? 0,

                BloodGroupStats = await _context.Donors
                    .GroupBy(d => d.BloodGroup)
                    .Select(g => new BloodGroupDonationStatsDto
                    {
                        BloodGroup = g.Key.ToString(),
                        DonorCount = g.Count(),
                        DonationsThisMonth = _context.Donations
                            .Count(d => d.BloodGroup == g.Key && d.DonationDate >= thisMonth),
                        TotalVolume = _context.Donations
                            .Where(d => d.BloodGroup == g.Key)
                            .Sum(d => (int?)d.VolumeCollected) ?? 0,
                        LastDonation = _context.Donations
                            .Where(d => d.BloodGroup == g.Key)
                            .Max(d => (DateTime?)d.DonationDate)
                    })
                    .ToListAsync(),

                RecentDonations = await _context.Donations
                    .Include(d => d.Donor)
                    .ThenInclude(d => d.User)
                    .OrderByDescending(d => d.DonationDate)
                    .Take(10)
                    .Select(d => new RecentDonationDto
                    {
                        DonationId = d.DonationId,
                        DonorName = d.Donor.User.Name,
                        BloodGroup = d.BloodGroup.ToString(),
                        DonationDate = d.DonationDate,
                        Volume = d.VolumeCollected,
                        Status = d.Status.ToString()
                    })
                    .ToListAsync(),

                UpcomingAppointments = new List<UpcomingAppointmentDto>() // Empty for now, appointments would need separate model
            };

            return Ok(stats);
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