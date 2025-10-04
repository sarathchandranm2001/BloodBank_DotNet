import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
    FormsModule
  ],
  template: `
    <div class="requests-container">
      <div class="header d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">My Blood Requests</h1>
        <button class="btn btn-primary" routerLink="/recipient/request-blood">
          <i class="bi bi-plus-circle me-1"></i>
          New Request
        </button>
      </div>

      <!-- Filters -->
      <div class="card filters-card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Status Filter</label>
              <select class="form-select" [(ngModel)]="selectedStatus" (change)="applyFilters()">
                <option value="">All Statuses</option>
                <option *ngFor="let status of statusOptions" [value]="status">
                  {{ statusNames[status] }}
                </option>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label">Urgency Filter</label>
              <select class="form-select" [(ngModel)]="selectedUrgency" (change)="applyFilters()">
                <option value="">All Urgency Levels</option>
                <option *ngFor="let urgency of urgencyOptions" [value]="urgency">
                  {{ urgencyNames[urgency] }}
                </option>
              </select>
            </div>

            <div class="col-md-4 d-flex align-items-end">
              <button class="btn btn-outline-secondary" (click)="clearFilters()">
                <i class="bi bi-x-circle me-1"></i>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Requests List -->
      <div class="requests-grid row g-3" *ngIf="!isLoading && filteredRequests.length > 0">
        <div class="col-lg-6" *ngFor="let request of filteredRequests">
          <div class="card request-card h-100">
            <div class="card-header">
              <div class="request-header d-flex justify-content-between align-items-start">
                <div class="request-title">
                  <h5 class="mb-2">{{ bloodGroupNames[request.bloodGroup] }} Blood Request</h5>
                  <span class="badge" [ngClass]="getStatusClass(request.status)">
                    {{ statusNames[request.status] }}
                  </span>
                </div>
                <div class="dropdown">
                  <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" 
                          data-bs-toggle="dropdown" (click)="selectRequest(request)">
                    <i class="bi bi-three-dots-vertical"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" (click)="selectedRequest && viewRequestDetails(selectedRequest); $event.preventDefault()">
                      <i class="bi bi-eye me-2"></i>View Details
                    </a></li>
                    <li><a class="dropdown-item" href="#" (click)="selectedRequest && editRequest(selectedRequest); $event.preventDefault()">
                      <i class="bi bi-pencil me-2"></i>Edit Request
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" (click)="selectedRequest && cancelRequest(selectedRequest); $event.preventDefault()">
                      <i class="bi bi-x-circle me-2"></i>Cancel Request
                    </a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="card-body">
              <div class="request-details">
                <div class="detail-row d-flex align-items-center mb-2">
                  <i class="bi bi-droplet-fill me-2 text-danger"></i>
                  <span><strong>Blood Group:</strong> {{ bloodGroupNames[request.bloodGroup] }}</span>
                </div>
                
                <div class="detail-row d-flex align-items-center mb-2">
                  <i class="bi bi-hash me-2 text-info"></i>
                  <span><strong>Units Requested:</strong> {{ request.unitsRequested }}</span>
                </div>
                
                <div class="detail-row d-flex align-items-center mb-2">
                  <i class="bi bi-exclamation-triangle me-2 text-warning"></i>
                  <span><strong>Urgency:</strong> 
                    <span class="badge ms-1" [ngClass]="getUrgencyClass(request.urgency)">
                      {{ urgencyNames[request.urgency] }}
                    </span>
                  </span>
                </div>
                
                <div class="detail-row d-flex align-items-center mb-2">
                  <i class="bi bi-clock me-2 text-primary"></i>
                  <span><strong>Required By:</strong> {{ request.requiredByDate | date:'medium' }}</span>
                </div>
                
                <div class="detail-row d-flex align-items-center mb-2">
                  <i class="bi bi-calendar-event me-2 text-secondary"></i>
                  <span><strong>Requested On:</strong> {{ request.requestDate | date:'medium' }}</span>
                </div>
                
                <div class="detail-row d-flex align-items-center mb-2" *ngIf="request.approvedDate">
                  <i class="bi bi-check-circle me-2 text-success"></i>
                  <span><strong>Approved On:</strong> {{ request.approvedDate | date:'medium' }}</span>
                </div>
                
                <div class="detail-row d-flex align-items-center mb-2" *ngIf="request.fulfilledDate">
                  <i class="bi bi-check-all me-2 text-success"></i>
                  <span><strong>Fulfilled On:</strong> {{ request.fulfilledDate | date:'medium' }}</span>
                </div>
              </div>

              <div class="request-reason mt-3" *ngIf="request.requestReason">
                <h6>Medical Justification:</h6>
                <p class="text-muted">{{ request.requestReason }}</p>
              </div>

              <div class="notes-section mt-3" *ngIf="request.doctorNotes || request.adminNotes">
                <div class="doctor-notes mb-2" *ngIf="request.doctorNotes">
                  <h6>Doctor's Notes:</h6>
                  <p class="text-muted">{{ request.doctorNotes }}</p>
                </div>
                
                <div class="admin-notes" *ngIf="request.adminNotes">
                  <h6>Admin Notes:</h6>
                  <p class="text-muted">{{ request.adminNotes }}</p>
                </div>
              </div>
            </div>

            <div class="card-footer bg-transparent">
              <div class="d-flex gap-2 flex-wrap">
                <button class="btn btn-outline-primary btn-sm" (click)="viewDetails(request)">
                  <i class="bi bi-eye me-1"></i>
                  View Details
                </button>
                
                <button class="btn btn-outline-warning btn-sm" (click)="editRequest(request)" 
                        *ngIf="canEditRequest(request)">
                  <i class="bi bi-pencil me-1"></i>
                  Edit
                </button>
                
                <button class="btn btn-outline-danger btn-sm" (click)="cancelRequest(request)"
                        *ngIf="canCancelRequest(request)">
                  <i class="bi bi-x-circle me-1"></i>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state text-center py-5" *ngIf="!isLoading && filteredRequests.length === 0">
        <i class="bi bi-inbox display-1 text-muted mb-3"></i>
        <h2>No blood requests found</h2>
        <p class="text-muted">{{ requests.length === 0 ? "You haven't made any blood requests yet." : "No requests match your current filters." }}</p>
        <div class="mt-3">
          <button class="btn btn-primary me-2" routerLink="/recipient/request-blood" 
                  *ngIf="requests.length === 0">
            <i class="bi bi-plus-circle me-1"></i>
            Create Your First Request
          </button>
          <button class="btn btn-outline-secondary" (click)="clearFilters()" 
                  *ngIf="requests.length > 0">
            <i class="bi bi-x-circle me-1"></i>
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-container text-center py-5" *ngIf="isLoading">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Loading your requests...</p>
      </div>
    </div>
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
    private recipientService: RecipientService
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
    alert(message);
  }
}