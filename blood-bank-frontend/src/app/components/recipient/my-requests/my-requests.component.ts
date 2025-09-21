import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { RecipientService } from '../../../services/recipient.service';
import { 
  BloodRequest, 
  BloodRequestStatus, 
  BloodRequestStatusNames, 
  BloodRequestUrgency, 
  BloodRequestUrgencyNames 
} from '../../../models/recipient.model';
import { BloodGroupNames } from '../../../models/common.model';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatMenuModule
  ],
  template: `
    <div class="requests-container">
      <div class="header">
        <h1>My Blood Requests</h1>
        <button mat-raised-button color="primary" routerLink="/recipient/request-blood">
          <mat-icon>add</mat-icon>
          New Request
        </button>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Status Filter</mat-label>
              <mat-select [(value)]="selectedStatus" (selectionChange)="applyFilters()">
                <mat-option value="">All Statuses</mat-option>
                <mat-option *ngFor="let status of statusOptions" [value]="status">
                  {{ statusNames[status] }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Urgency Filter</mat-label>
              <mat-select [(value)]="selectedUrgency" (selectionChange)="applyFilters()">
                <mat-option value="">All Urgency Levels</mat-option>
                <mat-option *ngFor="let urgency of urgencyOptions" [value]="urgency">
                  {{ urgencyNames[urgency] }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-stroked-button (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Clear Filters
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Requests List -->
      <div class="requests-grid" *ngIf="!isLoading && filteredRequests.length > 0">
        <mat-card *ngFor="let request of filteredRequests" class="request-card">
          <mat-card-header>
            <div class="request-header">
              <div class="request-title">
                <h3>{{ bloodGroupNames[request.bloodGroup] }} Blood Request</h3>
                <mat-chip [ngClass]="getStatusClass(request.status)">
                  {{ statusNames[request.status] }}
                </mat-chip>
              </div>
              <div class="request-actions">
                <button mat-icon-button [matMenuTriggerFor]="menu" (click)="selectRequest(request)">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </div>
            </div>
          </mat-card-header>

          <mat-card-content>
            <div class="request-details">
              <div class="detail-row">
                <mat-icon>bloodtype</mat-icon>
                <span><strong>Blood Group:</strong> {{ bloodGroupNames[request.bloodGroup] }}</span>
              </div>
              
              <div class="detail-row">
                <mat-icon>format_list_numbered</mat-icon>
                <span><strong>Units Requested:</strong> {{ request.unitsRequested }}</span>
              </div>
              
              <div class="detail-row">
                <mat-icon>priority_high</mat-icon>
                <span><strong>Urgency:</strong> 
                  <mat-chip [ngClass]="getUrgencyClass(request.urgency)">
                    {{ urgencyNames[request.urgency] }}
                  </mat-chip>
                </span>
              </div>
              
              <div class="detail-row">
                <mat-icon>schedule</mat-icon>
                <span><strong>Required By:</strong> {{ request.requiredByDate | date:'medium' }}</span>
              </div>
              
              <div class="detail-row">
                <mat-icon>calendar_today</mat-icon>
                <span><strong>Requested On:</strong> {{ request.requestDate | date:'medium' }}</span>
              </div>
              
              <div class="detail-row" *ngIf="request.approvedDate">
                <mat-icon>check_circle</mat-icon>
                <span><strong>Approved On:</strong> {{ request.approvedDate | date:'medium' }}</span>
              </div>
              
              <div class="detail-row" *ngIf="request.fulfilledDate">
                <mat-icon>done_all</mat-icon>
                <span><strong>Fulfilled On:</strong> {{ request.fulfilledDate | date:'medium' }}</span>
              </div>
            </div>

            <div class="request-reason" *ngIf="request.requestReason">
              <h4>Medical Justification:</h4>
              <p>{{ request.requestReason }}</p>
            </div>

            <div class="notes-section" *ngIf="request.doctorNotes || request.adminNotes">
              <div class="doctor-notes" *ngIf="request.doctorNotes">
                <h4>Doctor's Notes:</h4>
                <p>{{ request.doctorNotes }}</p>
              </div>
              
              <div class="admin-notes" *ngIf="request.adminNotes">
                <h4>Admin Notes:</h4>
                <p>{{ request.adminNotes }}</p>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button (click)="viewDetails(request)">
              <mat-icon>visibility</mat-icon>
              View Details
            </button>
            
            <button mat-button (click)="editRequest(request)" 
                    *ngIf="canEditRequest(request)">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
            
            <button mat-button color="warn" (click)="cancelRequest(request)"
                    *ngIf="canCancelRequest(request)">
              <mat-icon>cancel</mat-icon>
              Cancel
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!isLoading && filteredRequests.length === 0">
        <mat-icon>inbox</mat-icon>
        <h2>No blood requests found</h2>
        <p>{{ requests.length === 0 ? "You haven't made any blood requests yet." : "No requests match your current filters." }}</p>
        <button mat-raised-button color="primary" routerLink="/recipient/request-blood" 
                *ngIf="requests.length === 0">
          <mat-icon>add</mat-icon>
          Create Your First Request
        </button>
        <button mat-stroked-button (click)="clearFilters()" 
                *ngIf="requests.length > 0">
          <mat-icon>clear</mat-icon>
          Clear Filters
        </button>
      </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner></mat-spinner>
        <p>Loading your requests...</p>
      </div>
    </div>

    <!-- Menu for actions -->
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="viewRequestDetails(selectedRequest)" *ngIf="selectedRequest">
        <mat-icon>visibility</mat-icon>
        <span>View Details</span>
      </button>
      <button mat-menu-item (click)="editRequest(selectedRequest)" *ngIf="selectedRequest">
        <mat-icon>edit</mat-icon>
        <span>Edit Request</span>
      </button>
      <button mat-menu-item (click)="cancelRequest(selectedRequest)" *ngIf="selectedRequest" class="danger">
        <mat-icon>cancel</mat-icon>
        <span>Cancel Request</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .requests-container {
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

    .filters-card {
      margin-bottom: 30px;
    }

    .filters {
      display: flex;
      gap: 20px;
      align-items: center;
      flex-wrap: wrap;
    }

    .requests-grid {
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    }

    .request-card {
      height: fit-content;
    }

    .request-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
    }

    .request-title {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .request-title h3 {
      margin: 0;
      color: #333;
    }

    .request-details {
      margin: 15px 0;
    }

    .detail-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .detail-row mat-icon {
      color: #666;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .request-reason {
      margin: 15px 0;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }

    .request-reason h4 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .request-reason p {
      margin: 0;
      line-height: 1.5;
    }

    .notes-section {
      margin-top: 15px;
    }

    .doctor-notes,
    .admin-notes {
      margin: 10px 0;
      padding: 10px;
      border-radius: 6px;
    }

    .doctor-notes {
      background-color: #e3f2fd;
      border-left: 4px solid #2196f3;
    }

    .admin-notes {
      background-color: #f3e5f5;
      border-left: 4px solid #9c27b0;
    }

    .doctor-notes h4,
    .admin-notes h4 {
      margin: 0 0 5px 0;
      font-size: 14px;
      color: #333;
    }

    .doctor-notes p,
    .admin-notes p {
      margin: 0;
      font-size: 14px;
    }

    /* Status Chips */
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

    /* Urgency Chips */
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
      .requests-grid {
        grid-template-columns: 1fr;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }

      .filters {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class MyRequestsComponent implements OnInit {
  requests: BloodRequest[] = [];
  filteredRequests: BloodRequest[] = [];
  isLoading = false;
  
  selectedStatus = '';
  selectedUrgency = '';
  selectedRequest: BloodRequest | null = null;
  
  statusOptions = Object.values(BloodRequestStatus).filter(v => typeof v === 'number');
  urgencyOptions = Object.values(BloodRequestUrgency).filter(v => typeof v === 'number');
  
  statusNames = BloodRequestStatusNames;
  urgencyNames = BloodRequestUrgencyNames;
  bloodGroupNames = BloodGroupNames;

  constructor(
    private recipientService: RecipientService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.recipientService.getMyBloodRequests().subscribe({
      next: (requests: BloodRequest[]) => {
        this.requests = requests;
        this.applyFilters();
      },
      error: (error: any) => {
        console.error('Failed to load requests:', error);
        this.showMessage('Failed to load requests');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredRequests = this.requests.filter(request => {
      const statusMatch = !this.selectedStatus || request.status.toString() === this.selectedStatus;
      const urgencyMatch = !this.selectedUrgency || request.urgency.toString() === this.selectedUrgency;
      
      return statusMatch && urgencyMatch;
    });
  }

  clearFilters(): void {
    this.selectedStatus = '';
    this.selectedUrgency = '';
    this.applyFilters();
  }

  selectRequest(request: BloodRequest): void {
    this.selectedRequest = request;
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

  canEditRequest(request: BloodRequest): boolean {
    return request.status === BloodRequestStatus.Pending;
  }

  canCancelRequest(request: BloodRequest): boolean {
    return request.status === BloodRequestStatus.Pending || 
           request.status === BloodRequestStatus.Approved;
  }

  viewDetails(request: BloodRequest): void {
    // Navigate to detailed view or open dialog
    console.log('View details for request:', request.requestId);
  }

  viewRequestDetails(request: BloodRequest): void {
    // Wrapper method for consistency with template
    this.viewDetails(request);
  }

  editRequest(request: BloodRequest): void {
    // Navigate to edit form
    console.log('Edit request:', request.requestId);
  }

  cancelRequest(request: BloodRequest): void {
    if (confirm('Are you sure you want to cancel this blood request?')) {
      this.recipientService.cancelBloodRequest(request.requestId).subscribe({
        next: () => {
          this.showMessage('Request cancelled successfully');
          this.loadRequests();
        },
        error: (error: any) => {
          console.error('Failed to cancel request:', error);
          this.showMessage('Failed to cancel request');
        }
      });
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