import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AdminService, AdminDashboardStats } from '../../../services/admin.service';
import { ErrorHandlerService, ApiError } from '../../../services/error-handler.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="display-5 fw-bold text-dark">Admin Dashboard</h1>
          <p class="text-muted fs-5">Manage blood bank operations and monitor system health</p>
        </div>
        <button class="btn btn-primary" (click)="refreshData()" [disabled]="isLoading">
          <i class="bi bi-arrow-clockwise me-2"></i>Refresh Data
        </button>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="d-flex flex-column justify-content-center align-items-center py-5">
        <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted fs-5">Loading dashboard data...</p>
      </div>

      <!-- Quick Stats -->
      <div class="row g-4 mb-5" *ngIf="!isLoading">
        <div class="col-md-6 col-lg-4 col-xl-3">
          <div class="card h-100 shadow-sm border-0 bg-gradient" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div class="card-body text-white">
              <div class="d-flex align-items-center">
                <i class="bi bi-people-fill fs-1 me-3"></i>
                <div>
                  <h3 class="fw-bold mb-1">{{ totalUsers }}</h3>
                  <p class="mb-0 opacity-75">Total Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 col-xl-3">
          <div class="card h-100 shadow-sm border-0 bg-gradient" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <div class="card-body text-white">
              <div class="d-flex align-items-center">
                <i class="bi bi-heart-fill fs-1 me-3"></i>
                <div>
                  <h3 class="fw-bold mb-1">{{ totalDonors }}</h3>
                  <p class="mb-0 opacity-75">Registered Donors</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 col-xl-3">
          <div class="card h-100 shadow-sm border-0 bg-gradient" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            <div class="card-body text-white">
              <div class="d-flex align-items-center">
                <i class="bi bi-hospital-fill fs-1 me-3"></i>
                <div>
                  <h3 class="fw-bold mb-1">{{ totalRecipients }}</h3>
                  <p class="mb-0 opacity-75">Recipients</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 col-xl-3">
          <div class="card h-100 shadow-sm border-0 bg-gradient" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
            <div class="card-body text-white">
              <div class="d-flex align-items-center">
                <i class="bi bi-droplet-fill fs-1 me-3"></i>
                <div>
                  <h3 class="fw-bold mb-1">{{ totalBloodUnits }}</h3>
                  <p class="mb-0 opacity-75">Blood Units Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 col-xl-3">
          <div class="card h-100 shadow-sm border-0 bg-gradient" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
            <div class="card-body text-white">
              <div class="d-flex align-items-center">
                <i class="bi bi-clipboard-check-fill fs-1 me-3"></i>
                <div>
                  <h3 class="fw-bold mb-1">{{ pendingRequests }}</h3>
                  <p class="mb-0 opacity-75">Pending Requests</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 col-xl-3">
          <div class="card h-100 shadow-sm border-0 bg-gradient" style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);">
            <div class="card-body text-white">
              <div class="d-flex align-items-center">
                <i class="bi bi-exclamation-triangle-fill fs-1 me-3"></i>
                <div>
                  <h3 class="fw-bold mb-1">{{ lowStockAlerts }}</h3>
                  <p class="mb-0 opacity-75">Low Stock Alerts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 col-xl-3">
          <div class="card h-100 shadow-sm border-0 bg-gradient" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
            <div class="card-body text-dark">
              <div class="d-flex align-items-center">
                <i class="bi bi-clock-fill fs-1 me-3"></i>
                <div>
                  <h3 class="fw-bold mb-1">{{ expiringSoonUnits }}</h3>
                  <p class="mb-0 opacity-75">Expiring Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4 col-xl-3">
          <div class="card h-100 shadow-sm border-0 bg-gradient" style="background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);">
            <div class="card-body text-dark">
              <div class="d-flex align-items-center">
                <i class="bi bi-graph-up-arrow fs-1 me-3"></i>
                <div>
                  <h3 class="fw-bold mb-1">{{ totalDonationsThisMonth }}</h3>
                  <p class="mb-0 opacity-75">Donations This Month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Management Sections -->
      <div class="row g-4">
        <div class="col-md-6 col-lg-3">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-header bg-primary text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-people-fill me-2"></i>User Management
              </h5>
            </div>
            <div class="card-body">
              <p class="card-text">Manage system users, roles, and permissions</p>
            </div>
            <div class="card-footer bg-transparent">
              <button class="btn btn-primary w-100" routerLink="/admin/users">
                Manage Users
              </button>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-header bg-success text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-droplet-fill me-2"></i>Blood Inventory
              </h5>
            </div>
            <div class="card-body">
              <p class="card-text">Monitor blood stock levels and manage inventory</p>
            </div>
            <div class="card-footer bg-transparent">
              <button class="btn btn-success w-100" routerLink="/admin/inventory">
                View Inventory
              </button>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-header bg-info text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-graph-up me-2"></i>Reports & Analytics
              </h5>
            </div>
            <div class="card-body">
              <p class="card-text">Generate reports and view system analytics</p>
            </div>
            <div class="card-footer bg-transparent">
              <button class="btn btn-info w-100" routerLink="/admin/reports">
                View Reports
              </button>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-header bg-danger text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-heart-fill me-2"></i>Donor Management
              </h5>
            </div>
            <div class="card-body">
              <p class="card-text">Oversee donor registration and donation activities</p>
            </div>
            <div class="card-footer bg-transparent">
              <button class="btn btn-danger w-100" routerLink="/donors">
                Manage Donors
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
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