import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRegistration, UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  userRoles = [
    { value: UserRole.Admin, name: 'Admin' },
    { value: UserRole.Donor, name: 'Donor' },
    { value: UserRole.Recipient, name: 'Recipient' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    
    // Redirect if already authenticated
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword?.errors?.['passwordMismatch']) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }
    return null;
  }

  onSubmit(): void {
    console.log('🔄 Registration form submitted');
    console.log('Form valid:', this.registerForm.valid);
    console.log('Form value:', this.registerForm.value);
    console.log('Form errors:', this.getFormErrors());

    if (this.registerForm.valid) {
      this.isLoading = true;
      const { confirmPassword, ...registerData } = this.registerForm.value;
      
      // Convert role from string to number to match enum
      const userData: UserRegistration = {
        ...registerData,
        role: parseInt(registerData.role, 10)
      };
      
      console.log('📤 Sending registration data:', userData);

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('✅ Registration successful:', response);
          this.isLoading = false;
          alert('Registration successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('❌ Registration failed:', error);
          console.error('Error status:', error.status);
          console.error('Error body:', error.error);
          console.error('Full error object:', error);
          
          this.isLoading = false;
          let errorMessage = 'Registration failed. Please try again.';
          
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.errors) {
            // Handle validation errors
            const validationErrors = Object.values(error.error.errors).flat();
            errorMessage = validationErrors.join(', ');
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          alert(errorMessage);
        }
      });
    } else {
      console.log('❌ Form is invalid');
      console.log('Form errors:', this.getFormErrors());
      this.markFormGroupTouched();
    }
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength']?.requiredLength;
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${minLength} characters`;
    }
    if (field?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }
}
