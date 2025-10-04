import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DonorService } from '../../../services/donor.service';
import { Donor, DonorUpdate } from '../../../models/donor.model';
import { BloodGroupNames } from '../../../models/common.model';

@Component({
  selector: 'app-donor-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <!-- Profile Information -->
        <div class="col-lg-8">
          <div class="card shadow">
            <div class="card-header bg-danger text-white">
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <i class="bi bi-person-circle me-2"></i>
                  <h4 class="mb-0">Donor Profile</h4>
                </div>
                <button class="btn btn-outline-light btn-sm" (click)="toggleEdit()" *ngIf="!editMode">
                  <i class="bi bi-pencil me-1"></i>Edit Profile
                </button>
              </div>
            </div>
            
            <div class="card-body" *ngIf="donor">
              <form [formGroup]="profileForm" (ngSubmit)="onSave()" *ngIf="editMode; else viewMode">
                
                <!-- Contact Information -->
                <div class="mb-4">
                  <h5 class="text-danger border-bottom pb-2 mb-3">
                    <i class="bi bi-telephone me-2"></i>Contact Information
                  </h5>
                  
                  <div formGroupName="contactInfo">
                    <div class="mb-3">
                      <label for="phone" class="form-label">Phone Number</label>
                      <input type="tel" class="form-control" id="phone" formControlName="phone">
                    </div>

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
                        <label for="zipCode" class="form-label">ZIP Code</label>
                        <input type="text" class="form-control" id="zipCode" formControlName="zipCode">
                      </div>
                      <div class="col-md-6 mb-3">
                        <label for="country" class="form-label">Country</label>
                        <input type="text" class="form-control" id="country" formControlName="country">
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Medical History -->
                <div class="mb-4">
                  <h5 class="text-danger border-bottom pb-2 mb-3">
                    <i class="bi bi-clipboard-heart me-2"></i>Medical Information
                  </h5>
                  
                  <div class="mb-3">
                    <label for="medicalHistory" class="form-label">Medical History</label>
                    <textarea class="form-control" id="medicalHistory" rows="4" 
                              formControlName="medicalHistory" 
                              placeholder="Any medications, conditions, or health information"></textarea>
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-danger" [disabled]="!profileForm.valid || isLoading">
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <i class="bi bi-check-lg me-2" *ngIf="!isLoading"></i>
                    {{isLoading ? 'Saving...' : 'Save Changes'}}
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="cancelEdit()">
                    <i class="bi bi-x-lg me-2"></i>Cancel
                  </button>
                </div>
              </form>

              <!-- View Mode -->
              <ng-template #viewMode>
                <!-- Basic Information -->
                <div class="mb-4">
                  <h5 class="text-danger border-bottom pb-2 mb-3">
                    <i class="bi bi-person me-2"></i>Basic Information
                  </h5>
                  
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label text-muted">Name</label>
                      <p class="fw-semibold">{{donor.userName}}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label text-muted">Email</label>
                      <p class="fw-semibold">{{donor.userEmail}}</p>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label text-muted">Blood Group</label>
                      <p class="fw-semibold">
                        <span class="badge bg-danger fs-6">{{getBloodGroupName(donor.bloodGroup)}}</span>
                      </p>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label text-muted">Last Donation</label>
                      <p class="fw-semibold">
                        {{donor.lastDonationDate | date:'mediumDate' || 'No previous donations'}}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Contact Information -->
                <div class="mb-4">
                  <h5 class="text-danger border-bottom pb-2 mb-3">
                    <i class="bi bi-telephone me-2"></i>Contact Information
                  </h5>
                  
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label text-muted">Phone</label>
                      <p class="fw-semibold">{{donor.contactInfo.phone}}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label text-muted">Address</label>
                      <p class="fw-semibold">{{donor.contactInfo.address}}</p>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-4 mb-3">
                      <label class="form-label text-muted">City</label>
                      <p class="fw-semibold">{{donor.contactInfo.city}}</p>
                    </div>
                    <div class="col-md-4 mb-3">
                      <label class="form-label text-muted">State</label>
                      <p class="fw-semibold">{{donor.contactInfo.state}}</p>
                    </div>
                    <div class="col-md-4 mb-3">
                      <label class="form-label text-muted">ZIP Code</label>
                      <p class="fw-semibold">{{donor.contactInfo.zipCode}}</p>
                    </div>
                  </div>
                </div>

                <!-- Medical Information -->
                <div class="mb-4">
                  <h5 class="text-danger border-bottom pb-2 mb-3">
                    <i class="bi bi-clipboard-heart me-2"></i>Medical Information
                  </h5>
                  
                  <div class="mb-3">
                    <label class="form-label text-muted">Medical History</label>
                    <p class="fw-semibold">{{donor.medicalHistory || 'No medical history provided'}}</p>
                  </div>
                </div>
              </ng-template>
            </div>
          </div>
        </div>

        <!-- Donation Status -->
        <div class="col-lg-4">
          <div class="card shadow" *ngIf="donor">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">
                <i class="bi bi-activity me-2"></i>Donation Status
              </h5>
            </div>
            <div class="card-body">
              <div class="text-center mb-3">
                <div class="display-6 mb-2" [class]="donor.isEligibleToDonate ? 'text-success' : 'text-warning'">
                  <i [class]="donor.isEligibleToDonate ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill'"></i>
                </div>
                <h6 [class]="donor.isEligibleToDonate ? 'text-success' : 'text-warning'">
                  {{donor.isEligibleToDonate ? 'Eligible to Donate' : 'Not Eligible'}}
                </h6>
              </div>

              <div class="mb-3" *ngIf="!donor.isEligibleToDonate && donor.nextEligibleDonationDate">
                <small class="text-muted">Next eligible date:</small>
                <p class="fw-semibold">{{donor.nextEligibleDonationDate | date:'mediumDate'}}</p>
              </div>

              <div class="mb-3">
                <small class="text-muted">Days since last donation:</small>
                <p class="fw-semibold">{{donor.daysSinceLastDonation}} days</p>
              </div>

              <div class="d-grid">
                <button class="btn btn-success" [disabled]="!donor.isEligibleToDonate" (click)="scheduleDonation()">
                  <i class="bi bi-calendar-plus me-2"></i>
                  Schedule Donation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      border-radius: 10px;
    }
    
    .card-header {
      border-radius: 10px 10px 0 0 !important;
    }
    
    .form-control:focus,
    .form-select:focus {
      border-color: #dc3545;
      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
    
    .btn-danger {
      background: linear-gradient(45deg, #dc3545, #c82333);
      border: none;
    }
    
    .btn-danger:hover {
      background: linear-gradient(45deg, #c82333, #a71e2a);
      transform: translateY(-1px);
    }
    
    .text-danger {
      color: #dc3545 !important;
    }
    
    .border-bottom {
      border-color: #dc3545 !important;
    }
    
    .badge {
      font-size: 0.9em !important;
    }
  `]
})
export class DonorProfileComponent implements OnInit {
  donor: Donor | null = null;
  profileForm!: FormGroup;
  editMode = false;
  isLoading = false;

  constructor(
    private donorService: DonorService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadDonorProfile();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      contactInfo: this.fb.group({
        phone: ['', [Validators.required]],
        address: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zipCode: ['', [Validators.required]],
        country: ['', [Validators.required]]
      }),
      medicalHistory: ['']
    });
  }

  loadDonorProfile(): void {
    this.donorService.getDonorProfile().subscribe({
      next: (donor) => {
        this.donor = donor;
        this.populateForm();
      },
      error: (error) => {
        if (error.status === 404) {
          this.showMessage('Donor profile not found. Please register first.');
          this.router.navigate(['/donor/register']);
        } else {
          this.showMessage('Error loading profile. Please try again.');
        }
      }
    });
  }

  populateForm(): void {
    if (this.donor) {
      this.profileForm.patchValue({
        contactInfo: {
          phone: this.donor.contactInfo.phone,
          address: this.donor.contactInfo.address,
          city: this.donor.contactInfo.city,
          state: this.donor.contactInfo.state,
          zipCode: this.donor.contactInfo.zipCode,
          country: this.donor.contactInfo.country
        },
        medicalHistory: this.donor.medicalHistory
      });
    }
  }

  toggleEdit(): void {
    this.editMode = true;
    this.populateForm();
  }

  cancelEdit(): void {
    this.editMode = false;
    this.populateForm();
  }

  onSave(): void {
    if (this.profileForm.valid && this.donor) {
      this.isLoading = true;
      
      const formValue = this.profileForm.value;
      const updateData: DonorUpdate = {
        contactInfo: {
          phone: formValue.contactInfo.phone,
          address: formValue.contactInfo.address,
          city: formValue.contactInfo.city,
          state: formValue.contactInfo.state,
          zipCode: formValue.contactInfo.zipCode,
          country: formValue.contactInfo.country
        },
        medicalHistory: formValue.medicalHistory
      };

      this.donorService.updateDonor(this.donor.donorId, updateData).subscribe({
        next: () => {
          this.showMessage('Profile updated successfully!');
          this.editMode = false;
          this.loadDonorProfile(); // Reload to get updated data
        },
        error: (error) => {
          console.error('Update failed:', error);
          this.showMessage(error.error?.message || 'Update failed. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  scheduleDonation(): void {
    // TODO: Implement donation scheduling
    this.showMessage('Donation scheduling feature coming soon!');
  }

  getBloodGroupName(bloodGroup: number): string {
    return BloodGroupNames[bloodGroup as keyof typeof BloodGroupNames] || 'Unknown';
  }

  private showMessage(message: string): void {
    alert(message);
  }
}