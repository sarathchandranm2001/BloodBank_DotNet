import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { AdminService, AdminDashboardStats } from '../../../services/admin.service';
import { ErrorHandlerService, ApiError } from '../../../services/error-handler.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule
  ],
  template: `
    <div class="admin-dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage blood bank operations and monitor system health</p>
        </div>
        <button mat-raised-button color="primary" (click)="refreshData()" [disabled]="isLoading">
          <mat-icon>refresh</mat-icon> Refresh Data
        </button>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="loading-container">
        <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
        <p>Loading dashboard data...</p>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid" *ngIf="!isLoading">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="primary">people</mat-icon>
              <div class="stat-info">
                <h3>{{ totalUsers }}</h3>
                <p>Total Users</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="accent">volunteer_activism</mat-icon>
              <div class="stat-info">
                <h3>{{ totalDonors }}</h3>
                <p>Registered Donors</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="warn">local_hospital</mat-icon>
              <div class="stat-info">
                <h3>{{ totalRecipients }}</h3>
                <p>Recipients</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon style="color: #4caf50">inventory</mat-icon>
              <div class="stat-info">
                <h3>{{ totalBloodUnits }}</h3>
                <p>Blood Units Available</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="warn">assignment</mat-icon>
              <div class="stat-info">
                <h3>{{ pendingRequests }}</h3>
                <p>Pending Requests</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="warn">warning</mat-icon>
              <div class="stat-info">
                <h3>{{ lowStockAlerts }}</h3>
                <p>Low Stock Alerts</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="accent">schedule</mat-icon>
              <div class="stat-info">
                <h3>{{ expiringSoonUnits }}</h3>
                <p>Expiring Soon</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon color="primary">trending_up</mat-icon>
              <div class="stat-info">
                <h3>{{ totalDonationsThisMonth }}</h3>
                <p>Donations This Month</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Management Sections -->
      <div class="management-grid">
        <mat-card class="management-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>people</mat-icon>
              User Management
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage system users, roles, and permissions</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/admin/users">
              Manage Users
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="management-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>inventory</mat-icon>
              Blood Inventory
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Monitor blood stock levels and manage inventory</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/admin/inventory">
              View Inventory
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="management-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>assessment</mat-icon>
              Reports & Analytics
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Generate reports and view system analytics</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/admin/reports">
              View Reports
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="management-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>volunteer_activism</mat-icon>
              Donor Management
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Oversee donor registration and donation activities</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/donors">
              Manage Donors
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .dashboard-header div {
      text-align: left;
    }

    .dashboard-header h1 {
      margin: 0;
      color: #333;
      font-size: 2.5rem;
    }

    .dashboard-header p {
      color: #666;
      font-size: 1.1rem;
      margin: 10px 0 0 0;
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .stat-content mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 2rem;
      font-weight: bold;
      color: #333;
    }

    .stat-info p {
      margin: 5px 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }

    .management-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .management-card {
      transition: transform 0.2s ease-in-out;
    }

    .management-card:hover {
      transform: translateY(-5px);
    }

    .management-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .management-card mat-card-actions {
      padding: 16px;
    }

    @media (max-width: 768px) {
      .admin-dashboard-container {
        padding: 10px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .management-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  totalUsers = 0;
  totalDonors = 0;
  totalRecipients = 0;
  totalBloodUnits = 0;
  pendingRequests = 0;
  lowStockAlerts = 0;
  expiringSoonUnits = 0;
  totalDonationsThisMonth = 0;
  activeUsers = 0;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    
    this.adminService.getDashboardStats().subscribe({
      next: (stats: AdminDashboardStats) => {
        this.totalUsers = stats.totalUsers;
        this.totalDonors = stats.totalDonors;
        this.totalRecipients = stats.totalRecipients;
        this.totalBloodUnits = stats.totalBloodUnits;
        this.pendingRequests = stats.pendingRequests;
        this.lowStockAlerts = stats.lowStockAlerts;
        this.expiringSoonUnits = stats.expiringSoonUnits;
        this.totalDonationsThisMonth = stats.totalDonationsThisMonth;
        this.activeUsers = stats.activeUsers;
        this.isLoading = false;
      },
      error: (error: ApiError) => {
        this.errorHandler.handleApiError(error, 'Loading dashboard data');
        this.isLoading = false;
        this.setDefaultValues();
      }
    });
  }

  private setDefaultValues(): void {
    // Fallback values if API fails
    this.totalUsers = 0;
    this.totalDonors = 0;
    this.totalRecipients = 0;
    this.totalBloodUnits = 0;
    this.pendingRequests = 0;
    this.lowStockAlerts = 0;
    this.expiringSoonUnits = 0;
    this.totalDonationsThisMonth = 0;
    this.activeUsers = 0;
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}