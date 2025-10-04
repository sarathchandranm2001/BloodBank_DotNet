import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipientService } from '../../../services/recipient.service';
import { AuthService } from '../../../services/auth.service';
import { RecipientRegistration } from '../../../models/recipient.model';

@Component({
  selector: 'app-recipient-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container-fluid py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-lg">
            <div class="card-header bg-danger text-white">
              <h4 class="card-title mb-0">
                <i class="bi bi-person-plus-fill me-2"></i>
                Recipient Registration
              </h4>
              <p class="card-text mb-0 mt-2">Register as a blood recipient</p>
            </div>

            <div class="card-body">
              <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
                <!-- Hospital Information -->
                <div class="mb-4">
                  <h5 class="text-primary border-bottom pb-2 mb-3">
                    <i class="bi bi-hospital me-2"></i>Hospital Information
                  </h5>
                  
                  <div class="mb-3">
                    <label for="hospitalName" class="form-label">Hospital Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="hospitalName" 
                           formControlName="hospitalName" placeholder="Enter hospital name"
                           [class.is-invalid]="registrationForm.get('hospitalName')?.invalid && registrationForm.get('hospitalName')?.touched">
                    <div class="invalid-feedback" *ngIf="registrationForm.get('hospitalName')?.hasError('required') && registrationForm.get('hospitalName')?.touched">
                      Hospital name is required
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="doctorName" class="form-label">Doctor Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="doctorName" 
                           formControlName="doctorName" placeholder="Enter attending doctor name"
                           [class.is-invalid]="registrationForm.get('doctorName')?.invalid && registrationForm.get('doctorName')?.touched">
                    <div class="invalid-feedback" *ngIf="registrationForm.get('doctorName')?.hasError('required') && registrationForm.get('doctorName')?.touched">
                      Doctor name is required
                    </div>
                  </div>
                </div>

                <!-- Contact Information -->
                <div class="mb-4" formGroupName="contactInfo">
                  <h5 class="text-primary border-bottom pb-2 mb-3">
                    <i class="bi bi-telephone me-2"></i>Contact Information
                  </h5>
                  
                  <div class="mb-3">
                    <label for="address" class="form-label">Address <span class="text-danger">*</span></label>
                    <textarea class="form-control" id="address" rows="3" 
                              formControlName="address" placeholder="Enter complete address"
                              [class.is-invalid]="registrationForm.get('contactInfo.address')?.invalid && registrationForm.get('contactInfo.address')?.touched"></textarea>
                    <div class="invalid-feedback" *ngIf="registrationForm.get('contactInfo.address')?.hasError('required') && registrationForm.get('contactInfo.address')?.touched">
                      Address is required
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="city" class="form-label">City <span class="text-danger">*</span></label>
                      <input type="text" class="form-control" id="city" 
                             formControlName="city" placeholder="Enter city"
                             [class.is-invalid]="registrationForm.get('contactInfo.city')?.invalid && registrationForm.get('contactInfo.city')?.touched">
                      <div class="invalid-feedback" *ngIf="registrationForm.get('contactInfo.city')?.hasError('required') && registrationForm.get('contactInfo.city')?.touched">
                        City is required
                      </div>
                    </div>

                    <div class="col-md-6 mb-3">
                      <label for="state" class="form-label">State <span class="text-danger">*</span></label>
                      <input type="text" class="form-control" id="state" 
                             formControlName="state" placeholder="Enter state"
                             [class.is-invalid]="registrationForm.get('contactInfo.state')?.invalid && registrationForm.get('contactInfo.state')?.touched">
                      <div class="invalid-feedback" *ngIf="registrationForm.get('contactInfo.state')?.hasError('required') && registrationForm.get('contactInfo.state')?.touched">
                        State is required
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="pinCode" class="form-label">Pin Code <span class="text-danger">*</span></label>
                      <input type="text" class="form-control" id="pinCode" 
                             formControlName="pinCode" placeholder="Enter pin code"
                             [class.is-invalid]="registrationForm.get('contactInfo.pinCode')?.invalid && registrationForm.get('contactInfo.pinCode')?.touched">
                      <div class="invalid-feedback" *ngIf="registrationForm.get('contactInfo.pinCode')?.hasError('required') && registrationForm.get('contactInfo.pinCode')?.touched">
                        Pin code is required
                      </div>
                      <div class="invalid-feedback" *ngIf="registrationForm.get('contactInfo.pinCode')?.hasError('pattern') && registrationForm.get('contactInfo.pinCode')?.touched">
                        Please enter a valid 6-digit pin code
                      </div>
                    </div>

                    <div class="col-md-6 mb-3">
                      <label for="phoneNumber" class="form-label">Phone Number <span class="text-danger">*</span></label>
                      <input type="text" class="form-control" id="phoneNumber" 
                             formControlName="phoneNumber" placeholder="Enter phone number"
                             [class.is-invalid]="registrationForm.get('contactInfo.phoneNumber')?.invalid && registrationForm.get('contactInfo.phoneNumber')?.touched">
                      <div class="invalid-feedback" *ngIf="registrationForm.get('contactInfo.phoneNumber')?.hasError('required') && registrationForm.get('contactInfo.phoneNumber')?.touched">
                        Phone number is required
                      </div>
                      <div class="invalid-feedback" *ngIf="registrationForm.get('contactInfo.phoneNumber')?.hasError('pattern') && registrationForm.get('contactInfo.phoneNumber')?.touched">
                        Please enter a valid 10-digit phone number
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Medical Information -->
                <div class="mb-4">
                  <h5 class="text-primary border-bottom pb-2 mb-3">
                    <i class="bi bi-heart-pulse me-2"></i>Medical Information
                  </h5>
                  
                  <div class="mb-3">
                    <label for="medicalCondition" class="form-label">Medical Condition <span class="text-danger">*</span></label>
                    <textarea class="form-control" id="medicalCondition" rows="4" 
                              formControlName="medicalCondition" placeholder="Describe medical condition requiring blood transfusion"
                              [class.is-invalid]="registrationForm.get('medicalCondition')?.invalid && registrationForm.get('medicalCondition')?.touched"></textarea>
                    <div class="invalid-feedback" *ngIf="registrationForm.get('medicalCondition')?.hasError('required') && registrationForm.get('medicalCondition')?.touched">
                      Medical condition description is required
                    </div>
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="d-flex justify-content-end gap-2">
                  <button type="button" class="btn btn-outline-secondary" (click)="onCancel()">
                    <i class="bi bi-x-circle me-2"></i>Cancel
                  </button>
                  <button type="submit" class="btn btn-danger" 
                          [disabled]="registrationForm.invalid || isLoading">
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i *ngIf="!isLoading" class="bi bi-check-circle me-2"></i>
                    {{ isLoading ? 'Registering...' : 'Register' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RecipientRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private recipientService: RecipientService,
    private authService: AuthService,
    private router: Router
  ) {
    this.registrationForm = this.createForm();
  }

  ngOnInit(): void {
    // Check if user is already a registered recipient
    this.checkExistingRegistration();
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

  private checkExistingRegistration(): void {
    this.recipientService.getRecipientProfile().subscribe({
      next: (recipient) => {
        if (recipient) {
          this.showMessage('You are already registered as a recipient');
          this.router.navigate(['/recipient/profile']);
        }
      },
      error: () => {
        // User is not registered, continue with registration
      }
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.showMessage('Please login first');
        this.router.navigate(['/auth/login']);
        return;
      }

      const formValue = this.registrationForm.value;
      
      const registrationData: RecipientRegistration = {
        userId: currentUser.userId,
        hospitalName: formValue.hospitalName,
        doctorName: formValue.doctorName,
        medicalCondition: formValue.medicalCondition,
        contactInfo: {
          phone: formValue.contactInfo.phoneNumber, // Map phoneNumber to phone
          address: formValue.contactInfo.address,
          city: formValue.contactInfo.city,
          state: formValue.contactInfo.state,
          zipCode: formValue.contactInfo.pinCode, // Map pinCode to zipCode
          country: 'USA' // Default country
        }
      };

      this.recipientService.registerRecipient(registrationData).subscribe({
        next: (recipient) => {
          this.showMessage('Registration successful!');
          this.router.navigate(['/recipient/profile']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.showMessage(error.error?.message || 'Registration failed. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.registrationForm);
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  private showMessage(message: string): void {
    alert(message);
  }
}