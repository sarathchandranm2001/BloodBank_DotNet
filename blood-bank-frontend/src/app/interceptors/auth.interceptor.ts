import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service
    const token = this.authService.getToken();

    // Debug logging
    console.log('🔍 AUTH INTERCEPTOR: Request URL:', req.url);
    console.log('🔍 AUTH INTERCEPTOR: Token exists:', !!token);
    if (token) {
      console.log('🔍 AUTH INTERCEPTOR: Token preview:', token.substring(0, 50) + '...');
    }

    // Clone the request and add the authorization header if token exists
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('🔍 AUTH INTERCEPTOR: Added Authorization header');
    } else {
      console.log('🔍 AUTH INTERCEPTOR: No token, request sent without Authorization header');
    }

    // Handle the request and catch any errors
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid, logout and redirect to login
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}

// Functional interceptor for new Angular HttpClient
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Get the auth token from the service
  const token = authService.getToken();

  // Debug logging
  console.log('🔍 FUNCTIONAL AUTH INTERCEPTOR: Request URL:', req.url);
  console.log('🔍 FUNCTIONAL AUTH INTERCEPTOR: Token exists:', !!token);
  if (token) {
    console.log('🔍 FUNCTIONAL AUTH INTERCEPTOR: Token preview:', token.substring(0, 50) + '...');
  }

  // Clone the request and add the authorization header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('🔍 FUNCTIONAL AUTH INTERCEPTOR: Added Authorization header');
  } else {
    console.log('🔍 FUNCTIONAL AUTH INTERCEPTOR: No token, request sent without Authorization header');
  }

  // Handle the request and catch any errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired or invalid, logout and redirect to login
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};