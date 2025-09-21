import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from './api.service';
import { User, UserLogin, UserLoginResponse, UserRegistration, UserRole } from '../models/user.model';

interface JwtPayload {
  nameid: string; // User ID
  email: string;
  name: string;
  role: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.checkStoredAuthentication();
  }

  private checkStoredAuthentication(): void {
    const token = localStorage.getItem('bloodbank_token');
    if (token && !this.isTokenExpired(token)) {
      const user = this.getUserFromToken(token);
      if (user) {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }
    } else {
      this.logout();
    }
  }

  login(credentials: UserLogin): Observable<UserLoginResponse> {
    return this.apiService.post<UserLoginResponse>('/users/login', credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('bloodbank_token', response.token);
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  register(userData: UserRegistration): Observable<User> {
    return this.apiService.post<User>('/users/register', userData);
  }

  logout(): void {
    localStorage.removeItem('bloodbank_token');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.userId : null;
  }

  getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  hasRole(role: UserRole): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.Admin);
  }

  isDonor(): boolean {
    return this.hasRole(UserRole.Donor);
  }

  isRecipient(): boolean {
    return this.hasRole(UserRole.Recipient);
  }

  getToken(): string | null {
    return localStorage.getItem('bloodbank_token');
  }

  private getUserFromToken(token: string): User | null {
    try {
      const decoded: JwtPayload = jwtDecode(token);
      return {
        userId: parseInt(decoded.nameid),
        name: decoded.name,
        email: decoded.email,
        role: this.parseUserRole(decoded.role),
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private parseUserRole(roleString: string): UserRole {
    switch (roleString.toLowerCase()) {
      case 'admin':
        return UserRole.Admin;
      case 'donor':
        return UserRole.Donor;
      case 'recipient':
        return UserRole.Recipient;
      default:
        return UserRole.Donor; // Default fallback
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded: JwtPayload = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  refreshUserData(): Observable<User> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return of();
    }

    return this.apiService.get<User>(`/users/${userId}`)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
        })
      );
  }
}