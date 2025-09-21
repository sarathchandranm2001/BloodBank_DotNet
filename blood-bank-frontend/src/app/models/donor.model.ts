import { BloodGroup, ContactInfo } from './common.model';

export interface Donor {
  donorId: number;
  userId: number;
  bloodGroup: BloodGroup;
  lastDonationDate?: Date;
  contactInfo: ContactInfo;
  medicalHistory: string;
  createdAt: Date;
  updatedAt?: Date;
  isEligibleToDonate: boolean;
  nextEligibleDonationDate?: Date;
}

export interface DonorRegistration {
  userId: number;
  bloodGroup: BloodGroup;
  contactInfo: ContactInfo;
  medicalHistory: string;
}

export interface DonorUpdate {
  bloodGroup?: BloodGroup;
  contactInfo?: ContactInfo;
  medicalHistory?: string;
}

export interface DonorEligibility {
  donorId: number;
  isEligible: boolean;
  nextEligibleDate?: Date;
  daysSinceLastDonation?: number;
  daysUntilEligible?: number;
}

export interface DonationHistory {
  donationId: number;
  donorId: number;
  donationDate: Date;
  bloodGroup: BloodGroup;
  unitsCollected: number;
  notes?: string;
}