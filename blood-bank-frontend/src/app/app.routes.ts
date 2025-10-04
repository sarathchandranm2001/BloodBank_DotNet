import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

// Donor Components
import { DonorRegistrationComponent } from './components/donor/donor-registration/donor-registration.component';
import { DonorProfileComponent } from './components/donor/donor-profile/donor-profile.component';
import { DonorDashboardComponent } from './components/donor/donor-dashboard/donor-dashboard.component';

// Recipient Components
import { RecipientRegistrationComponent } from './components/recipient/recipient-registration/recipient-registration.component';
import { RecipientProfileComponent } from './components/recipient/recipient-profile/recipient-profile.component';
import { RecipientDashboardComponent } from './components/recipient/recipient-dashboard/recipient-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'donors',
    loadChildren: () => import('./modules/donor/donor.module').then(m => m.DonorModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'recipient',
    loadChildren: () => import('./modules/recipient/recipient.module').then(m => m.RecipientModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  // Standalone Donor Routes
  {
    path: 'donor/register',
    component: DonorRegistrationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'donor/profile',
    component: DonorProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'donor/dashboard',
    component: DonorDashboardComponent,
    canActivate: [AuthGuard]
  },
  // Standalone Recipient Routes
  {
    path: 'recipient/register',
    component: RecipientRegistrationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'recipient/profile',
    component: RecipientProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'recipient/dashboard',
    component: RecipientDashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
