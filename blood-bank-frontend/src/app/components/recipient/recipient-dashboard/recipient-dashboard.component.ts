import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipientService } from '../../../services/recipient.service';
import { AuthService } from '../../../services/auth.service';
import { 
  Recipient, 
  BloodRequest, 
  BloodRequestStatus, 
  BloodRequestStatusNames, 
  BloodRequestUrgency, 
  BloodRequestUrgencyNames 
} from '../../../models/recipient.model';
import { BloodGroupNames } from '../../../models/common.model';

@Component({
  selector: 'app-recipient-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <div class="container-fluid py-4">
      <!-- Welcome Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card bg-gradient text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h2 class="card-title mb-2">Welcome back, {{ currentUser?.fullName || 'Recipient' }}!</h2>
                  <p class="card-text mb-0">Manage your blood requests and check availability</p>
                </div>
                <div>
                  <a class="btn btn-light btn-lg" routerLink="/recipient/request-blood">
                    <i class="bi bi-plus-circle me-2"></i>
                    Request Blood
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Left Column -->
        <div class="col-lg-8">
          <!-- Profile Summary -->
          <div class="card mb-4" *ngIf="recipient">
            <div class="card-header bg-primary text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-person-circle me-2"></i>
                Profile Summary
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <i class="bi bi-person me-2 text-primary"></i>
                    <span>{{ recipient.userName }}</span>
                  </div>
                  <div class="mb-3">
                    <i class="bi bi-envelope me-2 text-primary"></i>
                    <span>{{ recipient.userEmail }}</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <i class="bi bi-hospital me-2 text-primary"></i>
                    <span>{{ recipient.hospitalName }}</span>
                  </div>
                  <div class="mb-3">
                    <i class="bi bi-person-badge me-2 text-primary"></i>
                    <span>Dr. {{ recipient.doctorName }}</span>
                  </div>
                </div>
              </div>
              
              <hr>
              
              <div class="row text-center">
                <div class="col-6">
                  <div class="border-end">
                    <h3 class="text-primary mb-1">{{ recipient.totalRequests || 0 }}</h3>
                    <small class="text-muted">Total Requests</small>
                  </div>
                </div>
                <div class="col-6">
                  <h3 class="text-warning mb-1">{{ recipient.pendingRequests || 0 }}</h3>
                  <small class="text-muted">Pending</small>
                </div>
              </div>
            </div>
            <div class="card-footer">
              <a class="btn btn-outline-primary" routerLink="/recipient/profile">
                <i class="bi bi-pencil me-2"></i>
                Edit Profile
              </a>
            </div>
          </div>

          <!-- Recent Requests -->
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">
                <i class="bi bi-clock-history me-2"></i>
                Recent Blood Requests
              </h5>
              <a class="btn btn-sm btn-outline-primary" routerLink="/recipient/my-requests">
                <i class="bi bi-arrow-right"></i>
              </a>
            </div>
            <div class="card-body">
              <div *ngIf="recentRequests.length > 0; else noRequests">
                <div *ngFor="let request of recentRequests; let last = last" class="border-bottom pb-3 mb-3" [class.border-bottom]="!last">
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                      <div class="d-flex align-items-center mb-2">
                        <span class="badge bg-danger me-2 fs-6">{{ bloodGroupNames[request.bloodGroup] }}</span>
                        <span class="badge" [ngClass]="getStatusClass(request.status)">
                          {{ statusNames[request.status] }}
                        </span>
                      </div>
                      <div class="text-muted small">
                        <span class="me-3">{{ request.unitsRequested }} units</span>
                        <span>{{ request.requestDate | date:'short' }}</span>
                      </div>
                    </div>
                    <div>
                      <span class="badge" [ngClass]="getUrgencyClass(request.urgency)">
                        {{ urgencyNames[request.urgency] }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <ng-template #noRequests>
                <div class="text-center py-4">
                  <i class="bi bi-inbox display-1 text-muted mb-3"></i>
                  <p class="text-muted mb-3">No blood requests yet</p>
                  <a class="btn btn-primary" routerLink="/recipient/request-blood">
                    <i class="bi bi-plus-circle me-2"></i>
                    Create First Request
                  </a>
                </div>
              </ng-template>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="col-lg-4">
          <!-- Quick Actions -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-lightning me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <a class="btn btn-danger btn-lg" routerLink="/recipient/request-blood">
                  <i class="bi bi-plus-circle-fill me-2"></i>
                  New Blood Request
                </a>
                
                <a class="btn btn-outline-primary" routerLink="/recipient/my-requests">
                  <i class="bi bi-list-ul me-2"></i>
                  My Requests
                </a>
                
                <a class="btn btn-outline-success" routerLink="/recipient/blood-availability">
                  <i class="bi bi-search me-2"></i>
                  Check Availability
                </a>
                
                <a class="btn btn-outline-secondary" routerLink="/recipient/profile">
                  <i class="bi bi-person me-2"></i>
                  My Profile
                </a>
              </div>
            </div>
          </div>

          <!-- Blood Availability Quick View -->
          <div class="card mb-4" *ngIf="bloodAvailability.length > 0">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">
                <i class="bi bi-droplet me-2"></i>
                Blood Availability
              </h5>
              <a class="btn btn-sm btn-outline-primary" routerLink="/recipient/blood-availability">
                <i class="bi bi-arrow-right"></i>
              </a>
            </div>
            <div class="card-body">
              <div class="row g-2 mb-3">
                <div *ngFor="let stock of bloodAvailability.slice(0, 4)" class="col-6">
                  <div class="card text-center" [ngClass]="getAvailabilityClass(stock)">
                    <div class="card-body py-2">
                      <div class="fw-bold">{{ bloodGroupNames[stock.bloodGroup] }}</div>
                      <small>{{ stock.availableUnits }} units</small>
                      <div>
                        <i class="bi" [ngClass]="getAvailabilityIcon(stock)"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <a class="btn btn-sm btn-outline-primary w-100" routerLink="/recipient/blood-availability">
                View All Blood Groups
              </a>
            </div>
          </div>

          <!-- Tips & Guidelines -->
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-lightbulb me-2"></i>
                Tips & Guidelines
              </h5>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                <div class="list-group-item px-0 border-0">
                  <i class="bi bi-info-circle text-info me-2"></i>
                  <small>Request blood at least 24-48 hours in advance for non-emergency cases</small>
                </div>
                <div class="list-group-item px-0 border-0">
                  <i class="bi bi-exclamation-triangle text-warning me-2"></i>
                  <small>For critical cases, mark your request as "Critical" urgency level</small>
                </div>
                <div class="list-group-item px-0 border-0">
                  <i class="bi bi-clock text-primary me-2"></i>
                  <small>Check blood availability before making requests</small>
                </div>
                <div class="list-group-item px-0 border-0">
                  <i class="bi bi-telephone text-success me-2"></i>
                  <small>Contact your doctor for any medical questions</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="text-center py-5" *ngIf="isLoading">
        <div class="spinner-border text-primary me-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mb-0">Loading dashboard...</p>
      </div>
    </div>
  `,
  styles: [`
    .bg-gradient {
      background: linear-gradient(135deg, #dc3545 0%, #6f42c1 100%);
    }
    
    .card.border-success {
      border-color: #198754 !important;
    }
    
    .card.border-warning {
      border-color: #ffc107 !important;
    }
    
    .card.border-danger {
      border-color: #dc3545 !important;
    }

    .welcome-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding: 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
    }

    .welcome-content h1 {
      margin: 0 0 8px 0;
      font-size: 2rem;
      font-weight: 500;
    }

    .welcome-content p {
      margin: 0;
      opacity: 0.9;
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 30px;
    }

    .left-column {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .right-column {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .profile-summary .profile-info {
      margin-bottom: 20px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      color: #666;
    }

    .info-item mat-icon {
      color: #e91e63;
      font-size: 20px;
    }

    .stats-row {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
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

    .recent-requests .request-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid #eee;
    }

    .recent-requests .request-item:last-child {
      border-bottom: none;
    }

    .request-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 5px;
    }

    .blood-group {
      font-weight: 500;
      color: #333;
    }

    .request-details {
      display: flex;
      gap: 15px;
      font-size: 0.9rem;
      color: #666;
    }

    .no-requests {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
      text-align: center;
    }

    .no-requests mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 15px;
    }

    .no-requests p {
      color: #666;
      margin-bottom: 15px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .actions-grid button {
      height: 60px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 15px;
    }

    .actions-grid button mat-icon {
      font-size: 24px;
    }

    .actions-grid button span {
      font-size: 0.9rem;
    }

    .availability-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 15px;
    }

    .availability-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      border: 1px solid #eee;
    }

    .availability-item.available {
      background-color: #e8f5e8;
      border-color: #4caf50;
    }

    .availability-item.limited {
      background-color: #fff3e0;
      border-color: #ff9800;
    }

    .availability-item.critical {
      background-color: #ffebee;
      border-color: #f44336;
    }

    .availability-item.unavailable {
      background-color: #f5f5f5;
      border-color: #9e9e9e;
    }

    .availability-item .blood-group {
      font-weight: 500;
      margin-bottom: 5px;
    }

    .availability-item .units {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 5px;
    }

    .view-all-btn {
      width: 100%;
      margin-top: 10px;
    }

    .tips-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .tip-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .tip-item mat-icon {
      color: #2196f3;
      font-size: 20px;
      margin-top: 2px;
    }

    .tip-item span {
      line-height: 1.5;
      color: #666;
    }

    /* Status and Urgency Chips */
    .status-pending {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-approved {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .status-fulfilled {
      background-color: #e0f2f1;
      color: #00695c;
    }

    .status-rejected {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .status-cancelled {
      background-color: #f5f5f5;
      color: #616161;
    }

    .urgency-low {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .urgency-medium {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .urgency-high {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .urgency-critical {
      background-color: #8e24aa;
      color: white;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
    }

    .loading-container mat-spinner {
      margin-bottom: 20px;
    }

    @media (max-width: 1024px) {
      .dashboard-content {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .welcome-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 15px;
      }

      .welcome-header {
        padding: 20px;
      }

      .welcome-content h1 {
        font-size: 1.5rem;
      }

      .stats-row {
        flex-direction: column;
        gap: 15px;
      }

      .availability-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RecipientDashboardComponent implements OnInit {
  recipient: Recipient | null = null;
  recentRequests: BloodRequest[] = [];
  bloodAvailability: any[] = [];
  currentUser: any = null;
  isLoading = false;

  statusNames = BloodRequestStatusNames;
  urgencyNames = BloodRequestUrgencyNames;
  bloodGroupNames: { [key: string]: string } = BloodGroupNames;

  constructor(
    private recipientService: RecipientService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Load profile and dashboard stats
    this.recipientService.getRecipientProfile().subscribe({
      next: (recipient: Recipient) => {
        this.recipient = recipient;
      },
      error: (error: any) => {
        console.error('Failed to load profile:', error);
        this.showMessage('Failed to load profile data');
      }
    });

    // Load dashboard statistics
    this.recipientService.getDashboardStats().subscribe({
      next: (stats: any) => {
        // Update recipient with latest stats
        if (this.recipient) {
          this.recipient.totalRequests = stats.totalRequests;
          this.recipient.pendingRequests = stats.pendingRequests;
        }
        console.log('Dashboard stats loaded:', stats);
      },
      error: (error: any) => {
        console.error('Failed to load dashboard stats:', error);
      }
    });

    // Load recent requests
    this.recipientService.getMyBloodRequests().subscribe({
      next: (requests: BloodRequest[]) => {
        this.recentRequests = requests.slice(0, 5); // Show only 5 most recent
      },
      error: (error: any) => {
        console.error('Failed to load requests:', error);
        this.showMessage('Failed to load recent requests');
      }
    });

    // Load blood availability
    this.recipientService.getBloodAvailability().subscribe({
      next: (availability: any[]) => {
        this.bloodAvailability = availability;
      },
      error: (error: any) => {
        console.error('Failed to load availability:', error);
        this.showMessage('Failed to load blood availability data');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: BloodRequestStatus): string {
    switch (status) {
      case BloodRequestStatus.Pending: return 'status-pending';
      case BloodRequestStatus.Approved: return 'status-approved';
      case BloodRequestStatus.Fulfilled: return 'status-fulfilled';
      case BloodRequestStatus.Rejected: return 'status-rejected';
      case BloodRequestStatus.Cancelled: return 'status-cancelled';
      default: return '';
    }
  }

  getUrgencyClass(urgency: BloodRequestUrgency): string {
    switch (urgency) {
      case BloodRequestUrgency.Low: return 'urgency-low';
      case BloodRequestUrgency.Medium: return 'urgency-medium';
      case BloodRequestUrgency.High: return 'urgency-high';
      case BloodRequestUrgency.Critical: return 'urgency-critical';
      default: return '';
    }
  }

  getAvailabilityClass(stock: any): string {
    if (stock.availableUnits === 0) return 'unavailable';
    if (stock.availableUnits <= 5) return 'critical';
    if (stock.availableUnits <= 20) return 'limited';
    return 'available';
  }

  getAvailabilityIcon(stock: any): string {
    const className = this.getAvailabilityClass(stock);
    switch (className) {
      case 'available': return 'check_circle';
      case 'limited': return 'warning';
      case 'critical': return 'error';
      case 'unavailable': return 'cancel';
      default: return 'help';
    }
  }

  private showMessage(message: string): void {
    alert(message);
  }
}