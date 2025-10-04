import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    RouterModule
  ],
  template: `
    <div class="availability-container">
      <div class="header d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">Blood Availability</h1>
        <button class="btn btn-primary" routerLink="/recipient/request-blood">
          <i class="bi bi-plus-circle me-1"></i>
          Request Blood
        </button>
      </div>

      <!-- Search Section -->
      <div class="card search-card mb-4">
        <div class="card-header">
          <h5 class="card-title mb-0">Check Blood Availability</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Blood Group</label>
              <select class="form-select" [(ngModel)]="selectedBloodGroup" (change)="filterByBloodGroup()">
                <option value="">All Blood Groups</option>
                <option *ngFor="let group of bloodGroups" [value]="group">
                  {{ bloodGroupNames[group] }}
                </option>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label">Minimum Units Required</label>
              <input type="number" class="form-control" [(ngModel)]="minUnitsRequired" 
                     (input)="filterByUnits()" placeholder="Enter minimum units">
            </div>

            <div class="col-md-4 d-flex align-items-end gap-2">
              <button class="btn btn-outline-secondary" (click)="clearFilters()">
                <i class="bi bi-x-circle me-1"></i>
                Clear Filters
              </button>

              <button class="btn btn-primary" (click)="refreshData()">
                <i class="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Availability Grid -->
      <div class="availability-grid row g-3" *ngIf="!isLoading && filteredAvailability.length > 0">
        <div class="col-md-6 col-lg-4" *ngFor="let stock of filteredAvailability">
          <div class="card blood-card h-100" [ngClass]="getAvailabilityClass(stock)">
            <div class="card-header">
              <div class="blood-header d-flex justify-content-between align-items-center">
                <div class="blood-group d-flex align-items-center">
                  <i class="bi bi-droplet-fill blood-icon me-2"></i>
                  <h5 class="mb-0">{{ bloodGroupNames[stock.bloodGroup] }}</h5>
                </div>
                <div class="availability-status">
                  <i class="bi bi-{{ getAvailabilityIcon(stock) }}"></i>
                </div>
              </div>
            </div>

            <div class="card-body">
              <div class="stock-info">
                <div class="units-available text-center mb-3">
                  <span class="units-number display-4 fw-bold text-primary">{{ stock.availableUnits }}</span>
                  <div class="units-label text-muted">Units Available</div>
                </div>

                <div class="stock-details">
                  <div class="detail-item d-flex align-items-center mb-2" *ngIf="stock.expiryDate">
                    <i class="bi bi-clock me-2"></i>
                    <span>Expires: {{ stock.expiryDate | date:'short' }}</span>
                  </div>
                  
                  <div class="detail-item d-flex align-items-center mb-2">
                    <i class="bi bi-arrow-clockwise me-2"></i>
                    <span>Updated: {{ stock.lastUpdated | date:'short' }}</span>
                  </div>
                </div>

                <div class="availability-message">
                  <p class="text-muted mb-0">{{ getAvailabilityMessage(stock) }}</p>
                </div>
              </div>
            </div>

            <div class="card-footer bg-transparent">
              <div class="d-grid gap-2">
                <button class="btn btn-primary" 
                        routerLink="/recipient/request-blood"
                        [queryParams]="{bloodGroup: stock.bloodGroup}"
                        [disabled]="stock.availableUnits === 0">
                  <i class="bi bi-plus-circle me-1"></i>
                  Request This Blood
                </button>
                
                <button class="btn btn-outline-info btn-sm" (click)="getDetailedInfo(stock.bloodGroup)">
                  <i class="bi bi-info-circle me-1"></i>
                  More Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Card -->
      <div class="card summary-card mt-4" *ngIf="!isLoading && availability.length > 0">
        <div class="card-header">
          <h5 class="card-title mb-0">Availability Summary</h5>
        </div>
        <div class="card-body">
          <div class="summary-stats row text-center">
            <div class="col-md-4">
              <div class="stat-item">
                <span class="stat-number display-5 fw-bold text-info">{{ getTotalUnits() }}</span>
                <div class="stat-label text-muted">Total Units</div>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="stat-item">
                <span class="stat-number display-5 fw-bold text-success">{{ getAvailableGroups() }}</span>
                <div class="stat-label text-muted">Blood Groups Available</div>
              </div>
            </div>
            
            <div class="col-md-4">
              <div class="stat-item">
                <span class="stat-number display-5 fw-bold text-warning">{{ getCriticalGroups() }}</span>
                <div class="stat-label text-muted">Critical Stock</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state text-center py-5" *ngIf="!isLoading && filteredAvailability.length === 0">
        <i class="bi bi-search display-1 text-muted mb-3"></i>
        <h2>No blood availability data</h2>
        <p class="text-muted">{{ availability.length === 0 ? "No blood stock information available." : "No blood groups match your current filters." }}</p>
        <div class="mt-3">
          <button class="btn btn-outline-secondary me-2" (click)="clearFilters()" 
                  *ngIf="availability.length > 0">
            <i class="bi bi-x-circle me-1"></i>
            Clear Filters
          </button>
          <button class="btn btn-primary" (click)="refreshData()">
            <i class="bi bi-arrow-clockwise me-1"></i>
            Refresh Data
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-container text-center py-5" *ngIf="isLoading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Loading blood availability...</p>
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
    private recipientService: RecipientService
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
      case 'available': return 'check-circle-fill';
      case 'limited': return 'exclamation-triangle-fill';
      case 'critical': return 'exclamation-circle-fill';
      case 'unavailable': return 'x-circle-fill';
      default: return 'question-circle-fill';
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
    alert(message);
  }
}