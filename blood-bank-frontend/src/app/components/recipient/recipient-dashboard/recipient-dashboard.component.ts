import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
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
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDividerModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Welcome Header -->
      <div class="welcome-header">
        <div class="welcome-content">
          <h1>Welcome back, {{ currentUser?.fullName || 'Recipient' }}!</h1>
          <p>Manage your blood requests and check availability</p>
        </div>
        <div class="quick-actions">
          <button mat-raised-button color="primary" routerLink="/recipient/request-blood">
            <mat-icon>add</mat-icon>
            Request Blood
          </button>
        </div>
      </div>

      <div class="dashboard-content">
        <!-- Profile Summary -->
        <div class="left-column">
          <mat-card class="profile-summary" *ngIf="recipient">
            <mat-card-header>
              <mat-card-title>Profile Summary</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="profile-info">
                <div class="info-item">
                  <mat-icon>person</mat-icon>
                  <span>{{ recipient.userName }}</span>
                </div>
                <div class="info-item">
                  <mat-icon>email</mat-icon>
                  <span>{{ recipient.userEmail }}</span>
                </div>
                <div class="info-item">
                  <mat-icon>local_hospital</mat-icon>
                  <span>{{ recipient.hospitalName }}</span>
                </div>
                <div class="info-item">
                  <mat-icon>medical_services</mat-icon>
                  <span>Dr. {{ recipient.doctorName }}</span>
                </div>
              </div>
              
              <mat-divider></mat-divider>
              
              <div class="stats-row">
                <div class="stat-item">
                  <span class="stat-number">{{ recipient.totalRequests || 0 }}</span>
                  <span class="stat-label">Total Requests</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ recipient.pendingRequests || 0 }}</span>
                  <span class="stat-label">Pending</span>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button routerLink="/recipient/profile">
                <mat-icon>edit</mat-icon>
                Edit Profile
              </button>
            </mat-card-actions>
          </mat-card>

          <!-- Recent Requests -->
          <mat-card class="recent-requests">
            <mat-card-header>
              <mat-card-title>Recent Blood Requests</mat-card-title>
              <button mat-icon-button routerLink="/recipient/my-requests">
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="recentRequests.length > 0; else noRequests">
                <div *ngFor="let request of recentRequests" class="request-item">
                  <div class="request-info">
                    <div class="request-header">
                      <span class="blood-group">{{ bloodGroupNames[request.bloodGroup] }}</span>
                      <mat-chip [ngClass]="getStatusClass(request.status)">
                        {{ statusNames[request.status] }}
                      </mat-chip>
                    </div>
                    <div class="request-details">
                      <span>{{ request.unitsRequested }} units</span>
                      <span>{{ request.requestDate | date:'short' }}</span>
                    </div>
                  </div>
                  <div class="urgency-indicator">
                    <mat-chip [ngClass]="getUrgencyClass(request.urgency)">
                      {{ urgencyNames[request.urgency] }}
                    </mat-chip>
                  </div>
                </div>
              </div>
              <ng-template #noRequests>
                <div class="no-requests">
                  <mat-icon>inbox</mat-icon>
                  <p>No blood requests yet</p>
                  <button mat-stroked-button routerLink="/recipient/request-blood">
                    Create First Request
                  </button>
                </div>
              </ng-template>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Right Column -->
        <div class="right-column">
          <!-- Quick Actions -->
          <mat-card class="quick-actions-card">
            <mat-card-header>
              <mat-card-title>Quick Actions</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="actions-grid">
                <button mat-raised-button color="primary" routerLink="/recipient/request-blood">
                  <mat-icon>add_circle</mat-icon>
                  <span>New Blood Request</span>
                </button>
                
                <button mat-stroked-button routerLink="/recipient/my-requests">
                  <mat-icon>list</mat-icon>
                  <span>My Requests</span>
                </button>
                
                <button mat-stroked-button routerLink="/recipient/blood-availability">
                  <mat-icon>search</mat-icon>
                  <span>Check Availability</span>
                </button>
                
                <button mat-stroked-button routerLink="/recipient/profile">
                  <mat-icon>person</mat-icon>
                  <span>My Profile</span>
                </button>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Blood Availability Quick View -->
          <mat-card class="availability-summary" *ngIf="bloodAvailability.length > 0">
            <mat-card-header>
              <mat-card-title>Blood Availability</mat-card-title>
              <button mat-icon-button routerLink="/recipient/blood-availability">
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-header>
            <mat-card-content>
              <div class="availability-grid">
                <div *ngFor="let stock of bloodAvailability.slice(0, 4)" 
                     class="availability-item" 
                     [ngClass]="getAvailabilityClass(stock)">
                  <div class="blood-group">{{ bloodGroupNames[stock.bloodGroup] }}</div>
                  <div class="units">{{ stock.availableUnits }} units</div>
                  <mat-icon>{{ getAvailabilityIcon(stock) }}</mat-icon>
                </div>
              </div>
              <button mat-button routerLink="/recipient/blood-availability" class="view-all-btn">
                View All Blood Groups
              </button>
            </mat-card-content>
          </mat-card>

          <!-- Tips & Guidelines -->
          <mat-card class="tips-card">
            <mat-card-header>
              <mat-card-title>Tips & Guidelines</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="tips-list">
                <div class="tip-item">
                  <mat-icon>info</mat-icon>
                  <span>Request blood at least 24-48 hours in advance for non-emergency cases</span>
                </div>
                <div class="tip-item">
                  <mat-icon>warning</mat-icon>
                  <span>For critical cases, mark your request as "Critical" urgency level</span>
                </div>
                <div class="tip-item">
                  <mat-icon>schedule</mat-icon>
                  <span>Check blood availability before making requests</span>
                </div>
                <div class="tip-item">
                  <mat-icon>contact_support</mat-icon>
                  <span>Contact your doctor for any medical questions</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner></mat-spinner>
        <p>Loading dashboard...</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 64px);
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
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Load profile
    this.recipientService.getRecipientProfile().subscribe({
      next: (recipient: Recipient) => {
        this.recipient = recipient;
      },
      error: (error: any) => {
        console.error('Failed to load profile:', error);
      }
    });

    // Load recent requests
    this.recipientService.getMyBloodRequests().subscribe({
      next: (requests: BloodRequest[]) => {
        this.recentRequests = requests.slice(0, 5); // Show only 5 most recent
      },
      error: (error: any) => {
        console.error('Failed to load requests:', error);
      }
    });

    // Load blood availability
    this.recipientService.getBloodAvailability().subscribe({
      next: (availability: any[]) => {
        this.bloodAvailability = availability;
      },
      error: (error: any) => {
        console.error('Failed to load availability:', error);
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
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}