import { Component, OnInit } from '@angular/core';import { Component, OnInit } from '@angular/core';import { Component, OnInit } from '@angular/core';import { Component, OnInit } from '@angular/core';import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';import { CommonModule } from '@angular/common';



export interface DonationRecord {import { RouterModule } from '@angular/router';import { CommonModule } from '@angular/common';

  id: number;

  donationDate: Date;

  donationCenter: string;

  bloodType: string;export interface DonationRecord {import { RouterModule } from '@angular/router';import { CommonModule } from '@angular/common';import { CommonModule } from '@angular/common';

  volume: number;

  notes?: string;  id: number;

  status: 'completed' | 'pending' | 'cancelled';

}  donationDate: Date;



@Component({  donationCenter: string;

  selector: 'app-donation-history',

  standalone: true,  bloodType: string;export interface DonationRecord {import { ActivatedRoute, Router } from '@angular/router';import { ActivatedRoute, Router } from '@angular/router';

  imports: [CommonModule, RouterModule],

  template: `  volume: number;

    <div class="container-fluid mt-4">

      <div class="row">  notes?: string;  id: number;

        <div class="col-12">

          <div class="card mb-4">  status: 'completed' | 'pending' | 'cancelled';

            <div class="card-header bg-danger text-white">

              <div class="d-flex align-items-center">}  donationDate: Date;import { DonorService } from '../../../../services/donor.service';import { DonorService } from '../../../../services/donor.service';

                <i class="bi bi-clock-history me-2"></i>

                <h4 class="card-title mb-0">Blood Donation History</h4>

              </div>

            </div>@Component({  donationCenter: string;

            <div class="card-body">

              <div class="row text-center">  selector: 'app-donation-history',

                <div class="col-md-3">

                  <div class="stat-card">  standalone: true,  bloodType: string;import { DonationHistory } from '../../../../models/donor.model';import { DonationHistory } from '../../../../models/donor.model';

                    <h5 class="text-danger">{{statistics.totalDonations}}</h5>

                    <small class="text-muted">Total Donations</small>  imports: [CommonModule, RouterModule],

                  </div>

                </div>  template: `  volume: number;

                <div class="col-md-3">

                  <div class="stat-card">    <div class="container-fluid mt-4">

                    <h5 class="text-success">{{statistics.lifesSaved}}</h5>

                    <small class="text-muted">Lives Saved</small>      <div class="row">  notes?: string;

                  </div>

                </div>        <div class="col-12">

                <div class="col-md-3">

                  <div class="stat-card">          <!-- Header Section -->  status: 'completed' | 'pending' | 'cancelled';

                    <h5 class="text-info">{{statistics.totalVolume}}ml</h5>

                    <small class="text-muted">Total Volume</small>          <div class="card mb-4">

                  </div>

                </div>            <div class="card-header bg-danger text-white">}@Component({@Component({

                <div class="col-md-3">

                  <div class="stat-card">              <div class="d-flex align-items-center">

                    <h5 class="text-warning">{{statistics.yearsDonating}}</h5>

                    <small class="text-muted">Years Donating</small>                <i class="bi bi-clock-history me-2"></i>

                  </div>

                </div>                <h4 class="card-title mb-0">Blood Donation History</h4>

              </div>

            </div>              </div>@Component({  selector: 'app-donation-history',  selector: 'app-donation-history',

          </div>

            </div>

          <div class="card">

            <div class="card-header">            <div class="card-body">  selector: 'app-donation-history',

              <h5 class="card-title mb-0">

                <i class="bi bi-list-ul me-2"></i>              <div class="row text-center">

                Donation Records

              </h5>                <div class="col-md-3">  standalone: true,  standalone: true,  standalone: true,

            </div>

            <div class="card-body">                  <div class="stat-card">

              <div *ngIf="isLoading" class="text-center py-5">

                <div class="spinner-border text-danger" role="status">                    <h5 class="text-danger">{{statistics.totalDonations}}</h5>  imports: [CommonModule, RouterModule],

                  <span class="visually-hidden">Loading...</span>

                </div>                    <small class="text-muted">Total Donations</small>

                <p class="mt-2">Loading donation history...</p>

              </div>                  </div>  template: `  imports: [CommonModule],  imports: [CommonModule],



              <div *ngIf="!isLoading && donationHistory.length === 0" class="text-center py-5">                </div>

                <i class="bi bi-file-earmark-x display-1 text-muted"></i>

                <h5 class="text-muted mt-3">No Donations Found</h5>                <div class="col-md-3">    <div class="container-fluid mt-4">

                <p class="text-muted">Start your donation journey today!</p>

                <button class="btn btn-danger" routerLink="/donor/blood-donation">                  <div class="stat-card">

                  <i class="bi bi-plus-circle me-2"></i>

                  Schedule Donation                    <h5 class="text-success">{{statistics.lifesSaved}}</h5>      <div class="row">  template: `  template: `

                </button>

              </div>                    <small class="text-muted">Lives Saved</small>



              <div *ngIf="!isLoading && donationHistory.length > 0" class="row">                  </div>        <div class="col-12">

                <div *ngFor="let donation of donationHistory" class="col-md-6 col-lg-4 mb-3">

                  <div class="card donation-card h-100">                </div>

                    <div class="card-header d-flex justify-content-between align-items-center">

                      <span class="fw-bold">{{donation.donationDate | date:'mediumDate'}}</span>                <div class="col-md-3">          <!-- Header Section -->    <div class="container py-4">    <div class="container py-4">

                      <span class="badge bg-success">{{donation.status | titlecase}}</span>

                    </div>                  <div class="stat-card">

                    <div class="card-body">

                      <div class="donation-details">                    <h5 class="text-info">{{statistics.totalVolume}}ml</h5>          <div class="card mb-4">

                        <div class="detail-row">

                          <i class="bi bi-geo-alt text-danger me-2"></i>                    <small class="text-muted">Total Volume</small>

                          <strong>Center:</strong> {{donation.donationCenter}}

                        </div>                  </div>            <div class="card-header bg-danger text-white">      <div class="row justify-content-center">      <div class="row justify-content-center">

                        <div class="detail-row">

                          <i class="bi bi-droplet text-danger me-2"></i>                </div>

                          <strong>Blood Type:</strong> {{donation.bloodType}}

                        </div>                <div class="col-md-3">              <div class="d-flex align-items-center">

                        <div class="detail-row">

                          <i class="bi bi-activity text-info me-2"></i>                  <div class="stat-card">

                          <strong>Volume:</strong> {{donation.volume}}ml

                        </div>                    <h5 class="text-warning">{{statistics.yearsDonating}}</h5>                <i class="bi bi-clock-history me-2"></i>        <div class="col-lg-10">        <div class="col-lg-10">

                        <div *ngIf="donation.notes" class="detail-row">

                          <i class="bi bi-journal-text text-secondary me-2"></i>                    <small class="text-muted">Years Donating</small>

                          <strong>Notes:</strong> {{donation.notes}}

                        </div>                  </div>                <h4 class="card-title mb-0">Blood Donation History</h4>

                      </div>

                    </div>                </div>

                    <div class="card-footer bg-transparent">

                      <div class="d-flex justify-content-between">              </div>              </div>          <!-- Header -->          <!-- Header -->

                        <button class="btn btn-outline-primary btn-sm">

                          <i class="bi bi-eye me-1"></i>            </div>

                          View Details

                        </button>          </div>            </div>

                        <button class="btn btn-outline-success btn-sm">

                          <i class="bi bi-download me-1"></i>

                          Certificate

                        </button>          <!-- Donation History List -->            <div class="card-body">          <div class="d-flex justify-content-between align-items-center mb-4">          <div class="d-flex justify-content-between align-items-center mb-4">

                      </div>

                    </div>          <div class="card">

                  </div>

                </div>            <div class="card-header">              <div class="row text-center">

              </div>

            </div>              <h5 class="card-title mb-0">

          </div>

        </div>                <i class="bi bi-list-ul me-2"></i>                <div class="col-md-3">            <h2 class="text-primary mb-0">            <h2 class="text-primary mb-0">

      </div>

    </div>                Donation Records

  `,

  styles: [`              </h5>                  <div class="stat-card">

    .stat-card {

      padding: 1rem;            </div>

      border-radius: 8px;

      background-color: #f8f9fa;            <div class="card-body">                    <h5 class="text-danger">{{statistics.totalDonations}}</h5>              <i class="bi bi-clock-history me-2"></i>              <i class="bi bi-clock-history me-2"></i>

      margin-bottom: 1rem;

    }              <div *ngIf="isLoading" class="text-center py-5">



    .donation-card {                <div class="spinner-border text-danger" role="status">                    <small class="text-muted">Total Donations</small>

      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    }                  <span class="visually-hidden">Loading...</span>



    .donation-card:hover {                </div>                  </div>              Donation History              Donation History

      transform: translateY(-2px);

      box-shadow: 0 4px 12px rgba(0,0,0,0.1);                <p class="mt-2">Loading donation history...</p>

    }

              </div>                </div>

    .detail-row {

      margin-bottom: 0.5rem;

      display: flex;

      align-items-center;              <div *ngIf="!isLoading && donationHistory.length === 0" class="text-center py-5">                <div class="col-md-3">            </h2>            </h2>

    }

                <i class="bi bi-file-earmark-x display-1 text-muted"></i>

    .donation-details {

      font-size: 0.9rem;                <h5 class="text-muted mt-3">No Donations Found</h5>                  <div class="stat-card">

    }

                <p class="text-muted">Start your donation journey today!</p>

    .card-header {

      font-size: 0.9rem;                <button class="btn btn-danger" routerLink="/donor/blood-donation">                    <h5 class="text-success">{{statistics.lifesSaved}}</h5>            <button class="btn btn-outline-secondary" (click)="goBack()">            <button class="btn btn-outline-secondary" (click)="goBack()">

    }

                  <i class="bi bi-plus-circle me-2"></i>

    .badge {

      font-size: 0.7rem;                  Schedule Donation                    <small class="text-muted">Lives Saved</small>

    }

                </button>

    .spinner-border {

      width: 3rem;              </div>                  </div>              <i class="bi bi-arrow-left me-2"></i>              <i class="bi bi-arrow-left me-2"></i>

      height: 3rem;

    }

  `]

})              <div *ngIf="!isLoading && donationHistory.length > 0" class="row">                </div>

export class DonationHistoryComponent implements OnInit {

  donationHistory: DonationRecord[] = [];                <div *ngFor="let donation of donationHistory" class="col-md-6 col-lg-4 mb-3">

  isLoading = true;

  statistics = {                  <div class="card donation-card h-100"                 <div class="col-md-3">              Back              Back

    totalDonations: 12,

    lifesSaved: 36,                       [class.border-success]="donation.status === 'completed'"

    totalVolume: 6000,

    yearsDonating: 3                       [class.border-warning]="donation.status === 'pending'"                  <div class="stat-card">

  };

                       [class.border-danger]="donation.status === 'cancelled'">

  ngOnInit(): void {

    this.loadDonationHistory();                    <div class="card-header d-flex justify-content-between align-items-center">                    <h5 class="text-info">{{statistics.totalVolume}}ml</h5>            </button>            </button>

  }

                      <span class="fw-bold">{{donation.donationDate | date:'mediumDate'}}</span>

  private loadDonationHistory(): void {

    setTimeout(() => {                      <span class="badge"                     <small class="text-muted">Total Volume</small>

      this.donationHistory = [

        {                            [class.bg-success]="donation.status === 'completed'"

          id: 1,

          donationDate: new Date('2024-01-15'),                            [class.bg-warning]="donation.status === 'pending'"                  </div>          </div>          </div>

          donationCenter: 'City General Hospital',

          bloodType: 'O+',                            [class.bg-danger]="donation.status === 'cancelled'">

          volume: 500,

          status: 'completed',                        {{donation.status | titlecase}}                </div>

          notes: 'Routine donation, no complications'

        },                      </span>

        {

          id: 2,                    </div>                <div class="col-md-3">

          donationDate: new Date('2023-11-20'),

          donationCenter: 'Red Cross Center',                    <div class="card-body">

          bloodType: 'O+',

          volume: 500,                      <div class="donation-details">                  <div class="stat-card">

          status: 'completed'

        },                        <div class="detail-row">

        {

          id: 3,                          <i class="bi bi-geo-alt text-danger me-2"></i>                    <h5 class="text-warning">{{statistics.yearsDonating}}</h5>          <!-- History Content -->          <!-- History Content -->

          donationDate: new Date('2023-09-10'),

          donationCenter: 'Community Blood Bank',                          <strong>Center:</strong> {{donation.donationCenter}}

          bloodType: 'O+',

          volume: 500,                        </div>                    <small class="text-muted">Years Donating</small>

          status: 'completed',

          notes: 'Emergency donation for accident victim'                        <div class="detail-row">

        }

      ];                          <i class="bi bi-droplet text-danger me-2"></i>                  </div>          <div class="card" *ngIf="history">          <div class="card" *ngIf="history">

      this.isLoading = false;

    }, 1000);                          <strong>Blood Type:</strong> {{donation.bloodType}}

  }

}                        </div>                </div>

                        <div class="detail-row">

                          <i class="bi bi-activity text-info me-2"></i>              </div>            <div class="card-header bg-primary text-white">            <div class="card-header bg-primary text-white">

                          <strong>Volume:</strong> {{donation.volume}}ml

                        </div>            </div>

                        <div *ngIf="donation.notes" class="detail-row">

                          <i class="bi bi-journal-text text-secondary me-2"></i>          </div>              <h5 class="card-title mb-0">              <h5 class="card-title mb-0">

                          <strong>Notes:</strong> {{donation.notes}}

                        </div>

                      </div>

                    </div>          <!-- Filter and Search Section -->                <i class="bi bi-person-circle me-2"></i>                <i class="bi bi-person-circle me-2"></i>

                    <div class="card-footer bg-transparent">

                      <div class="d-flex justify-content-between">          <div class="card mb-4">

                        <button class="btn btn-outline-primary btn-sm">

                          <i class="bi bi-eye me-1"></i>            <div class="card-body">                {{history.donorName}} - Donation Records                {{history.donorName}} - Donation Records

                          View Details

                        </button>              <div class="row">

                        <button *ngIf="donation.status === 'completed'" class="btn btn-outline-success btn-sm">

                          <i class="bi bi-download me-1"></i>                <div class="col-md-6">              </h5>              </h5>

                          Certificate

                        </button>                  <div class="input-group">

                      </div>

                    </div>                    <span class="input-group-text">            </div>            </div>

                  </div>

                </div>                      <i class="bi bi-search"></i>

              </div>

            </div>                    </span>            <div class="card-body">            <div class="card-body">

          </div>

        </div>                    <input type="text" class="form-control" placeholder="Search donations...">

      </div>

    </div>                  </div>              <!-- Donor Info -->              <!-- Donor Info -->

  `,

  styles: [`                </div>

    .stat-card {

      padding: 1rem;                <div class="col-md-3">              <div class="row mb-4">              <div class="row mb-4">

      border-radius: 8px;

      background-color: #f8f9fa;                  <select class="form-select">

      margin-bottom: 1rem;

    }                    <option value="">All Status</option>                <div class="col-md-3">                <div class="col-md-3">



    .donation-card {                    <option value="completed">Completed</option>

      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    }                    <option value="pending">Pending</option>                  <div class="text-center">                  <div class="text-center">



    .donation-card:hover {                    <option value="cancelled">Cancelled</option>

      transform: translateY(-2px);

      box-shadow: 0 4px 12px rgba(0,0,0,0.1);                  </select>                    <i class="bi bi-person-fill text-primary display-6"></i>                    <i class="bi bi-person-fill text-primary display-6"></i>

    }

                </div>

    .detail-row {

      margin-bottom: 0.5rem;                <div class="col-md-3">                    <h6 class="mt-2">{{history.donorName}}</h6>                    <h6 class="mt-2">{{history.donorName}}</h6>

      display: flex;

      align-items-center;                  <select class="form-select">

    }

                    <option value="">All Years</option>                  </div>                  </div>

    .donation-details {

      font-size: 0.9rem;                    <option value="2024">2024</option>

    }

                    <option value="2023">2023</option>                </div>                </div>

    .card-header {

      font-size: 0.9rem;                    <option value="2022">2022</option>

    }

                  </select>                <div class="col-md-3">                <div class="col-md-3">

    .badge {

      font-size: 0.7rem;                </div>

    }

              </div>                  <div class="text-center">                  <div class="text-center">

    .spinner-border {

      width: 3rem;            </div>

      height: 3rem;

    }          </div>                    <i class="bi bi-droplet-fill text-danger display-6"></i>                    <i class="bi bi-droplet-fill text-danger display-6"></i>

  `]

})

export class DonationHistoryComponent implements OnInit {

  donationHistory: DonationRecord[] = [];          <!-- Donation History List -->                    <h6 class="mt-2">{{history.bloodGroup}}</h6>                    <h6 class="mt-2">{{history.bloodGroup}}</h6>

  isLoading = true;

  statistics = {          <div class="card">

    totalDonations: 12,

    lifesSaved: 36,            <div class="card-header">                  </div>                  </div>

    totalVolume: 6000,

    yearsDonating: 3              <h5 class="card-title mb-0">

  };

                <i class="bi bi-list-ul me-2"></i>                </div>                </div>

  ngOnInit(): void {

    this.loadDonationHistory();                Donation Records

  }

              </h5>                <div class="col-md-3">                <div class="col-md-3">

  private loadDonationHistory(): void {

    // Simulate API call            </div>

    setTimeout(() => {

      this.donationHistory = [            <div class="card-body">                  <div class="text-center">                  <div class="text-center">

        {

          id: 1,              <div *ngIf="isLoading" class="text-center py-5">

          donationDate: new Date('2024-01-15'),

          donationCenter: 'City General Hospital',                <div class="spinner-border text-danger" role="status">                    <i class="bi bi-calendar-event-fill text-success display-6"></i>                    <i class="bi bi-calendar-event-fill text-success display-6"></i>

          bloodType: 'O+',

          volume: 500,                  <span class="visually-hidden">Loading...</span>

          status: 'completed',

          notes: 'Routine donation, no complications'                </div>                    <h6 class="mt-2">Total Donations</h6>                    <h6 class="mt-2">Total Donations</h6>

        },

        {                <p class="mt-2">Loading donation history...</p>

          id: 2,

          donationDate: new Date('2023-11-20'),              </div>                    <strong class="fs-4">{{history.donations.length}}</strong>                    <strong class="fs-4">{{history.donations.length}}</strong>

          donationCenter: 'Red Cross Center',

          bloodType: 'O+',

          volume: 500,

          status: 'completed'              <div *ngIf="!isLoading && donationHistory.length === 0" class="text-center py-5">                  </div>                  </div>

        },

        {                <i class="bi bi-file-earmark-x display-1 text-muted"></i>

          id: 3,

          donationDate: new Date('2023-09-10'),                <h5 class="text-muted mt-3">No Donations Found</h5>                </div>                </div>

          donationCenter: 'Community Blood Bank',

          bloodType: 'O+',                <p class="text-muted">Start your donation journey today!</p>

          volume: 500,

          status: 'completed',                <button class="btn btn-danger" routerLink="/donor/blood-donation">                <div class="col-md-3">                <div class="col-md-3">

          notes: 'Emergency donation for accident victim'

        }                  <i class="bi bi-plus-circle me-2"></i>

      ];

      this.isLoading = false;                  Schedule Donation                  <div class="text-center">                  <div class="text-center">

    }, 1000);

  }                </button>

}
              </div>                    <i class="bi bi-clock-fill text-info display-6"></i>                    <i class="bi bi-clock-fill text-info display-6"></i>



              <div *ngIf="!isLoading && donationHistory.length > 0" class="row">                    <h6 class="mt-2">Days Since Last</h6>                    <h6 class="mt-2">Days Since Last</h6>

                <div *ngFor="let donation of donationHistory" class="col-md-6 col-lg-4 mb-3">

                  <div class="card donation-card h-100"                     <strong class="fs-4">{{history.daysSinceLastDonation}}</strong>                    <strong class="fs-4">{{history.daysSinceLastDonation}}</strong>

                       [class.border-success]="donation.status === 'completed'"

                       [class.border-warning]="donation.status === 'pending'"                  </div>                  </div>

                       [class.border-danger]="donation.status === 'cancelled'">

                    <div class="card-header d-flex justify-content-between align-items-center">                </div>                </div>

                      <span class="fw-bold">{{donation.donationDate | date:'mediumDate'}}</span>

                      <span class="badge"               </div>              </div>

                            [class.bg-success]="donation.status === 'completed'"

                            [class.bg-warning]="donation.status === 'pending'"

                            [class.bg-danger]="donation.status === 'cancelled'">

                        {{donation.status | titlecase}}              <!-- Donations Table -->              <!-- Donations Table -->

                      </span>

                    </div>              <div class="table-responsive" *ngIf="history.donations.length > 0">              <div class="table-responsive" *ngIf="history.donations.length > 0">

                    <div class="card-body">

                      <div class="donation-details">                <table class="table table-striped">                <table class="table table-striped">

                        <div class="detail-row">

                          <i class="bi bi-geo-alt text-danger me-2"></i>                  <thead class="table-dark">                  <thead class="table-dark">

                          <strong>Center:</strong> {{donation.donationCenter}}

                        </div>                    <tr>                    <tr>

                        <div class="detail-row">

                          <i class="bi bi-droplet text-danger me-2"></i>                      <th>Date</th>                      <th>Date</th>

                          <strong>Blood Type:</strong> {{donation.bloodType}}

                        </div>                      <th>Location</th>                      <th>Location</th>

                        <div class="detail-row">

                          <i class="bi bi-activity text-info me-2"></i>                      <th>Blood Units</th>                      <th>Blood Units</th>

                          <strong>Volume:</strong> {{donation.volume}}ml

                        </div>                      <th>Status</th>                      <th>Status</th>

                        <div *ngIf="donation.notes" class="detail-row">

                          <i class="bi bi-journal-text text-secondary me-2"></i>                      <th>Notes</th>                      <th>Notes</th>

                          <strong>Notes:</strong> {{donation.notes}}

                        </div>                    </tr>                    </tr>

                      </div>

                    </div>                  </thead>                  </thead>

                    <div class="card-footer bg-transparent">

                      <div class="d-flex justify-content-between">                  <tbody>                  <tbody>

                        <button class="btn btn-outline-primary btn-sm">

                          <i class="bi bi-eye me-1"></i>                    <tr *ngFor="let donation of history.donations">                    <tr *ngFor="let donation of history.donations">

                          View Details

                        </button>                      <td>                      <td>

                        <button *ngIf="donation.status === 'completed'" class="btn btn-outline-success btn-sm">

                          <i class="bi bi-download me-1"></i>                        <strong>{{donation.donationDate | date:'shortDate'}}</strong>                        <strong>{{donation.donationDate | date:'shortDate'}}</strong>

                          Certificate

                        </button>                        <br>                        <br>

                      </div>

                    </div>                        <small class="text-muted">{{donation.donationDate | date:'shortTime'}}</small>                        <small class="text-muted">{{donation.donationDate | date:'shortTime'}}</small>

                  </div>

                </div>                      </td>                      </td>

              </div>

            </div>                      <td>{{donation.location || 'Not specified'}}</td>                      <td>{{donation.location || 'Not specified'}}</td>

          </div>

                      <td>                      <td>

          <!-- Pagination -->

          <nav *ngIf="!isLoading && donationHistory.length > 0" aria-label="Donation history pagination" class="mt-4">                        <span class="badge bg-primary">{{donation.bloodUnits || 1}} unit(s)</span>                        <span class="badge bg-primary">{{donation.bloodUnits || 1}} unit(s)</span>

            <ul class="pagination justify-content-center">

              <li class="page-item">                      </td>                      </td>

                <a class="page-link" href="#" aria-label="Previous">

                  <span aria-hidden="true">&laquo;</span>                      <td>                      <td>

                </a>

              </li>                        <span class="badge"                         <span class="badge" 

              <li class="page-item active"><a class="page-link" href="#">1</a></li>

              <li class="page-item"><a class="page-link" href="#">2</a></li>                              [class.bg-success]="donation.status === 'Completed'"                              [class.bg-success]="donation.status === 'Completed'"

              <li class="page-item"><a class="page-link" href="#">3</a></li>

              <li class="page-item">                              [class.bg-warning]="donation.status === 'Pending'"                              [class.bg-warning]="donation.status === 'Pending'"

                <a class="page-link" href="#" aria-label="Next">

                  <span aria-hidden="true">&raquo;</span>                              [class.bg-danger]="donation.status === 'Cancelled'">                              [class.bg-danger]="donation.status === 'Cancelled'">

                </a>

              </li>                          {{donation.status || 'Completed'}}                          {{donation.status || 'Completed'}}

            </ul>

          </nav>                        </span>                        </span>

        </div>

      </div>                      </td>                      </td>

    </div>

  `,                      <td>{{donation.notes || '-'}}</td>                      <td>{{donation.notes || '-'}}</td>

  styles: [`

    .stat-card {                    </tr>                    </tr>

      padding: 1rem;

      border-radius: 8px;                  </tbody>                  </tbody>

      background-color: #f8f9fa;

      margin-bottom: 1rem;                </table>                </table>

    }

              </div>              </div>

    .donation-card {

      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    }

              <!-- No Donations Message -->              <!-- No Donations Message -->

    .donation-card:hover {

      transform: translateY(-2px);              <div class="text-center py-5" *ngIf="history.donations.length === 0">              <div class="text-center py-5" *ngIf="history.donations.length === 0">

      box-shadow: 0 4px 12px rgba(0,0,0,0.1);

    }                <i class="bi bi-droplet display-1 text-muted mb-3"></i>                <i class="bi bi-droplet display-1 text-muted mb-3"></i>



    .detail-row {                <h5 class="text-muted">No donation history found</h5>                <h5 class="text-muted">No donation history found</h5>

      margin-bottom: 0.5rem;

      display: flex;                <p class="text-muted">This donor hasn't made any donations yet.</p>                <p class="text-muted">This donor hasn't made any donations yet.</p>

      align-items-center;

    }              </div>              </div>



    .donation-details {            </div>            </div>

      font-size: 0.9rem;

    }          </div>          </div>



    .card-header {

      font-size: 0.9rem;

    }          <!-- Loading State -->          <!-- Loading State -->



    .badge {          <div class="text-center py-5" *ngIf="loading">          <div class="text-center py-5" *ngIf="loading">

      font-size: 0.7rem;

    }            <div class="spinner-border text-primary mb-3" role="status">            <div class="spinner-border text-primary mb-3" role="status">



    .spinner-border {              <span class="visually-hidden">Loading...</span>              <span class="visually-hidden">Loading...</span>

      width: 3rem;

      height: 3rem;            </div>            </div>

    }

            <p class="text-muted">Loading donation history...</p>            <p class="text-muted">Loading donation history...</p>

    .page-link {

      color: #dc3545;          </div>          </div>

    }

        </div>        </div>

    .page-item.active .page-link {

      background-color: #dc3545;      </div>      </div>

      border-color: #dc3545;

    }    </div>    </div>



    .page-link:hover {  `,  `,

      color: #dc3545;

      background-color: #f8f9fa;  styles: [`        <mat-card-header>

      border-color: #dee2e6;

    }    .card {          <mat-card-title>

  `]

})      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);            <mat-icon>history</mat-icon>

export class DonationHistoryComponent implements OnInit {

  donationHistory: DonationRecord[] = [];      border: 1px solid rgba(0, 0, 0, 0.125);            Donation History

  isLoading = true;

  statistics = {    }          </mat-card-title>

    totalDonations: 12,

    lifesSaved: 36,              <button mat-icon-button (click)="goBack()" matTooltip="Back">

    totalVolume: 6000,

    yearsDonating: 3    .display-6 {            <mat-icon>arrow_back</mat-icon>

  };

      font-size: 2.5rem;          </button>

  ngOnInit(): void {

    this.loadDonationHistory();    }        </mat-card-header>

  }

    

  private loadDonationHistory(): void {

    // Simulate API call    .table-responsive {        <mat-card-content *ngIf="history">

    setTimeout(() => {

      this.donationHistory = [      border-radius: 0.375rem;          <!-- Donor Summary -->

        {

          id: 1,    }          <div class="summary-section">

          donationDate: new Date('2024-01-15'),

          donationCenter: 'City General Hospital',                <div class="summary-card">

          bloodType: 'O+',

          volume: 500,    .badge {              <mat-icon>person</mat-icon>

          status: 'completed',

          notes: 'Routine donation, no complications'      font-size: 0.875em;              <div>

        },

        {    }                <h3>{{history.donorName}}</h3>

          id: 2,

          donationDate: new Date('2023-11-20'),  `]                <p>Blood Group: {{history.bloodGroup}}</p>

          donationCenter: 'Red Cross Center',

          bloodType: 'O+',})              </div>

          volume: 500,

          status: 'completed'export class DonationHistoryComponent implements OnInit {            </div>

        },

        {  history: DonationHistory | null = null;          </div>

          id: 3,

          donationDate: new Date('2023-09-10'),  loading = false;

          donationCenter: 'Community Blood Bank',

          bloodType: 'O+',  donorId: string | null = null;          <!-- Statistics -->

          volume: 500,

          status: 'completed',          <div class="stats-section">

          notes: 'Emergency donation for accident victim'

        },  constructor(            <h3>Donation Statistics</h3>

        {

          id: 4,    private route: ActivatedRoute,            <div class="stats-grid">

          donationDate: new Date('2024-03-25'),

          donationCenter: 'Mobile Blood Drive',    private router: Router,              <div class="stat-item">

          bloodType: 'O+',

          volume: 500,    private donorService: DonorService                <mat-icon>bloodtype</mat-icon>

          status: 'pending',

          notes: 'Scheduled for next week'  ) { }                <div class="stat-content">

        }

      ];                  <div class="stat-number">{{history.totalDonations}}</div>

      this.isLoading = false;

    }, 1000);  ngOnInit(): void {                  <div class="stat-label">Total Donations</div>

  }

}    this.donorId = this.route.snapshot.paramMap.get('id');                </div>

