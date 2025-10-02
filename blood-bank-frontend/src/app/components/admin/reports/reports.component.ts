import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService, DonationAnalytics, BloodGroupDistribution } from '../../../services/admin.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="reports-container">
      <div class="header">
        <h1>Reports & Analytics</h1>
        <div class="header-actions">
          <button mat-raised-button color="accent" (click)="refreshData()" [disabled]="isLoading">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
          <button mat-raised-button color="primary" (click)="exportReports()">
            <mat-icon>download</mat-icon>
            Export Reports
          </button>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="loading-container">
        <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
        <p>Loading analytics data...</p>
      </div>

      <mat-tab-group *ngIf="!isLoading">
        <mat-tab label="Donation Analytics">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>volunteer_activism</mat-icon>
                  Donation Statistics
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="report-stats">
                  <div class="stat-item">
                    <h3>{{ donationAnalytics?.totalDonationsThisMonth || 0 }}</h3>
                    <p>Total Donations This Month</p>
                    <small *ngIf="donationAnalytics">
                      {{ getMonthComparison() }}
                    </small>
                  </div>
                  <div class="stat-item">
                    <h3>{{ donationAnalytics?.totalDonationsThisYear || 0 }}</h3>
                    <p>Total Donations This Year</p>
                  </div>
                  <div class="stat-item">
                    <h3>{{ donationAnalytics?.donorRetentionRate || 0 }}%</h3>
                    <p>Donor Retention Rate</p>
                  </div>
                </div>

                <!-- Blood Group Distribution -->
                <div class="blood-group-distribution" *ngIf="donationAnalytics?.bloodGroupDistribution?.length">
                  <h4>Donor Distribution by Blood Group</h4>
                  <div class="distribution-grid">
                    <div class="distribution-item" *ngFor="let item of donationAnalytics?.bloodGroupDistribution">
                      <span class="blood-type">{{ item.bloodGroup }}</span>
                      <span class="donor-count">{{ item.donorCount }} donors</span>
                      <span class="percentage">{{ item.percentage.toFixed(1) }}%</span>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Blood Inventory">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>inventory</mat-icon>
                  Inventory Analytics
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="report-stats">
                  <div class="stat-item">
                    <h3>{{ getTotalBloodUnits() }}</h3>
                    <p>Total Units in Stock</p>
                  </div>
                  <div class="stat-item">
                    <h3>{{ getExpiringSoonUnits() }}</h3>
                    <p>Units Expiring Soon</p>
                  </div>
                  <div class="stat-item">
                    <h3>{{ getLowStockAlertsCount() }}</h3>
                    <p>Low Stock Alerts</p>
                  </div>
                </div>

                <!-- Blood Group Inventory Details -->
                <div class="inventory-details" *ngIf="bloodGroupStats?.length">
                  <h4>Stock Status by Blood Group</h4>
                  <div class="stock-grid">
                    <div class="stock-item" *ngFor="let group of bloodGroupStats">
                      <span class="blood-type">{{ group.bloodGroup }}</span>
                      <span class="stock-count">{{ group.totalUnits }} units</span>
                      <span class="stock-status" [ngClass]="getStockStatusClass(group.totalUnits)">
                        {{ getStockStatus(group.totalUnits) }}
                      </span>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="System Overview">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>dashboard</mat-icon>
                  System Overview
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="report-stats">
                  <div class="stat-item">
                    <h3>{{ dashboardStats?.totalUsers || 0 }}</h3>
                    <p>Total Users</p>
                  </div>
                  <div class="stat-item">
                    <h3>{{ dashboardStats?.pendingRequests || 0 }}</h3>
                    <p>Pending Requests</p>
                  </div>
                  <div class="stat-item">
                    <h3>{{ dashboardStats?.activeUsers || 0 }}</h3>
                    <p>Active Users</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .reports-container {
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

    .tab-content {
      padding: 20px 0;
    }

    .report-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .stat-item {
      text-align: center;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fafafa;
    }

    .stat-item h3 {
      margin: 0;
      font-size: 2.5rem;
      color: #1976d2;
      font-weight: bold;
    }

    .stat-item p {
      margin: 10px 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    @media (max-width: 768px) {
      .reports-container {
        padding: 10px;
      }

      .report-stats {
        grid-template-columns: 1fr;
      }
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

    .blood-group-distribution, .inventory-details {
      margin-top: 30px;
    }

    .blood-group-distribution h4, .inventory-details h4 {
      margin-bottom: 15px;
      color: #333;
    }

    .distribution-grid, .stock-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .distribution-item, .stock-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    }

    .blood-type {
      font-weight: bold;
      color: #d32f2f;
    }

    .stock-status.good { color: #4caf50; }
    .stock-status.low { color: #ff9800; }
    .stock-status.critical { color: #f44336; }

    .stat-item small {
      display: block;
      margin-top: 5px;
      color: #888;
      font-size: 0.8rem;
    }
  `]
})
export class ReportsComponent implements OnInit {
  donationAnalytics: DonationAnalytics | null = null;
  bloodGroupStats: any[] = [];
  dashboardStats: any = null;
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReportsData();
  }

  private loadReportsData(): void {
    this.isLoading = true;
    
    // Load donation analytics
    this.adminService.getDonationAnalytics().subscribe({
      next: (analytics) => {
        this.donationAnalytics = analytics;
        this.loadBloodGroupStats();
      },
      error: (error) => {
        console.error('Error loading donation analytics:', error);
        this.loadBloodGroupStats(); // Continue loading other data
      }
    });
  }

  private loadBloodGroupStats(): void {
    this.adminService.getBloodGroupStats().subscribe({
      next: (stats) => {
        this.bloodGroupStats = stats;
        this.loadDashboardStats();
      },
      error: (error) => {
        console.error('Error loading blood group stats:', error);
        this.loadDashboardStats(); // Continue loading other data
      }
    });
  }

  private loadDashboardStats(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.snackBar.open('Error loading some reports data. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  refreshData(): void {
    this.loadReportsData();
  }

  exportReports(): void {
    this.adminService.exportData('reports', 'csv').subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `blood-bank-reports-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        this.snackBar.open('Reports exported successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error exporting reports:', error);
        this.snackBar.open('Error exporting reports. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  getMonthComparison(): string {
    if (!this.donationAnalytics) return '';
    
    const current = this.donationAnalytics.totalDonationsThisMonth;
    const last = this.donationAnalytics.totalDonationsLastMonth;
    
    if (last === 0) return 'No previous data';
    
    const change = ((current - last) / last * 100);
    const direction = change >= 0 ? '↑' : '↓';
    
    return `${direction} ${Math.abs(change).toFixed(1)}% from last month`;
  }

  getTotalBloodUnits(): number {
    return this.bloodGroupStats?.reduce((total, group) => total + group.totalUnits, 0) || 0;
  }

  getExpiringSoonUnits(): number {
    return this.bloodGroupStats?.reduce((total, group) => total + group.expiringSoonUnits, 0) || 0;
  }

  getLowStockAlertsCount(): number {
    return this.bloodGroupStats?.filter(group => group.isLowStock).length || 0;
  }

  getStockStatus(units: number): string {
    if (units >= 30) return 'Good';
    if (units >= 15) return 'Low';
    return 'Critical';
  }

  getStockStatusClass(units: number): string {
    if (units >= 30) return 'good';
    if (units >= 15) return 'low';
    return 'critical';
  }
}