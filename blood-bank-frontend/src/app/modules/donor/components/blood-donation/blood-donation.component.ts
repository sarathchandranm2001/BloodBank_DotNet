import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DonorService } from '../../../../services/donor.service';
import { Donor, DonorEligibility } from '../../../../models/donor.model';

@Component({
  selector: 'app-blood-donation',
  template: `
    <div class="donation-container">
      <mat-card *ngIf="donor">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>bloodtype</mat-icon>
            Blood Donation - {{donor.userName}}
          </mat-card-title>
          <mat-card-subtitle>
            Blood Group: {{donor.bloodGroupDisplay}}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <!-- Donor Information -->
          <div class="donor-info-section">
            <h3>Donor Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <mat-icon>person</mat-icon>
                <div>
                  <strong>{{donor.userName}}</strong>
                  <small>{{donor.userEmail}}</small>
                </div>
              </div>
              <div class="info-item">
                <mat-icon>bloodtype</mat-icon>
                <div>
                  <strong>{{donor.bloodGroupDisplay}}</strong>
                  <small>Blood Group</small>
                </div>
              </div>
              <div class="info-item">
                <mat-icon>phone</mat-icon>
                <div>
                  <strong>{{donor.contactInfo.phone}}</strong>
                  <small>Contact</small>
                </div>
              </div>
              <div class="info-item" *ngIf="donor.lastDonationDate">
                <mat-icon>history</mat-icon>
                <div>
                  <strong>{{donor.lastDonationDate | date:'shortDate'}}</strong>
                  <small>Last Donation ({{donor.daysSinceLastDonation}} days ago)</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Eligibility Check -->
          <div class="eligibility-section" *ngIf="eligibility">
            <h3>Eligibility Status</h3>
            <div class="eligibility-card" [class.eligible]="eligibility.isEligible" [class.not-eligible]="!eligibility.isEligible">
              <mat-icon>{{eligibility.isEligible ? 'check_circle' : 'cancel'}}</mat-icon>
              <div class="eligibility-content">
                <div class="status">
                  {{eligibility.isEligible ? 'ELIGIBLE TO DONATE' : 'NOT ELIGIBLE TO DONATE'}}
                </div>
                <div class="reason">{{eligibility.reason}}</div>
                <div class="details" *ngIf="!eligibility.isEligible && eligibility.nextEligibleDate">
                  Next eligible date: {{eligibility.nextEligibleDate | date:'fullDate'}}
                </div>
              </div>
            </div>
          </div>

          <!-- Pre-Donation Checklist -->
          <div class="checklist-section" *ngIf="eligibility?.isEligible">
            <h3>Pre-Donation Checklist</h3>
            <mat-list>
              <mat-list-item>
                <mat-checkbox [(ngModel)]="checklist.healthCondition">
                  Donor is in good health condition
                </mat-checkbox>
              </mat-list-item>
              <mat-list-item>
                <mat-checkbox [(ngModel)]="checklist.weightCheck">
                  Donor weighs at least 50 kg
                </mat-checkbox>
              </mat-list-item>
              <mat-list-item>
                <mat-checkbox [(ngModel)]="checklist.ageVerification">
                  Donor is between 18-65 years old
                </mat-checkbox>
              </mat-list-item>
              <mat-list-item>
                <mat-checkbox [(ngModel)]="checklist.bloodPressure">
                  Blood pressure is normal (120/80 ± 20)
                </mat-checkbox>
              </mat-list-item>
              <mat-list-item>
                <mat-checkbox [(ngModel)]="checklist.hemoglobin">
                  Hemoglobin level is adequate (≥12.5 g/dl)
                </mat-checkbox>
              </mat-list-item>
              <mat-list-item>
                <mat-checkbox [(ngModel)]="checklist.noAlcohol">
                  No alcohol consumption in last 24 hours
                </mat-checkbox>
              </mat-list-item>
              <mat-list-item>
                <mat-checkbox [(ngModel)]="checklist.consentGiven">
                  Informed consent obtained
                </mat-checkbox>
              </mat-list-item>
            </mat-list>
          </div>

          <!-- Donation Details -->
          <div class="donation-details" *ngIf="eligibility?.isEligible && allChecksPassed()">
            <h3>Donation Details</h3>
            <div class="donation-info">
              <mat-icon>event</mat-icon>
              <div>
                <strong>Donation Date:</strong>
                <p>{{today | date:'fullDate'}}</p>
              </div>
            </div>
            <div class="donation-info">
              <mat-icon>access_time</mat-icon>
              <div>
                <strong>Donation Time:</strong>
                <p>{{today | date:'shortTime'}}</p>
              </div>
            </div>
            <div class="donation-info">
              <mat-icon>local_hospital</mat-icon>
              <div>
                <strong>Collection Details:</strong>
                <p>Standard blood donation (450ml ± 10%)</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button mat-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Back
            </button>
            
            <button mat-button 
                    (click)="checkEligibility()" 
                    *ngIf="!eligibility"
                    color="primary">
              <mat-icon>health_and_safety</mat-icon>
              Check Eligibility
            </button>

            <button mat-raised-button 
                    color="accent"
                    (click)="recordDonation()"
                    [disabled]="!canProceedWithDonation()"
                    *ngIf="eligibility?.isEligible">
              <mat-icon *ngIf="!isRecording">bloodtype</mat-icon>
              <mat-icon *ngIf="isRecording">refresh</mat-icon>
              {{isRecording ? 'Recording...' : 'Record Donation'}}
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
        <p>Loading donor information...</p>
      </div>

      <!-- Error State -->
      <mat-card *ngIf="error">
        <mat-card-content>
          <div class="error-state">
            <mat-icon>error</mat-icon>
            <h3>Error Loading Donor</h3>
            <p>{{error}}</p>
            <button mat-raised-button color="primary" (click)="loadDonor()">
              Try Again
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .donation-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .donor-info-section, .eligibility-section, .checklist-section, .donation-details {
      margin-bottom: 30px;
    }

    .donor-info-section h3, .eligibility-section h3, .checklist-section h3, .donation-details h3 {
      color: #3f51b5;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }

    .info-item mat-icon {
      color: #3f51b5;
    }

    .eligibility-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      border-radius: 8px;
      border: 2px solid;
    }

    .eligibility-card.eligible {
      background-color: #e8f5e8;
      border-color: #4caf50;
      color: #2e7d32;
    }

    .eligibility-card.not-eligible {
      background-color: #ffebee;
      border-color: #f44336;
      color: #c62828;
    }

    .eligibility-card mat-icon {
      font-size: 36px;
      height: 36px;
      width: 36px;
    }

    .eligibility-content .status {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 8px;
    }

    .eligibility-content .reason {
      font-size: 14px;
      opacity: 0.8;
    }

    .checklist-section mat-list-item {
      height: auto;
      padding: 8px 0;
    }

    .donation-info {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
      padding: 12px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .donation-info mat-icon {
      color: #3f51b5;
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
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

    .error-state {
      text-align: center;
      padding: 40px;
    }

    .error-state mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #f44336;
      margin-bottom: 16px;
    }

    .error-state h3 {
      color: #f44336;
      margin-bottom: 8px;
    }
  `]
})
export class BloodDonationComponent implements OnInit {
  donor: Donor | null = null;
  eligibility: DonorEligibility | null = null;
  loading = false;
  error: string | null = null;
  isRecording = false;
  today = new Date();

