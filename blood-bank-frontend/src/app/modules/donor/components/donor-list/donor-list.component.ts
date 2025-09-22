import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DonorService } from '../../../../services/donor.service';
import { Donor } from '../../../../models/donor.model';
import { BloodGroupNames } from '../../../../models/common.model';

@Component({
  selector: 'app-donor-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12">
          <!-- Header -->
          <div class="card mb-4">
            <div class="card-header bg-primary text-white">
              <div class="d-flex justify-content-between align-items-center">
                <h4 class="mb-0">
                  <i class="bi bi-people me-2"></i>
                  Donors List
                </h4>
                <div class="d-flex gap-2">
                  <button 
                    class="btn btn-light btn-sm" 
                    [class.btn-warning]="showEligibleOnly"
                    (click)="loadEligibleDonors()">
                    <i class="bi bi-check-circle me-1"></i>
                    Eligible Donors ({{eligibleCount}})
                  </button>
                  <button 
                    class="btn btn-light btn-sm"
                    [class.btn-secondary]="!showEligibleOnly"
                    (click)="loadAllDonors()">
                    <i class="bi bi-people me-1"></i>
                    All Donors
                  </button>
                </div>
              </div>
            </div>

            <!-- Filters -->
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-3">
                  <label class="form-label">Filter by Blood Group</label>
                  <select 
                    class="form-select" 
                    [(ngModel)]="selectedBloodGroup" 
                    (change)="filterByBloodGroup()">
                    <option value="">All Blood Groups</option>
                    <option *ngFor="let group of bloodGroups" [value]="group.value">
                      {{group.label}}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Search donors</label>
                  <div class="input-group">
                    <input 
                      type="text" 
                      class="form-control" 
                      placeholder="Search by name or email"
                      (keyup)="applyFilter($event)">
                    <span class="input-group-text">
                      <i class="bi bi-search"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Donors Table -->
          <div class="card" *ngIf="!loading">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th>Name</th>
                      <th>Blood Group</th>
                      <th>Last Donation</th>
                      <th>Status</th>
                      <th>Contact</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let donor of filteredDonors">
                      <td>
                        <div>
                          <strong class="d-block">{{donor.userName}}</strong>
                          <small class="text-muted">{{donor.userEmail}}</small>
                        </div>
                      </td>
                      <td>
                        <span class="badge bg-danger fs-6">
                          {{donor.bloodGroupDisplay}}
                        </span>
                      </td>
                      <td>
                        <div *ngIf="donor.lastDonationDate; else noDonation">
                          <span class="d-block">{{donor.lastDonationDate | date:'shortDate'}}</span>
                          <small class="text-muted">({{donor.daysSinceLastDonation}} days ago)</small>
                        </div>
                        <ng-template #noDonation>
                          <span class="text-muted fst-italic">Never donated</span>
                        </ng-template>
                      </td>
                      <td>
                        <span class="badge" 
                              [class.bg-success]="donor.isEligibleToDonate"
                              [class.bg-danger]="!donor.isEligibleToDonate">
                          <i class="bi" 
                             [class.bi-check-circle]="donor.isEligibleToDonate"
                             [class.bi-x-circle]="!donor.isEligibleToDonate"
                             me-1></i>
                          {{donor.isEligibleToDonate ? 'Eligible' : 'Not Eligible'}}
                        </span>
                      </td>
                      <td>
                        <small>{{donor.contactInfo.phone}}</small>
                      </td>
                      <td>
                        <div class="btn-group" role="group">
                          <button 
                            class="btn btn-outline-primary btn-sm" 
                            (click)="viewProfile(donor)"
                            title="View Profile">
                            <i class="bi bi-eye"></i>
                          </button>
                          <button 
                            class="btn btn-outline-info btn-sm" 
                            (click)="checkEligibility(donor)"
                            title="Check Eligibility">
                            <i class="bi bi-shield-check"></i>
                          </button>
                          <button 
                            class="btn btn-outline-success btn-sm" 
                            (click)="recordDonation(donor)"
                            title="Record Donation"
                            [disabled]="!donor.isEligibleToDonate">
                            <i class="bi bi-droplet-half"></i>
                          </button>
                          <button 
                            class="btn btn-outline-secondary btn-sm" 
                            (click)="viewHistory(donor)"
                            title="Donation History">
                            <i class="bi bi-clock-history"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div class="text-center py-5" *ngIf="loading">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted">Loading donors...</p>
          </div>

          <!-- No Data State -->
          <div class="card" *ngIf="!loading && filteredDonors.length === 0">
            <div class="card-body text-center py-5">
              <i class="bi bi-people display-1 text-muted mb-3"></i>
              <p class="text-muted">No donors found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .donor-list-container {
      padding: 20px;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .filters {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .filters mat-form-field {
      min-width: 200px;
    }

    .table-container {
      max-height: 600px;
      overflow: auto;
    }

    .donors-table {
      width: 100%;
    }

    .donor-info {
      display: flex;
      flex-direction: column;
    }

    .donor-info small {
      color: #666;
      font-size: 12px;
    }

    .blood-group-chip {
      font-weight: bold;
    }

    .blood-0, .blood-2, .blood-4, .blood-6 { background-color: #ffebee; color: #c62828; }
    .blood-1, .blood-3, .blood-5, .blood-7 { background-color: #e8f5e8; color: #2e7d32; }

    .contact-info {
      display: flex;
      flex-direction: column;
    }

    .no-donation {
      color: #999;
      font-style: italic;
    }

    .eligible {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .not-eligible {
      background-color: #ffebee;
      color: #c62828;
    }

    .action-buttons {
      display: flex;
      gap: 5px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 10px;
    }

    .active {
      background-color: #3f51b5 !important;
      color: white !important;
    }
  `]
})
export class DonorListComponent implements OnInit {
  donors: Donor[] = [];
  filteredDonors: Donor[] = [];
  loading = false;
  showEligibleOnly = false;
  eligibleCount = 0;
  selectedBloodGroup = '';
  alertMessage: string = '';
  alertType: 'success' | 'danger' | 'warning' | 'info' = 'info';
  
  displayedColumns: string[] = ['name', 'bloodGroup', 'lastDonation', 'eligibility', 'contact', 'actions'];
  
  bloodGroups = [
    { value: '0', label: 'A+' },
    { value: '1', label: 'A-' },
    { value: '2', label: 'B+' },
    { value: '3', label: 'B-' },
    { value: '4', label: 'AB+' },
    { value: '5', label: 'AB-' },
    { value: '6', label: 'O+' },
    { value: '7', label: 'O-' }
  ];

  constructor(
    private donorService: DonorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllDonors();
  }

  loadAllDonors(): void {
    this.loading = true;
    this.showEligibleOnly = false;
    this.donorService.getDonors().subscribe({
      next: (donors) => {
        this.donors = donors;
        this.filteredDonors = donors;
        this.eligibleCount = donors.filter(d => d.isEligibleToDonate).length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading donors:', error);
        this.showAlert('Error loading donors', 'danger');
        this.loading = false;
      }
    });
  }

  loadEligibleDonors(): void {
    this.loading = true;
    this.showEligibleOnly = true;
    this.donorService.getEligibleDonors().subscribe({
      next: (donors) => {
        this.donors = donors;
        this.filteredDonors = donors;
        this.eligibleCount = donors.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading eligible donors:', error);
        this.showAlert('Error loading eligible donors', 'danger');
        this.loading = false;
      }
    });
  }

  filterByBloodGroup(): void {
    if (this.selectedBloodGroup) {
      this.donorService.getDonorsByBloodGroup(this.selectedBloodGroup).subscribe({
        next: (donors) => {
          this.filteredDonors = donors;
        },
        error: (error) => {
          console.error('Error filtering donors:', error);
          this.showAlert('Error filtering donors', 'danger');
        }
      });
    } else {
      this.filteredDonors = this.donors;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredDonors = this.donors.filter(donor => 
      donor.userName.toLowerCase().includes(filterValue) ||
      donor.userEmail.toLowerCase().includes(filterValue)
    );
  }

  viewProfile(donor: Donor): void {
    this.router.navigate(['/donors/profile', donor.donorId]);
  }

  checkEligibility(donor: Donor): void {
    this.router.navigate(['/donors/eligibility', donor.donorId]);
  }

  recordDonation(donor: Donor): void {
    if (donor.isEligibleToDonate) {
      this.router.navigate(['/donors/donate', donor.donorId]);
    }
  }

  viewHistory(donor: Donor): void {
    this.router.navigate(['/donors/history', donor.donorId]);
  }

  private showAlert(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.clearAlert();
    }, 5000);
  }

  clearAlert(): void {
    this.alertMessage = '';
  }
}