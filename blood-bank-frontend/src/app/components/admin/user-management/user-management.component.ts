import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    FormsModule
  ],
  template: `
    <div class="user-management-container">
      <div class="header d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">User Management</h1>
        <div class="header-actions">
          <button class="btn btn-outline-primary me-2" (click)="refreshData()" [disabled]="isLoading">
            <i class="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </button>
          <button class="btn btn-primary">
            <i class="bi bi-person-plus me-1"></i>
            Add New User
          </button>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="loading-container text-center py-5">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading user data...</p>
      </div>

      <div class="card" *ngIf="!isLoading">
        <div class="card-header">
          <h5 class="card-title mb-0">System Users ({{ filteredUsers.length }})</h5>
        </div>
        <div class="card-body">
          <!-- Search and Filter -->
          <div class="row mb-3">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-search"></i>
                </span>
                <input type="text" class="form-control" placeholder="Search users..." 
                       (keyup)="applyFilter($event)" #searchInput>
              </div>
            </div>
            
            <div class="col-md-4">
              <select class="form-select" (change)="filterByRole($event)" [value]="selectedRole">
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Donor">Donor</option>
                <option value="Recipient">Recipient</option>
              </select>
            </div>
          </div>

          <!-- Users Table -->
          <div class="table-responsive" *ngIf="filteredUsers.length > 0; else noUsersTemplate">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
                  <th scope="col" class="sortable" (click)="sortBy('userId')">
                    ID <i class="bi bi-arrow-down-up"></i>
                  </th>
                  <th scope="col" class="sortable" (click)="sortBy('name')">
                    Name <i class="bi bi-arrow-down-up"></i>
                  </th>
                  <th scope="col" class="sortable" (click)="sortBy('email')">
                    Email <i class="bi bi-arrow-down-up"></i>
                  </th>
                  <th scope="col" class="sortable" (click)="sortBy('role')">
                    Role <i class="bi bi-arrow-down-up"></i>
                  </th>
                  <th scope="col" class="sortable" (click)="sortBy('createdAt')">
                    Created <i class="bi bi-arrow-down-up"></i>
                  </th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of paginatedUsers">
                  <td>{{ user.userId }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="badge" [ngClass]="getRoleClass(user.role)">
                      {{ user.role }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.createdAt) }}</td>
                  <td>
                    <div class="btn-group btn-group-sm" role="group">
                      <button type="button" class="btn btn-outline-primary" (click)="viewUser(user)" title="View Details">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button type="button" class="btn btn-outline-warning" (click)="editUser(user)" title="Edit User">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button type="button" class="btn btn-outline-danger" (click)="deleteUser(user)" 
                              title="Delete User" [disabled]="user.role === 'Admin'">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Bootstrap Pagination -->
            <nav aria-label="User pagination" *ngIf="totalPages > 1">
              <ul class="pagination justify-content-center">
                <li class="page-item" [class.disabled]="currentPage === 1">
                  <button class="page-link" (click)="goToPage(1)" [disabled]="currentPage === 1">
                    <i class="bi bi-chevron-double-left"></i>
                  </button>
                </li>
                <li class="page-item" [class.disabled]="currentPage === 1">
                  <button class="page-link" (click)="goToPage(currentPage - 1)" [disabled]="currentPage === 1">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                </li>
                <li class="page-item" *ngFor="let page of getPageNumbers()" [class.active]="page === currentPage">
                  <button class="page-link" (click)="goToPage(page)">{{ page }}</button>
                </li>
                <li class="page-item" [class.disabled]="currentPage === totalPages">
                  <button class="page-link" (click)="goToPage(currentPage + 1)" [disabled]="currentPage === totalPages">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </li>
                <li class="page-item" [class.disabled]="currentPage === totalPages">
                  <button class="page-link" (click)="goToPage(totalPages)" [disabled]="currentPage === totalPages">
                    <i class="bi bi-chevron-double-right"></i>
                  </button>
                </li>
              </ul>
            </nav>

            <!-- Page Size Selector -->
            <div class="d-flex justify-content-between align-items-center mt-3">
              <div>
                <label class="form-label me-2">Show:</label>
                <select class="form-select form-select-sm d-inline-block w-auto" 
                        [(ngModel)]="pageSize" (change)="onPageSizeChange()">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span class="ms-2 text-muted">entries per page</span>
              </div>
              <div class="text-muted">
                Showing {{ getStartIndex() + 1 }} to {{ getEndIndex() }} of {{ filteredUsers.length }} entries
              </div>
            </div>
          </div>

          <ng-template #noUsersTemplate>
            <div class="text-center py-5">
              <i class="bi bi-people display-1 text-muted"></i>
              <p class="mt-3 text-muted">No users found</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-management-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .sortable {
      cursor: pointer;
      user-select: none;
    }

    .sortable:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .role-admin { background-color: #dc3545 !important; }
    .role-donor { background-color: #198754 !important; }
    .role-recipient { background-color: #0d6efd !important; }
    .role-default { background-color: #6c757d !important; }

    .table th {
      border-top: none;
    }

    .btn-group .btn {
      margin-right: 2px;
    }

    .btn-group .btn:last-child {
      margin-right: 0;
    }

    .pagination .page-link {
      color: #0d6efd;
    }

    .pagination .page-item.active .page-link {
      background-color: #0d6efd;
      border-color: #0d6efd;
    }
  `]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  isLoading = true;
  selectedRole = '';
  searchTerm = '';
  
  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  
  // Sorting properties
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private adminService: AdminService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.isLoading = true;
    
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...users];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        alert('Error loading user data. Please try again.');
        this.isLoading = false;
      }
    });
  }

  refreshData(): void {
    this.loadUsers();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchTerm = filterValue;
    this.filterUsers();
    this.currentPage = 1;
    this.updatePagination();
  }

  filterByRole(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedRole = target.value;
    this.filterUsers();
    this.currentPage = 1;
    this.updatePagination();
  }

  private filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.name.toLowerCase().includes(this.searchTerm) ||
        user.email.toLowerCase().includes(this.searchTerm);
      
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      
      return matchesSearch && matchesRole;
    });
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.filteredUsers.sort((a, b) => {
      let valueA = (a as any)[column];
      let valueB = (b as any)[column];
      
      if (column === 'createdAt') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      } else if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      
      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  getEndIndex(): number {
    return Math.min(this.getStartIndex() + this.pageSize, this.filteredUsers.length);
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
    alert(`Viewing details for ${user.name}`);
  }

  editUser(user: User): void {
    // TODO: Implement user edit dialog
    alert(`Editing ${user.name}`);
  }

  deleteUser(user: User): void {
    if (user.role === 'Admin') {
      alert('Cannot delete admin users');
      return;
    }

    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      this.adminService.deleteUser(user.userId).subscribe({
        next: () => {
          alert(`User ${user.name} deleted successfully`);
          this.loadUsers(); // Refresh the list
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Error deleting user. Please try again.');
        }
      });
    }
  }
}