export enum BloodGroup {
  APositive = 1,
  ANegative = 2,
  BPositive = 3,
  BNegative = 4,
  ABPositive = 5,
  ABNegative = 6,
  OPositive = 7,
  ONegative = 8
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