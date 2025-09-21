import { Pipe, PipeTransform } from '@angular/core';
import { BloodGroup, BloodGroupNames } from '../models/common.model';

@Pipe({
  name: 'bloodGroup',
  standalone: true
})
export class BloodGroupPipe implements PipeTransform {
  transform(value: BloodGroup): string {
    return BloodGroupNames[value] || 'Unknown';
  }
}

@Pipe({
  name: 'userRole',
  standalone: true
})
export class UserRolePipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1: return 'Admin';
      case 2: return 'Donor';
      case 3: return 'Recipient';
      default: return 'Unknown';
    }
  }
}

@Pipe({
  name: 'bloodRequestStatus',
  standalone: true
})
export class BloodRequestStatusPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1: return 'Pending';
      case 2: return 'Approved';
      case 3: return 'Fulfilled';
      case 4: return 'Rejected';
      case 5: return 'Cancelled';
      default: return 'Unknown';
    }
  }
}

@Pipe({
  name: 'urgency',
  standalone: true
})
export class UrgencyPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      case 4: return 'Critical';
      default: return 'Unknown';
    }
  }
}