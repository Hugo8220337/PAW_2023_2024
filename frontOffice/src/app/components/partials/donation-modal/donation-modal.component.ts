import { Component, EventEmitter, Inject, Output, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
 
// models
import { Donation } from '../../../models/donation.model';
import { DonationRequest } from '../../../models/donationRequest.model';

// services
import { DonationRequestsService } from '../../../services/http/donationRequests/donation-requests.service';
import { DonationsService } from '../../../services/http/donations/donations.service';
import { Condition } from '../../../models/conditions.model';
import { ConditionService } from '../../../services/http/conditions/condition.service';


interface DialogData {
  userType: String,
  donation: Donation,
  donationRequest: DonationRequest
}

/**
 * @title Dialog elements
 */
@Component({
  selector: 'app-donation-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatRadioModule
  ],
  templateUrl: './donation-modal.component.html',
  styleUrl: './donation-modal.component.css'
})
export class DonationModalComponent {
  conditions: Condition[] = [];
  donationStatus: String = "";
  donationRequestStatus: String = "";

  // evento para mandar a tabela atualizar quando o dialog fechar
  @Output() statusSaved: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<DonationModalComponent>,
    private donationService: DonationsService,
    private donationRequestService: DonationRequestsService,
    private conditionService: ConditionService
  ) {

    if(this.data.donation && this.data.donation.status) {
      this.donationStatus = this.data.donation.status
    } else if(this.data.donationRequest && this.data.donationRequest.status) {
      this.donationRequestStatus = this.data.donationRequest.status
    }
  }

  saveStatus() {
    if(this.data.donation) {
      if(this.data.donation._id !== undefined && this.donationStatus !== undefined) {

        this.donationService.updateDonationStatus(this.data.donation._id, this.donationStatus).subscribe({
          complete: () => {
            this.statusSaved.emit(); // Emit event to notify parent component
            this.dialogRef.close();
          }
        });

      }
    }
    else if(this.data.donationRequest) {
      if(this.data.donationRequest._id !== undefined && this.donationRequestStatus !== undefined) {

        this.donationRequestService.updateDonationRequestStatus(this.data.donationRequest._id, this.donationRequestStatus).subscribe({
          complete: () => {
            this.statusSaved.emit(); // Emit event to notify parent component
            this.dialogRef.close();
          }
        });

      }
    }
  }
}
