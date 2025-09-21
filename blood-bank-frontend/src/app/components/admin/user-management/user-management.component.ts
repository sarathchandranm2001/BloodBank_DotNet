import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  template: `
    <div class="user-management-container">
      <div class="header">
        <h1>User Management</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Add New User
        </button>
      </div>

      <mat-card>
        <mat-card-header>
          <mat-card-title>System Users</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Manage all system users, their roles, and permissions.</p>
          <!-- User table and management features will be implemented here -->
          <div class="placeholder">
            <mat-icon>people</mat-icon>
            <p>User management features coming soon...</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .user-management-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .placeholder {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .placeholder mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
    }
  `]
})
export class UserManagementComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}