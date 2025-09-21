import { BloodGroup } from './common.model';

export interface BloodInventory {
  inventoryId: number;
  bloodGroup: BloodGroup;
  availableUnits: number;
  reservedUnits: number;
  location: string;
  notes: string;
  lastUpdated: Date;
  oldestUnitExpiry?: Date;
  newestUnitExpiry?: Date;
}

export interface BloodAvailability {
  bloodGroup: BloodGroup;
  availableUnits: number;
  isLowStock: boolean;
  hasExpiringSoon: boolean;
}

export interface AddStock {
  bloodGroup: BloodGroup;
  units: number;
  reason: string;
  location?: string;
  notes?: string;
}

export interface RemoveStock {
  bloodGroup: BloodGroup;
  units: number;
  reason: string;
  notes?: string;
}

export interface BloodStock {
  stockId: number;
  bloodGroup: BloodGroup;
  unitsAvailable: number;
  expiryDate: Date;
  dateAdded: Date;
  donorBatch: string;
  storageLocation: string;
  notes: string;
  createdAt: Date;
  updatedAt?: Date;
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysUntilExpiry: number;
  isLowStock: boolean;
}

export interface BloodStockCreate {
  bloodGroup: BloodGroup;
  unitsAvailable: number;
  expiryDate: Date;
  donorBatch?: string;
  storageLocation?: string;
  notes?: string;
}

export interface BloodStockUpdate {
  unitsAvailable?: number;
  expiryDate?: Date;
  donorBatch?: string;
  storageLocation?: string;
  notes?: string;
}

export interface BloodStockSummary {
  bloodGroup: BloodGroup;
  totalUnits: number;
  freshUnits: number;
  expiringSoonUnits: number;
  expiredUnits: number;
  oldestExpiryDate: Date;
  newestExpiryDate: Date;
  hasLowStock: boolean;
  hasExpiringSoon: boolean;
  hasExpired: boolean;
}

export interface LowStockAlert {
  bloodGroup: BloodGroup;
  currentUnits: number;
  alertLevel: StockAlertLevel;
  lastUpdated: Date;
}

export interface IssueBlood {
  bloodGroup: BloodGroup;
  unitsRequested: number;
  reason?: string;
}

export enum StockAlertLevel {
  Critical = 1, // 0-2 units
  Low = 2,      // 3-5 units
  Medium = 3,   // 6-10 units
  Normal = 4    // >10 units
}

export const StockAlertLevelNames = {
  [StockAlertLevel.Critical]: 'Critical',
  [StockAlertLevel.Low]: 'Low',
  [StockAlertLevel.Medium]: 'Medium',
  [StockAlertLevel.Normal]: 'Normal'
};