import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService, BloodGroupStats, SystemAlert } from '../../../services/admin.service';

@Component({
  selector: 'app-blood-inventory',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="inventory-container">
      <div class="header">
        <h1>Blood Inventory Management</h1>
        <div class="header-actions">
          <button mat-raised-button color="accent" (click)="refreshData()" [disabled]="isLoading">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
          <button mat-raised-button color="primary">
            <mat-icon>add</mat-icon>
            Add Blood Stock
          </button>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="loading-container">
        <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
        <p>Loading inventory data...</p>
      </div>

      <div class="inventory-grid" *ngIf="!isLoading">
        <mat-card class="stock-summary">
          <mat-card-header>
            <mat-card-title>Stock Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="blood-groups" *ngIf="bloodGroups.length > 0; else noDataTemplate">
              <div class="blood-group-item" *ngFor="let group of bloodGroups">
                <span class="blood-type">{{ group.bloodGroup }}</span>
                <span class="units">{{ group.totalUnits }} units</span>
                <mat-chip [ngClass]="getStockClass(group.totalUnits)">
                  {{ getStockStatus(group.totalUnits) }}
                </mat-chip>
                <div class="additional-info">
                  <small *ngIf="group.expiringSoonUnits > 0" class="expiring-info">
                    {{ group.expiringSoonUnits }} expiring soon
                  </small>
                </div>
              </div>
            </div>
            <ng-template #noDataTemplate>
              <div class="no-data">
                <mat-icon>info</mat-icon>
                <p>No blood inventory data available</p>
              </div>
            </ng-template>
          </mat-card-content>
        </mat-card>

        <mat-card class="alerts">
          <mat-card-header>
            <mat-card-title>
              <mat-icon color="warn">warning</mat-icon>
              System Alerts
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="alerts.length > 0; else noAlertsTemplate">
              <div class="alert-item" *ngFor="let alert of alerts">
                <mat-icon [class]="'severity-' + alert.severity">{{ alert.icon }}</mat-icon>
                <span>{{ alert.message }}</span>
              </div>
            </div>
            <ng-template #noAlertsTemplate>
              <div class="no-alerts">
                <mat-icon color="primary">check_circle</mat-icon>
                <p>No active alerts</p>
              </div>
            </ng-template>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="inventory-details" *ngIf="!isLoading">
        <mat-card-header>
          <mat-card-title>Detailed Inventory</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Real-time blood inventory tracking with expiry monitoring and stock management.</p>
          <div class="inventory-stats">
            <div class="stat-item">
              <h4>Total Units</h4>
              <p>{{ getTotalUnits() }}</p>
            </div>
            <div class="stat-item">
              <h4>Low Stock Alerts</h4>
              <p>{{ getLowStockCount() }}</p>
            </div>
            <div class="stat-item">
              <h4>Expiring Soon</h4>
              <p>{{ getExpiringSoonCount() }}</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .inventory-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      text-align: center;
    }

    .loading-container p {
      margin-top: 20px;
      color: #666;
      font-size: 1.1rem;
    }

    .inventory-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .blood-groups {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .blood-group-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .blood-type {
      font-weight: bold;
      color: #d32f2f;
    }

    .alert-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      padding: 8px;
      background: #fff3e0;
      border-radius: 4px;
    }

    .no-data, .no-alerts {
      text-align: center;
      padding: 20px;
      color: #666;
    }

    .no-data mat-icon, .no-alerts mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      margin-bottom: 10px;
    }

    .additional-info {
      font-size: 0.8rem;
      color: #666;
      margin-top: 4px;
    }

    .expiring-info {
      color: #ff9800;
      font-weight: 500;
    }

    .inventory-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .stat-item {
      text-align: center;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .stat-item h4 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 0.9rem;
    }

    .stat-item p {
      margin: 0;
      font-size: 1.5rem;
      font-weight: bold;
      color: #1976d2;
    }

    .severity-critical { color: #f44336; }
    .severity-warning { color: #ff9800; }
    .severity-info { color: #2196f3; }

    .high-stock { background-color: #4caf50; }
    .medium-stock { background-color: #ff9800; }
    .low-stock { background-color: #f44336; }

    @media (max-width: 768px) {
      .inventory-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BloodInventoryComponent implements OnInit {
  bloodGroups: BloodGroupStats[] = [];
  alerts: SystemAlert[] = [];
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInventoryData();
  }

  private loadInventoryData(): void {
    this.isLoading = true;
    
    // Load blood group statistics
    this.adminService.getBloodGroupStats().subscribe({
      next: (stats) => {
        this.bloodGroups = stats;
        this.loadAlerts();
      },
      error: (error) => {
        console.error('Error loading blood group stats:', error);
        this.snackBar.open('Error loading inventory data. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  private loadAlerts(): void {
    this.adminService.getRecentActivity().subscribe({
      next: (activity) => {
        this.alerts = activity.systemAlerts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading alerts:', error);
        this.alerts = [];
        this.isLoading = false;
      }
    });
  }

  refreshData(): void {
    this.loadInventoryData();
  }

  getStockClass(units: number): string {
    if (units >= 30) return 'high-stock';
    if (units >= 15) return 'medium-stock';
    return 'low-stock';
  }

  getStockStatus(units: number): string {
    if (units >= 30) return 'Good';
    if (units >= 15) return 'Low';
    return 'Critical';
  }

  getTotalUnits(): number {
    return this.bloodGroups.reduce((total, group) => total + group.totalUnits, 0);
  }

  getLowStockCount(): number {
    return this.bloodGroups.filter(group => group.isLowStock).length;
  }

  getExpiringSoonCount(): number {
    return this.bloodGroups.reduce((total, group) => total + group.expiringSoonUnits, 0);
  }
}