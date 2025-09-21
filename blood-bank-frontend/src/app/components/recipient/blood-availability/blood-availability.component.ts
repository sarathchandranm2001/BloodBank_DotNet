import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { RecipientService } from '../../../services/recipient.service';
import { BloodGroup, BloodGroupNames } from '../../../models/common.model';

interface BloodStock {
  bloodGroup: BloodGroup;
  availableUnits: number;
  expiryDate?: Date;
  lastUpdated: Date;
}

@Component({
  selector: 'app-blood-availability',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  template: `
    <div class="availability-container">
      <div class="header">
        <h1>Blood Availability</h1>
        <button mat-raised-button color="primary" routerLink="/recipient/request-blood">
          <mat-icon>add</mat-icon>
          Request Blood
        </button>
      </div>

      <!-- Search Section -->
      <mat-card class="search-card">
        <mat-card-header>
          <mat-card-title>Check Blood Availability</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="search-form">
            <mat-form-field appearance="outline">
              <mat-label>Blood Group</mat-label>
              <mat-select [(value)]="selectedBloodGroup" (selectionChange)="filterByBloodGroup()">
                <mat-option value="">All Blood Groups</mat-option>
                <mat-option *ngFor="let group of bloodGroups" [value]="group">
                  {{ bloodGroupNames[group] }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Minimum Units Required</mat-label>
              <input matInput type="number" [(ngModel)]="minUnitsRequired" 
                     (input)="filterByUnits()" placeholder="Enter minimum units">
            </mat-form-field>

            <button mat-stroked-button (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Clear Filters
            </button>

            <button mat-raised-button (click)="refreshData()">
              <mat-icon>refresh</mat-icon>
              Refresh
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Availability Grid -->
      <div class="availability-grid" *ngIf="!isLoading && filteredAvailability.length > 0">
        <mat-card *ngFor="let stock of filteredAvailability" class="blood-card" 
                  [ngClass]="getAvailabilityClass(stock)">
          <mat-card-header>
            <div class="blood-header">
              <div class="blood-group">
                <mat-icon class="blood-icon">bloodtype</mat-icon>
                <h2>{{ bloodGroupNames[stock.bloodGroup] }}</h2>
              </div>
              <div class="availability-status">
                <mat-icon>{{ getAvailabilityIcon(stock) }}</mat-icon>
              </div>
            </div>
          </mat-card-header>

          <mat-card-content>
            <div class="stock-info">
              <div class="units-available">
                <span class="units-number">{{ stock.availableUnits }}</span>
                <span class="units-label">Units Available</span>
              </div>

              <div class="stock-details">
                <div class="detail-item" *ngIf="stock.expiryDate">
                  <mat-icon>schedule</mat-icon>
                  <span>Expires: {{ stock.expiryDate | date:'short' }}</span>
                </div>
                
                <div class="detail-item">
                  <mat-icon>update</mat-icon>
                  <span>Updated: {{ stock.lastUpdated | date:'short' }}</span>
                </div>
              </div>

              <div class="availability-message">
                <p>{{ getAvailabilityMessage(stock) }}</p>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-raised-button color="primary" 
                    routerLink="/recipient/request-blood"
                    [queryParams]="{bloodGroup: stock.bloodGroup}"
                    [disabled]="stock.availableUnits === 0">
              <mat-icon>add</mat-icon>
              Request This Blood
            </button>
            
            <button mat-button (click)="getDetailedInfo(stock.bloodGroup)">
              <mat-icon>info</mat-icon>
              More Info
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Summary Card -->
      <mat-card class="summary-card" *ngIf="!isLoading && availability.length > 0">
        <mat-card-header>
          <mat-card-title>Availability Summary</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-number">{{ getTotalUnits() }}</span>
              <span class="stat-label">Total Units</span>
            </div>
            
            <div class="stat-item">
              <span class="stat-number">{{ getAvailableGroups() }}</span>
              <span class="stat-label">Blood Groups Available</span>
            </div>
            
            <div class="stat-item">
              <span class="stat-number">{{ getCriticalGroups() }}</span>
              <span class="stat-label">Critical Stock</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!isLoading && filteredAvailability.length === 0">
        <mat-icon>search_off</mat-icon>
        <h2>No blood availability data</h2>
        <p>{{ availability.length === 0 ? "No blood stock information available." : "No blood groups match your current filters." }}</p>
        <button mat-stroked-button (click)="clearFilters()" 
                *ngIf="availability.length > 0">
          <mat-icon>clear</mat-icon>
          Clear Filters
        </button>
        <button mat-raised-button (click)="refreshData()">
          <mat-icon>refresh</mat-icon>
          Refresh Data
        </button>
      </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner></mat-spinner>
        <p>Loading blood availability...</p>
      </div>
    </div>
  `,
  styles: [`
    .availability-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .search-card {
      margin-bottom: 30px;
    }

    .search-form {
      display: flex;
      gap: 20px;
      align-items: center;
      flex-wrap: wrap;
    }

    .availability-grid {
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      margin-bottom: 30px;
    }

    .blood-card {
      height: fit-content;
      transition: transform 0.2s ease-in-out;
    }

    .blood-card:hover {
      transform: translateY(-2px);
    }

    .blood-card.available {
      border-left: 4px solid #4caf50;
    }

    .blood-card.limited {
      border-left: 4px solid #ff9800;
    }

    .blood-card.critical {
      border-left: 4px solid #f44336;
    }

    .blood-card.unavailable {
      border-left: 4px solid #9e9e9e;
      opacity: 0.7;
    }

    .blood-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .blood-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .blood-group h2 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .blood-icon {
      color: #e91e63;
      font-size: 24px;
    }

    .availability-status mat-icon {
      font-size: 24px;
    }

    .availability-status .available-icon {
      color: #4caf50;
    }

    .availability-status .limited-icon {
      color: #ff9800;
    }

    .availability-status .critical-icon {
      color: #f44336;
    }

    .availability-status .unavailable-icon {
      color: #9e9e9e;
    }

    .stock-info {
      padding: 15px 0;
    }

    .units-available {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
      padding: 20px;
      background-color: #f5f5f5;
      border-radius: 12px;
    }

    .units-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: #333;
    }

    .units-label {
      color: #666;
      font-size: 0.9rem;
    }

    .stock-details {
      margin-bottom: 15px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: #666;
    }

    .detail-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .availability-message {
      text-align: center;
      padding: 10px;
      border-radius: 8px;
      margin: 15px 0;
    }

    .blood-card.available .availability-message {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .blood-card.limited .availability-message {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .blood-card.critical .availability-message {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .blood-card.unavailable .availability-message {
      background-color: #f5f5f5;
      color: #616161;
    }

    .summary-card {
      margin-bottom: 30px;
    }

    .summary-stats {
      display: flex;
      justify-content: space-around;
      text-align: center;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #e91e63;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 20px;
    }

    .empty-state h2 {
      color: #666;
      margin-bottom: 10px;
    }

    .empty-state p {
      color: #999;
      margin-bottom: 20px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
    }

    .loading-container mat-spinner {
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .availability-grid {
        grid-template-columns: 1fr;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }

      .search-form {
        flex-direction: column;
        align-items: stretch;
      }

      .summary-stats {
        flex-direction: column;
        gap: 20px;
      }
    }
  `]
})
export class BloodAvailabilityComponent implements OnInit {
  availability: BloodStock[] = [];
  filteredAvailability: BloodStock[] = [];
  isLoading = false;
  
  selectedBloodGroup = '';
  minUnitsRequired: number | null = null;
  
  bloodGroups = Object.values(BloodGroup);
  bloodGroupNames: { [key: string]: string } = BloodGroupNames;

  constructor(
    private recipientService: RecipientService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAvailability();
  }

  loadAvailability(): void {
    this.isLoading = true;
    this.recipientService.getBloodAvailability().subscribe({
      next: (data: any[]) => {
        this.availability = data.map(item => ({
          ...item,
          lastUpdated: new Date(item.lastUpdated),
          expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined
        }));
        this.applyFilters();
      },
      error: (error: any) => {
        console.error('Failed to load availability:', error);
        this.showMessage('Failed to load blood availability');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  refreshData(): void {
    this.loadAvailability();
  }

  filterByBloodGroup(): void {
    this.applyFilters();
  }

  filterByUnits(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredAvailability = this.availability.filter(stock => {
      const groupMatch = !this.selectedBloodGroup || stock.bloodGroup.toString() === this.selectedBloodGroup;
      const unitsMatch = !this.minUnitsRequired || stock.availableUnits >= this.minUnitsRequired;
      
      return groupMatch && unitsMatch;
    });
  }

  clearFilters(): void {
    this.selectedBloodGroup = '';
    this.minUnitsRequired = null;
    this.applyFilters();
  }

  getAvailabilityClass(stock: BloodStock): string {
    if (stock.availableUnits === 0) return 'unavailable';
    if (stock.availableUnits <= 5) return 'critical';
    if (stock.availableUnits <= 20) return 'limited';
    return 'available';
  }

  getAvailabilityIcon(stock: BloodStock): string {
    const className = this.getAvailabilityClass(stock);
    switch (className) {
      case 'available': return 'check_circle';
      case 'limited': return 'warning';
      case 'critical': return 'error';
      case 'unavailable': return 'cancel';
      default: return 'help';
    }
  }

  getAvailabilityMessage(stock: BloodStock): string {
    const className = this.getAvailabilityClass(stock);
    switch (className) {
      case 'available': return 'Good availability - suitable for requests';
      case 'limited': return 'Limited stock - request promptly';
      case 'critical': return 'Critical stock levels - urgent requests only';
      case 'unavailable': return 'Currently unavailable';
      default: return 'Status unknown';
    }
  }

  getTotalUnits(): number {
    return this.availability.reduce((total, stock) => total + stock.availableUnits, 0);
  }

  getAvailableGroups(): number {
    return this.availability.filter(stock => stock.availableUnits > 0).length;
  }

  getCriticalGroups(): number {
    return this.availability.filter(stock => stock.availableUnits > 0 && stock.availableUnits <= 5).length;
  }

  getDetailedInfo(bloodGroup: BloodGroup): void {
    this.recipientService.getBloodAvailabilityByGroup(bloodGroup.toString()).subscribe({
      next: (details: any) => {
        // Show detailed information in a dialog or navigate to details page
        console.log('Detailed info for', bloodGroup, details);
        this.showMessage(`${this.bloodGroupNames[bloodGroup]}: ${details.availableUnits} units available`);
      },
      error: (error: any) => {
        console.error('Failed to get detailed info:', error);
        this.showMessage('Failed to get detailed information');
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