import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { RecipientRegistrationComponent } from '../../components/recipient/recipient-registration/recipient-registration.component';
import { RecipientProfileComponent } from '../../components/recipient/recipient-profile/recipient-profile.component';
import { BloodRequestComponent } from '../../components/recipient/blood-request/blood-request.component';
import { MyRequestsComponent } from '../../components/recipient/my-requests/my-requests.component';
import { BloodAvailabilityComponent } from '../../components/recipient/blood-availability/blood-availability.component';
import { RecipientDashboardComponent } from '../../components/recipient/recipient-dashboard/recipient-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: RecipientDashboardComponent },
  { path: 'register', component: RecipientRegistrationComponent },
  { path: 'profile', component: RecipientProfileComponent },
  { path: 'request-blood', component: BloodRequestComponent },
  { path: 'my-requests', component: MyRequestsComponent },
  { path: 'blood-availability', component: BloodAvailabilityComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RecipientModule { }