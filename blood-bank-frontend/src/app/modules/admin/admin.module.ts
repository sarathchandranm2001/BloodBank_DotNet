import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('../../components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  { 
    path: 'users', 
    loadComponent: () => import('../../components/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  { 
    path: 'inventory', 
    loadComponent: () => import('../../components/admin/blood-inventory/blood-inventory.component').then(m => m.BloodInventoryComponent)
  },
  { 
    path: 'reports', 
    loadComponent: () => import('../../components/admin/reports/reports.component').then(m => m.ReportsComponent)
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminModule { }