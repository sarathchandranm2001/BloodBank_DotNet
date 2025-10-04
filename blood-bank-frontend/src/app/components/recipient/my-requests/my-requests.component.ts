import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RecipientService } from '../../../services/recipient.service';
import { 
  BloodRequest, 
  BloodRequestDto,
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
    FormsModule,
    ReactiveFormsModule
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
                  <h5 class="mb-2">{{ bloodGroupStringNames[request.bloodGroup] || request.bloodGroup }} Blood Request</h5>
                  <span class="badge" [ngClass]="getStatusClass(request.status)">
                    {{ statusStringNames[request.status] || request.status }}
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
                  <span><strong>Blood Group:</strong> {{ bloodGroupStringNames[request.bloodGroup] || request.bloodGroup }}</span>
                </div>
                
                <div class="detail-row d-flex align-items-center mb-2">
                  <i class="bi bi-hash me-2 text-info"></i>
                  <span><strong>Units Requested:</strong> {{ request.unitsRequested }}</span>
                </div>
                
                <div class="detail-row d-flex align-items-center mb-2">
                  <i class="bi bi-exclamation-triangle me-2 text-warning"></i>
                  <span><strong>Urgency:</strong> 
                    <span class="badge ms-1" [ngClass]="getUrgencyClass(request.urgency)">
                      {{ urgencyStringNames[request.urgency] || request.urgency }}
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

      <!-- No Profile State -->
      <div class="empty-state text-center py-5" *ngIf="!isLoading && noRecipientProfile">
        <i class="bi bi-person-plus display-1 text-warning mb-3"></i>
        <h2>Complete Your Profile First</h2>
        <p class="text-muted">You need to complete your recipient profile before you can view or make blood requests.</p>
        <div class="mt-3">
          <a class="btn btn-warning btn-lg me-2" routerLink="/recipient/profile">
            <i class="bi bi-person-fill-add me-2"></i>
            Complete Profile
          </a>
          <a class="btn btn-outline-primary" routerLink="/recipient/dashboard">
            <i class="bi bi-arrow-left me-2"></i>
            Back to Dashboard
          </a>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state text-center py-5" *ngIf="!isLoading && !noRecipientProfile && filteredRequests.length === 0">
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

    <!-- Edit Request Modal -->
    <div class="modal fade" id="editRequestModal" tabindex="-1" *ngIf="editingRequest">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Blood Request</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" (click)="cancelEdit()"></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="editForm" (ngSubmit)="saveEdit()">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Units Requested *</label>
                  <input type="number" class="form-control" formControlName="unitsRequested" min="1" max="20">
                  <div class="form-text">Maximum 20 units allowed</div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Urgency Level *</label>
                  <select class="form-select" formControlName="urgency">
                    <option value="">Select urgency</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Required By Date</label>
                <input type="date" class="form-control" formControlName="requiredByDate">
              </div>
              <div class="mb-3">
                <label class="form-label">Request Reason *</label>
                <textarea class="form-control" formControlName="requestReason" rows="3" maxlength="500"></textarea>
                <div class="form-text">Describe why you need the blood</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Doctor's Notes</label>
                <textarea class="form-control" formControlName="doctorNotes" rows="2" maxlength="1000"></textarea>
                <div class="form-text">Additional medical information from your doctor</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="cancelEdit()">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="saveEdit()" [disabled]="!editForm.valid">
              <span class="spinner-border spinner-border-sm me-2" *ngIf="isUpdating"></span>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Details Modal -->
    <div class="modal fade" id="viewRequestModal" tabindex="-1" *ngIf="viewingRequest">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Blood Request Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" (click)="closeViewModal()"></button>
          </div>
          <div class="modal-body">
            <div class="row" *ngIf="viewingRequest">
              <div class="col-md-6">
                <div class="mb-3">
                  <strong>Request ID:</strong> #{{ viewingRequest.requestId }}
                </div>
                <div class="mb-3">
                  <strong>Blood Group:</strong> 
                  <span class="badge bg-danger ms-2">{{ bloodGroupStringNames[viewingRequest.bloodGroup] || viewingRequest.bloodGroup }}</span>
                </div>
                <div class="mb-3">
                  <strong>Units Requested:</strong> {{ viewingRequest.unitsRequested }}
                </div>
                <div class="mb-3">
                  <strong>Urgency:</strong> 
                  <span class="badge ms-2" [ngClass]="getUrgencyClass(viewingRequest.urgency)">
                    {{ urgencyStringNames[viewingRequest.urgency] || viewingRequest.urgency }}
                  </span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <strong>Status:</strong>
                  <span class="badge ms-2" [ngClass]="getStatusClass(viewingRequest.status)">
                    {{ statusStringNames[viewingRequest.status] || viewingRequest.status }}
                  </span>
                </div>
                <div class="mb-3">
                  <strong>Request Date:</strong> {{ viewingRequest.requestDate | date:'medium' }}
                </div>
                <div class="mb-3" *ngIf="viewingRequest.requiredByDate">
                  <strong>Required By:</strong> {{ viewingRequest.requiredByDate | date:'medium' }}
                </div>
                <div class="mb-3" *ngIf="viewingRequest.daysUntilRequired !== undefined && viewingRequest.daysUntilRequired >= 0">
                  <strong>Days Until Required:</strong> {{ viewingRequest.daysUntilRequired }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="mb-3">
                  <strong>Request Reason:</strong>
                  <p class="mt-2">{{ viewingRequest.requestReason }}</p>
                </div>
                <div class="mb-3" *ngIf="viewingRequest.doctorNotes">
                  <strong>Doctor's Notes:</strong>
                  <p class="mt-2">{{ viewingRequest.doctorNotes }}</p>
                </div>
                <div class="mb-3" *ngIf="viewingRequest.adminNotes">
                  <strong>Admin Notes:</strong>
                  <p class="mt-2">{{ viewingRequest.adminNotes }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeViewModal()">Close</button>
            <button type="button" class="btn btn-warning" (click)="editRequest(viewingRequest)" *ngIf="canEditRequest(viewingRequest)">
              <i class="bi bi-pencil me-1"></i> Edit Request
            </button>
            <button type="button" class="btn btn-danger" (click)="cancelRequest(viewingRequest)" *ngIf="canCancelRequest(viewingRequest)">
              <i class="bi bi-x-circle me-1"></i> Cancel Request
            </button>
          </div>
        </div>
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
  requests: BloodRequestDto[] = [];
  filteredRequests: BloodRequestDto[] = [];
  isLoading = false;
  noRecipientProfile = false;
  
  selectedStatus = '';
  selectedUrgency = '';
  selectedRequest: BloodRequestDto | null = null;
  
  // Modal states
  editingRequest: BloodRequestDto | null = null;
  viewingRequest: BloodRequestDto | null = null;
  editForm!: FormGroup;
  isUpdating = false;
  
  statusOptions = Object.values(BloodRequestStatus).filter(v => typeof v === 'number');
  urgencyOptions = Object.values(BloodRequestUrgency).filter(v => typeof v === 'number');
  
  statusNames = BloodRequestStatusNames;
  urgencyNames = BloodRequestUrgencyNames;
  bloodGroupNames = BloodGroupNames;

  // String-based mappings for backend response
  bloodGroupStringNames: { [key: string]: string } = {
    'O_NEGATIVE': 'O-',
    'O_POSITIVE': 'O+',
    'A_NEGATIVE': 'A-',
    'A_POSITIVE': 'A+',
    'B_NEGATIVE': 'B-',
    'B_POSITIVE': 'B+',
    'AB_NEGATIVE': 'AB-',
    'AB_POSITIVE': 'AB+'
  };

  urgencyStringNames: { [key: string]: string } = {
    'Low': 'Low',
    'Medium': 'Medium',
    'High': 'High',
    'Critical': 'Critical'
  };

  statusStringNames: { [key: string]: string } = {
    'Pending': 'Pending',
    'Approved': 'Approved',
    'Fulfilled': 'Fulfilled',
    'Rejected': 'Rejected',
    'Cancelled': 'Cancelled'
  };

  constructor(
    private recipientService: RecipientService,
    private formBuilder: FormBuilder
  ) {
    this.initializeEditForm();
  }

  ngOnInit(): void {
    this.loadRequests();
  }

  private initializeEditForm(): void {
    this.editForm = this.formBuilder.group({
      unitsRequested: ['', [Validators.required, Validators.min(1), Validators.max(20)]],
      urgency: ['', Validators.required],
      requestReason: ['', Validators.required],
      doctorNotes: [''],
      requiredByDate: ['']
    });
  }

  loadRequests(): void {
    this.isLoading = true;
    console.log('🔍 Loading blood requests...');
    this.recipientService.getMyBloodRequests().subscribe({
      next: (requests: BloodRequestDto[]) => {
        console.log('✅ Requests loaded successfully:', requests);
        this.requests = requests;
        this.applyFilters();
      },
      error: (error: any) => {
        console.error('💥 Failed to load requests:', error);
        console.error('💥 Error status:', error.status);
        console.error('💥 Error message:', error.error);
        
        if (error.status === 404) {
          this.noRecipientProfile = true;
          console.log('💡 No recipient profile found - user needs to register');
        } else {
          this.showMessage('Failed to load requests: ' + (error.error?.message || error.message));
        }
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

  selectRequest(request: BloodRequestDto): void {
    this.selectedRequest = request;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Approved': return 'status-approved';
      case 'Fulfilled': return 'status-fulfilled';
      case 'Rejected': return 'status-rejected';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getUrgencyClass(urgency: string): string {
    switch (urgency) {
      case 'Low': return 'urgency-low';
      case 'Medium': return 'urgency-medium';
      case 'High': return 'urgency-high';
      case 'Critical': return 'urgency-critical';
      default: return '';
    }
  }

  canEditRequest(request: BloodRequestDto): boolean {
    return request.status === 'Pending';
  }

  canCancelRequest(request: BloodRequestDto): boolean {
    return request.status === 'Pending' || 
           request.status === 'Approved';
  }

  viewDetails(request: BloodRequestDto): void {
    this.viewingRequest = request;
    this.editingRequest = null; // Close edit modal if open
    
    const modal = document.getElementById('viewRequestModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeViewModal(): void {
    this.viewingRequest = null;
    
    const modal = document.getElementById('viewRequestModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

  viewRequestDetails(request: BloodRequestDto): void {
    // For now, show an alert with request details
    const details = `
Blood Request Details:
- Blood Group: ${this.bloodGroupStringNames[request.bloodGroup] || request.bloodGroup}
- Units: ${request.unitsRequested}
- Urgency: ${this.urgencyStringNames[request.urgency] || request.urgency}
- Status: ${this.statusStringNames[request.status] || request.status}
- Request Date: ${new Date(request.requestDate).toLocaleDateString()}
- Required By: ${request.requiredByDate ? new Date(request.requiredByDate).toLocaleDateString() : 'Not specified'}
- Reason: ${request.requestReason}
- Doctor Notes: ${request.doctorNotes || 'None'}
- Admin Notes: ${request.adminNotes || 'None'}
    `;
    alert(details);
  }

  editRequest(request: BloodRequestDto): void {
    // Check if request can be edited
    if (request.status !== 'Pending') {
      this.showMessage('Only pending requests can be edited');
      return;
    }

    this.editingRequest = request;
    this.viewingRequest = null; // Close view modal if open
    
    // Populate the form with current request data
    this.editForm.patchValue({
      unitsRequested: request.unitsRequested,
      urgency: request.urgency,
      requestReason: request.requestReason,
      doctorNotes: request.doctorNotes || '',
      requiredByDate: request.requiredByDate ? new Date(request.requiredByDate).toISOString().split('T')[0] : ''
    });

    // Show the modal (you might need to use Bootstrap's modal API or a modal service)
    const modal = document.getElementById('editRequestModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  saveEdit(): void {
    if (!this.editForm.valid || !this.editingRequest) {
      return;
    }

    this.isUpdating = true;
    const formValue = this.editForm.value;
    
    const updateData = {
      unitsRequested: formValue.unitsRequested,
      urgency: formValue.urgency,
      requestReason: formValue.requestReason,
      doctorNotes: formValue.doctorNotes || undefined,
      requiredByDate: formValue.requiredByDate ? new Date(formValue.requiredByDate) : undefined
    };

    this.recipientService.updateBloodRequest(this.editingRequest.requestId, updateData).subscribe({
      next: (updatedRequest) => {
        this.showMessage('Request updated successfully');
        this.cancelEdit();
        this.loadRequests();
      },
      error: (error: any) => {
        console.error('Failed to update request:', error);
        this.showMessage('Failed to update request: ' + (error.error?.message || error.message));
      },
      complete: () => {
        this.isUpdating = false;
      }
    });
  }

  cancelEdit(): void {
    this.editingRequest = null;
    this.editForm.reset();
    
    const modal = document.getElementById('editRequestModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

  cancelRequest(request: BloodRequestDto): void {
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