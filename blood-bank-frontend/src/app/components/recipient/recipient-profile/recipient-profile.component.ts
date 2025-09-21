import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { RecipientService } from '../../../services/recipient.service';
import { Recipient, RecipientUpdate } from '../../../models/recipient.model';

@Component({
  selector: 'app-recipient-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule
  ],
  template: `
    <div class="profile-container" *ngIf="recipient">
      <div class="profile-header">
        <mat-card class="header-card">
          <mat-card-content>
            <div class="header-content">
              <div class="profile-info">
                <h1>{{ recipient.userName }}</h1>
                <p class="email">{{ recipient.userEmail }}</p>
                <div class="stats">
                  <mat-chip-set>
                    <mat-chip>Total Requests: {{ recipient.totalRequests || 0 }}</mat-chip>
                    <mat-chip>Pending: {{ recipient.pendingRequests || 0 }}</mat-chip>
                  </mat-chip-set>
                </div>
              </div>
              <div class="profile-actions">
                <button mat-raised-button color="primary" (click)="toggleEdit()">
                  <mat-icon>{{ isEditing ? 'cancel' : 'edit' }}</mat-icon>
                  {{ isEditing ? 'Cancel' : 'Edit Profile' }}
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="profile-content">
        <div class="left-column">
          <mat-card class="profile-details">
            <mat-card-header>
              <mat-card-title>Profile Details</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()" *ngIf="isEditing">
                <div class="form-section">
                  <h3>Hospital Information</h3>
                  
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Hospital Name</mat-label>
                    <input matInput formControlName="hospitalName">
                    <mat-error *ngIf="profileForm.get('hospitalName')?.hasError('required')">
                      Hospital name is required
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Doctor Name</mat-label>
                    <input matInput formControlName="doctorName">
                    <mat-error *ngIf="profileForm.get('doctorName')?.hasError('required')">
                      Doctor name is required
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-section" formGroupName="contactInfo">
                  <h3>Contact Information</h3>
                  
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Address</mat-label>
                    <textarea matInput formControlName="address" rows="3"></textarea>
                  </mat-form-field>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>City</mat-label>
                      <input matInput formControlName="city">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>State</mat-label>
                      <input matInput formControlName="state">
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Pin Code</mat-label>
                      <input matInput formControlName="pinCode">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Phone Number</mat-label>
                      <input matInput formControlName="phoneNumber">
                    </mat-form-field>
                  </div>
                </div>

                <div class="form-section">
                  <h3>Medical Information</h3>
                  
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Medical Condition</mat-label>
                    <textarea matInput formControlName="medicalCondition" rows="4"></textarea>
                  </mat-form-field>
                </div>

                <div class="form-actions">
                  <button mat-button type="button" (click)="cancelEdit()">Cancel</button>
                  <button mat-raised-button color="primary" type="submit" 
                          [disabled]="profileForm.invalid || isLoading">
                    <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                    {{ isLoading ? 'Updating...' : 'Update Profile' }}
                  </button>
                </div>
              </form>

              <div *ngIf="!isEditing" class="view-mode">
                <div class="info-section">
                  <h3>Hospital Information</h3>
                  <div class="info-item">
                    <strong>Hospital:</strong> {{ recipient.hospitalName }}
                  </div>
                  <div class="info-item">
                    <strong>Doctor:</strong> {{ recipient.doctorName }}
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="info-section">
                  <h3>Contact Information</h3>
                  <div class="info-item">
                    <strong>Address:</strong> {{ recipient.contactInfo.address }}
                  </div>
                  <div class="info-item">
                    <strong>City:</strong> {{ recipient.contactInfo.city }}
                  </div>
                  <div class="info-item">
                    <strong>State:</strong> {{ recipient.contactInfo.state }}
                  </div>
                  <div class="info-item">
                    <strong>Pin Code:</strong> {{ recipient.contactInfo.pinCode }}
                  </div>
                  <div class="info-item">
                    <strong>Phone:</strong> {{ recipient.contactInfo.phoneNumber }}
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="info-section">
                  <h3>Medical Information</h3>
                  <div class="info-item">
                    <strong>Medical Condition:</strong>
                    <p class="medical-condition">{{ recipient.medicalCondition }}</p>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <div class="info-section">
                  <h3>Registration Details</h3>
                  <div class="info-item">
                    <strong>Registered On:</strong> {{ recipient.createdAt | date:'medium' }}
                  </div>
                  <div class="info-item" *ngIf="recipient.updatedAt">
                    <strong>Last Updated:</strong> {{ recipient.updatedAt | date:'medium' }}
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="right-column">
          <mat-card class="actions-card">
            <mat-card-header>
              <mat-card-title>Quick Actions</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="quick-actions">
                <button mat-raised-button color="accent" routerLink="/recipient/request-blood">
                  <mat-icon>add</mat-icon>
                  New Blood Request
                </button>
                
                <button mat-stroked-button routerLink="/recipient/my-requests">
                  <mat-icon>list</mat-icon>
                  My Requests
                </button>
                
                <button mat-stroked-button routerLink="/recipient/blood-availability">
                  <mat-icon>search</mat-icon>
                  Check Availability
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>

    <div class="loading-container" *ngIf="!recipient && isLoading">
      <mat-spinner></mat-spinner>
      <p>Loading profile...</p>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .profile-header {
      margin-bottom: 30px;
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

    mat-spinner {
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
    private recipientService: RecipientService,
    private snackBar: MatSnackBar
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
        this.showMessage('Failed to load profile');
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
    }
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}