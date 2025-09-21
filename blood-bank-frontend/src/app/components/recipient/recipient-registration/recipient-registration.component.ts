import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RecipientService } from '../../../services/recipient.service';
import { AuthService } from '../../../services/auth.service';
import { RecipientRegistration } from '../../../models/recipient.model';

@Component({
  selector: 'app-recipient-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="registration-container">
      <mat-card class="registration-card">
        <mat-card-header>
          <mat-card-title>Recipient Registration</mat-card-title>
          <mat-card-subtitle>Register as a blood recipient</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()" class="registration-form">
            <!-- Hospital Information -->
            <div class="form-section">
              <h3>Hospital Information</h3>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Hospital Name</mat-label>
                <input matInput formControlName="hospitalName" placeholder="Enter hospital name">
                <mat-error *ngIf="registrationForm.get('hospitalName')?.hasError('required')">
                  Hospital name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Doctor Name</mat-label>
                <input matInput formControlName="doctorName" placeholder="Enter attending doctor name">
                <mat-error *ngIf="registrationForm.get('doctorName')?.hasError('required')">
                  Doctor name is required
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Contact Information -->
            <div class="form-section" formGroupName="contactInfo">
              <h3>Contact Information</h3>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Address</mat-label>
                <textarea matInput formControlName="address" placeholder="Enter complete address" rows="3"></textarea>
                <mat-error *ngIf="registrationForm.get('contactInfo.address')?.hasError('required')">
                  Address is required
                </mat-error>
              </mat-form-field>

              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>City</mat-label>
                  <input matInput formControlName="city" placeholder="Enter city">
                  <mat-error *ngIf="registrationForm.get('contactInfo.city')?.hasError('required')">
                    City is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>State</mat-label>
                  <input matInput formControlName="state" placeholder="Enter state">
                  <mat-error *ngIf="registrationForm.get('contactInfo.state')?.hasError('required')">
                    State is required
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Pin Code</mat-label>
                  <input matInput formControlName="pinCode" placeholder="Enter pin code">
                  <mat-error *ngIf="registrationForm.get('contactInfo.pinCode')?.hasError('required')">
                    Pin code is required
                  </mat-error>
                  <mat-error *ngIf="registrationForm.get('contactInfo.pinCode')?.hasError('pattern')">
                    Please enter a valid pin code
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Phone Number</mat-label>
                  <input matInput formControlName="phoneNumber" placeholder="Enter phone number">
                  <mat-error *ngIf="registrationForm.get('contactInfo.phoneNumber')?.hasError('required')">
                    Phone number is required
                  </mat-error>
                  <mat-error *ngIf="registrationForm.get('contactInfo.phoneNumber')?.hasError('pattern')">
                    Please enter a valid phone number
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <!-- Medical Information -->
            <div class="form-section">
              <h3>Medical Information</h3>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Medical Condition</mat-label>
                <textarea matInput formControlName="medicalCondition" placeholder="Describe medical condition requiring blood transfusion" rows="4"></textarea>
                <mat-error *ngIf="registrationForm.get('medicalCondition')?.hasError('required')">
                  Medical condition description is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="registrationForm.invalid || isLoading">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                {{ isLoading ? 'Registering...' : 'Register' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .registration-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background-color: #f5f5f5;
    }

    .registration-card {
      width: 100%;
      max-width: 800px;
      margin: 20px auto;
    }

    .registration-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-section {
      margin-bottom: 20px;
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

    mat-spinner {
      margin-right: 10px;
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class RecipientRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private recipientService: RecipientService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
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

      const registrationData: RecipientRegistration = {
        userId: currentUser.userId,
        ...this.registrationForm.value
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
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}