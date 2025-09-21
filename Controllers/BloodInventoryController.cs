using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BloodBankManagement.Data;
using BloodBankManagement.Models;
using BloodBankManagement.DTOs;

namespace BloodBankManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class BloodInventoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BloodInventoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/bloodinventory
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BloodAvailabilityDto>>> GetInventory()
        {
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

        // GET: api/bloodinventory/{bloodGroup}
        [HttpGet("{bloodGroup}")]
        public async Task<ActionResult<BloodAvailabilityDto>> GetInventoryByBloodGroup(string bloodGroup)
        {
            if (!Enum.TryParse<BloodGroup>(bloodGroup, out var parsedBloodGroup))
            {
                return BadRequest(new { message = "Invalid blood group" });
            }

            var inventory = await _context.BloodInventory
                .FirstOrDefaultAsync(bi => bi.BloodGroup == parsedBloodGroup);

            if (inventory == null)
            {
                return NotFound(new { message = "Blood group not found in inventory" });
            }

            var availabilityDto = new BloodAvailabilityDto
            {
                BloodGroup = inventory.BloodGroup.ToString(),
                AvailableUnits = inventory.AvailableUnits,
                ReservedUnits = inventory.ReservedUnits,
                TotalUnits = inventory.TotalUnits,
                Location = inventory.Location,
                LastUpdated = inventory.LastUpdated,
                OldestUnitExpiry = inventory.OldestUnitExpiry,
                NewestUnitExpiry = inventory.NewestUnitExpiry
            };

            return Ok(availabilityDto);
        }

        // POST: api/bloodinventory/add-stock
        [HttpPost("add-stock")]
        public async Task<IActionResult> AddStock([FromBody] AddStockDto addStockDto)
        {
            var inventory = await _context.BloodInventory
                .FirstOrDefaultAsync(bi => bi.BloodGroup == addStockDto.BloodGroup);

            if (inventory == null)
            {
                // Create new inventory entry
                inventory = new BloodInventory
                {
                    BloodGroup = addStockDto.BloodGroup,
                    AvailableUnits = addStockDto.Units,
                    ReservedUnits = 0,
                    LastUpdated = DateTime.UtcNow,
                    Location = addStockDto.Location ?? "Main Storage",
                    Notes = addStockDto.Notes ?? "",
                    OldestUnitExpiry = addStockDto.ExpiryDate,
                    NewestUnitExpiry = addStockDto.ExpiryDate
                };
                _context.BloodInventory.Add(inventory);
            }
            else
            {
                // Update existing inventory
                inventory.AvailableUnits += addStockDto.Units;
                inventory.LastUpdated = DateTime.UtcNow;
                
                if (!string.IsNullOrEmpty(addStockDto.Location))
                {
                    inventory.Location = addStockDto.Location;
                }

                if (!string.IsNullOrEmpty(addStockDto.Notes))
                {
                    inventory.Notes = addStockDto.Notes;
                }

                if (addStockDto.ExpiryDate.HasValue)
                {
                    if (!inventory.OldestUnitExpiry.HasValue || addStockDto.ExpiryDate < inventory.OldestUnitExpiry)
                    {
                        inventory.OldestUnitExpiry = addStockDto.ExpiryDate;
                    }

                    if (!inventory.NewestUnitExpiry.HasValue || addStockDto.ExpiryDate > inventory.NewestUnitExpiry)
                    {
                        inventory.NewestUnitExpiry = addStockDto.ExpiryDate;
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = $"Added {addStockDto.Units} units of {addStockDto.BloodGroup} blood to inventory" });
        }

        // POST: api/bloodinventory/remove-stock
        [HttpPost("remove-stock")]
        public async Task<IActionResult> RemoveStock([FromBody] RemoveStockDto removeStockDto)
        {
            var inventory = await _context.BloodInventory
                .FirstOrDefaultAsync(bi => bi.BloodGroup == removeStockDto.BloodGroup);

            if (inventory == null)
            {
                return NotFound(new { message = "Blood group not found in inventory" });
            }

            if (inventory.AvailableUnits < removeStockDto.Units)
            {
                return BadRequest(new { message = "Insufficient available units" });
            }

            inventory.AvailableUnits -= removeStockDto.Units;
            inventory.LastUpdated = DateTime.UtcNow;

            if (!string.IsNullOrEmpty(removeStockDto.Reason))
            {
                inventory.Notes = $"{DateTime.UtcNow:yyyy-MM-dd}: Removed {removeStockDto.Units} units - {removeStockDto.Reason}. {inventory.Notes}";
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = $"Removed {removeStockDto.Units} units of {removeStockDto.BloodGroup} blood from inventory" });
        }

        // GET: api/bloodinventory/low-stock
        [HttpGet("low-stock")]
        public async Task<ActionResult<IEnumerable<BloodAvailabilityDto>>> GetLowStockItems()
        {
            var lowStockItems = await _context.BloodInventory
                .Where(bi => bi.AvailableUnits < 10)
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
                .OrderBy(bi => bi.AvailableUnits)
                .ToListAsync();

            return Ok(lowStockItems);
        }

        // GET: api/bloodinventory/expiring-soon
        [HttpGet("expiring-soon")]
        public async Task<ActionResult<IEnumerable<BloodAvailabilityDto>>> GetExpiringSoonItems()
        {
            var expiringSoonItems = await _context.BloodInventory
                .Where(bi => bi.OldestUnitExpiry.HasValue && bi.OldestUnitExpiry <= DateTime.UtcNow.AddDays(7))
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
                .OrderBy(bi => bi.OldestUnitExpiry)
                .ToListAsync();

            return Ok(expiringSoonItems);
        }
    }

    public class AddStockDto
    {
        public BloodGroup BloodGroup { get; set; }
        public int Units { get; set; }
        public string? Location { get; set; }
        public string? Notes { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }

    public class RemoveStockDto
    {
        public BloodGroup BloodGroup { get; set; }
        public int Units { get; set; }
        public string? Reason { get; set; }
    }
}