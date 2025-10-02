import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

// Admin DTOs interfaces
export interface AdminDashboardStats {
  totalUsers: number;
  totalDonors: number;
  totalRecipients: number;
  totalBloodUnits: number;
  pendingRequests: number;
  lowStockAlerts: number;
  expiringSoonUnits: number;
  totalDonationsThisMonth: number;
  activeUsers: number;
}

export interface BloodGroupStats {
  bloodGroup: string;
  totalUnits: number;
  expiringSoonUnits: number;
  expiredUnits: number;
  isLowStock: boolean;
  lastUpdated: string;
}

export interface RecentDonor {
  donorId: number;
  name: string;
  bloodGroup: string;
  registrationDate: string;
  lastDonationDate?: string;
}

export interface RecentRequest {
  requestId: number;
  recipientName: string;
  bloodGroup: string;
  unitsRequested: number;
  status: string;
  requestDate: string;
  urgencyLevel: string;
}

export interface SystemAlert {
  type: string;
  icon: string;
  message: string;
  severity: string;
  createdAt: string;
}

export interface AdminActivity {
  recentDonors: RecentDonor[];
  recentRequests: RecentRequest[];
  systemAlerts: SystemAlert[];
}

export interface BloodGroupDistribution {
  bloodGroup: string;
  donorCount: number;
  percentage: number;
}

export interface DonationAnalytics {
  totalDonationsThisMonth: number;
  totalDonationsLastMonth: number;
  totalDonationsThisYear: number;
  donorRetentionRate: number;
  bloodGroupDistribution: BloodGroupDistribution[];
}

export interface BloodStockSummary {
  bloodGroup: string;
  totalUnits: number;
  freshUnits: number;
  expiringSoonUnits: number;
  expiredUnits: number;
  oldestExpiryDate: string;
  newestExpiryDate: string;
  hasLowStock: boolean;
  hasExpiringSoon: boolean;
  hasExpired: boolean;
}

export interface LowStockAlert {
  bloodGroup: string;
  currentUnits: number;
  lastUpdated: string;
}

export interface BloodAvailability {
  bloodGroup: string;
  availableUnits: number;
  reservedUnits: number;
  totalUnits: number;
  location: string;
  lastUpdated: string;
  oldestUnitExpiry?: string;
  newestUnitExpiry?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private apiService: ApiService) { }

  // Admin Dashboard APIs
  getDashboardStats(): Observable<AdminDashboardStats> {
    return this.apiService.get<AdminDashboardStats>('/admin/dashboard-stats');
  }

  getBloodGroupStats(): Observable<BloodGroupStats[]> {
    return this.apiService.get<BloodGroupStats[]>('/admin/blood-group-stats');
  }

  getRecentActivity(): Observable<AdminActivity> {
    return this.apiService.get<AdminActivity>('/admin/recent-activity');
  }

  getDonationAnalytics(): Observable<DonationAnalytics> {
    return this.apiService.get<DonationAnalytics>('/admin/donation-analytics');
  }

  // Blood Stock APIs
  getBloodStockSummary(): Observable<BloodStockSummary[]> {
    return this.apiService.get<BloodStockSummary[]>('/bloodstock/summary');
  }

  getLowStockAlerts(): Observable<LowStockAlert[]> {
    return this.apiService.get<LowStockAlert[]>('/bloodstock/low-stock-alerts');
  }

  getExpiringSoonStock(): Observable<any[]> {
    return this.apiService.get<any[]>('/bloodstock/expiring-soon');
  }

  getBloodInventory(): Observable<BloodAvailability[]> {
    return this.apiService.get<BloodAvailability[]>('/bloodinventory');
  }

  // User Management APIs
  getAllUsers(): Observable<any[]> {
    return this.apiService.get<any[]>('/users');
  }

  getUserById(id: number): Observable<any> {
    return this.apiService.get<any>(`/users/${id}`);
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.apiService.put<any>(`/users/${id}`, userData);
  }

  deleteUser(id: number): Observable<any> {
    return this.apiService.delete<any>(`/users/${id}`);
  }

  // Blood Requests APIs
  getAllBloodRequests(): Observable<any[]> {
    return this.apiService.get<any[]>('/bloodrequests');
  }

  getPendingBloodRequests(): Observable<any[]> {
    return this.apiService.get<any[]>('/bloodrequests/pending');
  }

  updateBloodRequestStatus(requestId: number, status: string, adminNotes?: string): Observable<any> {
    return this.apiService.put<any>(`/bloodrequests/${requestId}/status`, {
      status,
      adminNotes
    });
  }

  // Donor Management APIs
  getAllDonors(): Observable<any[]> {
    return this.apiService.get<any[]>('/donors');
  }

  getEligibleDonors(): Observable<any[]> {
    return this.apiService.get<any[]>('/donors/eligible');
  }

  getDonorsByBloodGroup(bloodGroup: string): Observable<any[]> {
    return this.apiService.get<any[]>(`/donors/bloodgroup/${bloodGroup}`);
  }

  // Recipient Management APIs
  getAllRecipients(): Observable<any[]> {
    return this.apiService.get<any[]>('/recipients');
  }

  // Blood Stock Management APIs
  addBloodStock(stockData: any): Observable<any> {
    return this.apiService.post<any>('/bloodstock', stockData);
  }

  updateBloodStock(stockId: number, stockData: any): Observable<any> {
    return this.apiService.put<any>(`/bloodstock/${stockId}`, stockData);
  }

  deleteBloodStock(stockId: number): Observable<any> {
    return this.apiService.delete<any>(`/bloodstock/${stockId}`);
  }

  // System Health APIs
  getSystemHealth(): Observable<any> {
    // This would be a custom endpoint for system health monitoring
    return this.apiService.get<any>('/admin/system-health');
  }

  // Export APIs
  exportData(dataType: string, format: string = 'csv'): Observable<Blob> {
    return this.apiService.getBlob(`/admin/export/${dataType}?format=${format}`);
  }
}