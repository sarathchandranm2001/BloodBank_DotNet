import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  AdminDashboardStats, 
  BloodGroupStats, 
  AdminActivity, 
  DonationAnalytics,
  DonorDetails,
  RecipientDetails,
  BloodRequestManagement,
  BloodInventoryItem,
  Transaction
} from '../models/admin.model';
import { BloodRequestDto, BloodRequestStatusUpdate, BloodRequestStatus } from '../models/recipient.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Dashboard Statistics
  getDashboardStats(): Observable<AdminDashboardStats> {
    return this.http.get<AdminDashboardStats>(`${this.apiUrl}/admin/dashboard-stats`);
  }

  getBloodGroupStats(): Observable<BloodGroupStats[]> {
    return this.http.get<BloodGroupStats[]>(`${this.apiUrl}/admin/blood-group-stats`);
  }

  getRecentActivity(): Observable<AdminActivity> {
    return this.http.get<AdminActivity>(`${this.apiUrl}/admin/recent-activity`);
  }

  getDonationAnalytics(): Observable<DonationAnalytics> {
    return this.http.get<DonationAnalytics>(`${this.apiUrl}/admin/donation-analytics`);
  }

  // Blood Request Management
  getAllBloodRequests(): Observable<BloodRequestDto[]> {
    return this.http.get<BloodRequestDto[]>(`${this.apiUrl}/bloodrequests`);
  }

  getPendingBloodRequests(): Observable<BloodRequestDto[]> {
    return this.http.get<BloodRequestDto[]>(`${this.apiUrl}/bloodrequests?status=Pending`);
  }

  updateRequestStatus(requestId: number, statusData: BloodRequestStatusUpdate): Observable<BloodRequestDto> {
    return this.http.put<BloodRequestDto>(`${this.apiUrl}/bloodrequests/${requestId}/status`, statusData);
  }

  approveBloodRequest(requestId: number, adminNotes?: string): Observable<BloodRequestDto> {
    return this.updateRequestStatus(requestId, { 
      status: BloodRequestStatus.Approved, 
      adminNotes: adminNotes || '' 
    });
  }

  rejectBloodRequest(requestId: number, adminNotes: string): Observable<BloodRequestDto> {
    return this.updateRequestStatus(requestId, { 
      status: BloodRequestStatus.Rejected, 
      adminNotes 
    });
  }

  fulfillBloodRequest(requestId: number, adminNotes?: string): Observable<BloodRequestDto> {
    return this.updateRequestStatus(requestId, { 
      status: BloodRequestStatus.Fulfilled, 
      adminNotes: adminNotes || '' 
    });
  }

  // Donor Management
  getAllDonors(): Observable<DonorDetails[]> {
    return this.http.get<DonorDetails[]>(`${this.apiUrl}/donors`);
  }

  getDonorById(id: number): Observable<DonorDetails> {
    return this.http.get<DonorDetails>(`${this.apiUrl}/donors/${id}`);
  }

  updateDonorStatus(id: number, isEligible: boolean): Observable<DonorDetails> {
    return this.http.put<DonorDetails>(`${this.apiUrl}/donors/${id}/eligibility`, { isEligible });
  }

  deleteDonor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/donors/${id}`);
  }

  // Recipient Management
  getAllRecipients(): Observable<RecipientDetails[]> {
    return this.http.get<RecipientDetails[]>(`${this.apiUrl}/recipients`);
  }

  getRecipientById(id: number): Observable<RecipientDetails> {
    return this.http.get<RecipientDetails>(`${this.apiUrl}/recipients/${id}`);
  }

  deleteRecipient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/recipients/${id}`);
  }

  // Blood Inventory Management
  getBloodInventory(): Observable<BloodInventoryItem[]> {
    return this.http.get<BloodInventoryItem[]>(`${this.apiUrl}/bloodstock`);
  }

  getBloodAvailability(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bloodstock/availability`);
  }

  updateBloodStock(inventoryId: number, units: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/bloodstock/${inventoryId}`, { unitsAvailable: units });
  }

  removeExpiredBlood(inventoryId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bloodstock/${inventoryId}/expired`);
  }

  // Transaction History
  getTransactionHistory(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/admin/transactions`);
  }

  getDonationHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/donations`);
  }

  // Reports and Analytics
  getBloodInventoryReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/reports/inventory`);
  }

  getDonorReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/reports/donors`);
  }

  getRequestsReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/reports/requests`);
  }

  // User Management
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  updateUserStatus(userId: number, isActive: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}/status`, { isActive });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  // Emergency Alerts
  sendEmergencyAlert(bloodGroup: string, message: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/emergency-alert`, { bloodGroup, message });
  }

  // System Settings
  getSystemSettings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/settings`);
  }

  updateSystemSettings(settings: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/settings`, settings);
  }

  // Export APIs
  exportData(dataType: string, format: string = 'csv'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/admin/export/${dataType}?format=${format}`, { responseType: 'blob' });
  }
}