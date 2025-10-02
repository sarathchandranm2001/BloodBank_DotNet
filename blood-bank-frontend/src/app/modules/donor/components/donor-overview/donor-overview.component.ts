import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DonorService } from '../../../../services/donor.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-donor-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="donor-overview-container">
      <!-- Header -->
      <div class="header-section">
        <h2>
          <i class="bi bi-heart-pulse me-2"></i>
          Donor Overview
        </h2>
        <p class="text-muted">Monitor donor activities and statistics</p>
      </div>

      <!-- Loading State -->
      <div class="text-center py-5" *ngIf="isLoading">
        <div class="spinner-border text-danger" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading donor statistics...</p>
      </div>

      <!-- Error State -->
      <div class="alert alert-danger" *ngIf="error && !isLoading">
        <i class="bi bi-exclamation-triangle me-2"></i>
        {{ error }}
        <button class="btn btn-outline-danger btn-sm ms-2" (click)="loadDashboardData()">
          Try Again
        </button>
      </div>

      <!-- Dashboard Content -->
      <div *ngIf="!isLoading && !error">
        <!-- Statistics Cards -->
        <div class="stats-grid mb-4">
          <div class="stat-card primary">
            <div class="stat-icon">
              <i class="bi bi-people"></i>
            </div>
            <div class="stat-content">
              <h3>{{ dashboardStats?.totalActiveDonors || 0 }}</h3>
              <p>Total Donors</p>
            </div>
          </div>

          <div class="stat-card success">
            <div class="stat-icon">
              <i class="bi bi-check-circle"></i>
            </div>
            <div class="stat-content">
              <h3>{{ dashboardStats?.eligibleDonors || 0 }}</h3>
              <p>Eligible Donors</p>
            </div>
          </div>

          <div class="stat-card info">
            <div class="stat-icon">
              <i class="bi bi-calendar-month"></i>
            </div>
            <div class="stat-content">
              <h3>{{ dashboardStats?.donationsThisMonth || 0 }}</h3>
              <p>Donations This Month</p>
            </div>
          </div>

          <div class="stat-card warning">
            <div class="stat-icon">
              <i class="bi bi-droplet"></i>
            </div>
            <div class="stat-content">
              <h3>{{ dashboardStats?.totalVolumeThisMonth || 0 }} ml</h3>
              <p>Volume This Month</p>
            </div>
          </div>
        </div>

        <!-- Annual Statistics -->
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-calendar-year me-2"></i>
                  This Year Statistics
                </h5>
              </div>
              <div class="card-body">
                <div class="year-stats">
                  <div class="year-stat-item">
                    <span class="label">Total Donations:</span>
                    <span class="value">{{ dashboardStats?.donationsThisYear || 0 }}</span>
                  </div>
                  <div class="year-stat-item">
                    <span class="label">Total Volume:</span>
                    <span class="value">{{ dashboardStats?.totalVolumeThisYear || 0 }} ml</span>
                  </div>
                  <div class="year-stat-item">
                    <span class="label">Average per Month:</span>
                    <span class="value">{{ getAveragePerMonth() }} donations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-graph-up me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <button 
                    class="btn btn-primary" 
                    routerLink="/donors/list"
                    *ngIf="currentUser?.role === 'Admin'">
                    <i class="bi bi-people me-2"></i>
                    View All Donors
                  </button>
                  
                  <button 
                    class="btn btn-success" 
                    routerLink="/donors/register"
                    *ngIf="currentUser?.role === 'Admin'">
                    <i class="bi bi-person-plus me-2"></i>
                    Register New Donor
                  </button>
                  
                  <button 
                    class="btn btn-info" 
                    routerLink="/donors/eligible">
                    <i class="bi bi-check2-circle me-2"></i>
                    View Eligible Donors
                  </button>
                  
                  <button 
                    class="btn btn-outline-primary" 
                    (click)="refreshData()">
                    <i class="bi bi-arrow-clockwise me-2"></i>
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Blood Group Statistics -->
        <div class="card mb-4" *ngIf="dashboardStats?.bloodGroupStats?.length">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-bar-chart me-2"></i>
              Blood Group Distribution
            </h5>
          </div>
          <div class="card-body">
            <div class="blood-group-grid">
              <div class="blood-group-card" *ngFor="let group of dashboardStats.bloodGroupStats">
                <div class="blood-group-header">
                  <span class="blood-type">{{ group.bloodGroup }}</span>
                  <span class="donor-count">{{ group.donorCount }} donors</span>
                </div>
                <div class="blood-group-stats">
                  <div class="stat-row">
                    <span>This Month:</span>
                    <span>{{ group.donationsThisMonth }} donations</span>
                  </div>
                  <div class="stat-row">
                    <span>Total Volume:</span>
                    <span>{{ group.totalVolume }} ml</span>
                  </div>
                  <div class="stat-row" *ngIf="group.lastDonation">
                    <span>Last Donation:</span>
                    <span>{{ group.lastDonation | date:'shortDate' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Donations -->
        <div class="card" *ngIf="dashboardStats?.recentDonations?.length">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-clock-history me-2"></i>
              Recent Donations
            </h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Donor</th>
                    <th>Blood Group</th>
                    <th>Date</th>
                    <th>Volume</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let donation of dashboardStats.recentDonations">
                    <td>{{ donation.donorName }}</td>
                    <td>
                      <span class="badge bg-danger">{{ donation.bloodGroup }}</span>
                    </td>
                    <td>{{ donation.donationDate | date:'shortDate' }}</td>
                    <td>{{ donation.volume }} ml</td>
                    <td>
                      <span class="badge" 
                            [class.bg-success]="donation.status === 'Completed'"
                            [class.bg-warning]="donation.status === 'Pending'">
                        {{ donation.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .donor-overview-container {
      padding: 20px;
    }

    .header-section {
      margin-bottom: 30px;
    }

    .header-section h2 {
      color: #dc3545;
      font-weight: 600;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-card.primary { border-left: 4px solid #007bff; }
    .stat-card.success { border-left: 4px solid #28a745; }
    .stat-card.info { border-left: 4px solid #17a2b8; }
    .stat-card.warning { border-left: 4px solid #ffc107; }

    .stat-icon {
      font-size: 2.5em;
      opacity: 0.8;
    }

    .stat-card.primary .stat-icon { color: #007bff; }
    .stat-card.success .stat-icon { color: #28a745; }
    .stat-card.info .stat-icon { color: #17a2b8; }
    .stat-card.warning .stat-icon { color: #ffc107; }

    .stat-content h3 {
      font-size: 2em;
      font-weight: bold;
      margin: 0;
      color: #333;
    }

    .stat-content p {
      margin: 0;
      color: #666;
      font-weight: 500;
    }

    .year-stats {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .year-stat-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }

    .year-stat-item:last-child {
      border-bottom: none;
    }

    .year-stat-item .label {
      font-weight: 500;
      color: #666;
    }

    .year-stat-item .value {
      font-weight: bold;
      color: #333;
    }

    .blood-group-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .blood-group-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      border: 1px solid #e9ecef;
    }

    .blood-group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #dc3545;
    }

    .blood-type {
      font-size: 1.5em;
      font-weight: bold;
      color: #dc3545;
    }

    .donor-count {
      background: #dc3545;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.9em;
      font-weight: 500;
    }

    .blood-group-stats {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.9em;
    }

    .stat-row span:first-child {
      color: #666;
    }

    .stat-row span:last-child {
      font-weight: 500;
      color: #333;
    }

    @media (max-width: 768px) {
      .donor-overview-container {
        padding: 15px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .stat-card {
        padding: 20px;
      }

      .blood-group-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DonorOverviewComponent implements OnInit {
  dashboardStats: any = null;
  isLoading = true;
  error: string | null = null;
  currentUser: any = null;

  constructor(
    private donorService: DonorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;

    this.donorService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.error = 'Failed to load dashboard statistics. Please try again.';
        this.isLoading = false;
      }
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  getAveragePerMonth(): number {
    if (!this.dashboardStats?.donationsThisYear) return 0;
    const currentMonth = new Date().getMonth() + 1;
    return Math.round(this.dashboardStats.donationsThisYear / currentMonth);
  }
}