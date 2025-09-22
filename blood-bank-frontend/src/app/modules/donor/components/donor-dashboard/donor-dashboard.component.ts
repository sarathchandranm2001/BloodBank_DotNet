import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="donor-dashboard">
      <!-- Header -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
          <span class="navbar-brand mb-0 h1">
            <i class="bi bi-heart-pulse me-2"></i>
            Donor Management
          </span>
          <div class="d-flex">
            <a class="btn btn-light btn-sm" routerLink="/donors/register" *ngIf="canRegisterDonor()">
              <i class="bi bi-person-plus me-2"></i>
              Register Donor
            </a>
          </div>
        </div>
      </nav>

      <!-- Navigation Tabs -->
      <div class="bg-light border-bottom">
        <div class="container-fluid">
          <ul class="nav nav-tabs nav-tabs-no-border">
            <li class="nav-item">
              <a class="nav-link" 
                 routerLink="/donors/list" 
                 routerLinkActive="active">
                <i class="bi bi-people me-2"></i>
                All Donors
              </a>
            </li>
            <li class="nav-item" *ngIf="canRegisterDonor()">
              <a class="nav-link" 
                 routerLink="/donors/register" 
                 routerLinkActive="active">
                <i class="bi bi-person-plus me-2"></i>
                Register
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Content -->
      <div class="dashboard-content">
        <router-outlet></router-outlet>
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