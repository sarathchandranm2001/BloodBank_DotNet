import { BloodGroup, ContactInfo } from './common.model';

export interface Donor {
  donorId: number;
  userId: number;
  userName: string;
  userEmail: string;
  bloodGroup: BloodGroup;
  bloodGroupDisplay: string;
  lastDonationDate?: Date;
  medicalHistory: string;
  contactInfo: ContactInfo;
  isEligibleToDonate: boolean;
  nextEligibleDonationDate?: Date;
  daysSinceLastDonation: number;
}

export interface DonorRegistration {
  userId: number;
  bloodGroup: BloodGroup;
  lastDonationDate?: Date;
  contactInfo: ContactInfo;
  medicalHistory: string;
}

export interface DonorUpdate {
  medicalHistory: string;
  contactInfo: ContactInfo;
}

export interface DonorEligibility {
  donorId: number;
  donorName: string;
  bloodGroup: string;
  isEligible: boolean;
  reason: string;
  daysSinceLastDonation: number;
  minimumDaysBetweenDonations: number;
  nextEligibleDate?: Date;
}

export interface DonationHistory {
  donorId: number;
  donorName: string;
  bloodGroup: string;
  totalDonations: number;
  lastDonationDate?: Date;
  firstDonationDate?: Date;
  averageDaysBetweenDonations: number;
  isCurrentlyEligible: boolean;
  nextEligibleDate?: Date;
}