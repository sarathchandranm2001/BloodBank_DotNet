import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { RecipientService } from '../../../services/recipient.service';
import { BloodRequestCreate, BloodRequestUrgency, BloodRequestUrgencyNames } from '../../../models/recipient.model';
import { BloodGroup, BloodGroupNames } from '../../../models/common.model';

@Component({
  selector: 'app-blood-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="request-container">
      <mat-card class="request-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>add_circle</mat-icon>
            New Blood Request
          </mat-card-title>
          <mat-card-subtitle>Submit a new blood request</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="requestForm" (ngSubmit)="onSubmit()" class="request-form">
            <!-- Blood Requirements -->
            <div class="form-section">
              <h3>Blood Requirements</h3>
              
              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Blood Group</mat-label>
                  <mat-select formControlName="bloodGroup">
                    <mat-option *ngFor="let group of bloodGroups" [value]="group">
                      {{ bloodGroupNames[group] }}
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="requestForm.get('bloodGroup')?.hasError('required')">
                    Blood group is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Units Required</mat-label>
                  <input matInput type="number" formControlName="unitsRequested" 
                         placeholder="Enter number of units" min="1" max="10">
                  <mat-error *ngIf="requestForm.get('unitsRequested')?.hasError('required')">
                    Number of units is required
                  </mat-error>
                  <mat-error *ngIf="requestForm.get('unitsRequested')?.hasError('min')">
                    At least 1 unit is required
                  </mat-error>
                  <mat-error *ngIf="requestForm.get('unitsRequested')?.hasError('max')">
                    Maximum 10 units can be requested
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Urgency Level</mat-label>
                  <mat-select formControlName="urgency">
                    <mat-option *ngFor="let urgency of urgencyLevels" [value]="urgency">
                      {{ urgencyNames[urgency] }}
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="requestForm.get('urgency')?.hasError('required')">
                    Urgency level is required
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Required By Date</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="requiredByDate"
                         placeholder="Select date">
                  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  <mat-error *ngIf="requestForm.get('requiredByDate')?.hasError('required')">
                    Required by date is required
                  </mat-error>
                  <mat-error *ngIf="requestForm.get('requiredByDate')?.hasError('futureDate')">
                    Date must be in the future
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <!-- Medical Justification -->
            <div class="form-section">
              <h3>Medical Information</h3>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Request Reason</mat-label>
                <textarea matInput formControlName="requestReason" 
                          placeholder="Provide detailed medical justification for the blood requirement"
                          rows="4"></textarea>
                <mat-error *ngIf="requestForm.get('requestReason')?.hasError('required')">
                  Medical justification is required
                </mat-error>
                <mat-error *ngIf="requestForm.get('requestReason')?.hasError('minlength')">
                  Please provide more detailed justification (minimum 20 characters)
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Doctor's Notes (Optional)</mat-label>
                <textarea matInput formControlName="doctorNotes" 
                          placeholder="Additional notes from the attending physician"
                          rows="3"></textarea>
              </mat-form-field>
            </div>

            <!-- Blood Availability Check -->
            <div class="form-section" *ngIf="bloodAvailability">
              <h3>Blood Availability</h3>
              <div class="availability-info" [ngClass]="getAvailabilityClass()">
                <mat-icon>{{ getAvailabilityIcon() }}</mat-icon>
                <div class="availability-text">
                  <strong>{{ selectedBloodGroup }} Blood:</strong>
                  <span>{{ bloodAvailability?.availableUnits || 0 }} units available</span>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="onCancel()">Cancel</button>
              <button mat-button type="button" (click)="checkAvailability()" 
                      [disabled]="!requestForm.get('bloodGroup')?.value">
                <mat-icon>search</mat-icon>
                Check Availability
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="requestForm.invalid || isLoading">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                {{ isLoading ? 'Submitting...' : 'Submit Request' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .request-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      background-color: #f5f5f5;
    }

    .request-card {
      width: 100%;
      max-width: 800px;
      margin: 20px auto;
    }

    .request-form {
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

    .availability-info {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px;
      border-radius: 8px;
      margin: 10px 0;
    }

    .availability-info.available {
      background-color: #e8f5e8;
      color: #2e7d32;
      border: 1px solid #4caf50;
    }

    .availability-info.limited {
      background-color: #fff3e0;
      color: #f57c00;
      border: 1px solid #ff9800;
    }

    .availability-info.unavailable {
      background-color: #ffebee;
      color: #d32f2f;
      border: 1px solid #f44336;
    }

    .availability-text {
      display: flex;
      flex-direction: column;
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

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class BloodRequestComponent implements OnInit {
  requestForm: FormGroup;
  isLoading = false;
  bloodAvailability: any = null;
  
  bloodGroups = Object.values(BloodGroup);
  bloodGroupNames: { [key: string]: string } = BloodGroupNames;
  urgencyLevels = Object.values(BloodRequestUrgency).filter(v => typeof v === 'number');
  urgencyNames = BloodRequestUrgencyNames;

  constructor(
    private fb: FormBuilder,
    private recipientService: RecipientService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.requestForm = this.createForm();
  }

  ngOnInit(): void {
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.requestForm.get('requiredByDate')?.setValue(tomorrow);
  }

  private createForm(): FormGroup {
    return this.fb.group({
      bloodGroup: ['', [Validators.required]],
      unitsRequested: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      urgency: ['', [Validators.required]],
      requiredByDate: ['', [Validators.required, this.futureDateValidator]],
      requestReason: ['', [Validators.required, Validators.minLength(20)]],
      doctorNotes: ['']
    });
  }

  private futureDateValidator(control: any): { [key: string]: any } | null {
    if (control.value) {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        return { 'futureDate': true };
      }
    }
    return null;
  }

  get selectedBloodGroup(): string {
    const bloodGroup = this.requestForm.get('bloodGroup')?.value as BloodGroup;
    return bloodGroup ? this.bloodGroupNames[bloodGroup] : '';
  }

  checkAvailability(): void {
    const bloodGroup = this.requestForm.get('bloodGroup')?.value;
    if (bloodGroup) {
      this.recipientService.getBloodAvailabilityByGroup(bloodGroup).subscribe({
        next: (availability: any) => {
          this.bloodAvailability = availability;
        },
        error: (error: any) => {
          console.error('Failed to check availability:', error);
          this.showMessage('Failed to check blood availability');
        }
      });
    }
  }

  getAvailabilityClass(): string {
    if (!this.bloodAvailability) return '';
    
    const available = this.bloodAvailability.availableUnits || 0;
    const required = this.requestForm.get('unitsRequested')?.value || 0;
    
    if (available === 0) return 'unavailable';
    if (available < required) return 'limited';
    return 'available';
  }

  getAvailabilityIcon(): string {
    const className = this.getAvailabilityClass();
    switch (className) {
      case 'available': return 'check_circle';
      case 'limited': return 'warning';
      case 'unavailable': return 'cancel';
      default: return 'info';
    }
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      this.isLoading = true;
      
      const requestData: BloodRequestCreate = this.requestForm.value;

      this.recipientService.createBloodRequest(requestData).subscribe({
        next: (request: any) => {
          this.showMessage('Blood request submitted successfully!');
          this.router.navigate(['/recipient/my-requests']);
        },
        error: (error: any) => {
          console.error('Request submission failed:', error);
          this.showMessage(error.error?.message || 'Request submission failed. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.requestForm);
    }
  }

  onCancel(): void {
    this.router.navigate(['/recipient/dashboard']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
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