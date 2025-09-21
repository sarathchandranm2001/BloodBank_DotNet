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

  // Register new donor
  registerDonor(donorData: DonorRegistration): Observable<Donor> {
    return this.http.post<Donor>(this.apiUrl, donorData);
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
}