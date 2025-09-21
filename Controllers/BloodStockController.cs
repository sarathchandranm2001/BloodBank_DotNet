using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BloodBankManagement.Data;
using BloodBankManagement.Models;
using BloodBankManagement.DTOs;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;

namespace BloodBankManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BloodStockController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BloodStockController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/bloodstock
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<BloodStockDto>>> GetAllBloodStock()
        {
            var bloodStocks = await _context.BloodStocks
                .OrderBy(bs => bs.BloodGroup)
                .ThenBy(bs => bs.ExpiryDate)
                .Select(bs => new BloodStockDto
                {
                    StockId = bs.StockId,
                    BloodGroup = bs.BloodGroup.ToString(),
                    UnitsAvailable = bs.UnitsAvailable,
                    ExpiryDate = bs.ExpiryDate,
                    DateAdded = bs.DateAdded,
                    DonorBatch = bs.DonorBatch,
                    StorageLocation = bs.StorageLocation,
                    Notes = bs.Notes,
                    CreatedAt = bs.CreatedAt,
                    UpdatedAt = bs.UpdatedAt,
                    IsExpired = bs.IsExpired,
                    IsExpiringSoon = bs.IsExpiringSoon,
                    DaysUntilExpiry = bs.DaysUntilExpiry,
                    IsLowStock = bs.IsLowStock
                })
                .ToListAsync();

            return Ok(bloodStocks);
        }

        // GET: api/bloodstock/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<BloodStockDto>> GetBloodStock(int id)
        {
            var bloodStock = await _context.BloodStocks.FindAsync(id);

            if (bloodStock == null)
            {
                return NotFound(new { message = "Blood stock entry not found" });
            }

            var bloodStockDto = new BloodStockDto
            {
                StockId = bloodStock.StockId,
                BloodGroup = bloodStock.BloodGroup.ToString(),
                UnitsAvailable = bloodStock.UnitsAvailable,
                ExpiryDate = bloodStock.ExpiryDate,
                DateAdded = bloodStock.DateAdded,
                DonorBatch = bloodStock.DonorBatch,
                StorageLocation = bloodStock.StorageLocation,
                Notes = bloodStock.Notes,
                CreatedAt = bloodStock.CreatedAt,
                UpdatedAt = bloodStock.UpdatedAt,
                IsExpired = bloodStock.IsExpired,
                IsExpiringSoon = bloodStock.IsExpiringSoon,
                DaysUntilExpiry = bloodStock.DaysUntilExpiry,
                IsLowStock = bloodStock.IsLowStock
            };

            return Ok(bloodStockDto);
        }

        // POST: api/bloodstock
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<BloodStockDto>> CreateBloodStock(BloodStockCreateDto createDto)
        {
            // Validate expiry date
            if (createDto.ExpiryDate <= DateTime.UtcNow)
            {
                return BadRequest(new { message = "Expiry date must be in the future" });
            }

            var bloodStock = new BloodStock
            {
                BloodGroup = createDto.BloodGroup,
                UnitsAvailable = createDto.UnitsAvailable,
                ExpiryDate = createDto.ExpiryDate,
                DonorBatch = createDto.DonorBatch,
                StorageLocation = createDto.StorageLocation,
                Notes = createDto.Notes,
                DateAdded = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _context.BloodStocks.Add(bloodStock);
            await _context.SaveChangesAsync();

            // Update blood inventory
            await UpdateBloodInventoryAsync(createDto.BloodGroup);

            var bloodStockDto = new BloodStockDto
            {
                StockId = bloodStock.StockId,
                BloodGroup = bloodStock.BloodGroup.ToString(),
                UnitsAvailable = bloodStock.UnitsAvailable,
                ExpiryDate = bloodStock.ExpiryDate,
                DateAdded = bloodStock.DateAdded,
                DonorBatch = bloodStock.DonorBatch,
                StorageLocation = bloodStock.StorageLocation,
                Notes = bloodStock.Notes,
                CreatedAt = bloodStock.CreatedAt,
                UpdatedAt = bloodStock.UpdatedAt,
                IsExpired = bloodStock.IsExpired,
                IsExpiringSoon = bloodStock.IsExpiringSoon,
                DaysUntilExpiry = bloodStock.DaysUntilExpiry,
                IsLowStock = bloodStock.IsLowStock
            };

            return CreatedAtAction(nameof(GetBloodStock), new { id = bloodStock.StockId }, bloodStockDto);
        }

        // PUT: api/bloodstock/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateBloodStock(int id, BloodStockUpdateDto updateDto)
        {
            var bloodStock = await _context.BloodStocks.FindAsync(id);

            if (bloodStock == null)
            {
                return NotFound(new { message = "Blood stock entry not found" });
            }

            var originalBloodGroup = bloodStock.BloodGroup;

            // Update fields if provided
            if (updateDto.UnitsAvailable.HasValue)
            {
                bloodStock.UnitsAvailable = updateDto.UnitsAvailable.Value;
            }

            if (updateDto.ExpiryDate.HasValue)
            {
                if (updateDto.ExpiryDate.Value <= DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Expiry date must be in the future" });
                }
                bloodStock.ExpiryDate = updateDto.ExpiryDate.Value;
            }

            if (!string.IsNullOrEmpty(updateDto.DonorBatch))
            {
                bloodStock.DonorBatch = updateDto.DonorBatch;
            }

            if (!string.IsNullOrEmpty(updateDto.StorageLocation))
            {
                bloodStock.StorageLocation = updateDto.StorageLocation;
            }

            if (!string.IsNullOrEmpty(updateDto.Notes))
            {
                bloodStock.Notes = updateDto.Notes;
            }

            bloodStock.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Update blood inventory
            await UpdateBloodInventoryAsync(originalBloodGroup);

            return NoContent();
        }

        // DELETE: api/bloodstock/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBloodStock(int id)
        {
            var bloodStock = await _context.BloodStocks.FindAsync(id);

            if (bloodStock == null)
            {
                return NotFound(new { message = "Blood stock entry not found" });
            }

            var bloodGroup = bloodStock.BloodGroup;

            _context.BloodStocks.Remove(bloodStock);
            await _context.SaveChangesAsync();

            // Update blood inventory
            await UpdateBloodInventoryAsync(bloodGroup);

            return NoContent();
        }

        // GET: api/bloodstock/summary
        [HttpGet("summary")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<BloodStockSummaryDto>>> GetBloodStockSummary()
        {
            var summary = await _context.BloodStocks
                .GroupBy(bs => bs.BloodGroup)
                .Select(g => new BloodStockSummaryDto
                {
                    BloodGroup = g.Key.ToString(),
                    TotalUnits = g.Sum(bs => bs.UnitsAvailable),
                    FreshUnits = g.Where(bs => !bs.IsExpired && !bs.IsExpiringSoon).Sum(bs => bs.UnitsAvailable),
                    ExpiringSoonUnits = g.Where(bs => bs.IsExpiringSoon).Sum(bs => bs.UnitsAvailable),
                    ExpiredUnits = g.Where(bs => bs.IsExpired).Sum(bs => bs.UnitsAvailable),
                    OldestExpiryDate = g.Min(bs => bs.ExpiryDate),
                    NewestExpiryDate = g.Max(bs => bs.ExpiryDate),
                    HasLowStock = g.Sum(bs => bs.UnitsAvailable) < 5,
                    HasExpiringSoon = g.Any(bs => bs.IsExpiringSoon),
                    HasExpired = g.Any(bs => bs.IsExpired)
                })
                .OrderBy(s => s.BloodGroup)
                .ToListAsync();

            return Ok(summary);
        }

        // GET: api/bloodstock/low-stock-alerts
        [HttpGet("low-stock-alerts")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<LowStockAlertDto>>> GetLowStockAlerts()
        {
            var lowStockAlerts = await _context.BloodStocks
                .GroupBy(bs => bs.BloodGroup)
                .Select(g => new LowStockAlertDto
                {
                    BloodGroup = g.Key.ToString(),
                    CurrentUnits = g.Sum(bs => bs.UnitsAvailable),
                    LastUpdated = g.Max(bs => bs.UpdatedAt ?? bs.CreatedAt)
                })
                .Where(alert => alert.CurrentUnits < 5)
                .OrderBy(alert => alert.CurrentUnits)
                .ToListAsync();

            return Ok(lowStockAlerts);
        }

        // GET: api/bloodstock/expiring-soon
        [HttpGet("expiring-soon")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<BloodStockDto>>> GetExpiringSoon()
        {
            var expiringSoon = await _context.BloodStocks
                .Where(bs => bs.IsExpiringSoon)
                .OrderBy(bs => bs.ExpiryDate)
                .Select(bs => new BloodStockDto
                {
                    StockId = bs.StockId,
                    BloodGroup = bs.BloodGroup.ToString(),
                    UnitsAvailable = bs.UnitsAvailable,
                    ExpiryDate = bs.ExpiryDate,
                    DateAdded = bs.DateAdded,
                    DonorBatch = bs.DonorBatch,
                    StorageLocation = bs.StorageLocation,
                    Notes = bs.Notes,
                    CreatedAt = bs.CreatedAt,
                    UpdatedAt = bs.UpdatedAt,
                    IsExpired = bs.IsExpired,
                    IsExpiringSoon = bs.IsExpiringSoon,
                    DaysUntilExpiry = bs.DaysUntilExpiry,
                    IsLowStock = bs.IsLowStock
                })
                .ToListAsync();

            return Ok(expiringSoon);
        }

        // GET: api/bloodstock/expired
        [HttpGet("expired")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<BloodStockDto>>> GetExpired()
        {
            var expired = await _context.BloodStocks
                .Where(bs => bs.IsExpired)
                .OrderBy(bs => bs.ExpiryDate)
                .Select(bs => new BloodStockDto
                {
                    StockId = bs.StockId,
                    BloodGroup = bs.BloodGroup.ToString(),
                    UnitsAvailable = bs.UnitsAvailable,
                    ExpiryDate = bs.ExpiryDate,
                    DateAdded = bs.DateAdded,
                    DonorBatch = bs.DonorBatch,
                    StorageLocation = bs.StorageLocation,
                    Notes = bs.Notes,
                    CreatedAt = bs.CreatedAt,
                    UpdatedAt = bs.UpdatedAt,
                    IsExpired = bs.IsExpired,
                    IsExpiringSoon = bs.IsExpiringSoon,
                    DaysUntilExpiry = bs.DaysUntilExpiry,
                    IsLowStock = bs.IsLowStock
                })
                .ToListAsync();

            return Ok(expired);
        }

        // GET: api/bloodstock/by-blood-group/{bloodGroup}
        [HttpGet("by-blood-group/{bloodGroup}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<BloodStockDto>>> GetByBloodGroup(string bloodGroup)
        {
            if (!Enum.TryParse<BloodGroup>(bloodGroup, out var parsedBloodGroup))
            {
                return BadRequest(new { message = "Invalid blood group" });
            }

            var stocks = await _context.BloodStocks
                .Where(bs => bs.BloodGroup == parsedBloodGroup)
                .OrderBy(bs => bs.ExpiryDate)
                .Select(bs => new BloodStockDto
                {
                    StockId = bs.StockId,
                    BloodGroup = bs.BloodGroup.ToString(),
                    UnitsAvailable = bs.UnitsAvailable,
                    ExpiryDate = bs.ExpiryDate,
                    DateAdded = bs.DateAdded,
                    DonorBatch = bs.DonorBatch,
                    StorageLocation = bs.StorageLocation,
                    Notes = bs.Notes,
                    CreatedAt = bs.CreatedAt,
                    UpdatedAt = bs.UpdatedAt,
                    IsExpired = bs.IsExpired,
                    IsExpiringSoon = bs.IsExpiringSoon,
                    DaysUntilExpiry = bs.DaysUntilExpiry,
                    IsLowStock = bs.IsLowStock
                })
                .ToListAsync();

            return Ok(stocks);
        }

        // POST: api/bloodstock/issue-blood
        [HttpPost("issue-blood")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> IssueBlood([FromBody] IssueBloodDto issueDto)
        {
            // Get available stock for the blood group (FIFO - First In, First Out)
            var availableStocks = await _context.BloodStocks
                .Where(bs => bs.BloodGroup == issueDto.BloodGroup && 
                           bs.UnitsAvailable > 0 && 
                           !bs.IsExpired)
                .OrderBy(bs => bs.ExpiryDate)
                .ToListAsync();

            var totalAvailable = availableStocks.Sum(bs => bs.UnitsAvailable);

            if (totalAvailable < issueDto.UnitsRequested)
            {
                return BadRequest(new { 
                    message = $"Insufficient stock. Available: {totalAvailable}, Requested: {issueDto.UnitsRequested}" 
                });
            }

            var remainingUnits = issueDto.UnitsRequested;
            var issuedStocks = new List<object>();

            foreach (var stock in availableStocks)
            {
                if (remainingUnits <= 0) break;

                var unitsToIssue = Math.Min(remainingUnits, stock.UnitsAvailable);
                stock.UnitsAvailable -= unitsToIssue;
                stock.UpdatedAt = DateTime.UtcNow;

                issuedStocks.Add(new
                {
                    StockId = stock.StockId,
                    BloodGroup = stock.BloodGroup.ToString(),
                    UnitsIssued = unitsToIssue,
                    ExpiryDate = stock.ExpiryDate,
                    DonorBatch = stock.DonorBatch
                });

                remainingUnits -= unitsToIssue;
            }

            await _context.SaveChangesAsync();

            // Update blood inventory
            await UpdateBloodInventoryAsync(issueDto.BloodGroup);

            return Ok(new { 
                message = $"Successfully issued {issueDto.UnitsRequested} units of {issueDto.BloodGroup}",
                issuedStocks = issuedStocks
            });
        }

        private async Task UpdateBloodInventoryAsync(BloodGroup bloodGroup)
        {
            var totalUnits = await _context.BloodStocks
                .Where(bs => bs.BloodGroup == bloodGroup && !bs.IsExpired)
                .SumAsync(bs => bs.UnitsAvailable);

            var oldestExpiry = await _context.BloodStocks
                .Where(bs => bs.BloodGroup == bloodGroup && !bs.IsExpired)
                .MinAsync(bs => (DateTime?)bs.ExpiryDate);

            var newestExpiry = await _context.BloodStocks
                .Where(bs => bs.BloodGroup == bloodGroup && !bs.IsExpired)
                .MaxAsync(bs => (DateTime?)bs.ExpiryDate);

            var inventory = await _context.BloodInventory
                .FirstOrDefaultAsync(bi => bi.BloodGroup == bloodGroup);

            if (inventory == null)
            {
                inventory = new BloodInventory
                {
                    BloodGroup = bloodGroup,
                    AvailableUnits = totalUnits,
                    ReservedUnits = 0,
                    LastUpdated = DateTime.UtcNow,
                    OldestUnitExpiry = oldestExpiry,
                    NewestUnitExpiry = newestExpiry
                };
                _context.BloodInventory.Add(inventory);
            }
            else
            {
                inventory.AvailableUnits = totalUnits;
                inventory.LastUpdated = DateTime.UtcNow;
                inventory.OldestUnitExpiry = oldestExpiry;
                inventory.NewestUnitExpiry = newestExpiry;
            }

            await _context.SaveChangesAsync();
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

    public class IssueBloodDto
    {
        [Required]
        public BloodGroup BloodGroup { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Units requested must be greater than 0")]
        public int UnitsRequested { get; set; }

        [StringLength(500)]
        public string Reason { get; set; } = string.Empty;
    }
}