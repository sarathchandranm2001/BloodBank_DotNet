import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Recipient, 
  RecipientRegistration, 
  RecipientUpdate, 
  BloodRequest, 
  BloodRequestCreate, 
  BloodRequestUpdate,
  BloodRequestStatusUpdate
} from '../models/recipient.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipientService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  // Recipient Management
  registerRecipient(recipientData: RecipientRegistration): Observable<Recipient> {
    return this.http.post<Recipient>(`${this.apiUrl}/recipients/register`, recipientData);
  }

  getRecipientProfile(): Observable<Recipient> {
    return this.http.get<Recipient>(`${this.apiUrl}/recipients/profile`);
  }

  updateRecipientProfile(updateData: RecipientUpdate): Observable<Recipient> {
    return this.http.put<Recipient>(`${this.apiUrl}/recipients/profile`, updateData);
  }

  getAllRecipients(): Observable<Recipient[]> {
    return this.http.get<Recipient[]>(`${this.apiUrl}/recipients`);
  }

  getRecipientById(id: number): Observable<Recipient> {
    return this.http.get<Recipient>(`${this.apiUrl}/recipients/${id}`);
  }

  deleteRecipient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/recipients/${id}`);
  }

  // Blood Request Management
  createBloodRequest(requestData: BloodRequestCreate): Observable<BloodRequest> {
    return this.http.post<BloodRequest>(`${this.apiUrl}/bloodrequests`, requestData);
  }

  getMyBloodRequests(): Observable<BloodRequest[]> {
    return this.http.get<BloodRequest[]>(`${this.apiUrl}/bloodrequests/my-requests`);
  }

  getAllBloodRequests(): Observable<BloodRequest[]> {
    return this.http.get<BloodRequest[]>(`${this.apiUrl}/bloodrequests`);
  }

  getBloodRequestById(id: number): Observable<BloodRequest> {
    return this.http.get<BloodRequest>(`${this.apiUrl}/bloodrequests/${id}`);
  }

  updateBloodRequest(id: number, updateData: BloodRequestUpdate): Observable<BloodRequest> {
    return this.http.put<BloodRequest>(`${this.apiUrl}/bloodrequests/${id}`, updateData);
  }

  updateBloodRequestStatus(id: number, statusData: BloodRequestStatusUpdate): Observable<BloodRequest> {
    return this.http.put<BloodRequest>(`${this.apiUrl}/bloodrequests/${id}/status`, statusData);
  }

  cancelBloodRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bloodrequests/${id}`);
  }

  // Blood Availability
  getBloodAvailability(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bloodstock/availability`);
  }

  getBloodAvailabilityByGroup(bloodGroup: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bloodstock/availability/${bloodGroup}`);
  }

  // Dashboard Statistics
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recipients/dashboard-stats`);
  }
}