import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Components
import { DonorListComponent } from './components/donor-list/donor-list.component';
import { DonorRegistrationComponent } from './components/donor-registration/donor-registration.component';
import { DonorProfileComponent } from './components/donor-profile/donor-profile.component';
import { DonorEligibilityComponent } from './components/donor-eligibility/donor-eligibility.component';
// import { DonationHistoryComponent } from './components/donation-history/donation-history.component';
// import { BloodDonationComponent } from './components/blood-donation/blood-donation.component';
import { DonorDashboardComponent } from './components/donor-dashboard/donor-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DonorDashboardComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent: () => import('./components/donor-overview/donor-overview.component').then(m => m.DonorOverviewComponent) },
      { path: 'list', component: DonorListComponent },
      { path: 'register', component: DonorRegistrationComponent },
      { path: 'profile/:id', component: DonorProfileComponent },
      { path: 'eligibility/:id', component: DonorEligibilityComponent },
      { path: 'history/:id', loadComponent: () => import('./components/donation-history/donation-history.component').then(m => m.DonationHistoryComponent) },
      // { path: 'donate/:id', component: BloodDonationComponent }
    ]
  }
];

@NgModule({
  declarations: [
    DonorRegistrationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class DonorModule { }