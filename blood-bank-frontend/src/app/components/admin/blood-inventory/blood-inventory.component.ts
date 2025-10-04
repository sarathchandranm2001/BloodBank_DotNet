import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, BloodGroupStats, SystemAlert } from '../../../services/admin.service';

@Component({
  selector: 'app-blood-inventory',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="display-5 fw-bold text-dark">Blood Inventory Management</h1>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary" (click)="refreshData()" [disabled]="isLoading">
            <i class="bi bi-arrow-clockwise me-2"></i>Refresh
          </button>
          <button class="btn btn-primary">
            <i class="bi bi-plus-lg me-2"></i>Add Blood Stock
          </button>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="d-flex flex-column justify-content-center align-items-center py-5">
        <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted fs-5">Loading inventory data...</p>
      </div>

      <div class="row g-4" *ngIf="!isLoading">
        <div class="col-lg-8">
          <div class="card shadow-sm border-0">
            <div class="card-header bg-primary text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-droplet-fill me-2"></i>Stock Summary
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3" *ngIf="bloodGroups.length > 0; else noDataTemplate">
                <div class="col-md-6 col-lg-4" *ngFor="let group of bloodGroups">
                  <div class="card h-100 border-start border-4" [ngClass]="{
                    'border-success': getStockClass(group.totalUnits) === 'high-stock',
                    'border-warning': getStockClass(group.totalUnits) === 'medium-stock',
                    'border-danger': getStockClass(group.totalUnits) === 'low-stock'
                  }">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 class="text-danger fw-bold mb-1">{{ group.bloodGroup }}</h5>
                          <p class="text-muted mb-2">{{ group.totalUnits }} units</p>
                          <span class="badge" [ngClass]="{
                            'bg-success': getStockClass(group.totalUnits) === 'high-stock',
                            'bg-warning': getStockClass(group.totalUnits) === 'medium-stock',
                            'bg-danger': getStockClass(group.totalUnits) === 'low-stock'
                          }">
                            {{ getStockStatus(group.totalUnits) }}
                          </span>
                        </div>
                        <i class="bi bi-droplet-fill fs-2 text-danger"></i>
                      </div>
                      <div *ngIf="group.expiringSoonUnits > 0" class="mt-2">
                        <small class="text-warning">
                          <i class="bi bi-exclamation-triangle-fill me-1"></i>
                          {{ group.expiringSoonUnits }} expiring soon
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ng-template #noDataTemplate>
                <div class="text-center py-4">
                  <i class="bi bi-info-circle fs-1 text-muted mb-3"></i>
                  <p class="text-muted">No blood inventory data available</p>
                </div>
              </ng-template>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card shadow-sm border-0">
            <div class="card-header bg-warning text-dark">
              <h5 class="card-title mb-0">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>System Alerts
              </h5>
            </div>
            <div class="card-body">
              <div *ngIf="alerts.length > 0; else noAlertsTemplate">
                <div class="alert alert-warning border-0 shadow-sm mb-2" *ngFor="let alert of alerts">
                  <div class="d-flex align-items-center">
                    <i class="bi" [ngClass]="{
                      'bi-exclamation-triangle-fill text-danger': alert.severity === 'critical',
                      'bi-exclamation-triangle text-warning': alert.severity === 'warning',
                      'bi-info-circle text-info': alert.severity === 'info'
                    }"></i>
                    <span class="ms-2">{{ alert.message }}</span>
                  </div>
                </div>
              </div>
              <ng-template #noAlertsTemplate>
                <div class="text-center py-4">
                  <i class="bi bi-check-circle-fill fs-1 text-success mb-3"></i>
                  <p class="text-muted">No active alerts</p>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4" *ngIf="!isLoading">
        <div class="col-12">
          <div class="card shadow-sm border-0">
            <div class="card-header bg-info text-white">
              <h5 class="card-title mb-0">
                <i class="bi bi-graph-up me-2"></i>Detailed Inventory
              </h5>
            </div>
            <div class="card-body">
              <p class="text-muted mb-4">Real-time blood inventory tracking with expiry monitoring and stock management.</p>
              <div class="row g-4">
                <div class="col-md-4">
                  <div class="text-center p-3 bg-light rounded">
                    <h4 class="fw-bold text-primary mb-1">{{ getTotalUnits() }}</h4>
                    <p class="text-muted mb-0">Total Units</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center p-3 bg-light rounded">
                    <h4 class="fw-bold text-warning mb-1">{{ getLowStockCount() }}</h4>
                    <p class="text-muted mb-0">Low Stock Alerts</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center p-3 bg-light rounded">
                    <h4 class="fw-bold text-danger mb-1">{{ getExpiringSoonCount() }}</h4>
                    <p class="text-muted mb-0">Expiring Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BloodInventoryComponent implements OnInit {
  bloodGroups: BloodGroupStats[] = [];
  alerts: SystemAlert[] = [];
  isLoading = true;

  constructor(
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadInventoryData();
  }

  private loadInventoryData(): void {
    this.isLoading = true;
    
    // Load blood group statistics
    this.adminService.getBloodGroupStats().subscribe({
      next: (stats) => {
        this.bloodGroups = stats;
        this.loadAlerts();
      },
      error: (error) => {
        console.error('Error loading blood group stats:', error);
        alert('Error loading inventory data. Please try again.');
        this.isLoading = false;
      }
    });
  }

  private loadAlerts(): void {
    this.adminService.getRecentActivity().subscribe({
      next: (activity) => {
        this.alerts = activity.systemAlerts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading alerts:', error);
        this.alerts = [];
        this.isLoading = false;
      }
    });
  }

  refreshData(): void {
    this.loadInventoryData();
  }

  getStockClass(units: number): string {
    if (units >= 30) return 'high-stock';
    if (units >= 15) return 'medium-stock';
    return 'low-stock';
  }

  getStockStatus(units: number): string {
    if (units >= 30) return 'Good';
    if (units >= 15) return 'Low';
    return 'Critical';
  }

  getTotalUnits(): number {
    return this.bloodGroups.reduce((total, group) => total + group.totalUnits, 0);
  }

  getLowStockCount(): number {
    return this.bloodGroups.filter(group => group.isLowStock).length;
  }

  getExpiringSoonCount(): number {
    return this.bloodGroups.reduce((total, group) => total + group.expiringSoonUnits, 0);
  }
}