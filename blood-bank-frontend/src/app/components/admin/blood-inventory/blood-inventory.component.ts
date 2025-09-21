import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-blood-inventory',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule
  ],
  template: `
    <div class="inventory-container">
      <div class="header">
        <h1>Blood Inventory Management</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Add Blood Stock
        </button>
      </div>

      <div class="inventory-grid">
        <mat-card class="stock-summary">
          <mat-card-header>
            <mat-card-title>Stock Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="blood-groups">
              <div class="blood-group-item" *ngFor="let group of bloodGroups">
                <span class="blood-type">{{ group.type }}</span>
                <span class="units">{{ group.units }} units</span>
                <mat-chip [ngClass]="getStockClass(group.units)">
                  {{ getStockStatus(group.units) }}
                </mat-chip>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="alerts">
          <mat-card-header>
            <mat-card-title>
              <mat-icon color="warn">warning</mat-icon>
              Alerts
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="alert-item" *ngFor="let alert of alerts">
              <mat-icon [color]="alert.severity">{{ alert.icon }}</mat-icon>
              <span>{{ alert.message }}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="inventory-details">
        <mat-card-header>
          <mat-card-title>Detailed Inventory</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Complete blood inventory management system with expiry tracking, batch management, and issuing controls.</p>
          <div class="placeholder">
            <mat-icon>inventory</mat-icon>
            <p>Detailed inventory features coming soon...</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .inventory-container {
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

    .inventory-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .blood-groups {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .blood-group-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .blood-type {
      font-weight: bold;
      color: #d32f2f;
    }

    .alert-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      padding: 8px;
      background: #fff3e0;
      border-radius: 4px;
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

    .high-stock { background-color: #4caf50; }
    .medium-stock { background-color: #ff9800; }
    .low-stock { background-color: #f44336; }

    @media (max-width: 768px) {
      .inventory-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BloodInventoryComponent implements OnInit {
  bloodGroups = [
    { type: 'A+', units: 45 },
    { type: 'A-', units: 12 },
    { type: 'B+', units: 38 },
    { type: 'B-', units: 8 },
    { type: 'AB+', units: 15 },
    { type: 'AB-', units: 5 },
    { type: 'O+', units: 52 },
    { type: 'O-', units: 18 }
  ];

  alerts = [
    { icon: 'warning', severity: 'warn', message: 'AB- blood is critically low (5 units)' },
    { icon: 'schedule', severity: 'accent', message: '3 units expiring within 7 days' },
    { icon: 'info', severity: 'primary', message: 'New donation scheduled for tomorrow' }
  ];

  constructor() {}

  ngOnInit(): void {}

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
}