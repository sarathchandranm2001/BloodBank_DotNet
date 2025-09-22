import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DonorService } from '../../../../services/donor.service';
import { Donor } from '../../../../models/donor.model';

@Component({
  selector: 'app-donor-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row" *ngIf="donor">
        <div class="col-12">
          <!-- Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-primary mb-0">
              <i class="bi bi-person-circle me-2"></i>
              Donor Profile
            </h2>
            <button class="btn btn-outline-secondary" (click)="goBack()">
              <i class="bi bi-arrow-left me-2"></i>
              Back
            </button>
          </div>

          <!-- Profile Grid -->
          <div class="row g-4">
            <!-- Personal Information -->
            <div class="col-lg-4">
              <div class="card h-100">
                <div class="card-header bg-primary text-white">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-person me-2"></i>
                    Personal Information
                  </h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-person-fill text-primary me-3 fs-5"></i>
                      <div>
                        <strong class="d-block">{{donor.userName}}</strong>
                        <small class="text-muted">Full Name</small>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-envelope-fill text-primary me-3 fs-5"></i>
                      <div>
                        <strong class="d-block">{{donor.userEmail}}</strong>
                        <small class="text-muted">Email Address</small>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-telephone-fill text-primary me-3 fs-5"></i>
                      <div>
                        <strong class="d-block">{{donor.contactInfo.phone}}</strong>
                        <small class="text-muted">Phone Number</small>
                      </div>
                    </div>
                  </div>
                  <div class="mb-0">
                    <div class="d-flex align-items-start">
                      <i class="bi bi-geo-alt-fill text-primary me-3 fs-5"></i>
                      <div>
                        <strong class="d-block">{{donor.contactInfo.address}}</strong>
                        <small class="text-muted">Address</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Medical Information -->
            <div class="col-lg-4">
              <div class="card h-100">
                <div class="card-header bg-success text-white">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-heart-pulse me-2"></i>
                    Medical Information
                  </h5>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-droplet-fill text-danger me-3 fs-5"></i>
                      <div>
                        <strong class="d-block">{{donor.bloodGroupDisplay}}</strong>
                        <small class="text-muted">Blood Group</small>
                      </div>
                    </div>
                  </div>
                  <div class="mb-0" *ngIf="donor.medicalHistory">
                    <div class="d-flex align-items-start">
                      <i class="bi bi-clipboard2-pulse-fill text-info me-3 fs-5"></i>
                      <div>
                        <strong class="d-block">{{donor.medicalHistory}}</strong>
                        <small class="text-muted">Medical History</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Donation Information -->
            <div class="col-lg-4">
              <div class="card h-100">
                <div class="card-header bg-info text-white">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-calendar-heart me-2"></i>
                    Donation Information
                  </h5>
                </div>
                <div class="card-body">
                  <div class="mb-3" *ngIf="donor.lastDonationDate">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-calendar-check-fill text-success me-3 fs-5"></i>
                      <div>
                        <strong class="d-block">{{donor.lastDonationDate | date:'fullDate'}}</strong>
                        <small class="text-muted">Last Donation Date</small>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3" *ngIf="donor.daysSinceLastDonation">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-clock-fill text-warning me-3 fs-5"></i>
                      <div>
                        <strong class="d-block">{{donor.daysSinceLastDonation}} days</strong>
                        <small class="text-muted">Days Since Last Donation</small>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="d-flex align-items-center">
                      <i class="bi" 
                         [class.bi-check-circle-fill]="donor.isEligibleToDonate" 
                         [class.bi-x-circle-fill]="!donor.isEligibleToDonate"
                         [class.text-success]="donor.isEligibleToDonate"
                         [class.text-danger]="!donor.isEligibleToDonate"
                         me-3 fs-5></i>
                      <div>
                        <strong class="d-block" 
                                [class.text-success]="donor.isEligibleToDonate" 
                                [class.text-danger]="!donor.isEligibleToDonate">
                          {{donor.isEligibleToDonate ? 'Eligible' : 'Not Eligible'}}
                        </strong>
                        <small class="text-muted">Current Status</small>
                      </div>
                    </div>
                  </div>
                  <div class="mb-0" *ngIf="donor.nextEligibleDonationDate">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-calendar-event-fill text-primary me-3 fs-5"></i>
                      <div>
                        <strong class="d-block">{{donor.nextEligibleDonationDate | date:'fullDate'}}</strong>
                        <small class="text-muted">Next Eligible Date</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="row mt-4">
            <div class="col-12">
              <div class="card">
                <div class="card-body text-center">
                  <div class="d-flex flex-wrap justify-content-center gap-3">
                    <button class="btn btn-primary" (click)="checkEligibility()">
                      <i class="bi bi-shield-check me-2"></i>
                      Check Eligibility
                    </button>
                    
                    <button class="btn btn-info" (click)="viewHistory()">
                      <i class="bi bi-clock-history me-2"></i>
                      Donation History
                    </button>
                    
                    <button class="btn btn-success" 
                            (click)="recordDonation()"
                            [disabled]="!donor.isEligibleToDonate">
                      <i class="bi bi-droplet-half me-2"></i>
                      Record Donation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="row" *ngIf="loading">
        <div class="col-12">
          <div class="text-center py-5">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted">Loading donor profile...</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-bottom: 30px;
    }

    .info-section h3 {
      color: #3f51b5;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 8px;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
      padding: 12px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .info-item mat-icon {
      color: #3f51b5;
      margin-top: 4px;
    }

    .info-item div {
      flex: 1;
    }

    .info-item strong {
      display: block;
      margin-bottom: 4px;
    }

    .info-item small {
      color: #666;
      font-size: 12px;
    }

    .eligible {
      color: #4caf50;
    }

    .not-eligible {
      color: #f44336;
    }

    .actions-section {
      display: flex;
      gap: 16px;
      justify-content: center;
      padding: 20px;
      border-top: 1px solid #e0e0e0;
      flex-wrap: wrap;
    }

    .actions-section button {
      min-width: 160px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
    }

    .loading-container p {
      margin-top: 16px;
      color: #666;
    }

    @media (max-width: 768px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-section {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class DonorProfileComponent implements OnInit {
  donor: Donor | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donorService: DonorService
  ) { }

  ngOnInit(): void {
    const donorId = this.route.snapshot.paramMap.get('id');
    if (donorId) {
      this.loadDonor(parseInt(donorId));
    }
  }

  loadDonor(donorId: number): void {
    this.loading = true;
    this.donorService.getDonor(donorId).subscribe({
      next: (donor) => {
        this.donor = donor;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading donor:', error);
        this.loading = false;
      }
    });
  }

  checkEligibility(): void {
    if (this.donor) {
      this.router.navigate(['/donors/eligibility', this.donor.donorId]);
    }
  }

  viewHistory(): void {
    if (this.donor) {
      this.router.navigate(['/donors/history', this.donor.donorId]);
    }
  }

  recordDonation(): void {
    if (this.donor && this.donor.isEligibleToDonate) {
      this.router.navigate(['/donors/donate', this.donor.donorId]);
    }
  }

  goBack(): void {
    this.router.navigate(['/donors']);
  }
}