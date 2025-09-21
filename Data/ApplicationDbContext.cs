using Microsoft.EntityFrameworkCore;
using BloodBankManagement.Models;

namespace BloodBankManagement.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets for entities
        public DbSet<User> Users { get; set; }
        public DbSet<Donor> Donors { get; set; }
        // Example: public DbSet<BloodRequest> BloodRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(256);
                entity.Property(e => e.Role).HasConversion<int>();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure Donor entity
            modelBuilder.Entity<Donor>(entity =>
            {
                entity.HasKey(e => e.DonorId);
                entity.HasIndex(e => e.UserId).IsUnique(); // One donor per user
                entity.Property(e => e.BloodGroup).HasConversion<int>();
                entity.Property(e => e.MedicalHistory).HasMaxLength(1000);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                // Configure ContactInfo as owned entity (embedded)
                entity.OwnsOne(d => d.ContactInfo, contact =>
                {
                    contact.Property(c => c.Phone).HasMaxLength(20);
                    contact.Property(c => c.Address).HasMaxLength(200);
                    contact.Property(c => c.City).HasMaxLength(50);
                    contact.Property(c => c.State).HasMaxLength(50);
                    contact.Property(c => c.ZipCode).HasMaxLength(10);
                    contact.Property(c => c.Country).HasMaxLength(50);
                });

                // Configure relationship with User
                entity.HasOne(d => d.User)
                      .WithMany()
                      .HasForeignKey(d => d.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}