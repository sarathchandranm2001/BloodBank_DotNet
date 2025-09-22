import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DonorService } from '../../../../services/donor.service';
import { DonorEligibility } from '../../../../models/donor.model';

@Component({
  selector: 'app-donor-eligibility',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-primary mb-0">
              <i class="bi bi-shield-check me-2"></i>
              Donor Eligibility Check
            </h2>
            <button class="btn btn-outline-secondary" (click)="goBack()">
              <i class="bi bi-arrow-left me-2"></i>
              Back
            </button>
          </div>

          <!-- Eligibility Status -->
          <div class="card mb-4" *ngIf="eligibility">
            <div class="card-body text-center py-5" 
                 [class.bg-success]="eligibility.isEligible" 
                 [class.bg-danger]="!eligibility.isEligible"
                 [class.text-white]="true">
              <i class="bi display-1 mb-3" 
                 [class.bi-check-circle-fill]="eligibility.isEligible"
                 [class.bi-x-circle-fill]="!eligibility.isEligible"></i>
              <h2 class="mb-2">
                {{eligibility.isEligible ? 'ELIGIBLE TO DONATE' : 'NOT ELIGIBLE TO DONATE'}}
              </h2>
              <p class="mb-0 fs-5">{{eligibility.donorName}} ({{eligibility.bloodGroup}})</p>
            </div>
          </div>

          <!-- Eligibility Details -->
          <div class="card mb-4" *ngIf="eligibility">
            <div class="card-header bg-primary text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-info-circle me-2"></i>
                Eligibility Details
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-4">
                <div class="col-12">
                  <div class="d-flex align-items-start">
                    <i class="bi bi-chat-text-fill text-primary me-3 fs-5"></i>
                    <div>
                      <strong class="d-block">Reason:</strong>
                      <p class="mb-0">{{eligibility.reason}}</p>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-clock-fill text-info me-3 fs-5"></i>
                    <div>
                      <strong class="d-block">Days Since Last Donation:</strong>
                      <p class="mb-0">{{eligibility.daysSinceLastDonation}} days</p>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-hourglass-split text-warning me-3 fs-5"></i>
                    <div>
                      <strong class="d-block">Minimum Days Between Donations:</strong>
                      <p class="mb-0">{{eligibility.minimumDaysBetweenDonations}} days</p>
                    </div>
                  </div>
                </div>

                <div class="col-12" *ngIf="eligibility.nextEligibleDate">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-calendar-event-fill text-success me-3 fs-5"></i>
                    <div>
                      <strong class="d-block">Next Eligible Date:</strong>
                      <p class="mb-0">{{eligibility.nextEligibleDate | date:'fullDate'}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Guidelines -->
          <div class="card mb-4" *ngIf="eligibility">
            <div class="card-header bg-info text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-list-check me-2"></i>
                Blood Donation Guidelines
              </h5>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <div class="list-group-item d-flex align-items-center">
                  <i class="bi me-3 fs-5" 
                     [class.bi-check-circle-fill]="eligibility.daysSinceLastDonation >= 56"
                     [class.bi-x-circle-fill]="eligibility.daysSinceLastDonation < 56"
                     [class.text-success]="eligibility.daysSinceLastDonation >= 56"
                     [class.text-danger]="eligibility.daysSinceLastDonation < 56"></i>
                  <div class="flex-grow-1">
                    <div class="fw-bold">Minimum 56 days gap between donations</div>
                    <small class="text-muted">Current gap: {{eligibility.daysSinceLastDonation}} days</small>
                  </div>
                </div>

                <div class="list-group-item d-flex align-items-center">
                  <i class="bi bi-info-circle-fill text-primary me-3 fs-5"></i>
                  <div class="fw-bold">Age should be between 18-65 years</div>
                </div>

                <div class="list-group-item d-flex align-items-center">
                  <i class="bi bi-info-circle-fill text-primary me-3 fs-5"></i>
                  <div class="fw-bold">Weight should be at least 50 kg</div>
                </div>

                <div class="list-group-item d-flex align-items-center">
                  <i class="bi bi-info-circle-fill text-primary me-3 fs-5"></i>
                  <div class="fw-bold">Must be in good health condition</div>
                </div>

                <div class="list-group-item d-flex align-items-center">
                  <i class="bi bi-info-circle-fill text-primary me-3 fs-5"></i>
                  <div class="fw-bold">Hemoglobin level ≥ 12.5 g/dl</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="card" *ngIf="eligibility">
            <div class="card-body">
              <div class="d-flex flex-wrap justify-content-center gap-3">
                <button class="btn btn-outline-secondary" (click)="goBack()">
                  <i class="bi bi-arrow-left me-2"></i>
                  Back to Profile
                </button>

                <button class="btn btn-primary" (click)="refreshEligibility()">
                  <i class="bi bi-arrow-clockwise me-2"></i>
                  Refresh Status
                </button>

                <button class="btn btn-success" 
                        (click)="proceedToDonation()"
                        [disabled]="!eligibility.isEligible">
                  <i class="bi bi-droplet-half me-2"></i>
                  Proceed to Donation
                </button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div class="text-center py-5" *ngIf="loading">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted">Checking eligibility...</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .eligibility-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .status-section {
      margin-bottom: 30px;
    }

    .status-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 30px;
      border-radius: 12px;
      border: 3px solid;
      text-align: center;
    }

    .status-card.eligible {
      background-color: #e8f5e8;
      border-color: #4caf50;
      color: #2e7d32;
    }

    .status-card.not-eligible {
      background-color: #ffebee;
      border-color: #f44336;
      color: #c62828;
    }

    .status-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
    }

    .status-content h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: bold;
    }

    .donor-name {
      margin: 0;
      opacity: 0.8;
      font-size: 16px;
    }

    .details-section, .guidelines-section {
      margin-bottom: 30px;
    }

    .details-section h3, .guidelines-section h3 {
      color: #3f51b5;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 8px;
    }

    .detail-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
      padding: 16px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .detail-item mat-icon {
      color: #3f51b5;
      margin-top: 4px;
    }

    .detail-item strong {
      display: block;
      margin-bottom: 4px;
      color: #333;
    }

    .detail-item p {
      margin: 0;
      color: #666;
    }

    .guidelines-section mat-list-item {
      margin-bottom: 8px;
    }

    mat-icon[matListIcon].met {
      color: #4caf50;
    }

    mat-icon[matListIcon].not-met {
      color: #f44336;
    }

    mat-icon[matListIcon].info {
      color: #2196f3;
    }

    .actions-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      border-top: 1px solid #e0e0e0;
      flex-wrap: wrap;
      gap: 12px;
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
      .status-card {
        flex-direction: column;
        text-align: center;
      }
      
      .actions-section {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class DonorEligibilityComponent implements OnInit {
  eligibility: DonorEligibility | null = null;
  loading = false;
  donorId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donorService: DonorService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.donorId = parseInt(id);
      this.checkEligibility();
    }
  }

  checkEligibility(): void {
    this.loading = true;
    this.donorService.getDonorEligibility(this.donorId).subscribe({
      next: (eligibility) => {
        this.eligibility = eligibility;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error checking eligibility:', error);
        this.loading = false;
      }
    });
  }

  refreshEligibility(): void {
    this.checkEligibility();
  }

  proceedToDonation(): void {
    if (this.eligibility?.isEligible) {
      this.router.navigate(['/donors/donate', this.donorId]);
    }
  }

  goBack(): void {
    this.router.navigate(['/donors/profile', this.donorId]);
  }
}