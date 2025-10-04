import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DonorService } from '../../../services/donor.service';
import { Donor } from '../../../models/donor.model';
import { BloodGroupNames } from '../../../models/common.model';

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4" *ngIf="donor">
      <!-- Welcome Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card bg-gradient-danger text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h2 class="mb-1">Welcome back, {{donor.userName}}!</h2>
                  <p class="mb-0 opacity-75">Thank you for being a life-saving donor</p>
                </div>
                <div class="text-end">
                  <i class="bi bi-heart-fill display-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card h-100 border-danger">
            <div class="card-body text-center">
              <div class="text-danger mb-2">
                <i class="bi bi-droplet-fill display-4"></i>
              </div>
              <h5 class="card-title">Blood Group</h5>
              <p class="card-text">
                <span class="badge bg-danger fs-6">{{getBloodGroupName(donor.bloodGroup)}}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card h-100" [class]="donor.isEligibleToDonate ? 'border-success' : 'border-warning'">
            <div class="card-body text-center">
              <div class="mb-2" [class]="donor.isEligibleToDonate ? 'text-success' : 'text-warning'">
                <i [class]="donor.isEligibleToDonate ? 'bi bi-check-circle-fill display-4' : 'bi bi-exclamation-triangle-fill display-4'"></i>
              </div>
              <h5 class="card-title">Eligibility</h5>
              <p class="card-text" [class]="donor.isEligibleToDonate ? 'text-success' : 'text-warning'">
                {{donor.isEligibleToDonate ? 'Eligible' : 'Not Eligible'}}
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card h-100 border-info">
            <div class="card-body text-center">
              <div class="text-info mb-2">
                <i class="bi bi-calendar-event display-4"></i>
              </div>
              <h5 class="card-title">Last Donation</h5>
              <p class="card-text">
                {{donor.lastDonationDate | date:'mediumDate' || 'Never'}}
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card h-100 border-secondary">
            <div class="card-body text-center">
              <div class="text-secondary mb-2">
                <i class="bi bi-clock display-4"></i>
              </div>
              <h5 class="card-title">Days Since</h5>
              <p class="card-text">
                {{donor.daysSinceLastDonation}} days
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Cards -->
      <div class="row mb-4">
        <!-- Donation Status -->
        <div class="col-md-6 mb-3">
          <div class="card shadow h-100">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <i class="bi bi-activity me-2"></i>Donation Status
              </h5>
            </div>
            <div class="card-body">
              <div *ngIf="donor.isEligibleToDonate" class="text-center">
                <div class="text-success mb-3">
                  <i class="bi bi-check-circle-fill display-4"></i>
                </div>
                <h6 class="text-success">You're eligible to donate!</h6>
                <p class="text-muted mb-3">Your next donation can save up to 3 lives.</p>
                <button class="btn btn-success" (click)="scheduleDonation()">
                  <i class="bi bi-calendar-plus me-2"></i>Schedule Donation
                </button>
              </div>
              
              <div *ngIf="!donor.isEligibleToDonate" class="text-center">
                <div class="text-warning mb-3">
                  <i class="bi bi-exclamation-triangle-fill display-4"></i>
                </div>
                <h6 class="text-warning">Not eligible at this time</h6>
                <p class="text-muted mb-3">
                  You need to wait before your next donation.
                </p>
                <div *ngIf="donor.nextEligibleDonationDate" class="mb-3">
                  <small class="text-muted">Next eligible date:</small>
                  <p class="fw-semibold">{{donor.nextEligibleDonationDate | date:'mediumDate'}}</p>
                </div>
                <button class="btn btn-outline-primary" (click)="setReminder()">
                  <i class="bi bi-bell me-2"></i>Set Reminder
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="col-md-6 mb-3">
          <div class="card shadow h-100">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0">
                <i class="bi bi-lightning-fill me-2"></i>Quick Actions
              </h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-outline-primary" (click)="viewProfile()">
                  <i class="bi bi-person me-2"></i>View Profile
                </button>
                <button class="btn btn-outline-secondary" (click)="viewDonationHistory()">
                  <i class="bi bi-clock-history me-2"></i>Donation History
                </button>
                <button class="btn btn-outline-info" (click)="checkEligibility()">
                  <i class="bi bi-clipboard-check me-2"></i>Check Eligibility
                </button>
                <button class="btn btn-outline-success" (click)="findDonationCenters()">
                  <i class="bi bi-geo-alt me-2"></i>Find Centers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Information Cards -->
      <div class="row mb-4">
        <div class="col-md-6 mb-3">
          <div class="card shadow">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">
                <i class="bi bi-info-circle me-2"></i>Donation Benefits
              </h5>
            </div>
            <div class="card-body">
              <ul class="list-unstyled mb-0">
                <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Save up to 3 lives per donation</li>
                <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Free health screening</li>
                <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Burn calories (approximately 650)</li>
                <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Reduce iron levels naturally</li>
                <li class="mb-0"><i class="bi bi-check-circle text-success me-2"></i>Feel good about helping others</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-3">
          <div class="card shadow">
            <div class="card-header bg-warning text-dark">
              <h5 class="mb-0">
                <i class="bi bi-exclamation-triangle me-2"></i>Before You Donate
              </h5>
            </div>
            <div class="card-body">
              <ul class="list-unstyled mb-0">
                <li class="mb-2"><i class="bi bi-check-circle text-warning me-2"></i>Get plenty of sleep</li>
                <li class="mb-2"><i class="bi bi-check-circle text-warning me-2"></i>Eat a healthy meal</li>
                <li class="mb-2"><i class="bi bi-check-circle text-warning me-2"></i>Drink extra water</li>
                <li class="mb-2"><i class="bi bi-check-circle text-warning me-2"></i>Avoid alcohol for 24 hours</li>
                <li class="mb-0"><i class="bi bi-check-circle text-warning me-2"></i>Bring a valid ID</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div class="container mt-5" *ngIf="!donor && !error">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center">
          <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading your dashboard...</p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div class="container mt-5" *ngIf="error">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body text-center">
              <i class="bi bi-exclamation-triangle text-warning display-4 mb-3"></i>
              <h5>Profile Not Found</h5>
              <p class="text-muted">You need to complete your donor registration first.</p>
              <button class="btn btn-danger" (click)="goToRegistration()">
                <i class="bi bi-person-plus me-2"></i>Register as Donor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-gradient-danger {
      background: linear-gradient(45deg, #dc3545, #c82333);
    }
    
    .card {
      border-radius: 10px;
      transition: transform 0.2s;
    }
    
    .card:hover {
      transform: translateY(-2px);
    }
    
    .card-header {
      border-radius: 10px 10px 0 0 !important;
    }
    
    .btn {
      border-radius: 8px;
    }
    
    .badge {
      font-size: 0.9em !important;
    }
    
    .display-4 {
      font-size: 2.5rem;
    }
    
    .shadow {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
    }
  `]
})
export class DonorDashboardComponent implements OnInit {
  donor: Donor | null = null;
  error = false;

  constructor(
    private donorService: DonorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDonorProfile();
  }

  loadDonorProfile(): void {
    this.donorService.getDonorProfile().subscribe({
      next: (donor) => {
        this.donor = donor;
        this.error = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.error = true;
        } else {
          this.showMessage('Error loading dashboard. Please try again.');
        }
      }
    });
  }

  getBloodGroupName(bloodGroup: number): string {
    return BloodGroupNames[bloodGroup as keyof typeof BloodGroupNames] || 'Unknown';
  }

  scheduleDonation(): void {
    // TODO: Implement donation scheduling
    this.showMessage('Donation scheduling feature coming soon!');
  }

  setReminder(): void {
    // TODO: Implement reminder functionality
    this.showMessage('Reminder feature coming soon!');
  }

  viewProfile(): void {
    this.router.navigate(['/donor/profile']);
  }

  viewDonationHistory(): void {
    // TODO: Implement donation history
    this.showMessage('Donation history feature coming soon!');
  }

  checkEligibility(): void {
    // TODO: Implement eligibility checker
    this.showMessage('Eligibility checker feature coming soon!');
  }

  findDonationCenters(): void {
    // TODO: Implement center finder
    this.showMessage('Center finder feature coming soon!');
  }

  goToRegistration(): void {
    this.router.navigate(['/donor/register']);
  }

  private showMessage(message: string): void {
    alert(message);
  }
}