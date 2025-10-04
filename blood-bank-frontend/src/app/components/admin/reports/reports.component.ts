import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { DonationAnalytics, BloodGroupDistribution } from '../../../models/admin.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="reports-container">
      <div class="header d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">Reports & Analytics</h1>
        <div class="header-actions">
          <button class="btn btn-outline-primary me-2" (click)="refreshData()" [disabled]="isLoading">
            <i class="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </button>
          <button class="btn btn-primary" (click)="exportReports()">
            <i class="bi bi-download me-1"></i>
            Export Reports
          </button>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="loading-container text-center py-5">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading analytics data...</p>
      </div>

      <!-- Bootstrap Tabs -->
      <div *ngIf="!isLoading">
        <ul class="nav nav-tabs" id="reportsTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="donations-tab" data-bs-toggle="tab" 
                    data-bs-target="#donations-pane" type="button" role="tab">
              <i class="bi bi-heart me-2"></i>Donation Analytics
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="inventory-tab" data-bs-toggle="tab" 
                    data-bs-target="#inventory-pane" type="button" role="tab">
              <i class="bi bi-box-seam me-2"></i>Blood Inventory
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="overview-tab" data-bs-toggle="tab" 
                    data-bs-target="#overview-pane" type="button" role="tab">
              <i class="bi bi-speedometer2 me-2"></i>System Overview
            </button>
          </li>
        </ul>

        <div class="tab-content" id="reportsTabContent">
          <!-- Donation Analytics Tab -->
          <div class="tab-pane fade show active" id="donations-pane" role="tabpanel">
            <div class="tab-content-wrapper">
              <div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-heart-fill text-danger me-2"></i>
                    Donation Statistics
                  </h5>
                </div>
                <div class="card-body">
                  <div class="report-stats">
                    <div class="stat-item">
                      <h3>{{ donationAnalytics?.totalDonationsThisMonth || 0 }}</h3>
                      <p>Total Donations This Month</p>
                      <small *ngIf="donationAnalytics" class="text-muted">
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
                </div>
              </div>
            </div>
          </div>

          <!-- Blood Inventory Tab -->
          <div class="tab-pane fade" id="inventory-pane" role="tabpanel">
            <div class="tab-content-wrapper">
              <div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-box-seam text-info me-2"></i>
                    Inventory Analytics
                  </h5>
                </div>
                <div class="card-body">
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
                </div>
              </div>
            </div>
          </div>

          <!-- System Overview Tab -->
          <div class="tab-pane fade" id="overview-pane" role="tabpanel">
            <div class="tab-content-wrapper">
              <div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">
                    <i class="bi bi-speedometer2 text-success me-2"></i>
                    System Overview
                  </h5>
                </div>
                <div class="card-body">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .tab-content-wrapper {
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
      border: 1px solid #dee2e6;
      border-radius: 8px;
      background: #f8f9fa;
      transition: transform 0.2s ease;
    }

    .stat-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .stat-item h3 {
      margin: 0;
      font-size: 2.5rem;
      color: #0d6efd;
      font-weight: bold;
    }

    .stat-item p {
      margin: 10px 0 0 0;
      color: #6c757d;
      font-size: 0.9rem;
    }

    .stat-item small {
      display: block;
      margin-top: 5px;
      color: #6c757d;
      font-size: 0.8rem;
    }

    .nav-tabs .nav-link {
      color: #495057;
      border: 1px solid transparent;
    }

    .nav-tabs .nav-link.active {
      color: #0d6efd;
      background-color: #fff;
      border-color: #dee2e6 #dee2e6 #fff;
    }

    .nav-tabs .nav-link:hover {
      color: #0d6efd;
      background-color: #e9ecef;
    }

    @media (max-width: 768px) {
      .reports-container {
        padding: 10px;
      }

      .report-stats {
        grid-template-columns: 1fr;
      }

      .header-actions {
        flex-direction: column;
        gap: 8px;
      }

      .header-actions .btn {
        font-size: 0.875rem;
      }
    }

    .blood-group-distribution, .inventory-details {
      margin-top: 30px;
    }

    .blood-group-distribution h4, .inventory-details h4 {
      margin-bottom: 15px;
      color: #212529;
      font-weight: 600;
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
      border: 1px solid #dee2e6;
      border-radius: 6px;
      background: white;
      transition: background-color 0.2s ease;
    }

    .distribution-item:hover, .stock-item:hover {
      background-color: #f8f9fa;
    }

    .blood-type {
      font-weight: bold;
      color: #dc3545;
    }

    .stock-status.good { color: #198754; font-weight: 600; }
    .stock-status.low { color: #fd7e14; font-weight: 600; }
    .stock-status.critical { color: #dc3545; font-weight: 600; }

    .card-header h5 {
      display: flex;
      align-items: center;
    }
  `]
})
export class ReportsComponent implements OnInit {
  donationAnalytics: DonationAnalytics | null = null;
  bloodGroupStats: any[] = [];
  dashboardStats: any = null;
  isLoading = true;

  constructor(
    private adminService: AdminService
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
        alert('Error loading some reports data. Please try again.');
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
        
        alert('Reports exported successfully');
      },
      error: (error) => {
        console.error('Error exporting reports:', error);
        alert('Error exporting reports. Please try again.');
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