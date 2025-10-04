import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipientService } from '../../../services/recipient.service';
import { Recipient, RecipientUpdate } from '../../../models/recipient.model';

@Component({
  selector: 'app-recipient-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container-fluid py-4" *ngIf="recipient || (!recipient && !isLoading)">
      <!-- Profile Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card bg-gradient text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h1 class="card-title mb-2" *ngIf="recipient">{{ recipient.userName }}</h1>
                  <h1 class="card-title mb-2" *ngIf="!recipient">Complete Your Profile</h1>
                  <p class="card-text mb-2" *ngIf="recipient">{{ recipient.userEmail }}</p>
                  <p class="card-text mb-2" *ngIf="!recipient">Register as a blood recipient to make requests</p>
                  <div class="d-flex gap-2" *ngIf="recipient">
                    <span class="badge bg-light text-dark">Total Requests: {{ recipient.totalRequests || 0 }}</span>
                    <span class="badge bg-warning text-dark">Pending: {{ recipient.pendingRequests || 0 }}</span>
                  </div>
                </div>
                <div *ngIf="recipient">
                  <button class="btn btn-light btn-lg" (click)="toggleEdit()">
                    <i class="bi" [ngClass]="isEditing ? 'bi-x-circle' : 'bi-pencil'"></i>
                    {{ isEditing ? 'Cancel' : 'Edit Profile' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Left Column - Profile Details -->
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-person-circle me-2"></i>
                Profile Details
              </h5>
            </div>
            <div class="card-body">
              <!-- Edit Form -->
              <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()" *ngIf="isEditing">
                <!-- Hospital Information -->
                <div class="mb-4">
                  <h6 class="text-primary border-bottom pb-2 mb-3">
                    <i class="bi bi-hospital me-2"></i>Hospital Information
                  </h6>
                  
                  <div class="mb-3">
                    <label for="hospitalName" class="form-label">Hospital Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="hospitalName" 
                           formControlName="hospitalName"
                           [class.is-invalid]="profileForm.get('hospitalName')?.invalid && profileForm.get('hospitalName')?.touched">
                    <div class="invalid-feedback" *ngIf="profileForm.get('hospitalName')?.hasError('required') && profileForm.get('hospitalName')?.touched">
                      Hospital name is required
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="doctorName" class="form-label">Doctor Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="doctorName" 
                           formControlName="doctorName"
                           [class.is-invalid]="profileForm.get('doctorName')?.invalid && profileForm.get('doctorName')?.touched">
                    <div class="invalid-feedback" *ngIf="profileForm.get('doctorName')?.hasError('required') && profileForm.get('doctorName')?.touched">
                      Doctor name is required
                    </div>
                  </div>
                </div>

                <!-- Contact Information -->
                <div class="mb-4" formGroupName="contactInfo">
                  <h6 class="text-primary border-bottom pb-2 mb-3">
                    <i class="bi bi-telephone me-2"></i>Contact Information
                  </h6>
                  
                  <div class="mb-3">
                    <label for="address" class="form-label">Address</label>
                    <textarea class="form-control" id="address" rows="3" formControlName="address"></textarea>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="city" class="form-label">City</label>
                      <input type="text" class="form-control" id="city" formControlName="city">
                    </div>
                    <div class="col-md-6 mb-3">
                      <label for="state" class="form-label">State</label>
                      <input type="text" class="form-control" id="state" formControlName="state">
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="pinCode" class="form-label">Pin Code</label>
                      <input type="text" class="form-control" id="pinCode" formControlName="pinCode">
                    </div>
                    <div class="col-md-6 mb-3">
                      <label for="phoneNumber" class="form-label">Phone Number</label>
                      <input type="text" class="form-control" id="phoneNumber" formControlName="phoneNumber">
                    </div>
                  </div>
                </div>

                <!-- Medical Information -->
                <div class="mb-4">
                  <h6 class="text-primary border-bottom pb-2 mb-3">
                    <i class="bi bi-heart-pulse me-2"></i>Medical Information
                  </h6>
                  
                  <div class="mb-3">
                    <label for="medicalCondition" class="form-label">Medical Condition</label>
                    <textarea class="form-control" id="medicalCondition" rows="4" formControlName="medicalCondition"></textarea>
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="d-flex justify-content-end gap-2">
                  <button type="button" class="btn btn-outline-secondary" (click)="cancelEdit()">
                    <i class="bi bi-x-circle me-2"></i>Cancel
                  </button>
                  <button type="submit" class="btn btn-primary" [disabled]="profileForm.invalid || isLoading">
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i *ngIf="!isLoading" class="bi bi-check-circle me-2"></i>
                    {{ isLoading ? (recipient ? 'Updating...' : 'Registering...') : (recipient ? 'Update Profile' : 'Register Profile') }}
                  </button>
                </div>
              </form>

              <!-- View Mode -->
              <div *ngIf="!isEditing">
                <!-- Hospital Information -->
                <div class="mb-4">
                  <h6 class="text-primary border-bottom pb-2 mb-3">
                    <i class="bi bi-hospital me-2"></i>Hospital Information
                  </h6>
                  <div class="row">
                    <div class="col-sm-3"><strong>Hospital:</strong></div>
                    <div class="col-sm-9">{{ recipient?.hospitalName }}</div>
                  </div>
                  <div class="row mt-2">
                    <div class="col-sm-3"><strong>Doctor:</strong></div>
                    <div class="col-sm-9">{{ recipient?.doctorName }}</div>
                  </div>
                </div>

                <hr>

                <!-- Contact Information -->
                <div class="mb-4">
                  <h6 class="text-primary border-bottom pb-2 mb-3">
                    <i class="bi bi-telephone me-2"></i>Contact Information
                  </h6>
                  <div class="row mb-2">
                    <div class="col-sm-3"><strong>Address:</strong></div>
                    <div class="col-sm-9">{{ recipient?.contactInfo?.address }}</div>
                  </div>
                  <div class="row mb-2">
                    <div class="col-sm-3"><strong>City:</strong></div>
                    <div class="col-sm-9">{{ recipient?.contactInfo?.city }}</div>
                  </div>
                  <div class="row mb-2">
                    <div class="col-sm-3"><strong>State:</strong></div>
                    <div class="col-sm-9">{{ recipient?.contactInfo?.state }}</div>
                  </div>
                  <div class="row mb-2">
                    <div class="col-sm-3"><strong>Pin Code:</strong></div>
                    <div class="col-sm-9">{{ recipient?.contactInfo?.pinCode }}</div>
                  </div>
                  <div class="row mb-2">
                    <div class="col-sm-3"><strong>Phone:</strong></div>
                    <div class="col-sm-9">{{ recipient?.contactInfo?.phoneNumber }}</div>
                  </div>
                </div>

                <hr>

                <!-- Medical Information -->
                <div class="mb-4">
                  <h6 class="text-primary border-bottom pb-2 mb-3">
                    <i class="bi bi-heart-pulse me-2"></i>Medical Information
                  </h6>
                  <div class="row">
                    <div class="col-sm-3"><strong>Medical Condition:</strong></div>
                    <div class="col-sm-9">
                      <p class="mb-0 text-break">{{ recipient?.medicalCondition }}</p>
                    </div>
                  </div>
                </div>

                <hr>

                <!-- Registration Details -->
                <div class="mb-4">
                  <h6 class="text-primary border-bottom pb-2 mb-3">
                    <i class="bi bi-calendar me-2"></i>Registration Details
                  </h6>
                  <div class="row mb-2">
                    <div class="col-sm-3"><strong>Registered On:</strong></div>
                    <div class="col-sm-9">{{ recipient?.createdAt | date:'medium' }}</div>
                  </div>
                  <div class="row" *ngIf="recipient?.updatedAt">
                    <div class="col-sm-3"><strong>Last Updated:</strong></div>
                    <div class="col-sm-9">{{ recipient?.updatedAt | date:'medium' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Quick Actions -->
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-lightning me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <a class="btn btn-danger btn-lg" routerLink="/recipient/request-blood">
                  <i class="bi bi-plus-circle-fill me-2"></i>
                  New Blood Request
                </a>
                
                <a class="btn btn-outline-primary" routerLink="/recipient/my-requests">
                  <i class="bi bi-list-ul me-2"></i>
                  My Requests
                </a>
                
                <a class="btn btn-outline-success" routerLink="/recipient/blood-availability">
                  <i class="bi bi-search me-2"></i>
                  Check Availability
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div class="text-center py-5" *ngIf="!recipient && isLoading">
      <div class="spinner-border text-primary me-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mb-0">Loading profile...</p>
    </div>
  `,
  styles: [`
    .bg-gradient {
      background: linear-gradient(135deg, #dc3545 0%, #6f42c1 100%);
    }

    .header-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .profile-info h1 {
      margin: 0 0 5px 0;
      font-size: 2rem;
    }

    .profile-info .email {
      margin: 0 0 15px 0;
      opacity: 0.9;
    }

    .stats {
      margin-top: 15px;
    }

    .profile-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
    }

    .form-section {
      margin-bottom: 25px;
    }

    .form-section h3 {
      color: #333;
      margin-bottom: 15px;
      border-bottom: 2px solid #e91e63;
      padding-bottom: 5px;
    }

    .form-row {
      display: flex;
      gap: 15px;
    }

    .full-width {
      width: 100%;
    }

    .half-width {
      flex: 1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 20px;
    }

    .view-mode {
      padding: 10px 0;
    }

    .info-section {
      margin: 20px 0;
    }

    .info-section h3 {
      color: #333;
      margin-bottom: 15px;
      border-bottom: 2px solid #e91e63;
      padding-bottom: 5px;
    }

    .info-item {
      margin-bottom: 10px;
      display: flex;
      align-items: flex-start;
    }

    .info-item strong {
      min-width: 150px;
      color: #666;
    }

    .medical-condition {
      margin: 5px 0 0 0;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .actions-card {
      position: sticky;
      top: 20px;
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .quick-actions button {
      width: 100%;
      height: 48px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50vh;
    }

    .spinner-border {
      margin-right: 10px;
    }

    @media (max-width: 768px) {
      .profile-content {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }

      .form-row {
        flex-direction: column;
        gap: 10px;
      }

      .actions-card {
        position: static;
      }
    }
  `]
})
export class RecipientProfileComponent implements OnInit {
  recipient: Recipient | null = null;
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private recipientService: RecipientService
  ) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      hospitalName: ['', [Validators.required, Validators.minLength(2)]],
      doctorName: ['', [Validators.required, Validators.minLength(2)]],
      contactInfo: this.fb.group({
        address: ['', [Validators.required, Validators.minLength(10)]],
        city: ['', [Validators.required, Validators.minLength(2)]],
        state: ['', [Validators.required, Validators.minLength(2)]],
        pinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
      }),
      medicalCondition: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadProfile(): void {
    this.isLoading = true;
    this.recipientService.getRecipientProfile().subscribe({
      next: (recipient: Recipient) => {
        this.recipient = recipient;
        this.populateForm();
      },
      error: (error: any) => {
        console.error('Failed to load profile:', error);
        if (error.status === 404) {
          // No profile exists - this is a new user who needs to register
          console.log('No recipient profile found - user needs to register');
          this.recipient = null;
          this.isEditing = true; // Show form for new registration
        } else {
          this.showMessage('Failed to load profile');
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private populateForm(): void {
    if (this.recipient) {
      this.profileForm.patchValue({
        hospitalName: this.recipient.hospitalName,
        doctorName: this.recipient.doctorName,
        contactInfo: this.recipient.contactInfo,
        medicalCondition: this.recipient.medicalCondition
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.populateForm(); // Reset form
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.populateForm(); // Reset form
  }

  onUpdateProfile(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      
      if (this.recipient) {
        // Update existing profile
        const updateData: RecipientUpdate = this.profileForm.value;

        this.recipientService.updateRecipientProfile(updateData).subscribe({
          next: (recipient: Recipient) => {
            this.recipient = recipient;
            this.isEditing = false;
            this.showMessage('Profile updated successfully!');
          },
          error: (error: any) => {
            console.error('Profile update failed:', error);
            this.showMessage(error.error?.message || 'Profile update failed');
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      } else {
        // Register new profile
        const formValue = this.profileForm.value;
        const registrationData = {
          userId: 0, // Backend will get the actual userId from JWT token
          hospitalName: formValue.hospitalName,
          doctorName: formValue.doctorName,
          contactInfo: {
            address: formValue.contactInfo.address,
            city: formValue.contactInfo.city,
            state: formValue.contactInfo.state,
            zipCode: formValue.contactInfo.pinCode,
            phone: formValue.contactInfo.phoneNumber,
            country: 'India' // Default country
          },
          medicalCondition: formValue.medicalCondition
        };

        this.recipientService.registerRecipient(registrationData).subscribe({
          next: (recipient: Recipient) => {
            this.recipient = recipient;
            this.isEditing = false;
            this.showMessage('Profile registered successfully! You can now make blood requests.');
          },
          error: (error: any) => {
            console.error('Profile registration failed:', error);
            this.showMessage(error.error?.message || 'Profile registration failed');
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      }
    }
  }

  private showMessage(message: string): void {
    alert(message);
  }
}