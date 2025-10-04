import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

interface Donor {
  id: number;
  userName: string;
  userEmail: string;
  bloodGroupDisplay: string;
  contactInfo: {
    phone: string;
  };
  lastDonationDate?: Date;
  daysSinceLastDonation?: number;
}

interface DonorEligibility {
  isEligible: boolean;
  reason: string;
  nextEligibleDate?: Date;
}

@Component({
  selector: 'app-blood-donation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <!-- Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-danger">
              <i class="bi bi-droplet-fill me-2"></i>
              Blood Donation Process
            </h2>
            <button class="btn btn-outline-secondary" (click)="goBack()">
              <i class="bi bi-arrow-left me-2"></i>Back
            </button>
          </div>

          <!-- Loading State -->
          <div *ngIf="isLoading" class="text-center py-5">
            <div class="spinner-border text-danger mb-3" style="width: 3rem; height: 3rem;">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted">Loading donor information...</p>
          </div>

          <!-- Error State -->
          <div *ngIf="error" class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Error!</strong> {{error}}
            <button class="btn btn-outline-danger btn-sm ms-2" (click)="loadDonorInfo()">
              Try Again
            </button>
          </div>

          <!-- Main Content -->
          <div *ngIf="!isLoading && !error && donor">
            <!-- Donor Information -->
            <div class="card mb-4">
              <div class="card-header bg-primary text-white">
                <h5 class="card-title mb-0">
                  <i class="bi bi-person-fill me-2"></i>
                  Donor Information
                </h5>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="p-3 bg-light rounded">
                      <div class="d-flex align-items-center">
                        <i class="bi bi-person text-primary fs-3 me-3"></i>
                        <div>
                          <h6 class="mb-1">{{donor.userName}}</h6>
                          <small class="text-muted">{{donor.userEmail}}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="p-3 bg-light rounded">
                      <div class="d-flex align-items-center">
                        <i class="bi bi-droplet-fill text-danger fs-3 me-3"></i>
                        <div>
                          <h6 class="mb-1">{{donor.bloodGroupDisplay}}</h6>
                          <small class="text-muted">Blood Group</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="p-3 bg-light rounded">
                      <div class="d-flex align-items-center">
                        <i class="bi bi-telephone-fill text-success fs-3 me-3"></i>
                        <div>
                          <h6 class="mb-1">{{donor.contactInfo.phone}}</h6>
                          <small class="text-muted">Contact</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6" *ngIf="donor.lastDonationDate">
                    <div class="p-3 bg-light rounded">
                      <div class="d-flex align-items-center">
                        <i class="bi bi-clock-history text-warning fs-3 me-3"></i>
                        <div>
                          <h6 class="mb-1">{{donor.lastDonationDate | date:'shortDate'}}</h6>
                          <small class="text-muted">Last Donation ({{donor.daysSinceLastDonation}} days ago)</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Eligibility Status -->
            <div class="card mb-4" *ngIf="eligibility">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="bi bi-shield-check me-2"></i>
                  Donation Eligibility
                </h5>
              </div>
              <div class="card-body">
                <div class="alert" 
                     [class.alert-success]="eligibility.isEligible" 
                     [class.alert-danger]="!eligibility.isEligible">
                  <div class="d-flex align-items-center">
                    <i class="bi fs-3 me-3" 
                       [class.bi-check-circle-fill]="eligibility.isEligible" 
                       [class.bi-x-circle-fill]="!eligibility.isEligible"></i>
                    <div>
                      <h6 class="mb-1">{{eligibility.isEligible ? 'ELIGIBLE TO DONATE' : 'NOT ELIGIBLE TO DONATE'}}</h6>
                      <p class="mb-1">{{eligibility.reason}}</p>
                      <small *ngIf="!eligibility.isEligible && eligibility.nextEligibleDate">
                        Next eligible date: {{eligibility.nextEligibleDate | date:'fullDate'}}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pre-Donation Checklist -->
            <div class="card mb-4" *ngIf="eligibility?.isEligible">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="bi bi-list-check me-2"></i>
                  Pre-Donation Checklist
                </h5>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="form-check p-3 border rounded">
                      <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.healthCondition" id="health">
                      <label class="form-check-label fw-bold" for="health">
                        Good Health Condition
                      </label>
                      <div class="small text-muted">Donor is in good health and feeling well today</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check p-3 border rounded">
                      <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.weightCheck" id="weight">
                      <label class="form-check-label fw-bold" for="weight">
                        Weight Requirement
                      </label>
                      <div class="small text-muted">Donor weighs at least 50 kg (110 lbs)</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check p-3 border rounded">
                      <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.ageVerification" id="age">
                      <label class="form-check-label fw-bold" for="age">
                        Age Verification
                      </label>
                      <div class="small text-muted">Donor is between 18-65 years old</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check p-3 border rounded">
                      <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.bloodPressure" id="bp">
                      <label class="form-check-label fw-bold" for="bp">
                        Blood Pressure
                      </label>
                      <div class="small text-muted">Blood pressure is normal (120/80 ± 20)</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check p-3 border rounded">
                      <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.hemoglobin" id="hb">
                      <label class="form-check-label fw-bold" for="hb">
                        Hemoglobin Level
                      </label>
                      <div class="small text-muted">Hemoglobin level is adequate (≥12.5 g/dl)</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check p-3 border rounded">
                      <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.noAlcohol" id="alcohol">
                      <label class="form-check-label fw-bold" for="alcohol">
                        No Alcohol
                      </label>
                      <div class="small text-muted">No alcohol consumption in last 24 hours</div>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-check p-3 border rounded bg-light">
                      <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.consentGiven" id="consent">
                      <label class="form-check-label fw-bold" for="consent">
                        Informed Consent
                      </label>
                      <div class="small text-muted">I understand the donation process and give my informed consent</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Donation Information -->
            <div class="card mb-4" *ngIf="eligibility?.isEligible && allChecksPassed()">
              <div class="card-header bg-success text-white">
                <h5 class="card-title mb-0">
                  <i class="bi bi-info-circle me-2"></i>
                  Donation Information
                </h5>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-4">
                    <div class="text-center p-3 bg-light rounded">
                      <i class="bi bi-calendar-event text-primary fs-1"></i>
                      <h6 class="mt-2 mb-1">Date</h6>
                      <p class="mb-0">{{today | date:'fullDate'}}</p>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="text-center p-3 bg-light rounded">
                      <i class="bi bi-clock text-info fs-1"></i>
                      <h6 class="mt-2 mb-1">Time</h6>
                      <p class="mb-0">{{today | date:'shortTime'}}</p>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="text-center p-3 bg-light rounded">
                      <i class="bi bi-hospital text-success fs-1"></i>
                      <h6 class="mt-2 mb-1">Collection</h6>
                      <p class="mb-0">450ml ± 10%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <button class="btn btn-outline-secondary" (click)="goBack()">
                    <i class="bi bi-arrow-left me-2"></i>Back to Profile
                  </button>
                  
                  <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary" 
                            (click)="checkEligibility()" 
                            *ngIf="!eligibility"
                            [disabled]="isLoading">
                      <i class="bi bi-shield-check me-2"></i>Check Eligibility
                    </button>
                    
                    <button class="btn btn-success" 
                            (click)="recordDonation()"
                            *ngIf="eligibility?.isEligible && allChecksPassed()"
                            [disabled]="isRecording">
                      <i class="bi me-2" 
                         [class.bi-droplet-fill]="!isRecording" 
                         [class.bi-arrow-repeat]="isRecording"></i>
                      {{isRecording ? 'Recording...' : 'Record Donation'}}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BloodDonationComponent implements OnInit {
  donor: Donor | null = null;
  eligibility: DonorEligibility | null = null;
  isLoading = false;
  isRecording = false;
  error: string | null = null;
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDonorInfo();
  }

  private loadDonorInfo(): void {
    this.isLoading = true;
    this.error = null;

    // Simulate API call
    setTimeout(() => {
      // Mock data for now
      this.donor = {
        id: 1,
        userName: 'John Doe',
        userEmail: 'john.doe@example.com',
        bloodGroupDisplay: 'O+',
        contactInfo: {
          phone: '+1-555-0123'
        },
        lastDonationDate: new Date('2024-08-15'),
        daysSinceLastDonation: 50
      };
      this.isLoading = false;
    }, 1000);
  }

  checkEligibility(): void {
    if (!this.donor) return;

    this.isLoading = true;
    
    // Simulate eligibility check
    setTimeout(() => {
      const daysSinceLastDonation = this.donor?.daysSinceLastDonation || 0;
      
      if (daysSinceLastDonation >= 56) { // 8 weeks minimum
        this.eligibility = {
          isEligible: true,
          reason: 'All eligibility criteria met. Ready to donate.'
        };
      } else {
        const nextEligibleDate = new Date();
        nextEligibleDate.setDate(nextEligibleDate.getDate() + (56 - daysSinceLastDonation));
        
        this.eligibility = {
          isEligible: false,
          reason: `Must wait ${56 - daysSinceLastDonation} more days between donations.`,
          nextEligibleDate
        };
      }
      this.isLoading = false;
    }, 1500);
  }

  allChecksPassed(): boolean {
    return Object.values(this.checklist).every(check => check === true);
  }

  recordDonation(): void {
    if (!this.canProceedWithDonation()) return;

    this.isRecording = true;
    
    // Simulate donation recording
    setTimeout(() => {
      alert('Donation recorded successfully!');
      this.isRecording = false;
      this.router.navigate(['/donors/overview']);
    }, 2000);
  }

  canProceedWithDonation(): boolean {
    return this.eligibility?.isEligible === true && this.allChecksPassed();
  }

  goBack(): void {
    this.router.navigate(['/donors/overview']);
  }
}