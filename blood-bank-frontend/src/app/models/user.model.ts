export interface User {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  token: string;
  user: User;
  expiresAt: Date;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  password?: string;
}

export enum UserRole {
  Admin = 1,
  Donor = 2,
  Recipient = 3
}

export const UserRoleNames = {
  [UserRole.Admin]: 'Admin',
  [UserRole.Donor]: 'Donor',
  [UserRole.Recipient]: 'Recipient'
};