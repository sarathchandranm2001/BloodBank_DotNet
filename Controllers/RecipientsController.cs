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
    public class RecipientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RecipientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/recipients
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<RecipientDto>>> GetRecipients()
        {
            var recipients = await _context.Recipients
                .Include(r => r.User)
                .Include(r => r.BloodRequests)
                .Select(r => new RecipientDto
                {
                    RecipientId = r.RecipientId,
                    UserId = r.UserId,
                    UserName = r.User.Name,
                    UserEmail = r.User.Email,
                    HospitalName = r.HospitalName,
                    DoctorName = r.DoctorName,
                    ContactInfo = new ContactInfoDto
                    {
                        Phone = r.ContactInfo.Phone,
                        Address = r.ContactInfo.Address,
                        City = r.ContactInfo.City,
                        State = r.ContactInfo.State,
                        ZipCode = r.ContactInfo.ZipCode,
                        Country = r.ContactInfo.Country
                    },
                    MedicalCondition = r.MedicalCondition,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt,
                    TotalRequests = r.BloodRequests.Count,
                    PendingRequests = r.BloodRequests.Count(br => br.Status == RequestStatus.Pending)
                })
                .ToListAsync();

            return Ok(recipients);
        }

        // GET: api/recipients/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<RecipientDto>> GetRecipient(int id)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            var recipient = await _context.Recipients
                .Include(r => r.User)
                .Include(r => r.BloodRequests)
                .FirstOrDefaultAsync(r => r.RecipientId == id);

            if (recipient == null)
            {
                return NotFound(new { message = "Recipient not found" });
            }

            // Check authorization - only admin or the recipient themselves can access
            if (currentUserRole != "Admin" && recipient.UserId != currentUserId)
            {
                return Forbid();
            }

            var recipientDto = new RecipientDto
            {
                RecipientId = recipient.RecipientId,
                UserId = recipient.UserId,
                UserName = recipient.User.Name,
                UserEmail = recipient.User.Email,
                HospitalName = recipient.HospitalName,
                DoctorName = recipient.DoctorName,
                ContactInfo = new ContactInfoDto
                {
                    Phone = recipient.ContactInfo.Phone,
                    Address = recipient.ContactInfo.Address,
                    City = recipient.ContactInfo.City,
                    State = recipient.ContactInfo.State,
                    ZipCode = recipient.ContactInfo.ZipCode,
                    Country = recipient.ContactInfo.Country
                },
                MedicalCondition = recipient.MedicalCondition,
                CreatedAt = recipient.CreatedAt,
                UpdatedAt = recipient.UpdatedAt,
                TotalRequests = recipient.BloodRequests.Count,
                PendingRequests = recipient.BloodRequests.Count(br => br.Status == RequestStatus.Pending)
            };

            return Ok(recipientDto);
        }

        // POST: api/recipients
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<RecipientDto>> CreateRecipient(RecipientRegistrationDto recipientRegistrationDto)
        {
            // Check if user exists and has Recipient role
            var user = await _context.Users.FindAsync(recipientRegistrationDto.UserId);
            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }

            if (user.Role != UserRole.Recipient)
            {
                return BadRequest(new { message = "User must have Recipient role" });
            }

            // Check if recipient already exists for this user
            var existingRecipient = await _context.Recipients.FirstOrDefaultAsync(r => r.UserId == recipientRegistrationDto.UserId);
            if (existingRecipient != null)
            {
                return BadRequest(new { message = "Recipient profile already exists for this user" });
            }

            var recipient = new Recipient
            {
                UserId = recipientRegistrationDto.UserId,
                HospitalName = recipientRegistrationDto.HospitalName,
                DoctorName = recipientRegistrationDto.DoctorName,
                MedicalCondition = recipientRegistrationDto.MedicalCondition,
                ContactInfo = new ContactInfo
                {
                    Phone = recipientRegistrationDto.ContactInfo.Phone,
                    Address = recipientRegistrationDto.ContactInfo.Address,
                    City = recipientRegistrationDto.ContactInfo.City,
                    State = recipientRegistrationDto.ContactInfo.State,
                    ZipCode = recipientRegistrationDto.ContactInfo.ZipCode,
                    Country = recipientRegistrationDto.ContactInfo.Country
                }
            };

            _context.Recipients.Add(recipient);
            await _context.SaveChangesAsync();

            // Reload with user data
            await _context.Entry(recipient)
                .Reference(r => r.User)
                .LoadAsync();

            var recipientDto = new RecipientDto
            {
                RecipientId = recipient.RecipientId,
                UserId = recipient.UserId,
                UserName = recipient.User.Name,
                UserEmail = recipient.User.Email,
                HospitalName = recipient.HospitalName,
                DoctorName = recipient.DoctorName,
                ContactInfo = new ContactInfoDto
                {
                    Phone = recipient.ContactInfo.Phone,
                    Address = recipient.ContactInfo.Address,
                    City = recipient.ContactInfo.City,
                    State = recipient.ContactInfo.State,
                    ZipCode = recipient.ContactInfo.ZipCode,
                    Country = recipient.ContactInfo.Country
                },
                MedicalCondition = recipient.MedicalCondition,
                CreatedAt = recipient.CreatedAt,
                UpdatedAt = recipient.UpdatedAt,
                TotalRequests = 0,
                PendingRequests = 0
            };

            return CreatedAtAction(nameof(GetRecipient), new { id = recipient.RecipientId }, recipientDto);
        }

        // PUT: api/recipients/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecipient(int id, RecipientUpdateDto recipientUpdateDto)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            var recipient = await _context.Recipients.FindAsync(id);
            if (recipient == null)
            {
                return NotFound(new { message = "Recipient not found" });
            }

            // Check authorization - only admin or the recipient themselves can update
            if (currentUserRole != "Admin" && recipient.UserId != currentUserId)
            {
                return Forbid();
            }

            // Update fields
            if (!string.IsNullOrEmpty(recipientUpdateDto.HospitalName))
            {
                recipient.HospitalName = recipientUpdateDto.HospitalName;
            }

            if (!string.IsNullOrEmpty(recipientUpdateDto.DoctorName))
            {
                recipient.DoctorName = recipientUpdateDto.DoctorName;
            }

            if (!string.IsNullOrEmpty(recipientUpdateDto.MedicalCondition))
            {
                recipient.MedicalCondition = recipientUpdateDto.MedicalCondition;
            }

            if (recipientUpdateDto.ContactInfo != null)
            {
                if (!string.IsNullOrEmpty(recipientUpdateDto.ContactInfo.Phone))
                {
                    recipient.ContactInfo.Phone = recipientUpdateDto.ContactInfo.Phone;
                }

                if (!string.IsNullOrEmpty(recipientUpdateDto.ContactInfo.Address))
                {
                    recipient.ContactInfo.Address = recipientUpdateDto.ContactInfo.Address;
                }

                if (!string.IsNullOrEmpty(recipientUpdateDto.ContactInfo.City))
                {
                    recipient.ContactInfo.City = recipientUpdateDto.ContactInfo.City;
                }

                if (!string.IsNullOrEmpty(recipientUpdateDto.ContactInfo.State))
                {
                    recipient.ContactInfo.State = recipientUpdateDto.ContactInfo.State;
                }

                if (!string.IsNullOrEmpty(recipientUpdateDto.ContactInfo.ZipCode))
                {
                    recipient.ContactInfo.ZipCode = recipientUpdateDto.ContactInfo.ZipCode;
                }

                if (!string.IsNullOrEmpty(recipientUpdateDto.ContactInfo.Country))
                {
                    recipient.ContactInfo.Country = recipientUpdateDto.ContactInfo.Country;
                }
            }

            recipient.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/recipients/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRecipient(int id)
        {
            var recipient = await _context.Recipients.FindAsync(id);
            if (recipient == null)
            {
                return NotFound(new { message = "Recipient not found" });
            }

            _context.Recipients.Remove(recipient);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/recipients/{id}/requests
        [HttpPost("{id}/requests")]
        public async Task<ActionResult<BloodRequestDto>> CreateBloodRequest(int id, BloodRequestCreateDto requestDto)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            var recipient = await _context.Recipients
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.RecipientId == id);

            if (recipient == null)
            {
                return NotFound(new { message = "Recipient not found" });
            }

            // Check authorization - only admin or the recipient themselves can create requests
            if (currentUserRole != "Admin" && recipient.UserId != currentUserId)
            {
                return Forbid();
            }

            var bloodRequest = new BloodRequest
            {
                RecipientId = id,
                BloodGroup = requestDto.BloodGroup,
                UnitsRequested = requestDto.UnitsRequested,
                Urgency = requestDto.Urgency,
                RequestReason = requestDto.RequestReason,
                DoctorNotes = requestDto.DoctorNotes,
                RequiredByDate = requestDto.RequiredByDate,
                Status = RequestStatus.Pending
            };

            _context.BloodRequests.Add(bloodRequest);
            await _context.SaveChangesAsync();

            // Reload with related data
            await _context.Entry(bloodRequest)
                .Reference(br => br.Recipient)
                .LoadAsync();
            await _context.Entry(bloodRequest.Recipient)
                .Reference(r => r.User)
                .LoadAsync();

            var requestDtoResult = new BloodRequestDto
            {
                RequestId = bloodRequest.RequestId,
                RecipientId = bloodRequest.RecipientId,
                RecipientName = bloodRequest.Recipient.User.Name,
                HospitalName = bloodRequest.Recipient.HospitalName,
                DoctorName = bloodRequest.Recipient.DoctorName,
                BloodGroup = bloodRequest.BloodGroup.ToString(),
                UnitsRequested = bloodRequest.UnitsRequested,
                Urgency = bloodRequest.Urgency.ToString(),
                Status = bloodRequest.Status.ToString(),
                RequestReason = bloodRequest.RequestReason,
                DoctorNotes = bloodRequest.DoctorNotes,
                RequestDate = bloodRequest.RequestDate,
                RequiredByDate = bloodRequest.RequiredByDate,
                AdminNotes = bloodRequest.AdminNotes,
                DaysUntilRequired = bloodRequest.RequiredByDate.HasValue ? 
                    Math.Max(0, (int)(bloodRequest.RequiredByDate.Value - DateTime.UtcNow).TotalDays) : 0
            };

            return CreatedAtAction("GetBloodRequest", "BloodRequests", new { id = bloodRequest.RequestId }, requestDtoResult);
        }

        // GET: api/recipients/{id}/requests
        [HttpGet("{id}/requests")]
        public async Task<ActionResult<IEnumerable<BloodRequestDto>>> GetRecipientRequests(int id)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            var recipient = await _context.Recipients.FindAsync(id);
            if (recipient == null)
            {
                return NotFound(new { message = "Recipient not found" });
            }

            // Check authorization - only admin or the recipient themselves can view requests
            if (currentUserRole != "Admin" && recipient.UserId != currentUserId)
            {
                return Forbid();
            }

            var requests = await _context.BloodRequests
                .Include(br => br.Recipient)
                .ThenInclude(r => r.User)
                .Include(br => br.ApprovedByUser)
                .Include(br => br.FulfilledByUser)
                .Where(br => br.RecipientId == id)
                .OrderByDescending(br => br.RequestDate)
                .Select(br => new BloodRequestDto
                {
                    RequestId = br.RequestId,
                    RecipientId = br.RecipientId,
                    RecipientName = br.Recipient.User.Name,
                    HospitalName = br.Recipient.HospitalName,
                    DoctorName = br.Recipient.DoctorName,
                    BloodGroup = br.BloodGroup.ToString(),
                    UnitsRequested = br.UnitsRequested,
                    Urgency = br.Urgency.ToString(),
                    Status = br.Status.ToString(),
                    RequestReason = br.RequestReason,
                    DoctorNotes = br.DoctorNotes,
                    RequestDate = br.RequestDate,
                    RequiredByDate = br.RequiredByDate,
                    ApprovedDate = br.ApprovedDate,
                    FulfilledDate = br.FulfilledDate,
                    ApprovedByName = br.ApprovedByUser != null ? br.ApprovedByUser.Name : null,
                    FulfilledByName = br.FulfilledByUser != null ? br.FulfilledByUser.Name : null,
                    AdminNotes = br.AdminNotes,
                    DaysUntilRequired = br.RequiredByDate.HasValue ? 
                        Math.Max(0, (int)(br.RequiredByDate.Value - DateTime.UtcNow).TotalDays) : 0
                })
                .ToListAsync();

            return Ok(requests);
        }

        // GET: api/recipients/{id}/availability
        [HttpGet("{id}/availability")]
        public async Task<ActionResult<IEnumerable<BloodAvailabilityDto>>> GetBloodAvailability(int id)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            var recipient = await _context.Recipients.FindAsync(id);
            if (recipient == null)
            {
                return NotFound(new { message = "Recipient not found" });
            }

            // Check authorization - only admin or the recipient themselves can view availability
            if (currentUserRole != "Admin" && recipient.UserId != currentUserId)
            {
                return Forbid();
            }

            var inventory = await _context.BloodInventory
                .Select(bi => new BloodAvailabilityDto
                {
                    BloodGroup = bi.BloodGroup.ToString(),
                    AvailableUnits = bi.AvailableUnits,
                    ReservedUnits = bi.ReservedUnits,
                    TotalUnits = bi.TotalUnits,
                    Location = bi.Location,
                    LastUpdated = bi.LastUpdated,
                    OldestUnitExpiry = bi.OldestUnitExpiry,
                    NewestUnitExpiry = bi.NewestUnitExpiry
                })
                .OrderBy(bi => bi.BloodGroup)
                .ToListAsync();

            return Ok(inventory);
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
    }
}