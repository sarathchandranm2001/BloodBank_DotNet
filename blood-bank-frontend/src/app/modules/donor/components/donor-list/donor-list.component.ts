import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DonorService } from '../../../../services/donor.service';
import { Donor } from '../../../../models/donor.model';
import { BloodGroupNames } from '../../../../models/common.model';

@Component({
  selector: 'app-donor-list',
  template: `
    <div class="donor-list-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>people</mat-icon>
            Donors List
          </mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="primary" 
                    (click)="loadEligibleDonors()" 
                    [class.active]="showEligibleOnly">
              <mat-icon>check_circle</mat-icon>
              Eligible Donors ({{eligibleCount}})
            </button>
            <button mat-raised-button (click)="loadAllDonors()" [class.active]="!showEligibleOnly">
              <mat-icon>group</mat-icon>
              All Donors
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Filter by Blood Group</mat-label>
              <mat-select [(value)]="selectedBloodGroup" (selectionChange)="filterByBloodGroup()">
                <mat-option value="">All Blood Groups</mat-option>
                <mat-option *ngFor="let group of bloodGroups" [value]="group.value">
                  {{group.label}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Search donors</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Search by name or email">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>

          <div class="table-container" *ngIf="!loading">
            <table mat-table [dataSource]="filteredDonors" class="donors-table">
              
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let donor">
                  <div class="donor-info">
                    <strong>{{donor.userName}}</strong>
                    <small>{{donor.userEmail}}</small>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="bloodGroup">
                <th mat-header-cell *matHeaderCellDef>Blood Group</th>
                <td mat-cell *matCellDef="let donor">
                  <mat-chip class="blood-group-chip" [class]="'blood-' + donor.bloodGroup">
                    {{donor.bloodGroupDisplay}}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="lastDonation">
                <th mat-header-cell *matHeaderCellDef>Last Donation</th>
                <td mat-cell *matCellDef="let donor">
                  <div *ngIf="donor.lastDonationDate; else noDonation">
                    {{donor.lastDonationDate | date:'shortDate'}}
                    <small>({{donor.daysSinceLastDonation}} days ago)</small>
                  </div>
                  <ng-template #noDonation>
                    <span class="no-donation">Never donated</span>
                  </ng-template>
                </td>
              </ng-container>

              <ng-container matColumnDef="eligibility">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let donor">
                  <mat-chip [class]="donor.isEligibleToDonate ? 'eligible' : 'not-eligible'">
                    <mat-icon>{{donor.isEligibleToDonate ? 'check_circle' : 'block'}}</mat-icon>
                    {{donor.isEligibleToDonate ? 'Eligible' : 'Not Eligible'}}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="contact">
                <th mat-header-cell *matHeaderCellDef>Contact</th>
                <td mat-cell *matCellDef="let donor">
                  <div class="contact-info">
                    <small>{{donor.contactInfo.phone}}</small>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let donor">
                  <div class="action-buttons">
                    <button mat-icon-button (click)="viewProfile(donor)" matTooltip="View Profile">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button 
                            (click)="checkEligibility(donor)" 
                            matTooltip="Check Eligibility"
                            color="primary">
                      <mat-icon>health_and_safety</mat-icon>
                    </button>
                    <button mat-icon-button 
                            (click)="recordDonation(donor)" 
                            matTooltip="Record Donation"
                            color="accent"
                            [disabled]="!donor.isEligibleToDonate">
                      <mat-icon>bloodtype</mat-icon>
                    </button>
                    <button mat-icon-button 
                            (click)="viewHistory(donor)" 
                            matTooltip="Donation History">
                      <mat-icon>history</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <div class="loading-container" *ngIf="loading">
            <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
          </div>

          <div class="no-data" *ngIf="!loading && filteredDonors.length === 0">
            <mat-icon>people_outline</mat-icon>
            <p>No donors found</p>
          </div>
        </mat-card-content>
      </mat-card>
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
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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
        this.snackBar.open('Error loading donors', 'Close', { duration: 3000 });
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
        this.snackBar.open('Error loading eligible donors', 'Close', { duration: 3000 });
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
          this.snackBar.open('Error filtering donors', 'Close', { duration: 3000 });
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
}