import { BloodGroup, ContactInfo } from './common.model';

export interface Recipient {
  recipientId: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  hospitalName: string;
  doctorName: string;
  contactInfo: ContactInfo;
  medicalCondition: string;
  totalRequests?: number;
  pendingRequests?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface RecipientRegistration {
  userId: number;
  hospitalName: string;
  doctorName: string;
  contactInfo: {
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  medicalCondition: string;
}

export interface RecipientUpdate {
  hospitalName?: string;
  doctorName?: string;
  contactInfo?: ContactInfo;
  medicalCondition?: string;
}

export enum BloodRequestUrgency {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

export enum BloodRequestStatus {
  Pending = 1,
  Approved = 2,
  Fulfilled = 3,
  Rejected = 4,
  Cancelled = 5
}

export interface BloodRequest {
  requestId: number;
  recipientId: number;
  bloodGroup: BloodGroup;
  unitsRequested: number;
  urgency: BloodRequestUrgency;
  status: BloodRequestStatus;
  requestReason: string;
  doctorNotes?: string;
  adminNotes?: string;
  requestDate: Date;
  requiredByDate: Date;
  approvedDate?: Date;
  fulfilledDate?: Date;
  approvedBy?: number;
  fulfilledBy?: number;
  createdAt: Date;
  updatedAt?: Date;
}

// Backend DTO representation with string values
export interface BloodRequestDto {
  requestId: number;
  recipientId: number;
  recipientName?: string;
  hospitalName?: string;
  doctorName?: string;
  bloodGroup: string;
  unitsRequested: number;
  urgency: string;
  status: string;
  requestReason: string;
  doctorNotes?: string;
  adminNotes?: string;
  requestDate: Date;
  requiredByDate?: Date;
  approvedDate?: Date;
  fulfilledDate?: Date;
  approvedByName?: string;
  fulfilledByName?: string;
  daysUntilRequired?: number;
}

export interface BloodRequestCreate {
  bloodGroup: BloodGroup;
  unitsRequested: number;
  urgency: BloodRequestUrgency;
  requestReason: string;
  doctorNotes?: string;
  requiredByDate: Date;
}

export interface BloodRequestUpdate {
  unitsRequested?: number;
  urgency?: BloodRequestUrgency;
  requestReason?: string;
  doctorNotes?: string;
  requiredByDate?: Date;
}

export interface BloodRequestStatusUpdate {
  status: BloodRequestStatus;
  adminNotes?: string;
}

export const BloodRequestUrgencyNames = {
  [BloodRequestUrgency.Low]: 'Low',
  [BloodRequestUrgency.Medium]: 'Medium',
  [BloodRequestUrgency.High]: 'High',
  [BloodRequestUrgency.Critical]: 'Critical'
};

export const BloodRequestStatusNames = {
  [BloodRequestStatus.Pending]: 'Pending',
  [BloodRequestStatus.Approved]: 'Approved',
  [BloodRequestStatus.Fulfilled]: 'Fulfilled',
  [BloodRequestStatus.Rejected]: 'Rejected',
  [BloodRequestStatus.Cancelled]: 'Cancelled'
};