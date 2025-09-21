import { Component } from '@angular/core';

@Component({
  selector: 'app-donor-dashboard',
  template: `
    <div class="donor-dashboard">
      <mat-toolbar color="primary">
        <mat-toolbar-row>
          <span>Donor Management</span>
          <span class="spacer"></span>
          <button mat-button routerLink="/donors/register" *ngIf="canRegisterDonor()">
            <mat-icon>person_add</mat-icon>
            Register Donor
          </button>
        </mat-toolbar-row>
      </mat-toolbar>

      <div class="dashboard-content">
        <nav mat-tab-nav-bar>
          <a mat-tab-link 
             routerLink="/donors/list" 
             routerLinkActive 
             #rla1="routerLinkActive"
             [active]="rla1.isActive">
            <mat-icon>people</mat-icon>
            All Donors
          </a>
          <a mat-tab-link 
             routerLink="/donors/register" 
             routerLinkActive 
             #rla2="routerLinkActive"
             [active]="rla2.isActive"
             *ngIf="canRegisterDonor()">
            <mat-icon>person_add</mat-icon>
            Register
          </a>
        </nav>

        <div class="tab-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .donor-dashboard {
      height: 100%;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .dashboard-content {
      padding: 20px;
    }

    .tab-content {
      margin-top: 20px;
    }

    mat-tab-nav-bar {
      background-color: #f5f5f5;
    }

    a[mat-tab-link] {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class DonorDashboardComponent {
  
  canRegisterDonor(): boolean {
    // Check if user can register donors (Admin or Staff)
    const userRole = localStorage.getItem('userRole');
    return userRole === 'Admin' || userRole === 'Staff';
  }
}