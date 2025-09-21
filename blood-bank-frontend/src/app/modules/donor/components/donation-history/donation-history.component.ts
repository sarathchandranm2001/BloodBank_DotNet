import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonorService } from '../../../../services/donor.service';
import { DonationHistory } from '../../../../models/donor.model';

@Component({
  selector: 'app-donation-history',
  template: `
    <div class="history-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>history</mat-icon>
            Donation History
          </mat-card-title>
          <button mat-icon-button (click)="goBack()" matTooltip="Back">
            <mat-icon>arrow_back</mat-icon>
          </button>
        </mat-card-header>

        <mat-card-content *ngIf="history">
          <!-- Donor Summary -->
          <div class="summary-section">
            <div class="summary-card">
              <mat-icon>person</mat-icon>
              <div>
                <h3>{{history.donorName}}</h3>
                <p>Blood Group: {{history.bloodGroup}}</p>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="stats-section">
            <h3>Donation Statistics</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <mat-icon>bloodtype</mat-icon>
                <div class="stat-content">
                  <div class="stat-number">{{history.totalDonations}}</div>
                  <div class="stat-label">Total Donations</div>
                </div>
              </div>

              <div class="stat-item" *ngIf="history.lastDonationDate">
                <mat-icon>event</mat-icon>
                <div class="stat-content">
                  <div class="stat-number">{{history.lastDonationDate | date:'shortDate'}}</div>
                  <div class="stat-label">Last Donation</div>
                </div>
              </div>

              <div class="stat-item" *ngIf="history.firstDonationDate">
                <mat-icon>start</mat-icon>
                <div class="stat-content">
                  <div class="stat-number">{{history.firstDonationDate | date:'shortDate'}}</div>
                  <div class="stat-label">First Donation</div>
                </div>
              </div>

              <div class="stat-item" *ngIf="history.averageDaysBetweenDonations">
                <mat-icon>schedule</mat-icon>
                <div class="stat-content">
                  <div class="stat-number">{{history.averageDaysBetweenDonations}}</div>
                  <div class="stat-label">Avg. Days Between</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Current Status -->
          <div class="status-section">
            <h3>Current Status</h3>
            <div class="status-grid">
              <div class="status-item" [class.eligible]="history.isCurrentlyEligible" [class.not-eligible]="!history.isCurrentlyEligible">
                <mat-icon>{{history.isCurrentlyEligible ? 'check_circle' : 'cancel'}}</mat-icon>
                <div>
                  <strong>{{history.isCurrentlyEligible ? 'Eligible' : 'Not Eligible'}}</strong>
                  <small>Current Donation Status</small>
                </div>
              </div>

              <div class="status-item" *ngIf="history.nextEligibleDate">
                <mat-icon>event_available</mat-icon>
                <div>
                  <strong>{{history.nextEligibleDate | date:'fullDate'}}</strong>
                  <small>Next Eligible Date</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="timeline-section" *ngIf="history.totalDonations > 0">
            <h3>Donation Timeline</h3>
            <div class="timeline-info">
              <mat-icon>info</mat-icon>
              <p>
                {{history.donorName}} has been a donor since 
                {{history.firstDonationDate | date:'MMMM yyyy'}} 
                and has made {{history.totalDonations}} 
                donation{{history.totalDonations > 1 ? 's' : ''}}.
              </p>
            </div>
            
            <div class="milestone-cards" *ngIf="getMilestones().length > 0">
              <h4>Achievements</h4>
              <div class="milestones">
                <div class="milestone" *ngFor="let milestone of getMilestones()">
                  <mat-icon [style.color]="milestone.color">{{milestone.icon}}</mat-icon>
                  <div>
                    <strong>{{milestone.title}}</strong>
                    <small>{{milestone.description}}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No History -->
          <div class="no-history" *ngIf="history.totalDonations === 0">
            <mat-icon>bloodtype</mat-icon>
            <h3>No Donation History</h3>
            <p>This donor has not made any blood donations yet.</p>
            <button mat-raised-button 
                    color="primary" 
                    (click)="proceedToDonation()"
                    [disabled]="!history.isCurrentlyEligible">
              <mat-icon>bloodtype</mat-icon>
              Record First Donation
            </button>
          </div>

          <!-- Actions -->
          <div class="actions-section" *ngIf="history.totalDonations > 0">
            <button mat-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Back to Profile
            </button>

            <button mat-raised-button 
                    color="primary" 
                    (click)="checkEligibility()">
              <mat-icon>health_and_safety</mat-icon>
              Check Eligibility
            </button>

            <button mat-raised-button 
                    color="accent" 
                    (click)="proceedToDonation()"
                    [disabled]="!history.isCurrentlyEligible">
              <mat-icon>bloodtype</mat-icon>
              Record New Donation
            </button>
          </div>
        </mat-card-content>

        <!-- Loading State -->
        <mat-card-content *ngIf="loading">
          <div class="loading-container">
            <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
            <p>Loading donation history...</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .history-container {
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .summary-section {
      margin-bottom: 30px;
    }

    .summary-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, #3f51b5, #5c6bc0);
      color: white;
      border-radius: 12px;
    }

    .summary-card mat-icon {
      font-size: 36px;
      height: 36px;
      width: 36px;
    }

    .summary-card h3 {
      margin: 0 0 4px 0;
      font-size: 20px;
    }

    .summary-card p {
      margin: 0;
      opacity: 0.9;
    }

    .stats-section, .status-section, .timeline-section {
      margin-bottom: 30px;
    }

    .stats-section h3, .status-section h3, .timeline-section h3 {
      color: #3f51b5;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 8px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #3f51b5;
    }

    .stat-item mat-icon {
      color: #3f51b5;
      font-size: 28px;
      height: 28px;
      width: 28px;
    }

    .stat-number {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }

    .stat-label {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      border: 2px solid;
    }

    .status-item.eligible {
      background-color: #e8f5e8;
      border-color: #4caf50;
      color: #2e7d32;
    }

    .status-item.not-eligible {
      background-color: #ffebee;
      border-color: #f44336;
      color: #c62828;
    }

    .status-item strong {
      display: block;
    }

    .status-item small {
      font-size: 12px;
      opacity: 0.8;
    }

    .timeline-info {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background-color: #e3f2fd;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .timeline-info mat-icon {
      color: #1976d2;
      margin-top: 2px;
    }

    .timeline-info p {
      margin: 0;
      color: #1565c0;
    }

    .milestone-cards h4 {
      color: #3f51b5;
      margin-bottom: 16px;
    }

    .milestones {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }

    .milestone {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background-color: #fff3e0;
      border-radius: 8px;
      border-left: 4px solid #ff9800;
    }

    .milestone strong {
      display: block;
      color: #e65100;
    }

    .milestone small {
      font-size: 11px;
      color: #bf360c;
    }

    .no-history {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-history mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .no-history h3 {
      margin-bottom: 8px;
      color: #333;
    }

    .actions-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      border-top: 1px solid #e0e0e0;
      flex-wrap: wrap;
      gap: 12px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
    }

    .loading-container p {
      margin-top: 16px;
      color: #666;
    }

    @media (max-width: 768px) {
      .stats-grid, .status-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-section {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class DonationHistoryComponent implements OnInit {
  history: DonationHistory | null = null;
  loading = false;
  donorId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donorService: DonorService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.donorId = parseInt(id);
      this.loadHistory();
    }
  }

  loadHistory(): void {
    this.loading = true;
    this.donorService.getDonationHistory(this.donorId).subscribe({
      next: (history) => {
        this.history = history;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading donation history:', error);
        this.loading = false;
      }
    });
  }

  getMilestones(): any[] {
    if (!this.history) return [];

    const milestones = [];
    
    if (this.history.totalDonations >= 1) {
      milestones.push({
        icon: 'star',
        title: 'First Time Donor',
        description: 'Made first blood donation',
        color: '#4caf50'
      });
    }
    
    if (this.history.totalDonations >= 5) {
      milestones.push({
        icon: 'emoji_events',
        title: 'Regular Donor',
        description: '5+ donations completed',
        color: '#ff9800'
      });
    }
    
    if (this.history.totalDonations >= 10) {
      milestones.push({
        icon: 'military_tech',
        title: 'Dedicated Donor',
        description: '10+ donations completed',
        color: '#9c27b0'
      });
    }
    
    if (this.history.totalDonations >= 25) {
      milestones.push({
        icon: 'workspace_premium',
        title: 'Life Saver',
        description: '25+ donations completed',
        color: '#f44336'
      });
    }

    return milestones;
  }

  checkEligibility(): void {
    this.router.navigate(['/donors/eligibility', this.donorId]);
  }

  proceedToDonation(): void {
    if (this.history?.isCurrentlyEligible) {
      this.router.navigate(['/donors/donate', this.donorId]);
    }
  }

  goBack(): void {
    this.router.navigate(['/donors/profile', this.donorId]);
  }
}