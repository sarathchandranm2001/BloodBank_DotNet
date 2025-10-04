// Admin Dashboard Models
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

export interface DonationAnalytics {
  totalDonationsThisMonth: number;
  totalDonationsLastMonth: number;
  totalDonationsThisYear: number;
  donorRetentionRate: number;
  bloodGroupDistribution: BloodGroupDistribution[];
}

export interface BloodGroupDistribution {
  bloodGroup: string;
  donorCount: number;
  percentage: number;
}

// Transaction/Activity models
export interface Transaction {
  id: number;
  type: 'donation' | 'request' | 'transfer' | 'expiry';
  bloodGroup: string;
  units: number;
  date: string;
  donorName?: string;
  recipientName?: string;  
  status: string;
  notes?: string;
}

// Extended User Details
export interface DonorDetails {
  donorId: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isEligible: boolean;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  registrationDate: string;
  totalDonations: number;
  medicalConditions?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface RecipientDetails {
  recipientId: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  hospitalName: string;
  doctorName: string;
  medicalCondition: string;
  registrationDate: string;
  totalRequests: number;
  emergencyContact?: string;
  emergencyPhone?: string;
}

// Blood Request Management
export interface BloodRequestManagement {
  requestId: number;
  recipientId: number;
  recipientName: string;
  hospitalName: string;
  doctorName: string;
  bloodGroup: string;
  unitsRequested: number;
  urgency: string;
  status: string;
  requestReason: string;
  doctorNotes?: string;
  requestDate: string;
  requiredByDate?: string;
  approvedDate?: string;
  fulfilledDate?: string;
  adminNotes?: string;
  daysUntilRequired?: number;
  isExpired?: boolean;
}

// Blood Inventory Management
export interface BloodInventoryItem {
  inventoryId: number;
  bloodGroup: string;
  unitsAvailable: number;
  donationDate: string;
  expiryDate: string;
  donorName?: string;
  location: string;
  batchNumber: string;
  isExpiringSoon: boolean;
  isExpired: boolean;
  daysUntilExpiry: number;
  status: 'available' | 'reserved' | 'expired' | 'used';
}

// String mappings for display
export const BloodGroupStringNames: { [key: string]: string } = {
  'O_NEGATIVE': 'O-',
  'O_POSITIVE': 'O+',
  'A_NEGATIVE': 'A-',
  'A_POSITIVE': 'A+',
  'B_NEGATIVE': 'B-',
  'B_POSITIVE': 'B+',
  'AB_NEGATIVE': 'AB-',
  'AB_POSITIVE': 'AB+'
};

export const UrgencyStringNames: { [key: string]: string } = {
  'Low': 'Low',
  'Medium': 'Medium',
  'High': 'High',
  'Critical': 'Critical'
};

export const StatusStringNames: { [key: string]: string } = {
  'Pending': 'Pending',
  'Approved': 'Approved',
  'Fulfilled': 'Fulfilled',
  'Rejected': 'Rejected',
  'Cancelled': 'Cancelled'
};