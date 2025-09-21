using BloodBankManagement.Data;
using BloodBankManagement.DTOs;
using BloodBankManagement.Models;
using BloodBankManagement.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BloodBankManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IPasswordHashService _passwordHashService;

        public UsersController(
            ApplicationDbContext context,
            IJwtTokenService jwtTokenService,
            IPasswordHashService passwordHashService)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
            _passwordHashService = passwordHashService;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(UserRegistrationDto registrationDto)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == registrationDto.Email))
            {
                return BadRequest("User with this email already exists.");
            }

            // Create new user
            var user = new User
            {
                Name = registrationDto.Name,
                Email = registrationDto.Email,
                PasswordHash = _passwordHashService.HashPassword(registrationDto.Password),
                Role = registrationDto.Role,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Return user details (without password)
            var userDto = new UserDto
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };

            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, userDto);
        }

        /// <summary>
        /// Authenticate user and return JWT token
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<UserLoginResponseDto>> Login(UserLoginDto loginDto)
        {
            // Find user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            // Verify password
            if (!_passwordHashService.VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid email or password.");
            }

            // Generate JWT token
            var token = _jwtTokenService.GenerateToken(user);

            var response = new UserLoginResponseDto
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddDays(1) // 24 hours
            };

            return Ok(response);
        }

        /// <summary>
        /// Get all users (Admin only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        /// <summary>
        /// Get user by ID (Admin or self)
        /// </summary>
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            // Check if user is admin or requesting their own info
            if (currentUserRole != "Admin" && currentUserId != id)
            {
                return Forbid("You can only access your own profile.");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var userDto = new UserDto
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };

            return Ok(userDto);
        }

        /// <summary>
        /// Update user profile
        /// </summary>
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<UserDto>> UpdateUser(int id, UserUpdateDto updateDto)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            // Check if user is admin or updating their own profile
            if (currentUserRole != "Admin" && currentUserId != id)
            {
                return Forbid("You can only update your own profile.");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Update fields if provided
            if (!string.IsNullOrEmpty(updateDto.Name))
                user.Name = updateDto.Name;

            if (!string.IsNullOrEmpty(updateDto.Email))
            {
                // Check if email is already taken by another user
                if (await _context.Users.AnyAsync(u => u.Email == updateDto.Email && u.UserId != id))
                {
                    return BadRequest("Email is already taken by another user.");
                }
                user.Email = updateDto.Email;
            }

            if (!string.IsNullOrEmpty(updateDto.Password))
            {
                user.PasswordHash = _passwordHashService.HashPassword(updateDto.Password);
            }

            // Only admins can change roles
            if (updateDto.Role.HasValue && currentUserRole == "Admin")
            {
                user.Role = updateDto.Role.Value;
            }

            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };

            return Ok(userDto);
        }

        /// <summary>
        /// Delete user (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Helper methods
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("UserId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }

        private string GetCurrentUserRole()
        {
            return User.FindFirst("Role")?.Value ?? User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
        }
    }
}