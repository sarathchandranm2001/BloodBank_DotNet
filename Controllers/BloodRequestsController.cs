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
    public class BloodRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BloodRequestsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/bloodrequests
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<BloodRequestDto>>> GetBloodRequests()
        {
            var requests = await _context.BloodRequests
                .Include(br => br.Recipient)
                .ThenInclude(r => r.User)
                .Include(br => br.ApprovedByUser)
                .Include(br => br.FulfilledByUser)
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

        // GET: api/bloodrequests/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BloodRequestDto>> GetBloodRequest(int id)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            var request = await _context.BloodRequests
                .Include(br => br.Recipient)
                .ThenInclude(r => r.User)
                .Include(br => br.ApprovedByUser)
                .Include(br => br.FulfilledByUser)
                .FirstOrDefaultAsync(br => br.RequestId == id);

            if (request == null)
            {
                return NotFound(new { message = "Blood request not found" });
            }

            // Check authorization - only admin or the recipient can view
            if (currentUserRole != "Admin" && request.Recipient.UserId != currentUserId)
            {
                return Forbid();
            }

            var requestDto = new BloodRequestDto
            {
                RequestId = request.RequestId,
                RecipientId = request.RecipientId,
                RecipientName = request.Recipient.User.Name,
                HospitalName = request.Recipient.HospitalName,
                DoctorName = request.Recipient.DoctorName,
                BloodGroup = request.BloodGroup.ToString(),
                UnitsRequested = request.UnitsRequested,
                Urgency = request.Urgency.ToString(),
                Status = request.Status.ToString(),
                RequestReason = request.RequestReason,
                DoctorNotes = request.DoctorNotes,
                RequestDate = request.RequestDate,
                RequiredByDate = request.RequiredByDate,
                ApprovedDate = request.ApprovedDate,
                FulfilledDate = request.FulfilledDate,
                ApprovedByName = request.ApprovedByUser?.Name,
                FulfilledByName = request.FulfilledByUser?.Name,
                AdminNotes = request.AdminNotes,
                DaysUntilRequired = request.RequiredByDate.HasValue ? 
                    Math.Max(0, (int)(request.RequiredByDate.Value - DateTime.UtcNow).TotalDays) : 0
            };

            return Ok(requestDto);
        }

        // PUT: api/bloodrequests/{id}/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRequestStatus(int id, BloodRequestStatusUpdateDto statusUpdateDto)
        {
            var currentUserId = GetCurrentUserId();
            var request = await _context.BloodRequests.FindAsync(id);

            if (request == null)
            {
                return NotFound(new { message = "Blood request not found" });
            }

            var oldStatus = request.Status;
            request.Status = statusUpdateDto.Status;
            request.AdminNotes = statusUpdateDto.AdminNotes;
            request.UpdatedAt = DateTime.UtcNow;

            switch (statusUpdateDto.Status)
            {
                case RequestStatus.Approved:
                    if (oldStatus == RequestStatus.Pending)
                    {
                        request.ApprovedDate = DateTime.UtcNow;
                        request.ApprovedBy = currentUserId;

                        // Reserve blood units
                        var inventory = await _context.BloodInventory
                            .FirstOrDefaultAsync(bi => bi.BloodGroup == request.BloodGroup);

                        if (inventory != null)
                        {
                            if (inventory.AvailableUnits >= request.UnitsRequested)
                            {
                                inventory.AvailableUnits -= request.UnitsRequested;
                                inventory.ReservedUnits += request.UnitsRequested;
                                inventory.LastUpdated = DateTime.UtcNow;
                            }
                            else
                            {
                                return BadRequest(new { message = "Insufficient blood units available" });
                            }
                        }
                        else
                        {
                            return BadRequest(new { message = "Blood group not available in inventory" });
                        }
                    }
                    break;

                case RequestStatus.Fulfilled:
                    if (oldStatus == RequestStatus.Approved)
                    {
                        request.FulfilledDate = DateTime.UtcNow;
                        request.FulfilledBy = currentUserId;

                        // Remove from reserved units
                        var inventory = await _context.BloodInventory
                            .FirstOrDefaultAsync(bi => bi.BloodGroup == request.BloodGroup);

                        if (inventory != null && inventory.ReservedUnits >= request.UnitsRequested)
                        {
                            inventory.ReservedUnits -= request.UnitsRequested;
                            inventory.LastUpdated = DateTime.UtcNow;
                        }
                    }
                    break;

                case RequestStatus.Rejected:
                case RequestStatus.Cancelled:
                    if (oldStatus == RequestStatus.Approved)
                    {
                        // Return reserved units to available
                        var inventory = await _context.BloodInventory
                            .FirstOrDefaultAsync(bi => bi.BloodGroup == request.BloodGroup);

                        if (inventory != null && inventory.ReservedUnits >= request.UnitsRequested)
                        {
                            inventory.ReservedUnits -= request.UnitsRequested;
                            inventory.AvailableUnits += request.UnitsRequested;
                            inventory.LastUpdated = DateTime.UtcNow;
                        }
                    }
                    break;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = $"Request status updated to {statusUpdateDto.Status}" });
        }

        // GET: api/bloodrequests/pending
        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<BloodRequestDto>>> GetPendingRequests()
        {
            var pendingRequests = await _context.BloodRequests
                .Include(br => br.Recipient)
                .ThenInclude(r => r.User)
                .Where(br => br.Status == RequestStatus.Pending)
                .OrderByDescending(br => br.Urgency)
                .ThenBy(br => br.RequiredByDate)
                .ThenBy(br => br.RequestDate)
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
                    AdminNotes = br.AdminNotes,
                    DaysUntilRequired = br.RequiredByDate.HasValue ? 
                        Math.Max(0, (int)(br.RequiredByDate.Value - DateTime.UtcNow).TotalDays) : 0
                })
                .ToListAsync();

            return Ok(pendingRequests);
        }

        // GET: api/bloodrequests/urgent
        [HttpGet("urgent")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<BloodRequestDto>>> GetUrgentRequests()
        {
            var urgentRequests = await _context.BloodRequests
                .Include(br => br.Recipient)
                .ThenInclude(r => r.User)
                .Where(br => br.Status == RequestStatus.Pending && 
                            (br.Urgency == UrgencyLevel.High || br.Urgency == UrgencyLevel.Critical))
                .OrderByDescending(br => br.Urgency)
                .ThenBy(br => br.RequiredByDate)
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
                    AdminNotes = br.AdminNotes,
                    DaysUntilRequired = br.RequiredByDate.HasValue ? 
                        Math.Max(0, (int)(br.RequiredByDate.Value - DateTime.UtcNow).TotalDays) : 0
                })
                .ToListAsync();

            return Ok(urgentRequests);
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