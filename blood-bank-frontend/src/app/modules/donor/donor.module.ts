import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Bootstrap Modules (if using ng-bootstrap)
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

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
    
    // Bootstrap Modules
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule,
    NgbNavModule,
    NgbModalModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbProgressbarModule
  ]
})
export class DonorModule { }