    if (this.donorId) {              </div>

      this.loadHistory();

    }              <div class="stat-item" *ngIf="history.lastDonationDate">

  }                <mat-icon>event</mat-icon>

                <div class="stat-content">

  loadHistory(): void {                  <div class="stat-number">{{history.lastDonationDate | date:'shortDate'}}</div>

    if (!this.donorId) return;                  <div class="stat-label">Last Donation</div>

                    </div>

    this.loading = true;              </div>

    this.donorService.getDonationHistory(this.donorId).subscribe({

      next: (history) => {              <div class="stat-item" *ngIf="history.firstDonationDate">

        this.history = history;                <mat-icon>start</mat-icon>

        this.loading = false;                <div class="stat-content">

      },                  <div class="stat-number">{{history.firstDonationDate | date:'shortDate'}}</div>

      error: (error) => {                  <div class="stat-label">First Donation</div>

        console.error('Error loading donation history:', error);                </div>

        this.loading = false;              </div>

      }

    });              <div class="stat-item" *ngIf="history.averageDaysBetweenDonations">

  }                <mat-icon>schedule</mat-icon>

                <div class="stat-content">

  goBack(): void {                  <div class="stat-number">{{history.averageDaysBetweenDonations}}</div>

    this.router.navigate(['/donors']);                  <div class="stat-label">Avg. Days Between</div>

  }                </div>

}              </div>
            </div>
          </div>

          <!-- Current Status -->
          <div class="status-section">
            <h3>Current Status</h3>
            <div class="status-grid">
              <div class="status-item" [class.eligible]="history.isCurrentlyEligible" [class.not-eligible]="!history.isCurrentlyEligible">
                <mat-icon>{{history.isCurrentlyEligible ? 'check_circle' : 'cancel'}}</mat-icon>
                <div>
                  <strong>{{history.isCurrentlyEligible ? 'Eligible' : 'Not Eligible'}}</strong>
                  <small>Current Donation Status</small>
                </div>
              </div>

              <div class="status-item" *ngIf="history.nextEligibleDate">
                <mat-icon>event_available</mat-icon>
                <div>
                  <strong>{{history.nextEligibleDate | date:'fullDate'}}</strong>
                  <small>Next Eligible Date</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="timeline-section" *ngIf="history.totalDonations > 0">
            <h3>Donation Timeline</h3>
            <div class="timeline-info">
              <mat-icon>info</mat-icon>
              <p>
                {{history.donorName}} has been a donor since 
                {{history.firstDonationDate | date:'MMMM yyyy'}} 
                and has made {{history.totalDonations}} 
                donation{{history.totalDonations > 1 ? 's' : ''}}.
              </p>
            </div>
            
            <div class="milestone-cards" *ngIf="getMilestones().length > 0">
              <h4>Achievements</h4>
              <div class="milestones">
                <div class="milestone" *ngFor="let milestone of getMilestones()">
                  <mat-icon [style.color]="milestone.color">{{milestone.icon}}</mat-icon>
                  <div>
                    <strong>{{milestone.title}}</strong>
                    <small>{{milestone.description}}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No History -->
          <div class="no-history" *ngIf="history.totalDonations === 0">
            <mat-icon>bloodtype</mat-icon>
            <h3>No Donation History</h3>
            <p>This donor has not made any blood donations yet.</p>
            <button mat-raised-button 
                    color="primary" 
                    (click)="proceedToDonation()"
                    [disabled]="!history.isCurrentlyEligible">
              <mat-icon>bloodtype</mat-icon>
              Record First Donation
            </button>
          </div>

          <!-- Actions -->
          <div class="actions-section" *ngIf="history.totalDonations > 0">
            <button mat-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Back to Profile
            </button>

            <button mat-raised-button 
                    color="primary" 
                    (click)="checkEligibility()">
              <mat-icon>health_and_safety</mat-icon>
              Check Eligibility
            </button>

            <button mat-raised-button 
                    color="accent" 
                    (click)="proceedToDonation()"
                    [disabled]="!history.isCurrentlyEligible">
              <mat-icon>bloodtype</mat-icon>
              Record New Donation
            </button>
          </div>
        </mat-card-content>

        <!-- Loading State -->
        <mat-card-content *ngIf="loading">
          <div class="loading-container">
            <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
            <p>Loading donation history...</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .history-container {
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .summary-section {
      margin-bottom: 30px;
    }

    .summary-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, #3f51b5, #5c6bc0);
      color: white;
      border-radius: 12px;
    }

    .summary-card mat-icon {
      font-size: 36px;
      height: 36px;
      width: 36px;
    }

    .summary-card h3 {
      margin: 0 0 4px 0;
      font-size: 20px;
    }

    .summary-card p {
      margin: 0;
      opacity: 0.9;
    }

    .stats-section, .status-section, .timeline-section {
      margin-bottom: 30px;
    }

    .stats-section h3, .status-section h3, .timeline-section h3 {
      color: #3f51b5;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 8px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #3f51b5;
    }

    .stat-item mat-icon {
      color: #3f51b5;
      font-size: 28px;
      height: 28px;
      width: 28px;
    }

    .stat-number {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }

    .stat-label {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      border: 2px solid;
    }

    .status-item.eligible {
      background-color: #e8f5e8;
      border-color: #4caf50;
      color: #2e7d32;
    }

    .status-item.not-eligible {
      background-color: #ffebee;
      border-color: #f44336;
      color: #c62828;
    }

    .status-item strong {
      display: block;
    }

    .status-item small {
      font-size: 12px;
      opacity: 0.8;
    }

    .timeline-info {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background-color: #e3f2fd;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .timeline-info mat-icon {
      color: #1976d2;
      margin-top: 2px;
    }

    .timeline-info p {
      margin: 0;
      color: #1565c0;
    }

    .milestone-cards h4 {
      color: #3f51b5;
      margin-bottom: 16px;
    }

    .milestones {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }

    .milestone {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background-color: #fff3e0;
      border-radius: 8px;
      border-left: 4px solid #ff9800;
    }

    .milestone strong {
      display: block;
      color: #e65100;
    }

    .milestone small {
      font-size: 11px;
      color: #bf360c;
    }

    .no-history {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-history mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .no-history h3 {
      margin-bottom: 8px;
      color: #333;
    }

    .actions-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      border-top: 1px solid #e0e0e0;
      flex-wrap: wrap;
      gap: 12px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
    }

    .loading-container p {
      margin-top: 16px;
      color: #666;
    }

    @media (max-width: 768px) {
      .stats-grid, .status-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-section {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class DonationHistoryComponent implements OnInit {
  history: DonationHistory | null = null;
  loading = false;
  donorId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donorService: DonorService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.donorId = parseInt(id);
      this.loadHistory();
    }
  }

  loadHistory(): void {
    this.loading = true;
    this.donorService.getDonationHistory(this.donorId).subscribe({
      next: (history) => {
        this.history = history;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading donation history:', error);
        this.loading = false;
      }
    });
  }

  getMilestones(): any[] {
    if (!this.history) return [];

    const milestones = [];
    
    if (this.history.totalDonations >= 1) {
      milestones.push({
        icon: 'star',
        title: 'First Time Donor',
        description: 'Made first blood donation',
        color: '#4caf50'
      });
    }
    
    if (this.history.totalDonations >= 5) {
      milestones.push({
        icon: 'emoji_events',
        title: 'Regular Donor',
        description: '5+ donations completed',
        color: '#ff9800'
      });
    }
    
    if (this.history.totalDonations >= 10) {
      milestones.push({
        icon: 'military_tech',
        title: 'Dedicated Donor',
        description: '10+ donations completed',
        color: '#9c27b0'
      });
    }
    
    if (this.history.totalDonations >= 25) {
      milestones.push({
        icon: 'workspace_premium',
        title: 'Life Saver',
        description: '25+ donations completed',
        color: '#f44336'
      });
    }

    return milestones;
  }

  checkEligibility(): void {
    this.router.navigate(['/donors/eligibility', this.donorId]);
  }

  proceedToDonation(): void {
    if (this.history?.isCurrentlyEligible) {
      this.router.navigate(['/donors/donate', this.donorId]);
    }
  }

  goBack(): void {
    this.router.navigate(['/donors/profile', this.donorId]);
  }
}