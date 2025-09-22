import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';

// Components
import { DonorListComponent } from './components/donor-list/donor-list.component';
import { DonorRegistrationComponent } from './components/donor-registration/donor-registration.component';
import { DonorProfileComponent } from './components/donor-profile/donor-profile.component';
import { DonorEligibilityComponent } from './components/donor-eligibility/donor-eligibility.component';
import { DonationHistoryComponent } from './components/donation-history/donation-history.component';
import { BloodDonationComponent } from './components/blood-donation/blood-donation.component';
import { DonorDashboardComponent } from './components/donor-dashboard/donor-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DonorDashboardComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: DonorListComponent },
      { path: 'register', component: DonorRegistrationComponent },
      { path: 'profile/:id', component: DonorProfileComponent },
      { path: 'eligibility/:id', component: DonorEligibilityComponent },
      { path: 'history/:id', component: DonationHistoryComponent },
      { path: 'donate/:id', component: BloodDonationComponent }
    ]
  }
];

@NgModule({
  declarations: [
    DonorListComponent,
    DonorRegistrationComponent,
    DonorProfileComponent,
    DonorEligibilityComponent,
    DonationHistoryComponent,
    BloodDonationComponent,
    DonorDashboardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    
    // Material Modules
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatListModule
  ]
})
export class DonorModule { }