  checklist = {
    healthCondition: false,
    weightCheck: false,
    ageVerification: false,
    bloodPressure: false,
    hemoglobin: false,
    noAlcohol: false,
    consentGiven: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donorService: DonorService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const donorId = this.route.snapshot.paramMap.get('id');
    if (donorId) {
      this.loadDonor(parseInt(donorId));
    }
  }

  loadDonor(donorId?: number): void {
    const id = donorId || parseInt(this.route.snapshot.paramMap.get('id')!);
    this.loading = true;
    this.error = null;

    this.donorService.getDonor(id).subscribe({
      next: (donor) => {
        this.donor = donor;
        this.loading = false;
        if (donor.isEligibleToDonate) {
          this.checkEligibility();
        }
      },
      error: (error) => {
        console.error('Error loading donor:', error);
        this.error = 'Unable to load donor information. Please try again.';
        this.loading = false;
      }
    });
  }

  checkEligibility(): void {
    if (!this.donor) return;

    this.donorService.getDonorEligibility(this.donor.donorId).subscribe({
      next: (eligibility) => {
        this.eligibility = eligibility;
      },
      error: (error) => {
        console.error('Error checking eligibility:', error);
        this.snackBar.open('Error checking eligibility', 'Close', { duration: 3000 });
      }
    });
  }

  allChecksPassed(): boolean {
    return Object.values(this.checklist).every(check => check === true);
  }

  canProceedWithDonation(): boolean {
    return !!(this.eligibility?.isEligible && this.allChecksPassed());
  }

  recordDonation(): void {
    if (!this.donor || !this.canProceedWithDonation()) return;

    this.isRecording = true;
    this.donorService.recordDonation(this.donor.donorId).subscribe({
      next: (result) => {
        if (result.donationRecorded) {
          this.snackBar.open('Blood donation recorded successfully!', 'Close', { duration: 5000 });
          this.router.navigate(['/donors/history', this.donor!.donorId]);
        } else {
          this.snackBar.open(result.message, 'Close', { duration: 3000 });
        }
        this.isRecording = false;
      },
      error: (error) => {
        console.error('Error recording donation:', error);
        this.snackBar.open('Error recording donation. Please try again.', 'Close', { duration: 3000 });
        this.isRecording = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/donors']);
  }
}