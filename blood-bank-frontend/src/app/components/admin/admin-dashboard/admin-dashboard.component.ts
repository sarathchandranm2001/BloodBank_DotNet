import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';
import { ErrorHandlerService, ApiError } from '../../../services/error-handler.service';
import { 
  AdminDashboardStats,
  BloodGroupStats,
  AdminActivity,
  RecentDonor,
  RecentRequest,
  SystemAlert,
  BloodInventoryItem
} from '../../../models/admin.model';
import { BloodRequestDto } from '../../../models/recipient.model';
import { interval, Subscription } from 'rxjs';

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
        <!-- Pending Requests -->
        <div class="col-12 col-xl-6">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0"><i class="bi bi-clipboard-check me-2"></i>Pending Requests</h5>
              <button class="btn btn-sm btn-outline-dark" (click)="loadRequests()">
                <i class="bi bi-arrow-clockwise"></i>
              </button>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                  <thead class="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Recipient</th>
                      <th>Group</th>
                      <th>Units</th>
                      <th>Urgency</th>
                      <th>Requested</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let r of pendingRequestsList">
                      <td>#{{ r.requestId }}</td>
                      <td>
                        <div class="fw-medium">{{ r.recipientName }}</div>
                        <div class="text-muted small">{{ r.hospitalName || '-' }}</div>
                      </td>
                      <td><span class="badge bg-danger">{{ r.bloodGroup }}</span></td>
                      <td>{{ r.unitsRequested }}</td>
                      <td>
                        <span class="badge" [ngClass]="getUrgencyClass(r.urgency)">{{ r.urgency }}</span>
                      </td>
                      <td>{{ r.requestDate | date:'short' }}</td>
                      <td class="d-flex gap-2">
                        <button class="btn btn-sm btn-success" (click)="approve(r)"><i class="bi bi-check2"></i></button>
                        <button class="btn btn-sm btn-danger" (click)="reject(r)"><i class="bi bi-x"></i></button>
                      </td>
                    </tr>
                    <tr *ngIf="pendingRequestsList.length === 0">
                      <td colspan="7" class="text-center text-muted py-3">No pending requests</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Donors -->
        <div class="col-12 col-xl-6">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-header bg-danger text-white d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0"><i class="bi bi-heart-fill me-2"></i>Recent Donors</h5>
              <button class="btn btn-sm btn-light" (click)="loadDonors()">
                <i class="bi bi-arrow-clockwise"></i>
              </button>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0 align-middle">
                  <thead class="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Group</th>
                      <th>Last Donation</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let d of donors">
                      <td>#{{ d.donorId }}</td>
                      <td>{{ d.name }}</td>
                      <td><span class="badge bg-danger">{{ d.bloodGroup }}</span></td>
                      <td>{{ d.lastDonationDate ? (d.lastDonationDate | date:'mediumDate') : '-' }}</td>
                      <td>
                        <button class="btn btn-sm btn-outline-light" (click)="viewDonor(d.donorId)">
                          View
                        </button>
                      </td>
                    </tr>
                    <tr *ngIf="donors.length === 0">
                      <td colspan="5" class="text-center text-muted py-3">No donors found</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Inventory Overview -->
        <div class="col-12">
          <div class="card shadow-sm border-0">
            <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0"><i class="bi bi-droplet-fill me-2"></i>Blood Inventory Overview</h5>
              <button class="btn btn-sm btn-light" (click)="loadInventory()"><i class="bi bi-arrow-clockwise"></i></button>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-6 col-md-3 col-xl-2" *ngFor="let s of bloodGroupStats">
                  <div class="p-3 border rounded h-100">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <span class="badge bg-danger">{{ s.bloodGroup }}</span>
                      <span class="badge" [class.bg-warning]="s.isLowStock" [class.bg-success]="!s.isLowStock">
                        {{ s.totalUnits }}u
                      </span>
                    </div>
                    <div class="small text-muted">
                      Expiring soon: {{ s.expiringSoonUnits }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity & Transactions -->
        <div class="col-12 col-xl-6">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0"><i class="bi bi-lightning-fill me-2"></i>Recent Activity</h5>
              <button class="btn btn-sm btn-light" (click)="loadActivity()"><i class="bi bi-arrow-clockwise"></i></button>
            </div>
            <div class="card-body">
              <h6 class="text-muted mb-3">System Alerts</h6>
              <ul class="list-group mb-4">
                <li class="list-group-item d-flex justify-content-between align-items-center" *ngFor="let a of alerts">
                  <span><i class="bi me-2" [ngClass]="'bi-' + a.icon"></i>{{ a.message }}</span>
                  <span class="badge bg-secondary">{{ a.createdAt | date:'short' }}</span>
                </li>
                <li class="list-group-item text-muted text-center" *ngIf="alerts.length === 0">No alerts</li>
              </ul>

              <h6 class="text-muted mb-3">Recent Requests</h6>
              <div class="list-group mb-4">
                <div class="list-group-item d-flex justify-content-between align-items-center" *ngFor="let rr of recentRequests">
                  <div>
                    <div class="fw-medium">#{{ rr.requestId }} • {{ rr.recipientName }}</div>
                    <div class="small text-muted">{{ rr.bloodGroup }} • {{ rr.urgencyLevel }}</div>
                  </div>
                  <span class="badge" [ngClass]="getStatusClass(rr.status)">{{ rr.status }}</span>
                </div>
                <div class="list-group-item text-muted text-center" *ngIf="recentRequests.length === 0">No recent requests</div>
              </div>

              <h6 class="text-muted mb-3">Recent Donors</h6>
              <div class="list-group">
                <div class="list-group-item d-flex justify-content-between align-items-center" *ngFor="let rd of recentDonors">
                  <div>
                    <div class="fw-medium">#{{ rd.donorId }} • {{ rd.name }}</div>
                    <div class="small text-muted">{{ rd.bloodGroup }} • Registered {{ rd.registrationDate | date:'mediumDate' }}</div>
                  </div>
                  <button class="btn btn-sm btn-outline-primary" (click)="viewDonor(rd.donorId)">View</button>
                </div>
                <div class="list-group-item text-muted text-center" *ngIf="recentDonors.length === 0">No recent donors</div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-xl-6">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0"><i class="bi bi-receipt-cutoff me-2"></i>Donations (Transactions)</h5>
              <button class="btn btn-sm btn-light" (click)="loadDonations()"><i class="bi bi-arrow-clockwise"></i></button>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-striped mb-0 align-middle">
                  <thead class="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Donor</th>
                      <th>Group</th>
                      <th>Volume</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let t of donations">
                      <td>#{{ t.donationId }}</td>
                      <td>{{ t.donorName }}</td>
                      <td><span class="badge bg-danger">{{ t.bloodGroup }}</span></td>
                      <td>{{ t.volumeCollected }} ml</td>
                      <td>{{ t.donationDate | date:'short' }}</td>
                    </tr>
                    <tr *ngIf="donations.length === 0">
                      <td colspan="5" class="text-center text-muted py-3">No donations yet</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Donor Detail Modal (simple) -->
      <div class="modal fade" id="donorDetailModal" tabindex="-1" *ngIf="selectedDonor">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Donor Details</h5>
              <button type="button" class="btn-close" (click)="closeDonorModal()"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Name:</strong> {{ selectedDonor?.userName || selectedDonor?.name }}</p>
                  <p><strong>Email:</strong> {{ selectedDonor?.userEmail || '-' }}</p>
                  <p><strong>Blood Group:</strong> {{ selectedDonor?.bloodGroup }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Phone:</strong> {{ selectedDonor?.contactInfo?.phone || '-' }}</p>
                  <p><strong>Last Donation:</strong> {{ selectedDonor?.lastDonationDate ? (selectedDonor?.lastDonationDate | date:'medium') : '-' }}</p>
                  <p><strong>Eligible:</strong> {{ selectedDonor?.isEligibleToDonate ? 'Yes' : 'No' }}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeDonorModal()">Close</button>
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

  // Data collections
  requests: BloodRequestDto[] = [];
  pendingRequestsList: BloodRequestDto[] = [];
  donors: RecentDonor[] = [];
  bloodGroupStats: BloodGroupStats[] = [];
  alerts: SystemAlert[] = [];
  recentRequests: RecentRequest[] = [];
  recentDonors: RecentDonor[] = [];
  donations: any[] = [];

  // Detail modal state
  selectedDonor: any | null = null;

  // Polling
  private refreshSub?: Subscription;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadAll();
    // Auto-refresh every 15s
    this.refreshSub = interval(15000).subscribe(() => this.loadAuto());
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
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

  loadRequests(): void {
    this.adminService.getAllBloodRequests().subscribe({
      next: (reqs: BloodRequestDto[]) => {
        this.requests = reqs;
        this.pendingRequestsList = reqs.filter(r => r.status === 'Pending');
        this.pendingRequests = this.pendingRequestsList.length;
      },
      error: (e: ApiError) => this.errorHandler.handleApiError(e, 'Loading requests')
    });
  }

  loadDonors(): void {
    this.adminService.getRecentActivity().subscribe({
      next: (activity: AdminActivity) => {
        this.donors = activity.recentDonors;
      },
      error: (e: ApiError) => this.errorHandler.handleApiError(e, 'Loading donors')
    });
  }

  loadInventory(): void {
    this.adminService.getBloodGroupStats().subscribe({
      next: (stats: BloodGroupStats[]) => {
        this.bloodGroupStats = stats;
        this.lowStockAlerts = stats.filter(s => s.isLowStock).length;
      },
      error: (e: ApiError) => this.errorHandler.handleApiError(e, 'Loading inventory')
    });
  }

  loadActivity(): void {
    this.adminService.getRecentActivity().subscribe({
      next: (activity: AdminActivity) => {
        this.alerts = activity.systemAlerts;
        this.recentRequests = activity.recentRequests;
        this.recentDonors = activity.recentDonors;
      },
      error: (e: ApiError) => this.errorHandler.handleApiError(e, 'Loading activity')
    });
  }

  loadDonations(): void {
    this.adminService.getDonationAnalytics(); // warm cache if any
    this.adminService.getDonationHistory().subscribe({
      next: (list: any[]) => this.donations = list,
      error: (e: ApiError) => this.errorHandler.handleApiError(e, 'Loading donations')
    });
  }

  private loadAll(): void {
    this.loadDashboardData();
    this.loadRequests();
    this.loadDonors();
    this.loadInventory();
    this.loadActivity();
    this.loadDonations();
  }

  private loadAuto(): void {
    // Lightweight refreshes for live updates
    this.loadRequests();
    this.loadInventory();
    this.loadActivity();
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
    this.loadAll();
  }

  // UI helpers
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'Approved': return 'bg-success';
      case 'Rejected': return 'bg-danger';
      case 'Fulfilled': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }

  getUrgencyClass(urgency: string): string {
    switch (urgency) {
      case 'Low': return 'bg-success';
      case 'Medium': return 'bg-warning text-dark';
      case 'High': return 'bg-danger';
      case 'Critical': return 'bg-dark';
      default: return 'bg-secondary';
    }
  }

  // Actions
  approve(r: BloodRequestDto): void {
    const notes = prompt('Add admin notes (optional):') || '';
    this.adminService.approveBloodRequest(r.requestId, notes).subscribe({
      next: () => this.loadRequests(),
      error: (e: ApiError) => this.errorHandler.handleApiError(e, 'Approving request')
    });
  }

  reject(r: BloodRequestDto): void {
    const notes = prompt('Reason for rejection (required):');
    if (!notes) return;
    this.adminService.rejectBloodRequest(r.requestId, notes).subscribe({
      next: () => this.loadRequests(),
      error: (e: ApiError) => this.errorHandler.handleApiError(e, 'Rejecting request')
    });
  }

  viewDonor(donorId: number): void {
    this.selectedDonor = null;
    // Try to fetch donor details via donors API
    this.adminService.getDonorById(donorId).subscribe({
      next: (donor) => {
        this.selectedDonor = donor;
        const modal = document.getElementById('donorDetailModal');
        if (modal) { modal.classList.add('show'); (modal as any).style.display = 'block'; document.body.classList.add('modal-open'); }
      },
      error: (e: ApiError) => this.errorHandler.handleApiError(e, 'Loading donor details')
    });
  }

  closeDonorModal(): void {
    const modal = document.getElementById('donorDetailModal');
    if (modal) { modal.classList.remove('show'); (modal as any).style.display = 'none'; document.body.classList.remove('modal-open'); }
    this.selectedDonor = null;
  }
}