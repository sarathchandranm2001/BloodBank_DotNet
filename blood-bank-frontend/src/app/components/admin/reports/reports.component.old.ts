import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="text-primary">
          <i class="bi bi-graph-up me-2"></i>Reports & Analytics
        </h1>
        <button class="btn btn-primary">
          <i class="bi bi-download me-2"></i>Export Reports
        </button>
      </div>

      <!-- Navigation Tabs -->
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a class="nav-link active" href="#donations">Donation Reports</a>
        </li>
      </ul>
        <mat-tab label="Donation Reports">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>volunteer_activism</mat-icon>
                  Donation Statistics
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="report-stats">
                  <div class="stat-item">
                    <h3>125</h3>
                    <p>Total Donations This Month</p>
                  </div>
                  <div class="stat-item">
                    <h3>1,250</h3>
                    <p>Total Donations This Year</p>
                  </div>
                  <div class="stat-item">
                    <h3>85%</h3>
                    <p>Donor Retention Rate</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        <mat-tab label="Blood Usage">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>local_hospital</mat-icon>
                  Blood Usage Analytics
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="report-stats">
                  <div class="stat-item">
                    <h3>95</h3>
                    <p>Units Issued This Month</p>
                  </div>
                  <div class="stat-item">
                    <h3>O+</h3>
                    <p>Most Requested Type</p>
                  </div>
                  <div class="stat-item">
                    <h3>2.5 days</h3>
                    <p>Average Request Processing</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Inventory Reports">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>inventory</mat-icon>
                  Inventory Analytics
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="report-stats">
                  <div class="stat-item">
                    <h3>320</h3>
                    <p>Total Units in Stock</p>
                  </div>
                  <div class="stat-item">
                    <h3>15</h3>
                    <p>Units Expiring Soon</p>
                  </div>
                  <div class="stat-item">
                    <h3>95%</h3>
                    <p>Inventory Utilization</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="User Activity">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>people</mat-icon>
                  User Activity Reports
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="report-stats">
                  <div class="stat-item">
                    <h3>150</h3>
                    <p>Active Users</p>
                  </div>
                  <div class="stat-item">
                    <h3>25</h3>
                    <p>New Registrations This Month</p>
                  </div>
                  <div class="stat-item">
                    <h3>90%</h3>
                    <p>System Uptime</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .reports-container {
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

    .tab-content {
      padding: 20px 0;
    }

    .report-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .stat-item {
      text-align: center;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: #fafafa;
    }

    .stat-item h3 {
      margin: 0;
      font-size: 2.5rem;
      color: #1976d2;
      font-weight: bold;
    }

    .stat-item p {
      margin: 10px 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    @media (max-width: 768px) {
      .reports-container {
        padding: 10px;
      }

      .report-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReportsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}