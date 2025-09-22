import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DonorService } from '../../../../services/donor.service';
import { UserService } from '../../../../services/user.service';
import { DonorRegistration } from '../../../../models/donor.model';
import { BloodGroup, BloodGroupNames } from '../../../../models/common.model';
import { User, UserRole } from '../../../../models/user.model';

@Component({
  selector: 'app-donor-registration',
  template: `
  
    <div class="container mt-4">
      <div class="row">
        <!-- Main Registration Form -->
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header bg-primary text-white d-flex align-items-center">
              <i class="bi bi-person-plus me-2"></i>
              <h5 class="mb-0">Register New Donor</h5>
            </div>
            <div class="card-body">
              <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
                
                <!-- User Selection -->
                <div class="mb-3">
                  <label for="userId" class="form-label">Select User <span class="text-danger">*</span></label>
                  <select 
                    class="form-select" 
                    id="userId" 
                    formControlName="userId"
                    [class.is-invalid]="registrationForm.get('userId')?.invalid && registrationForm.get('userId')?.touched">
                    <option value="">Select a user</option>
                    <option *ngFor="let user of users" [value]="user.userId">
                      {{user.name}} ({{user.email}})
                    </option>
                  </select>
                  <div class="invalid-feedback" *ngIf="registrationForm.get('userId')?.hasError('required') && registrationForm.get('userId')?.touched">
                    Please select a user
                  </div>
                </div>

                <!-- Blood Group Selection -->
                <div class="mb-3">
                  <label for="bloodGroup" class="form-label">Blood Group <span class="text-danger">*</span></label>
                  <select 
                    class="form-select" 
                    id="bloodGroup" 
                    formControlName="bloodGroup"
                    [class.is-invalid]="registrationForm.get('bloodGroup')?.invalid && registrationForm.get('bloodGroup')?.touched">
                    <option value="">Select blood group</option>
                    <option *ngFor="let group of bloodGroups" [value]="group.value">
                      {{group.label}}
                    </option>
                  </select>
                  <div class="invalid-feedback" *ngIf="registrationForm.get('bloodGroup')?.hasError('required') && registrationForm.get('bloodGroup')?.touched">
                    Please select blood group
                  </div>
                </div>

                <!-- Last Donation Date (Optional) -->
                <div class="mb-3">
                  <label for="lastDonationDate" class="form-label">Last Donation Date (if any)</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="lastDonationDate" 
                    formControlName="lastDonationDate">
                  <div class="form-text">Leave empty if this is the first donation</div>
                </div>

                <!-- Contact Information -->
                <div class="border rounded p-3 mb-3">
                  <h6 class="text-primary mb-3">
                    <i class="bi bi-telephone me-2"></i>Contact Information
                  </h6>
                  
                  <div class="mb-3">
                    <label for="phone" class="form-label">Phone Number <span class="text-danger">*</span></label>
                    <input 
                      type="tel" 
                      class="form-control" 
                      id="phone" 
                      formControlName="phone"
                      [class.is-invalid]="registrationForm.get('phone')?.invalid && registrationForm.get('phone')?.touched">
                    <div class="invalid-feedback" *ngIf="registrationForm.get('phone')?.hasError('required') && registrationForm.get('phone')?.touched">
                      Phone number is required
                    </div>
                    <div class="invalid-feedback" *ngIf="registrationForm.get('phone')?.hasError('pattern') && registrationForm.get('phone')?.touched">
                      Please enter a valid phone number
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="address" class="form-label">Address <span class="text-danger">*</span></label>
                    <textarea 
                      class="form-control" 
                      id="address" 
                      rows="3" 
                      formControlName="address"
                      [class.is-invalid]="registrationForm.get('address')?.invalid && registrationForm.get('address')?.touched"></textarea>
                    <div class="invalid-feedback" *ngIf="registrationForm.get('address')?.hasError('required') && registrationForm.get('address')?.touched">
                      Address is required
                    </div>
                  </div>
                </div>

                <!-- Medical History -->
                <div class="mb-3">
                  <label for="medicalHistory" class="form-label">Medical History</label>
                  <textarea 
                    class="form-control" 
                    id="medicalHistory" 
                    rows="4" 
                    formControlName="medicalHistory"
                    placeholder="Enter any relevant medical history, allergies, medications, etc."></textarea>
                  <div class="form-text">Include any medical conditions, current medications, allergies, or previous surgeries</div>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex justify-content-end gap-2">
                  <button type="button" class="btn btn-outline-secondary" (click)="onCancel()">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="registrationForm.invalid || isSubmitting">
                    <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i *ngIf="!isSubmitting" class="bi bi-save me-2"></i>
                    {{isSubmitting ? 'Registering...' : 'Register Donor'}}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Registration Guidelines -->
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header bg-light d-flex align-items-center">
              <i class="bi bi-info-circle me-2"></i>
              <h6 class="mb-0">Donor Registration Guidelines</h6>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex align-items-center">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <span>Donor must be between 18-65 years old</span>
                </li>
                <li class="list-group-item d-flex align-items-center">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <span>Weight should be at least 50 kg</span>
                </li>
                <li class="list-group-item d-flex align-items-center">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <span>Must be in good health condition</span>
                </li>
                <li class="list-group-item d-flex align-items-center">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <span>No blood donation in the last 56 days</span>
                </li>
                <li class="list-group-item d-flex align-items-center">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  <span>Complete medical history is required</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      border: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .card-header {
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .form-label {
      font-weight: 500;
    }
    
    .border {
      border: 1px solid #dee2e6 !important;
    }
    
    .text-primary {
      color: #0d6efd !important;
    }
    
    .btn {
      border-radius: 0.375rem;
    }
    
    .form-control, .form-select {
      border-radius: 0.375rem;
    }
    
    .list-group-item {
      border: none;
      padding: 0.75rem 0;
    }
  `]
})
export class DonorRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  users: User[] = [];
  isSubmitting = false;

  bloodGroups = [
    { value: BloodGroup.APositive, label: BloodGroupNames[BloodGroup.APositive] },
    { value: BloodGroup.ANegative, label: BloodGroupNames[BloodGroup.ANegative] },
    { value: BloodGroup.BPositive, label: BloodGroupNames[BloodGroup.BPositive] },
    { value: BloodGroup.BNegative, label: BloodGroupNames[BloodGroup.BNegative] },
    { value: BloodGroup.ABPositive, label: BloodGroupNames[BloodGroup.ABPositive] },
    { value: BloodGroup.ABNegative, label: BloodGroupNames[BloodGroup.ABNegative] },
    { value: BloodGroup.OPositive, label: BloodGroupNames[BloodGroup.OPositive] },
    { value: BloodGroup.ONegative, label: BloodGroupNames[BloodGroup.ONegative] }
  ];

  constructor(
    private fb: FormBuilder,
    private donorService: DonorService,
    private userService: UserService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  createForm(): void {
    this.registrationForm = this.fb.group({
      userId: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      lastDonationDate: [''],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[\d\s\-\(\)]+$/)]],
      address: ['', Validators.required],
      medicalHistory: ['']
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        // Filter out users who are already donors
        this.users = users.filter(user => user.role !== UserRole.Donor);
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        // You might want to show a Bootstrap alert here instead
        alert('Error loading users');
      }
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isSubmitting = true;
      
      const formValue = this.registrationForm.value;
      const donorData: DonorRegistration = {
        userId: formValue.userId,
        bloodGroup: formValue.bloodGroup,
        lastDonationDate: formValue.lastDonationDate,
        contactInfo: {
          phone: formValue.phone,
          address: formValue.address,
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        medicalHistory: formValue.medicalHistory
      };

      this.donorService.registerDonor(donorData).subscribe({
        next: (donor) => {
          // You might want to show a Bootstrap toast or alert here
          alert('Donor registered successfully!');
          this.router.navigate(['/donors/profile', donor.donorId]);
        },
        error: (error) => {
          console.error('Error registering donor:', error);
          // You might want to show a Bootstrap alert here
          alert('Error registering donor. Please try again.');
          this.isSubmitting = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/donors']);
  }
}