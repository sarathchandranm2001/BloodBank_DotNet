import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminService } from '../../../services/admin.service';
import { UserService } from '../../../services/user.service';

interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

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
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDialogModule
  ],
  template: `
    <div class="user-management-container">
      <div class="header">
        <h1>User Management</h1>
        <div class="header-actions">
          <button mat-raised-button color="accent" (click)="refreshData()" [disabled]="isLoading">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
          <button mat-raised-button color="primary">
            <mat-icon>add</mat-icon>
            Add New User
          </button>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="loading-container">
        <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
        <p>Loading user data...</p>
      </div>

      <mat-card *ngIf="!isLoading">
        <mat-card-header>
          <mat-card-title>System Users ({{ users.length }})</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <!-- Search and Filter -->
          <div class="filters">
            <mat-form-field appearance="outline">
              <mat-label>Search users</mat-label>
              <input matInput (keyup)="applyFilter($event)" #searchInput>
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Filter by Role</mat-label>
              <mat-select (selectionChange)="filterByRole($event.value)">
                <mat-option value="">All Roles</mat-option>
                <mat-option value="Admin">Admin</mat-option>
                <mat-option value="Donor">Donor</mat-option>
                <mat-option value="Recipient">Recipient</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <!-- Users Table -->
          <div class="table-container" *ngIf="users.length > 0; else noUsersTemplate">
            <table mat-table [dataSource]="dataSource" matSort class="users-table">
              <!-- ID Column -->
              <ng-container matColumnDef="userId">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let user">{{ user.userId }}</td>
              </ng-container>

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
                <td mat-cell *matCellDef="let user">{{ user.name }}</td>
              </ng-container>

              <!-- Email Column -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
                <td mat-cell *matCellDef="let user">{{ user.email }}</td>
              </ng-container>

              <!-- Role Column -->
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip [ngClass]="getRoleClass(user.role)">
                    {{ user.role }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Created Date Column -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Created</th>
                <td mat-cell *matCellDef="let user">{{ formatDate(user.createdAt) }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button color="primary" (click)="viewUser(user)" title="View Details">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="editUser(user)" title="Edit User">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteUser(user)" title="Delete User"
                          [disabled]="user.role === 'Admin'">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <mat-paginator #paginator 
                          [pageSizeOptions]="[5, 10, 20, 50]" 
                          [pageSize]="10"
                          showFirstLastButtons>
            </mat-paginator>
          </div>

          <ng-template #noUsersTemplate>
            <div class="no-data">
              <mat-icon>people_outline</mat-icon>
              <p>No users found</p>
            </div>
          </ng-template>
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

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      text-align: center;
    }

    .loading-container p {
      margin-top: 20px;
      color: #666;
      font-size: 1.1rem;
    }

    .filters {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .table-container {
      overflow-x: auto;
    }

    .users-table {
      width: 100%;
    }

    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-data mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 15px;
    }

    .role-admin { background-color: #f44336; color: white; }
    .role-donor { background-color: #4caf50; color: white; }
    .role-recipient { background-color: #2196f3; color: white; }
    .role-default { background-color: #9e9e9e; color: white; }
  `]
})
export class UserManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  users: User[] = [];
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = ['userId', 'name', 'email', 'role', 'createdAt', 'actions'];
  isLoading = true;
  selectedRole = '';

  constructor(
    private adminService: AdminService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadUsers(): void {
    this.isLoading = true;
    
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.dataSource.data = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Error loading user data. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  refreshData(): void {
    this.loadUsers();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByRole(role: string): void {
    this.selectedRole = role;
    if (role) {
      this.dataSource.data = this.users.filter(user => user.role === role);
    } else {
      this.dataSource.data = this.users;
    }
  }

  getRoleClass(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin': return 'role-admin';
      case 'donor': return 'role-donor';
      case 'recipient': return 'role-recipient';
      default: return 'role-default';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  viewUser(user: User): void {
    // TODO: Implement user details dialog
    this.snackBar.open(`Viewing details for ${user.name}`, 'Close', {
      duration: 3000
    });
  }

  editUser(user: User): void {
    // TODO: Implement user edit dialog
    this.snackBar.open(`Editing ${user.name}`, 'Close', {
      duration: 3000
    });
  }

  deleteUser(user: User): void {
    if (user.role === 'Admin') {
      this.snackBar.open('Cannot delete admin users', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      this.adminService.deleteUser(user.userId).subscribe({
        next: () => {
          this.snackBar.open(`User ${user.name} deleted successfully`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadUsers(); // Refresh the list
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.snackBar.open('Error deleting user. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}