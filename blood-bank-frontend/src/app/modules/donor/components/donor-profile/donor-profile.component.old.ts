import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonorService } from '../../../../services/donor.service';
import { Donor } from '../../../../models/donor.model';

@Component({
  selector: 'app-donor-profile',
  template: `
    <div class="profile-container">
      <mat-card *ngIf="donor">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>person</mat-icon>
            Donor Profile
          </mat-card-title>
          <div class="header-actions">
            <button mat-icon-button (click)="goBack()" matTooltip="Back">
              <mat-icon>arrow_back</mat-icon>
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div class="profile-grid">
            <!-- Personal Information -->
            <div class="info-section">
              <h3>Personal Information</h3>
              <div class="info-item">
                <mat-icon>person</mat-icon>
                <div>
                  <strong>{{donor.userName}}</strong>
                  <small>Full Name</small>
                </div>
              </div>
              <div class="info-item">
                <mat-icon>email</mat-icon>
                <div>
                  <strong>{{donor.userEmail}}</strong>
                  <small>Email Address</small>
                </div>
              </div>
              <div class="info-item">
                <mat-icon>phone</mat-icon>
                <div>
                  <strong>{{donor.contactInfo.phone}}</strong>
                  <small>Phone Number</small>
                </div>
              </div>
              <div class="info-item">
                <mat-icon>location_on</mat-icon>
                <div>
                  <strong>{{donor.contactInfo.address}}</strong>
                  <small>Address</small>
                </div>
              </div>
            </div>

            <!-- Medical Information -->
            <div class="info-section">
              <h3>Medical Information</h3>
              <div class="info-item">
                <mat-icon>bloodtype</mat-icon>
                <div>
                  <strong>{{donor.bloodGroupDisplay}}</strong>
                  <small>Blood Group</small>
                </div>
              </div>
              <div class="info-item" *ngIf="donor.medicalHistory">
                <mat-icon>medical_services</mat-icon>
                <div>
                  <strong>{{donor.medicalHistory}}</strong>
                  <small>Medical History</small>
                </div>
              </div>
            </div>

            <!-- Donation Information -->
            <div class="info-section">
              <h3>Donation Information</h3>
              <div class="info-item" *ngIf="donor.lastDonationDate">
                <mat-icon>calendar_today</mat-icon>
                <div>
                  <strong>{{donor.lastDonationDate | date:'fullDate'}}</strong>
                  <small>Last Donation Date</small>
                </div>
              </div>
              <div class="info-item" *ngIf="donor.daysSinceLastDonation">
                <mat-icon>timelapse</mat-icon>
                <div>
                  <strong>{{donor.daysSinceLastDonation}} days</strong>
                  <small>Days Since Last Donation</small>
                </div>
              </div>
              <div class="info-item">
                <mat-icon>{{donor.isEligibleToDonate ? 'check_circle' : 'cancel'}}</mat-icon>
                <div>
                  <strong [class.eligible]="donor.isEligibleToDonate" [class.not-eligible]="!donor.isEligibleToDonate">
                    {{donor.isEligibleToDonate ? 'Eligible' : 'Not Eligible'}}
                  </strong>
                  <small>Current Status</small>
                </div>
              </div>
              <div class="info-item" *ngIf="donor.nextEligibleDonationDate">
                <mat-icon>event</mat-icon>
                <div>
                  <strong>{{donor.nextEligibleDonationDate | date:'fullDate'}}</strong>
                  <small>Next Eligible Date</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="actions-section">
            <button mat-raised-button 
                    color="primary" 
                    (click)="checkEligibility()">
              <mat-icon>health_and_safety</mat-icon>
              Check Eligibility
            </button>
            
            <button mat-raised-button 
                    color="accent" 
                    (click)="viewHistory()">
              <mat-icon>history</mat-icon>
              Donation History
            </button>
            
            <button mat-raised-button 
                    color="warn" 
                    (click)="recordDonation()"
                    [disabled]="!donor.isEligibleToDonate">
              <mat-icon>bloodtype</mat-icon>
              Record Donation
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
        <p>Loading donor profile...</p>
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