export enum BloodGroup {
  APositive = 0,
  ANegative = 1,
  BPositive = 2,
  BNegative = 3,
  ABPositive = 4,
  ABNegative = 5,
  OPositive = 6,
  ONegative = 7
}

export const BloodGroupNames = {
  [BloodGroup.APositive]: 'A+',
  [BloodGroup.ANegative]: 'A-',
  [BloodGroup.BPositive]: 'B+',
  [BloodGroup.BNegative]: 'B-',
  [BloodGroup.ABPositive]: 'AB+',
  [BloodGroup.ABNegative]: 'AB-',
  [BloodGroup.OPositive]: 'O+',
  [BloodGroup.ONegative]: 'O-'
};

export interface ContactInfo {
  phone: string;
  phoneNumber?: string; // Alias for compatibility
  address: string;
  city: string;
  state: string;
  zipCode: string;
  pinCode?: string; // Alias for compatibility  
  country: string;
}