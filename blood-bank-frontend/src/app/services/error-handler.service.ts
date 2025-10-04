import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    let errorCode = 'UNKNOWN_ERROR';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
      errorCode = 'CLIENT_ERROR';
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Bad request - invalid data provided';
          errorCode = 'BAD_REQUEST';
          break;
        case 401:
          errorMessage = 'Authentication required - please login again';
          errorCode = 'UNAUTHORIZED';
          // Optionally redirect to login
          break;
        case 403:
          errorMessage = 'Access denied - insufficient permissions';
          errorCode = 'FORBIDDEN';
          break;
        case 404:
          errorMessage = 'Resource not found';
          errorCode = 'NOT_FOUND';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflict - resource already exists';
          errorCode = 'CONFLICT';
          break;
        case 422:
          errorMessage = this.getValidationErrorMessage(error.error);
          errorCode = 'VALIDATION_ERROR';
          break;
        case 500:
          errorMessage = 'Internal server error - please try again later';
          errorCode = 'SERVER_ERROR';
          break;
        case 503:
          errorMessage = 'Service temporarily unavailable - please try again later';
          errorCode = 'SERVICE_UNAVAILABLE';
          break;
        default:
          errorMessage = error.error?.message || `Server error (${error.status})`;
          errorCode = `HTTP_${error.status}`;
      }
    }

    // Log the error details for debugging
    console.error('API Error Details:', {
      message: errorMessage,
      code: errorCode,
      status: error.status,
      url: error.url,
      error: error.error
    });

    const apiError: ApiError = {
      message: errorMessage,
      code: errorCode,
      details: error.error
    };

    return throwError(() => apiError);
  }

  private getValidationErrorMessage(errorResponse: any): string {
    if (errorResponse?.errors) {
      // Handle ASP.NET Core model validation errors
      const errorMessages: string[] = [];
      
      for (const field in errorResponse.errors) {
        if (errorResponse.errors[field]) {
          errorMessages.push(...errorResponse.errors[field]);
        }
      }
      
      return errorMessages.length > 0 
        ? `Validation failed: ${errorMessages.join(', ')}`
        : 'Validation failed';
    }
    
    return errorResponse?.message || 'Validation failed';
  }

  showError(message: string, duration: number = 5000): void {
    console.error('Error:', message);
    alert(`Error: ${message}`);
  }

  showSuccess(message: string, duration: number = 3000): void {
    console.log('Success:', message);
    alert(`Success: ${message}`);
  }

  showWarning(message: string, duration: number = 4000): void {
    console.warn('Warning:', message);
    alert(`Warning: ${message}`);
  }

  showInfo(message: string, duration: number = 3000): void {
    console.info('Info:', message);
    alert(`Info: ${message}`);
  }  handleApiError(error: ApiError, context?: string): void {
    const contextMessage = context ? `${context}: ` : '';
    
    // Show different UI feedback based on error type
    switch (error.code) {
      case 'UNAUTHORIZED':
        this.showError(`${contextMessage}${error.message}`, 6000);
        // Could trigger logout or redirect to login
        break;
      case 'FORBIDDEN':
        this.showError(`${contextMessage}${error.message}`, 5000);
        break;
      case 'VALIDATION_ERROR':
        this.showWarning(`${contextMessage}${error.message}`, 6000);
        break;
      case 'CONFLICT':
        this.showWarning(`${contextMessage}${error.message}`, 5000);
        break;
      case 'NOT_FOUND':
        this.showError(`${contextMessage}${error.message}`, 4000);
        break;
      case 'SERVER_ERROR':
      case 'SERVICE_UNAVAILABLE':
        this.showError(`${contextMessage}${error.message}`, 7000);
        break;
      default:
        this.showError(`${contextMessage}${error.message}`, 5000);
    }
  }
}