import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Donor, 
  DonorRegistration, 
  DonorUpdate, 
  DonorEligibility, 
  DonationHistory 
} from '../models/donor.model';
import { BloodGroup } from '../models/common.model';

// Backend DTO structure for API calls
interface DonorRegistrationDTO {
  userId: number;
  bloodGroup: BloodGroup;
  lastDonationDate?: Date;
  contactInfo: {
    Phone: string;
    Address: string;
    City: string;
    State: string;
    ZipCode: string;
    Country: string;
  };
  medicalHistory: string;
}

@Injectable({
  providedIn: 'root'
})
export class DonorService {
  private readonly apiUrl = `${environment.apiUrl}/donors`;

  constructor(private http: HttpClient) { }

  // Get all donors (Admin only)
  getDonors(): Observable<Donor[]> {
    return this.http.get<Donor[]>(this.apiUrl);
  }

  // Get specific donor by ID
  getDonor(id: number): Observable<Donor> {
    return this.http.get<Donor>(`${this.apiUrl}/${id}`);
  }

  // Get current donor profile
  getDonorProfile(): Observable<Donor> {
    return this.http.get<Donor>(`${this.apiUrl}/profile`);
  }

  // Register new donor
  registerDonor(donorData: DonorRegistration): Observable<Donor> {
    console.log('🔍 SERVICE: Input donorData:', donorData);
    
    // Convert frontend model to backend DTO structure
    const dtoData: DonorRegistrationDTO = {
      userId: donorData.userId,
      bloodGroup: donorData.bloodGroup,
      lastDonationDate: donorData.lastDonationDate,
      contactInfo: {
        Phone: donorData.contactInfo.phone,
        Address: donorData.contactInfo.address,
        City: donorData.contactInfo.city,
        State: donorData.contactInfo.state,
        ZipCode: donorData.contactInfo.zipCode,
        Country: donorData.contactInfo.country
      },
      medicalHistory: donorData.medicalHistory
    };

    console.log('🔍 SERVICE: Sending DTO to backend:', dtoData);
    console.log('🔍 SERVICE: DTO JSON:', JSON.stringify(dtoData, null, 2));

    return this.http.post<Donor>(`${this.apiUrl}/register`, dtoData);
  }

  // Update donor information
  updateDonor(id: number, donorData: DonorUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, donorData);
  }

  // Delete donor (Admin only)
  deleteDonor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Check donor eligibility
  getDonorEligibility(id: number): Observable<DonorEligibility> {
    return this.http.get<DonorEligibility>(`${this.apiUrl}/${id}/eligibility`);
  }

  // Get next donation date
  getNextDonationDate(id: number): Observable<{ nextDonationDate: Date; daysUntilEligible: number }> {
    return this.http.get<{ nextDonationDate: Date; daysUntilEligible: number }>(`${this.apiUrl}/${id}/next-donation-date`);
  }

  // Get donation history
  getDonationHistory(id: number): Observable<DonationHistory> {
    return this.http.get<DonationHistory>(`${this.apiUrl}/${id}/donation-history`);
  }

  // Record a blood donation
  recordDonation(id: number): Observable<{ message: string; donationRecorded: boolean }> {
    return this.http.post<{ message: string; donationRecorded: boolean }>(`${this.apiUrl}/${id}/record-donation`, {});
  }

  // Get eligible donors
  getEligibleDonors(): Observable<Donor[]> {
    return this.http.get<Donor[]>(`${this.apiUrl}/eligible`);
  }

  // Get donors by blood group
  getDonorsByBloodGroup(bloodGroup: string): Observable<Donor[]> {
    return this.http.get<Donor[]>(`${this.apiUrl}/blood-group/${bloodGroup}`);
  }

  // Get donor dashboard statistics (Admin only)
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/stats`);
  }

  // Get donations by donor
  getDonationsByDonor(donorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/donations/donor/${donorId}`);
  }

  // Create new donation record (Admin only)
  createDonation(donationData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/donations`, donationData);
  }

  // Get all donations (Admin only)
  getAllDonations(page: number = 1, pageSize: number = 20, filters?: any): Observable<any[]> {
    let params = `?page=${page}&pageSize=${pageSize}`;
    if (filters?.bloodGroup) params += `&bloodGroup=${filters.bloodGroup}`;
    if (filters?.startDate) params += `&startDate=${filters.startDate}`;
    if (filters?.endDate) params += `&endDate=${filters.endDate}`;
    
    return this.http.get<any[]>(`${environment.apiUrl}/donations${params}`);
  }

  // Get donation statistics for dashboard
  getDonationDashboardStats(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/donations/stats/dashboard`);
  }
}