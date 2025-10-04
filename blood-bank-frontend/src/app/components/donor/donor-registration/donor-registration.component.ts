import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DonorService } from '../../../services/donor.service';
import { AuthService } from '../../../services/auth.service';
import { DonorRegistration } from '../../../models/donor.model';
import { BloodGroup, BloodGroupNames } from '../../../models/common.model';


interface DonorRegistrationForm {
  userId: number;
  bloodGroup: BloodGroup;
  lastDonationDate?: Date;
  contactInfo: {
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  medicalHistory: string;
}

@Component({
  selector: 'app-donor-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow">
            <div class="card-header bg-danger text-white">
              <div class="d-flex align-items-center">
                <i class="bi bi-heart-fill me-2"></i>
                <h4 class="mb-0">Donor Registration</h4>
              </div>
              <small class="text-white-50">Register to become a blood donor and save lives</small>
            </div>
            
            <div class="card-body">
              <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
                
                <!-- Blood Group Section -->
                <div class="mb-4">
                  <h5 class="text-danger border-bottom pb-2 mb-3">
                    <i class="bi bi-droplet me-2"></i>Blood Information
                  </h5>
                  
                  <div class="mb-3">
                    <label for="bloodGroup" class="form-label">Blood Group <span class="text-danger">*</span></label>
                    <select class="form-select" id="bloodGroup" formControlName="bloodGroup"
                            [class.is-invalid]="registrationForm.get('bloodGroup')?.invalid && registrationForm.get('bloodGroup')?.touched">
                      <option value="">Select your blood group</option>
                      <option *ngFor="let bg of bloodGroups" [value]="bg.value">{{bg.name}}</option>
                    </select>
                    <div class="invalid-feedback" *ngIf="registrationForm.get('bloodGroup')?.hasError('required') && registrationForm.get('bloodGroup')?.touched">
                      Please select your blood group
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="lastDonationDate" class="form-label">Last Donation Date (if any)</label>
                    <input type="date" class="form-control" id="lastDonationDate" 
                           formControlName="lastDonationDate"
                           [max]="today">
                    <small class="form-text text-muted">Leave blank if you're a first-time donor</small>
                  </div>
                </div>

                <!-- Contact Information Section -->
                <div class="mb-4">
                  <h5 class="text-danger border-bottom pb-2 mb-3">
                    <i class="bi bi-telephone me-2"></i>Contact Information
                  </h5>
                  
                  <div formGroupName="contactInfo">
                    <div class="mb-3">
                      <label for="phoneNumber" class="form-label">Phone Number <span class="text-danger">*</span></label>
                      <input type="tel" class="form-control" id="phoneNumber" 
                             formControlName="phoneNumber" placeholder="Enter phone number"
                             [class.is-invalid]="registrationForm.get('contactInfo.phoneNumber')?.invalid && registrationForm.get('contactInfo.phoneNumber')?.touched">
                      <div class="invalid-feedback" *ngIf="registrationForm.get('contactInfo.phoneNumber')?.hasError('required') && registrationForm.get('contactInfo.phoneNumber')?.touched">
                        Phone number is required
                      </div>
                    </div>

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
                        <label for="pinCode" class="form-label">ZIP Code <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="pinCode" 
                               formControlName="pinCode" placeholder="Enter ZIP code"
                               [class.is-invalid]="registrationForm.get('contactInfo.pinCode')?.invalid && registrationForm.get('contactInfo.pinCode')?.touched">
                        <div class="invalid-feedback" *ngIf="registrationForm.get('contactInfo.pinCode')?.hasError('required') && registrationForm.get('contactInfo.pinCode')?.touched">
                          ZIP code is required
                        </div>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label for="country" class="form-label">Country <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="country" 
                               formControlName="country" placeholder="Enter country"
                               [class.is-invalid]="registrationForm.get('contactInfo.country')?.invalid && registrationForm.get('contactInfo.country')?.touched">
                        <div class="invalid-feedback" *ngIf="registrationForm.get('contactInfo.country')?.hasError('required') && registrationForm.get('contactInfo.country')?.touched">
                          Country is required
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Medical History Section -->
                <div class="mb-4">
                  <h5 class="text-danger border-bottom pb-2 mb-3">
                    <i class="bi bi-clipboard-heart me-2"></i>Medical Information
                  </h5>
                  
                  <div class="mb-3">
                    <label for="medicalHistory" class="form-label">Medical History</label>
                    <textarea class="form-control" id="medicalHistory" rows="4" 
                              formControlName="medicalHistory" 
                              placeholder="Please provide any relevant medical history, medications, or conditions (optional)"></textarea>
                    <small class="form-text text-muted">
                      Include any medications, chronic conditions, recent surgeries, or other health information that may affect donation eligibility
                    </small>
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-danger" [disabled]="!registrationForm.valid || isLoading">
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i class="bi bi-heart-fill me-2" *ngIf="!isLoading"></i>
                    {{isLoading ? 'Registering...' : 'Register as Donor'}}
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="onCancel()">
                    <i class="bi bi-x-lg me-2"></i>Cancel
                  </button>
                  <button type="button" class="btn btn-info" (click)="testDebug()">
                    <i class="bi bi-bug me-2"></i>Test Debug
                  </button>
                </div>
              </form>
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
    
    .is-invalid {
      border-color: #dc3545;
    }
    
    .invalid-feedback {
      color: #dc3545;
    }
  `]
})
export class DonorRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  isLoading = false;
  today = new Date().toISOString().split('T')[0];
  
  bloodGroups = [
    { value: BloodGroup.APositive, name: BloodGroupNames[BloodGroup.APositive] },
    { value: BloodGroup.ANegative, name: BloodGroupNames[BloodGroup.ANegative] },
    { value: BloodGroup.BPositive, name: BloodGroupNames[BloodGroup.BPositive] },
    { value: BloodGroup.BNegative, name: BloodGroupNames[BloodGroup.BNegative] },
    { value: BloodGroup.ABPositive, name: BloodGroupNames[BloodGroup.ABPositive] },
    { value: BloodGroup.ABNegative, name: BloodGroupNames[BloodGroup.ABNegative] },
    { value: BloodGroup.OPositive, name: BloodGroupNames[BloodGroup.OPositive] },
    { value: BloodGroup.ONegative, name: BloodGroupNames[BloodGroup.ONegative] }
  ];

  constructor(
    private fb: FormBuilder,
    private donorService: DonorService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkExistingRegistration();
  }

  initializeForm(): void {
    this.registrationForm = this.fb.group({
      bloodGroup: ['', [Validators.required]],
      lastDonationDate: [''],
      contactInfo: this.fb.group({
        phoneNumber: ['', [Validators.required]],
        address: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        pinCode: ['', [Validators.required]],
        country: ['USA', [Validators.required]]
      }),
      medicalHistory: ['']
    });
  }

  checkExistingRegistration(): void {
    this.donorService.getDonorProfile().subscribe({
      next: (donor) => {
        if (donor) {
          this.showMessage('You are already registered as a donor');
          this.router.navigate(['/donor/profile']);
        }
      },
      error: () => {
        // User is not registered, continue with registration
      }
    });
  }

  onSubmit(): void {
    console.log('🔍 FORM: Form valid?', this.registrationForm.valid);
    console.log('🔍 FORM: Form value:', this.registrationForm.value);
    console.log('🔍 FORM: Form errors:', this.getFormValidationErrors());
    
    if (this.registrationForm.valid) {
      this.isLoading = true;
      
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.showMessage('Please login first');
        this.router.navigate(['/auth/login']);
        return;
      }

      // Debug: Check user role and token
      console.log('Current user:', currentUser);
      console.log('User role:', currentUser.role);
      console.log('Is donor?', this.authService.isDonor());
      
      const token = this.authService.getToken();
      console.log('Token exists?', !!token);
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log('Token payload:', payload);
        } catch (e) {
          console.log('Error decoding token:', e);
        }
      }
      
      if (currentUser.role !== 2) { // UserRole.Donor = 2
        this.showMessage('You must be registered as a Donor to access this feature. Please register with the Donor role first.');
        this.router.navigate(['/auth/register']);
        return;
      }

      const formValue = this.registrationForm.value;
      
      const registrationData: DonorRegistration = {
        userId: currentUser.userId,
        bloodGroup: parseInt(formValue.bloodGroup), // Ensure it's a number
        lastDonationDate: formValue.lastDonationDate || undefined,
        contactInfo: {
          phone: formValue.contactInfo.phoneNumber,
          address: formValue.contactInfo.address,
          city: formValue.contactInfo.city,
          state: formValue.contactInfo.state,
          zipCode: formValue.contactInfo.pinCode,
          country: formValue.contactInfo.country
        },
        medicalHistory: formValue.medicalHistory || ''
      };

      // Debug: Check current user and token
      console.log('🔍 DEBUG: Current user:', currentUser);
      console.log('🔍 DEBUG: User role:', currentUser.role);
      console.log('🔍 DEBUG: Is donor?', this.authService.isDonor());
      console.log('🔍 DEBUG: Form value:', formValue);
      console.log('🔍 DEBUG: Registration data:', registrationData);
      console.log('🔍 DEBUG: Registration data JSON:', JSON.stringify(registrationData, null, 2));
      
      // Check if token exists
      const authToken = localStorage.getItem('bloodbank_token');
      console.log('🔍 DEBUG: Token exists in localStorage:', !!authToken);
      console.log('🔍 DEBUG: AuthService getToken():', !!this.authService.getToken());
      if (authToken) {
        try {
          const payload = JSON.parse(atob(authToken.split('.')[1]));
          console.log('🔍 DEBUG: Token payload:', payload);
        } catch (e) {
          console.log('🔍 DEBUG: Error parsing token:', e);
        }
      }

      this.donorService.registerDonor(registrationData).subscribe({
        next: (donor) => {
          this.showMessage('Registration successful! Welcome to our donor community.');
          this.router.navigate(['/donor/profile']);
        },
        error: (error) => {
          console.error('💥 Registration failed:', error);
          console.error('💥 Error status:', error.status);
          console.error('💥 Error message:', error.error);
          console.error('💥 Full error object:', JSON.stringify(error.error, null, 2));
          
          // Show specific validation errors if available
          if (error.error?.errors) {
            console.error('💥 Validation errors:', error.error.errors);
            const validationErrors = Object.keys(error.error.errors).map(key => 
              `${key}: ${error.error.errors[key].join(', ')}`
            ).join('\n');
            this.showMessage(`Validation errors:\n${validationErrors}`);
          } else {
            this.showMessage(error.error?.message || error.error?.title || 'Registration failed. Please try again.');
          }
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

  testDebug(): void {
    console.log('🧪 Testing debug endpoints...');
    
    // Test 1: No authentication required
    console.log('🧪 Testing endpoint without authentication...');
    this.http.get('http://localhost:5258/api/donors/test-auth').subscribe({
      next: (result: any) => {
        console.log('🧪 No-auth endpoint success:', result);
        
        // Test 2: Authentication required
        console.log('🧪 Testing endpoint with authentication...');
        
        // Check token before making request
        const token = this.authService.getToken();
        console.log('🧪 Token for auth test:', token ? token.substring(0, 50) + '...' : 'NO TOKEN');
        
        if (token) {
          try {
            const parts = token.split('.');
            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));
            console.log('🧪 Token header:', header);
            console.log('🧪 Token payload:', payload);
            console.log('🧪 Token expires at:', new Date(payload.exp * 1000));
            console.log('🧪 Current time:', new Date());
            console.log('🧪 Token expired?', payload.exp * 1000 < Date.now());
          } catch (e) {
            console.log('🧪 Error decoding token:', e);
          }
        }
        
        this.http.get('http://localhost:5258/api/donors/test-jwt').subscribe({
          next: (authResult: any) => {
            console.log('🧪 Auth endpoint success:', authResult);
            alert('Both tests passed - check console');
          },
          error: (authError: any) => {
            console.log('🧪 Auth endpoint error:', authError);
            alert('Auth test failed - check console');
          }
        });
      },
      error: (error: any) => {
        console.log('🧪 No-auth endpoint error:', error);
        alert('Basic connectivity failed - check console');
      }
    });
  }

  private showMessage(message: string): void {
    alert(message);
  }

  private getFormValidationErrors() {
    let formErrors: any = {};

    Object.keys(this.registrationForm.controls).forEach(key => {
      const controlErrors: any = this.registrationForm.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });

    return formErrors;
  }
}