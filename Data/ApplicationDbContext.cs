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
        public DbSet<Recipient> Recipients { get; set; }
        public DbSet<BloodRequest> BloodRequests { get; set; }
        public DbSet<BloodInventory> BloodInventory { get; set; }

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

            // Configure Recipient entity
            modelBuilder.Entity<Recipient>(entity =>
            {
                entity.HasKey(e => e.RecipientId);
                entity.HasIndex(e => e.UserId).IsUnique();
                entity.Property(e => e.HospitalName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.DoctorName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.MedicalCondition).HasMaxLength(500);

                // Configure ContactInfo as owned entity (embedded)
                entity.OwnsOne(r => r.ContactInfo, contact =>
                {
                    contact.Property(c => c.Phone).HasMaxLength(20);
                    contact.Property(c => c.Address).HasMaxLength(200);
                    contact.Property(c => c.City).HasMaxLength(50);
                    contact.Property(c => c.State).HasMaxLength(50);
                    contact.Property(c => c.ZipCode).HasMaxLength(10);
                    contact.Property(c => c.Country).HasMaxLength(50);
                });

                // Configure relationship with User
                entity.HasOne(r => r.User)
                      .WithMany()
                      .HasForeignKey(r => r.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure BloodRequest entity
            modelBuilder.Entity<BloodRequest>(entity =>
            {
                entity.HasKey(e => e.RequestId);
                entity.Property(e => e.BloodGroup).HasConversion<int>();
                entity.Property(e => e.Status).HasConversion<int>();
                entity.Property(e => e.Urgency).HasConversion<int>();
                entity.Property(e => e.RequestReason).HasMaxLength(500);
                entity.Property(e => e.DoctorNotes).HasMaxLength(1000);
                entity.Property(e => e.AdminNotes).HasMaxLength(500);

                // Configure relationship with Recipient
                entity.HasOne(br => br.Recipient)
                      .WithMany(r => r.BloodRequests)
                      .HasForeignKey(br => br.RecipientId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Configure relationship with ApprovedBy User
                entity.HasOne(br => br.ApprovedByUser)
                      .WithMany()
                      .HasForeignKey(br => br.ApprovedBy)
                      .OnDelete(DeleteBehavior.SetNull);

                // Configure relationship with FulfilledBy User
                entity.HasOne(br => br.FulfilledByUser)
                      .WithMany()
                      .HasForeignKey(br => br.FulfilledBy)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Configure BloodInventory entity
            modelBuilder.Entity<BloodInventory>(entity =>
            {
                entity.HasKey(e => e.InventoryId);
                entity.HasIndex(e => e.BloodGroup).IsUnique();
                entity.Property(e => e.BloodGroup).HasConversion<int>();
                entity.Property(e => e.Location).HasMaxLength(200);
                entity.Property(e => e.Notes).HasMaxLength(500);
            });
        }
    }
}