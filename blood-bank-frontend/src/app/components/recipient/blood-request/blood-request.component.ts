import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipientService } from '../../../services/recipient.service';
import { BloodRequestCreate, BloodRequestUrgency, BloodRequestUrgencyNames } from '../../../models/recipient.model';
import { BloodGroup, BloodGroupNames } from '../../../models/common.model';

@Component({
  selector: 'app-blood-request',
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
                <i class="bi bi-plus-circle me-2"></i>
                New Blood Request
              </h4>
              <p class="card-text mb-0 mt-2">Submit a new blood request</p>
            </div>

            <div class="card-body">
              <form [formGroup]="requestForm" (ngSubmit)="onSubmit()">
                <!-- Blood Requirements -->
                <div class="mb-4">
                  <h5 class="text-primary border-bottom pb-2 mb-3">
                    <i class="bi bi-droplet-half me-2"></i>Blood Requirements
                  </h5>
                  
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="bloodGroup" class="form-label">Blood Group <span class="text-danger">*</span></label>
                      <select class="form-select" id="bloodGroup" formControlName="bloodGroup"
                              [class.is-invalid]="requestForm.get('bloodGroup')?.invalid && requestForm.get('bloodGroup')?.touched">
                        <option value="">Select Blood Group</option>
                        <option *ngFor="let group of bloodGroups" [value]="group">
                          {{ bloodGroupNames[group] }}
                        </option>
                      </select>
                      <div class="invalid-feedback" *ngIf="requestForm.get('bloodGroup')?.hasError('required') && requestForm.get('bloodGroup')?.touched">
                        Blood group is required
                      </div>
                    </div>

                    <div class="col-md-6 mb-3">
                      <label for="unitsRequested" class="form-label">Units Required <span class="text-danger">*</span></label>
                      <input type="number" class="form-control" id="unitsRequested" 
                             formControlName="unitsRequested" placeholder="Enter number of units"
                             min="1" max="10"
                             [class.is-invalid]="requestForm.get('unitsRequested')?.invalid && requestForm.get('unitsRequested')?.touched">
                      <div class="invalid-feedback" *ngIf="requestForm.get('unitsRequested')?.hasError('required') && requestForm.get('unitsRequested')?.touched">
                        Number of units is required
                      </div>
                      <div class="invalid-feedback" *ngIf="requestForm.get('unitsRequested')?.hasError('min') && requestForm.get('unitsRequested')?.touched">
                        At least 1 unit is required
                      </div>
                      <div class="invalid-feedback" *ngIf="requestForm.get('unitsRequested')?.hasError('max') && requestForm.get('unitsRequested')?.touched">
                        Maximum 10 units can be requested
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="urgency" class="form-label">Urgency Level <span class="text-danger">*</span></label>
                      <select class="form-select" id="urgency" formControlName="urgency"
                              [class.is-invalid]="requestForm.get('urgency')?.invalid && requestForm.get('urgency')?.touched">
                        <option value="">Select Urgency Level</option>
                        <option *ngFor="let urgency of urgencyLevels" [value]="urgency">
                          {{ urgencyNames[urgency] }}
                        </option>
                      </select>
                      <div class="invalid-feedback" *ngIf="requestForm.get('urgency')?.hasError('required') && requestForm.get('urgency')?.touched">
                        Urgency level is required
                      </div>
                    </div>

                    <div class="col-md-6 mb-3">
                      <label for="requiredByDate" class="form-label">Required By Date <span class="text-danger">*</span></label>
                      <input type="date" class="form-control" id="requiredByDate" 
                             formControlName="requiredByDate"
                             [class.is-invalid]="requestForm.get('requiredByDate')?.invalid && requestForm.get('requiredByDate')?.touched">
                      <div class="invalid-feedback" *ngIf="requestForm.get('requiredByDate')?.hasError('required') && requestForm.get('requiredByDate')?.touched">
                        Required by date is required
                      </div>
                      <div class="invalid-feedback" *ngIf="requestForm.get('requiredByDate')?.hasError('futureDate') && requestForm.get('requiredByDate')?.touched">
                        Date must be in the future
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Medical Justification -->
                <div class="mb-4">
                  <h5 class="text-primary border-bottom pb-2 mb-3">
                    <i class="bi bi-heart-pulse me-2"></i>Medical Information
                  </h5>
                  
                  <div class="mb-3">
                    <label for="requestReason" class="form-label">Request Reason <span class="text-danger">*</span></label>
                    <textarea class="form-control" id="requestReason" rows="4"
                              formControlName="requestReason" 
                              placeholder="Provide detailed medical justification for the blood requirement"
                              [class.is-invalid]="requestForm.get('requestReason')?.invalid && requestForm.get('requestReason')?.touched"></textarea>
                    <div class="invalid-feedback" *ngIf="requestForm.get('requestReason')?.hasError('required') && requestForm.get('requestReason')?.touched">
                      Medical justification is required
                    </div>
                    <div class="invalid-feedback" *ngIf="requestForm.get('requestReason')?.hasError('minlength') && requestForm.get('requestReason')?.touched">
                      Please provide more detailed justification (minimum 20 characters)
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="doctorNotes" class="form-label">Doctor's Notes (Optional)</label>
                    <textarea class="form-control" id="doctorNotes" rows="3"
                              formControlName="doctorNotes" 
                              placeholder="Additional notes from the attending physician"></textarea>
                  </div>
                </div>

                <!-- Blood Availability Check -->
                <div class="mb-4" *ngIf="bloodAvailability">
                  <h5 class="text-primary border-bottom pb-2 mb-3">
                    <i class="bi bi-search me-2"></i>Blood Availability
                  </h5>
                  <div class="alert" [ngClass]="getAvailabilityClass()">
                    <i class="bi" [ngClass]="getAvailabilityIcon()"></i>
                    <strong>{{ selectedBloodGroup }} Blood:</strong>
                    {{ bloodAvailability?.availableUnits || 0 }} units available
                  </div>
                </div>

                <div class="d-flex justify-content-end gap-2">
                  <button type="button" class="btn btn-outline-secondary" (click)="onCancel()">
                    <i class="bi bi-x-circle me-2"></i>Cancel
                  </button>
                  <button type="button" class="btn btn-info" (click)="checkAvailability()" 
                          [disabled]="!requestForm.get('bloodGroup')?.value">
                    <i class="bi bi-search me-2"></i>Check Availability
                  </button>
                  <button type="submit" class="btn btn-danger" 
                          [disabled]="requestForm.invalid || isLoading">
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i *ngIf="!isLoading" class="bi bi-check-circle me-2"></i>
                    {{ isLoading ? 'Submitting...' : 'Submit Request' }}
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
    private router: Router
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
    if (!this.bloodAvailability) return 'alert-secondary';
    
    const available = this.bloodAvailability.availableUnits || 0;
    const required = this.requestForm.get('unitsRequested')?.value || 0;
    
    if (available === 0) return 'alert-danger';
    if (available < required) return 'alert-warning';
    return 'alert-success';
  }

  getAvailabilityIcon(): string {
    const className = this.getAvailabilityClass();
    switch (className) {
      case 'alert-success': return 'bi-check-circle-fill';
      case 'alert-warning': return 'bi-exclamation-triangle-fill';
      case 'alert-danger': return 'bi-x-circle-fill';
      default: return 'bi-info-circle-fill';
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
    alert(message);
  }
}