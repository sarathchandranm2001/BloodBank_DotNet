import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('bloodbank_token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      })
    };
  }

  private handleError(error: any): Observable<never> {
    return this.errorHandler.handleError(error);
  }

  // Generic HTTP methods
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, {
      ...this.getHttpOptions(),
      params
    }).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  // File download/blob response
  getBlob(endpoint: string, params?: HttpParams): Observable<Blob> {
    return this.http.get(`${this.apiUrl}${endpoint}`, {
      ...this.getHttpOptions(),
      params,
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // File upload
  uploadFile<T>(endpoint: string, file: File): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('bloodbank_token');
    const headers = new HttpHeaders({
      ...(token && { 'Authorization': `Bearer ${token}` })
    });

    return this.http.post<T>(`${this.apiUrl}${endpoint}`, formData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
}