import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DonorService } from '../../../../services/donor.service';
import { UserService } from '../../../../services/user.service';
import { DonorRegistration } from '../../../../models/donor.model';
import { BloodGroup, BloodGroupNames } from '../../../../models/common.model';
import { User, UserRole } from '../../../../models/user.model';

@Component({
  selector: 'app-donor-registration',
  template: `
    <div class="registration-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>person_add</mat-icon>
            Register New Donor
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
            
            <!-- User Selection -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Select User</mat-label>
              <mat-select formControlName="userId" required>
                <mat-option *ngFor="let user of users" [value]="user.userId">
                  {{user.name}} ({{user.email}})
                </mat-option>
              </mat-select>
              <mat-error *ngIf="registrationForm.get('userId')?.hasError('required')">
                Please select a user
              </mat-error>
            </mat-form-field>

            <!-- Blood Group Selection -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Blood Group</mat-label>
              <mat-select formControlName="bloodGroup" required>
                <mat-option *ngFor="let group of bloodGroups" [value]="group.value">
                  {{group.label}}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="registrationForm.get('bloodGroup')?.hasError('required')">
                Please select blood group
              </mat-error>
            </mat-form-field>

            <!-- Last Donation Date (Optional) -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Last Donation Date (if any)</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="lastDonationDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-hint>Leave empty if this is the first donation</mat-hint>
            </mat-form-field>

            <!-- Contact Information -->
            <div class="contact-section">
              <h3>Contact Information</h3>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Phone Number</mat-label>
                <input matInput formControlName="phone" type="tel" required>
                <mat-error *ngIf="registrationForm.get('phone')?.hasError('required')">
                  Phone number is required
                </mat-error>
                <mat-error *ngIf="registrationForm.get('phone')?.hasError('pattern')">
                  Please enter a valid phone number
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Address</mat-label>
                <textarea matInput formControlName="address" rows="3" required></textarea>
                <mat-error *ngIf="registrationForm.get('address')?.hasError('required')">
                  Address is required
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Medical History -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Medical History</mat-label>
              <textarea matInput 
                        formControlName="medicalHistory" 
                        rows="4" 
                        placeholder="Enter any relevant medical history, allergies, medications, etc."></textarea>
              <mat-hint>Include any medical conditions, current medications, allergies, or previous surgeries</mat-hint>
            </mat-form-field>

            <!-- Action Buttons -->
            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">
                Cancel
              </button>
              <button mat-raised-button 
                      color="primary" 
                      type="submit" 
                      [disabled]="registrationForm.invalid || isSubmitting">
                <mat-icon *ngIf="isSubmitting">refresh</mat-icon>
                <mat-icon *ngIf="!isSubmitting">save</mat-icon>
                {{isSubmitting ? 'Registering...' : 'Register Donor'}}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Registration Guidelines -->
      <mat-card class="guidelines-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>info</mat-icon>
            Donor Registration Guidelines
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            <mat-list-item>
              <mat-icon matListIcon>check_circle</mat-icon>
              <div matLine>Donor must be between 18-65 years old</div>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListIcon>check_circle</mat-icon>
              <div matLine>Weight should be at least 50 kg</div>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListIcon>check_circle</mat-icon>
              <div matLine>Must be in good health condition</div>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListIcon>check_circle</mat-icon>
              <div matLine>No blood donation in the last 56 days</div>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListIcon>check_circle</mat-icon>
              <div matLine>Complete medical history is required</div>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .registration-container {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      padding: 20px;
    }

    @media (max-width: 768px) {
      .registration-container {
        grid-template-columns: 1fr;
      }
    }

    mat-card {
      height: fit-content;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .contact-section {
      margin: 20px 0;
    }

    .contact-section h3 {
      color: #3f51b5;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    .guidelines-card {
      background-color: #f8f9fa;
    }

    .guidelines-card mat-list-item {
      margin-bottom: 8px;
    }

    mat-icon[matListIcon] {
      color: #4caf50;
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
    private router: Router,
    private snackBar: MatSnackBar
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
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
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
          this.snackBar.open('Donor registered successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/donors/profile', donor.donorId]);
        },
        error: (error) => {
          console.error('Error registering donor:', error);
          this.snackBar.open('Error registering donor. Please try again.', 'Close', { duration: 3000 });
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/donors']);
  }
}