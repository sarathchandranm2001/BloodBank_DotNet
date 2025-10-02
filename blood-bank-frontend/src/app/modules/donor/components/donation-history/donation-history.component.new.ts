import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { DonorService } from '../../../../services/donor.service';
import { AuthService } from '../../../../services/auth.service';

export interface DonationRecord {
  donationId: number;
  donationDate: Date;
  donationCenter: string;
  bloodGroup: string;
  volumeCollected: number;
  status: string;
  notes?: string;
}

export interface DonationHistory {
  donorId: number;
  donorName: string;
  bloodGroup: string;
  totalDonations: number;
  totalVolumeContributed: number;
  firstDonationDate?: Date;
  lastDonationDate?: Date;
  daysSinceLastDonation: number;
  averageDaysBetweenDonations: number;
  isCurrentlyEligible: boolean;
  nextEligibleDate?: Date;
  consecutiveDonations: number;
  donationsThisYear: number;
  donationsThisMonth: number;
}

@Component({
  selector: 'app-donation-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid mt-4">
      <div class="row">
        <div class="col-12">
          <div class="card mb-4">
            <div class="card-header bg-danger text-white">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <h4 class="mb-0">
                    <i class="bi bi-clock-history me-2"></i>
                    Donation History
                  </h4>
                </div>
                <button class="btn btn-light btn-sm" (click)="refreshData()">
                  <i class="bi bi-arrow-clockwise me-1"></i>
                  Refresh
                </button>
              </div>
            </div>

            <!-- Loading State -->
            <div class="card-body text-center" *ngIf="loading">
              <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading donation history...</p>
            </div>

            <!-- Error State -->
            <div class="card-body text-center" *ngIf="error && !loading">
              <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ error }}
              </div>
              <button class="btn btn-primary" (click)="loadData()">
                <i class="bi bi-arrow-clockwise me-1"></i>
                Try Again
              </button>
            </div>

            <!-- Main Content -->
            <div class="card-body" *ngIf="!loading && !error">
              <!-- Donor Summary -->
              <div class="row mb-4" *ngIf="donorStats">
                <div class="col-md-4">
                  <div class="stat-card bg-primary text-white">
                    <div class="stat-value">{{ donorStats.totalDonations }}</div>
                    <div class="stat-label">Total Donations</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-card bg-success text-white">
                    <div class="stat-value">{{ donorStats.totalVolumeContributed }} ml</div>
                    <div class="stat-label">Total Volume</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-card" [class.bg-success]="donorStats.isCurrentlyEligible" [class.bg-warning]="!donorStats.isCurrentlyEligible">
                    <div class="stat-value">
                      <i class="bi" [class.bi-check-circle]="donorStats.isCurrentlyEligible" [class.bi-clock]="!donorStats.isCurrentlyEligible"></i>
                    </div>
                    <div class="stat-label">
                      {{ donorStats.isCurrentlyEligible ? 'Eligible to Donate' : 'Not Eligible Yet' }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Donation Statistics -->
              <div class="row mb-4" *ngIf="donorStats">
                <div class="col-md-6">
                  <div class="info-card">
                    <h5>Donation Statistics</h5>
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="label">Blood Group:</span>
                        <span class="value badge bg-danger">{{ donorStats.bloodGroup }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">This Year:</span>
                        <span class="value">{{ donorStats.donationsThisYear }} donations</span>
                      </div>
                      <div class="info-item">
                        <span class="label">This Month:</span>
                        <span class="value">{{ donorStats.donationsThisMonth }} donations</span>
                      </div>
                      <div class="info-item">
                        <span class="label">Days Since Last:</span>
                        <span class="value">{{ donorStats.daysSinceLastDonation }} days</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-card">
                    <h5>Timeline</h5>
                    <div class="info-grid">
                      <div class="info-item" *ngIf="donorStats.firstDonationDate">
                        <span class="label">First Donation:</span>
                        <span class="value">{{ donorStats.firstDonationDate | date:'mediumDate' }}</span>
                      </div>
                      <div class="info-item" *ngIf="donorStats.lastDonationDate">
                        <span class="label">Last Donation:</span>
                        <span class="value">{{ donorStats.lastDonationDate | date:'mediumDate' }}</span>
                      </div>
                      <div class="info-item" *ngIf="donorStats.nextEligibleDate">
                        <span class="label">Next Eligible:</span>
                        <span class="value">{{ donorStats.nextEligibleDate | date:'mediumDate' }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">Average Days Between:</span>
                        <span class="value">{{ donorStats.averageDaysBetweenDonations | number:'1.0-0' }} days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Donation Records -->
              <div class="donation-records" *ngIf="donationRecords.length > 0">
                <h5 class="mb-3">
                  <i class="bi bi-list-ul me-2"></i>
                  Donation Records ({{ donationRecords.length }})
                </h5>
                
                <div class="table-responsive">
                  <table class="table table-striped table-hover">
                    <thead class="table-dark">
                      <tr>
                        <th>Date</th>
                        <th>Center</th>
                        <th>Blood Group</th>
                        <th>Volume</th>
                        <th>Status</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let donation of donationRecords">
                        <td>
                          <strong>{{ donation.donationDate | date:'shortDate' }}</strong>
                          <br>
                          <small class="text-muted">{{ donation.donationDate | date:'shortTime' }}</small>
                        </td>
                        <td>{{ donation.donationCenter }}</td>
                        <td>
                          <span class="badge bg-danger">{{ donation.bloodGroup }}</span>
                        </td>
                        <td>{{ donation.volumeCollected }} ml</td>
                        <td>
                          <span class="badge" 
                                [class.bg-success]="donation.status === 'Completed'"
                                [class.bg-warning]="donation.status === 'Pending'"
                                [class.bg-danger]="donation.status === 'Cancelled'">
                            {{ donation.status }}
                          </span>
                        </td>
                        <td>
                          {{ donation.notes || 'No notes' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- No Records Message -->
              <div class="text-center py-4" *ngIf="donationRecords.length === 0 && !loading">
                <i class="bi bi-inbox text-muted" style="font-size: 3em;"></i>
                <h5 class="text-muted mt-2">No donation records found</h5>
                <p class="text-muted">This donor hasn't made any donations yet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 20px;
    }

    .stat-value {
      font-size: 2em;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 0.9em;
      opacity: 0.9;
    }

    .info-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      height: 100%;
    }

    .info-grid {
      display: grid;
      gap: 10px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid #e9ecef;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 500;
      color: #6c757d;
    }

    .value {
      font-weight: 600;
      color: #495057;
    }

    .table-responsive {
      border-radius: 8px;
      overflow: hidden;
    }

    .donation-records {
      margin-top: 30px;
    }

    @media (max-width: 768px) {
      .stat-card {
        margin-bottom: 15px;
      }
      
      .info-card {
        margin-bottom: 20px;
      }
    }
  `]
})
export class DonationHistoryComponent implements OnInit {
  donorStats: DonationHistory | null = null;
  donationRecords: DonationRecord[] = [];
  loading = true;
  error: string | null = null;
  donorId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private donorService: DonorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.donorId = +params['id'];
      if (this.donorId) {
        this.loadData();
      }
    });
  }

  loadData(): void {
    if (!this.donorId) return;

    this.loading = true;
    this.error = null;

    // Load donor statistics
    this.donorService.getDonationHistory(this.donorId).subscribe({
      next: (stats) => {
        this.donorStats = stats;
        this.loadDonationRecords();
      },
      error: (error) => {
        console.error('Error loading donor statistics:', error);
        this.error = 'Failed to load donation history. Please try again.';
        this.loading = false;
      }
    });
  }

  loadDonationRecords(): void {
    if (!this.donorId) return;

    this.donorService.getDonationsByDonor(this.donorId).subscribe({
      next: (records) => {
        this.donationRecords = records.map(record => ({
          ...record,
          donationDate: new Date(record.donationDate)
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading donation records:', error);
        // Even if records fail, we still show the stats
        this.donationRecords = [];
        this.loading = false;
      }
    });
  }

  refreshData(): void {
    this.loadData();
  }
}