import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonorService } from '../../../../services/donor.service';
import { DonorEligibility } from '../../../../models/donor.model';

@Component({
  selector: 'app-donor-eligibility',
  template: `
    <div class="eligibility-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>health_and_safety</mat-icon>
            Donor Eligibility Check
          </mat-card-title>
          <button mat-icon-button (click)="goBack()" matTooltip="Back">
            <mat-icon>arrow_back</mat-icon>
          </button>
        </mat-card-header>

        <mat-card-content *ngIf="eligibility">
          <!-- Eligibility Status -->
          <div class="status-section">
            <div class="status-card" [class.eligible]="eligibility.isEligible" [class.not-eligible]="!eligibility.isEligible">
              <mat-icon class="status-icon">
                {{eligibility.isEligible ? 'check_circle' : 'cancel'}}
              </mat-icon>
              <div class="status-content">
                <h2>{{eligibility.isEligible ? 'ELIGIBLE TO DONATE' : 'NOT ELIGIBLE TO DONATE'}}</h2>
                <p class="donor-name">{{eligibility.donorName}} ({{eligibility.bloodGroup}})</p>
              </div>
            </div>
          </div>

          <!-- Eligibility Details -->
          <div class="details-section">
            <h3>Eligibility Details</h3>
            
            <div class="detail-item">
              <mat-icon>info</mat-icon>
              <div>
                <strong>Reason:</strong>
                <p>{{eligibility.reason}}</p>
              </div>
            </div>

            <div class="detail-item">
              <mat-icon>timelapse</mat-icon>
              <div>
                <strong>Days Since Last Donation:</strong>
                <p>{{eligibility.daysSinceLastDonation}} days</p>
              </div>
            </div>

            <div class="detail-item">
              <mat-icon>schedule</mat-icon>
              <div>
                <strong>Minimum Days Between Donations:</strong>
                <p>{{eligibility.minimumDaysBetweenDonations}} days</p>
              </div>
            </div>

            <div class="detail-item" *ngIf="eligibility.nextEligibleDate">
              <mat-icon>event</mat-icon>
              <div>
                <strong>Next Eligible Date:</strong>
                <p>{{eligibility.nextEligibleDate | date:'fullDate'}}</p>
              </div>
            </div>
          </div>

          <!-- Guidelines -->
          <div class="guidelines-section">
            <h3>Blood Donation Guidelines</h3>
            <mat-list>
              <mat-list-item>
                <mat-icon matListIcon [class.met]="eligibility.daysSinceLastDonation >= 56" 
                         [class.not-met]="eligibility.daysSinceLastDonation < 56">
                  {{eligibility.daysSinceLastDonation >= 56 ? 'check_circle' : 'cancel'}}
                </mat-icon>
                <div matLine>Minimum 56 days gap between donations</div>
                <div matLine>
                  <small>Current gap: {{eligibility.daysSinceLastDonation}} days</small>
                </div>
              </mat-list-item>

              <mat-list-item>
                <mat-icon matListIcon class="info">info</mat-icon>
                <div matLine>Age should be between 18-65 years</div>
              </mat-list-item>

              <mat-list-item>
                <mat-icon matListIcon class="info">info</mat-icon>
                <div matLine>Weight should be at least 50 kg</div>
              </mat-list-item>

              <mat-list-item>
                <mat-icon matListIcon class="info">info</mat-icon>
                <div matLine>Must be in good health condition</div>
              </mat-list-item>

              <mat-list-item>
                <mat-icon matListIcon class="info">info</mat-icon>
                <div matLine>Hemoglobin level ≥ 12.5 g/dl</div>
              </mat-list-item>
            </mat-list>
          </div>

          <!-- Actions -->
          <div class="actions-section">
            <button mat-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Back to Profile
            </button>

            <button mat-raised-button 
                    color="primary" 
                    (click)="refreshEligibility()">
              <mat-icon>refresh</mat-icon>
              Refresh Status
            </button>

            <button mat-raised-button 
                    color="accent" 
                    (click)="proceedToDonation()"
                    [disabled]="!eligibility.isEligible">
              <mat-icon>bloodtype</mat-icon>
              Proceed to Donation
            </button>
          </div>
        </mat-card-content>

        <!-- Loading State -->
        <mat-card-content *ngIf="loading">
          <div class="loading-container">
            <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
            <p>Checking eligibility...</p>
          </div>
        </mat-card-content>
      </mat-card>
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