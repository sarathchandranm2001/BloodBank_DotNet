import { Component, OnInit } from '@angular/core';import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';import { ActivatedRoute, Router, RouterModule } from '@angular/router';



interface Donor {interface Donor {

  id: number;  id: number;

  userName: string;  userName: string;

  userEmail: string;  userEmail: string;

  bloodGroupDisplay: string;  bloodGroupDisplay: string;

  contactInfo: {  contactInfo: {

    phone: string;    phone: string;

  };  };

  lastDonationDate?: Date;  lastDonationDate?: Date;

  daysSinceLastDonation?: number;  daysSinceLastDonation?: number;

}}



interface DonorEligibility {interface DonorEligibility {

  isEligible: boolean;  isEligible: boolean;

  reason: string;  reason: string;

  nextEligibleDate?: Date;  nextEligibleDate?: Date;

}}



@Component({@Component({

  selector: 'app-blood-donation',  selector: 'app-blood-donation',

  standalone: true,  standalone: true,

  imports: [CommonModule, FormsModule, RouterModule],  imports: [CommonModule, FormsModule, RouterModule],

  template: `  template: `

    <div class="container-fluid mt-4">    <div class="container-fluid mt-4">

      <div class="row">      <div class="row">

        <div class="col-12">        <div class="col-12">

          <!-- Header -->          <!-- Header -->

          <div class="card mb-4" *ngIf="donor">          <div class="card mb-4" *ngIf="donor">

            <div class="card-header bg-danger text-white">            <div class="card-header bg-danger text-white">

              <div class="d-flex align-items-center">              <div class="d-flex align-items-center">

                <i class="bi bi-droplet me-2"></i>                <i class="bi bi-droplet me-2"></i>

                <h4 class="card-title mb-0">Blood Donation - {{donor.userName}}</h4>                <h4 class="card-title mb-0">Blood Donation - {{donor.userName}}</h4>

              </div>              </div>

              <small class="text-light">Blood Group: {{donor.bloodGroupDisplay}}</small>              <small class="text-light">Blood Group: {{donor.bloodGroupDisplay}}</small>

            </div>            </div>

          </div>          </div>



          <!-- Donor Information -->          <!-- Donor Information -->

          <div class="card mb-4" *ngIf="donor">          <div class="card mb-4" *ngIf="donor">

            <div class="card-header">            <div class="card-header">

              <h5 class="card-title mb-0">              <h5 class="card-title mb-0">

                <i class="bi bi-person-circle me-2"></i>                <i class="bi bi-person-circle me-2"></i>

                Donor Information                Donor Information

              </h5>              </h5>

            </div>            </div>

            <div class="card-body">            <div class="card-body">

              <div class="row">              <div class="row">

                <div class="col-md-6 mb-3">                <div class="col-md-6 mb-3">

                  <div class="info-card">                  <div class="info-card">

                    <div class="d-flex align-items-center">                    <div class="d-flex align-items-center">

                      <i class="bi bi-person text-primary me-3"></i>                      <i class="bi bi-person text-primary me-3"></i>

                      <div>                      <div>

                        <strong>{{donor.userName}}</strong>                        <strong>{{donor.userName}}</strong>

                        <br><small class="text-muted">{{donor.userEmail}}</small>                        <br><small class="text-muted">{{donor.userEmail}}</small>

                      </div>                      </div>

                    </div>                    </div>

                  </div>                  </div>

                </div>                </div>

                <div class="col-md-6 mb-3">                <div class="col-md-6 mb-3">

                  <div class="info-card">                  <div class="info-card">

                    <div class="d-flex align-items-center">                    <div class="d-flex align-items-center">

                      <i class="bi bi-droplet text-danger me-3"></i>                      <i class="bi bi-droplet text-danger me-3"></i>

                      <div>                      <div>

                        <strong>{{donor.bloodGroupDisplay}}</strong>                        <strong>{{donor.bloodGroupDisplay}}</strong>

                        <br><small class="text-muted">Blood Group</small>                        <br><small class="text-muted">Blood Group</small>

                      </div>                      </div>

                    </div>                    </div>

                  </div>                  </div>

                </div>                </div>

                <div class="col-md-6 mb-3">                <div class="col-md-6 mb-3">

                  <div class="info-card">                  <div class="info-card">

                    <div class="d-flex align-items-center">                    <div class="d-flex align-items-center">

                      <i class="bi bi-telephone text-success me-3"></i>                      <i class="bi bi-telephone text-success me-3"></i>

                      <div>                      <div>

                        <strong>{{donor.contactInfo.phone}}</strong>                        <strong>{{donor.contactInfo.phone}}</strong>

                        <br><small class="text-muted">Contact</small>                        <br><small class="text-muted">Contact</small>

                      </div>                      </div>

                    </div>                    </div>

                  </div>                  </div>

                </div>                </div>

                <div class="col-md-6 mb-3" *ngIf="donor.lastDonationDate">                <div class="col-md-6 mb-3" *ngIf="donor.lastDonationDate">

                  <div class="info-card">                  <div class="info-card">

                    <div class="d-flex align-items-center">                    <div class="d-flex align-items-center">

                      <i class="bi bi-clock-history text-warning me-3"></i>                      <i class="bi bi-clock-history text-warning me-3"></i>

                      <div>                      <div>

                        <strong>{{donor.lastDonationDate | date:'shortDate'}}</strong>                        <strong>{{donor.lastDonationDate | date:'shortDate'}}</strong>

                        <br><small class="text-muted">Last Donation ({{donor.daysSinceLastDonation}} days ago)</small>                        <br><small class="text-muted">Last Donation ({{donor.daysSinceLastDonation}} days ago)</small>

                      </div>                      </div>

                    </div>                    </div>

                  </div>                  </div>

                </div>                </div>

              </div>              </div>

            </div>            </div>

          </div>          </div>



          <!-- Pre-Donation Checklist -->          <!-- Eligibility Status -->

          <div class="card mb-4">          <div class="card mb-4" *ngIf="eligibility">

            <div class="card-header">            <div class="card-header">

              <h5 class="card-title mb-0">              <h5 class="card-title mb-0">

                <i class="bi bi-list-check me-2"></i>                <i class="bi bi-shield-check me-2"></i>

                Pre-Donation Checklist                Donation Eligibility

              </h5>              </h5>

            </div>            </div>

            <div class="card-body">            <div class="card-body">

              <div class="checklist">              <div class="alert" 

                <div class="form-check mb-3">                   [class.alert-success]="eligibility.isEligible" 

                  <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.healthCondition" id="health">                   [class.alert-danger]="!eligibility.isEligible">

                  <label class="form-check-label" for="health">                <div class="d-flex align-items-center">

                    I am in good health and feeling well today                  <i class="bi" 

                  </label>                     [class.bi-check-circle]="eligibility.isEligible" 

                </div>                     [class.bi-x-circle]="!eligibility.isEligible" 

                <div class="form-check mb-3">                     [class.text-success]="eligibility.isEligible" 

                  <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.weightCheck" id="weight">                     [class.text-danger]="!eligibility.isEligible"></i>

                  <label class="form-check-label" for="weight">                  <div class="ms-3">

                    I weigh at least 50kg (110 lbs)                    <h6 class="mb-1">{{eligibility.isEligible ? 'ELIGIBLE TO DONATE' : 'NOT ELIGIBLE TO DONATE'}}</h6>

                  </label>                    <p class="mb-1">{{eligibility.reason}}</p>

                </div>                    <small *ngIf="!eligibility.isEligible && eligibility.nextEligibleDate">

                <div class="form-check mb-3">                      Next eligible date: {{eligibility.nextEligibleDate | date:'fullDate'}}

                  <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.ageVerification" id="age">                    </small>

                  <label class="form-check-label" for="age">                  </div>

                    I am between 18-65 years old                </div>

                  </label>              </div>

                </div>            </div>

                <div class="form-check mb-3">          </div>

                  <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.bloodPressure" id="bp">

                  <label class="form-check-label" for="bp">          <!-- Pre-Donation Checklist -->

                    My blood pressure is normal          <div class="card mb-4">

                  </label>            <div class="card-header">

                </div>              <h5 class="card-title mb-0">

                <div class="form-check mb-3">                <i class="bi bi-list-check me-2"></i>

                  <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.hemoglobin" id="hemo">                Pre-Donation Checklist

                  <label class="form-check-label" for="hemo">              </h5>

                    My hemoglobin level is adequate            </div>

                  </label>            <div class="card-body">

                </div>              <div class="checklist">

                <div class="form-check mb-3">                <div class="form-check mb-3">

                  <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.noAlcohol" id="alcohol">                  <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.healthCondition" id="health">

                  <label class="form-check-label" for="alcohol">                  <label class="form-check-label" for="health">

                    I have not consumed alcohol in the past 24 hours                    I am in good health and feeling well today

                  </label>                  </label>

                </div>                </div>

                <div class="form-check mb-3">                <div class="form-check mb-3">

                  <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.consentGiven" id="consent">                  <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.weightCheck" id="weight">

                  <label class="form-check-label" for="consent">                  <label class="form-check-label" for="weight">

                    I consent to blood donation and understand the process                    I weigh at least 50kg (110 lbs)

                  </label>                  </label>

                </div>                </div>

              </div>                <div class="form-check mb-3">

            </div>                  <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.ageVerification" id="age">

          </div>                  <label class="form-check-label" for="age">

                    I am between 18-65 years old

          <!-- Action Buttons -->                  </label>

          <div class="card">                </div>

            <div class="card-body">                <div class="form-check mb-3">

              <div class="d-flex justify-content-between">                  <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.bloodPressure" id="bp">

                <button class="btn btn-outline-secondary" (click)="goBack()">                  <label class="form-check-label" for="bp">

                  <i class="bi bi-arrow-left me-2"></i>                    My blood pressure is normal

                  Back to Profile                  </label>

                </button>                </div>

                <button class="btn btn-danger"                 <div class="form-check mb-3">

                        [disabled]="!isReadyToDonate()"                   <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.hemoglobin" id="hemo">

                        (click)="startDonation()">                  <label class="form-check-label" for="hemo">

                  <i class="bi bi-droplet me-2"></i>                    My hemoglobin level is adequate

                  Start Donation                  </label>

                </button>                </div>

              </div>                <div class="form-check mb-3">

            </div>                  <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.noAlcohol" id="alcohol">

          </div>                  <label class="form-check-label" for="alcohol">

                    I have not consumed alcohol in the past 24 hours

          <!-- Loading -->                  </label>

          <div *ngIf="isLoading" class="text-center py-5">                </div>

            <div class="spinner-border text-danger" role="status">                <div class="form-check mb-3">

              <span class="visually-hidden">Loading...</span>                  <input class="form-check-input" type="checkbox" [(ngModel)]="checklist.consentGiven" id="consent">

            </div>                  <label class="form-check-label" for="consent">

          </div>                    I consent to blood donation and understand the process

                  </label>

          <!-- Error Alert -->                </div>

          <div *ngIf="error" class="alert alert-danger mt-3">              </div>

            <i class="bi bi-exclamation-triangle me-2"></i>            </div>

            <strong>Error!</strong> {{error}}          </div>

          </div>

        </div>          <!-- Donation Information -->

      </div>          <div class="card mb-4">

    </div>            <div class="card-header">

  `,              <h5 class="card-title mb-0">

  styles: [`                <i class="bi bi-info-circle me-2"></i>

    .info-card {                Donation Information

      padding: 1rem;              </h5>

      border: 1px solid #dee2e6;            </div>

      border-radius: 8px;            <div class="card-body">

      background-color: #f8f9fa;              <div class="row">

    }                <div class="col-md-4 mb-3">

                  <div class="donation-info-card">

    .form-check-input:checked {                    <i class="bi bi-calendar-event text-primary"></i>

      background-color: #dc3545;                    <h6>Date</h6>

      border-color: #dc3545;                    <p>{{today | date:'fullDate'}}</p>

    }                  </div>

                </div>

    .btn-danger:disabled {                <div class="col-md-4 mb-3">

      opacity: 0.5;                  <div class="donation-info-card">

    }                    <i class="bi bi-clock text-info"></i>

                    <h6>Time</h6>

    .checklist .form-check {                    <p>{{today | date:'shortTime'}}</p>

      padding: 0.75rem;                  </div>

      border: 1px solid #dee2e6;                </div>

      border-radius: 6px;                <div class="col-md-4 mb-3">

      background-color: #f8f9fa;                  <div class="donation-info-card">

    }                    <i class="bi bi-hospital text-success"></i>

                    <h6>Location</h6>

    .alert {                    <p>Blood Bank Center</p>

      border-radius: 8px;                  </div>

    }                </div>

  `]              </div>

})            </div>

export class BloodDonationComponent implements OnInit {          </div>

  donor: Donor | null = null;

  eligibility: DonorEligibility | null = null;          <!-- Action Buttons -->

  isLoading = false;          <div class="card">

  error: string | null = null;            <div class="card-body">

  today = new Date();              <div class="d-flex justify-content-between">

                  <button class="btn btn-outline-secondary" (click)="goBack()">

  checklist = {                  <i class="bi bi-arrow-left me-2"></i>

    healthCondition: false,                  Back to Profile

    weightCheck: false,                </button>

    ageVerification: false,                <div>

    bloodPressure: false,                  <button class="btn btn-outline-info me-2" (click)="checkEligibility()">

    hemoglobin: false,                    <i class="bi bi-shield-check me-2"></i>

    noAlcohol: false,                    Check Eligibility

    consentGiven: false                  </button>

  };                  <button class="btn btn-danger" 

                          [disabled]="!isReadyToDonate()" 

  constructor(                          (click)="startDonation()">

    private route: ActivatedRoute,                    <i class="bi" 

    private router: Router                       [class.bi-droplet]="!isRecording" 

  ) {}                       [class.bi-arrow-repeat]="isRecording"></i>

                    {{isRecording ? 'Processing...' : 'Start Donation'}}

  ngOnInit(): void {                  </button>

    this.loadDonorInfo();                </div>

  }              </div>

            </div>

  private loadDonorInfo(): void {          </div>

    // Mock data for now

    this.donor = {          <!-- Loading -->

      id: 1,          <div *ngIf="isLoading" class="text-center py-5">

      userName: 'John Doe',            <div class="spinner-border text-danger" role="status">

      userEmail: 'john.doe@example.com',              <span class="visually-hidden">Loading...</span>

      bloodGroupDisplay: 'O+',            </div>

      contactInfo: {          </div>

        phone: '+1-555-0123'

      },          <!-- Error Alert -->

      lastDonationDate: new Date('2023-12-15'),          <div *ngIf="error" class="alert alert-danger mt-3">

      daysSinceLastDonation: 90            <i class="bi bi-exclamation-triangle me-2"></i>

    };            <strong>Error!</strong> {{error}}

  }          </div>

        </div>

  isReadyToDonate(): boolean {      </div>

    return Object.values(this.checklist).every(check => check);    </div>

  }  `,

  styles: [`

  startDonation(): void {    .info-card {

    if (this.isReadyToDonate()) {      padding: 1rem;

      this.isLoading = true;      border: 1px solid #dee2e6;

      // Simulate donation process      border-radius: 8px;

      setTimeout(() => {      background-color: #f8f9fa;

        this.isLoading = false;    }

        alert('Donation process started successfully!');

      }, 2000);    .donation-info-card {

    }      text-align: center;

  }      padding: 1.5rem;

      border: 1px solid #dee2e6;

  goBack(): void {      border-radius: 8px;

    this.router.navigate(['../profile', this.donor?.id], { relativeTo: this.route.parent });      background-color: #fff;

  }    }

}
    .donation-info-card i {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .donation-info-card h6 {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .form-check-input:checked {
      background-color: #dc3545;
      border-color: #dc3545;
    }

    .btn-danger:disabled {
      opacity: 0.5;
    }

    .checklist .form-check {
      padding: 0.75rem;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      background-color: #f8f9fa;
    }

    .alert {
      border-radius: 8px;
    }
  `]
})
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