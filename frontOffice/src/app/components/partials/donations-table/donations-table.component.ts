import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Donation } from '../../../models/donation.model';
import { DonationRequest } from '../../../models/donationRequest.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


//Service
import { DateFormatService } from '../../../services/data/dates/date-format.service';
import { MatDialog } from '@angular/material/dialog';
import { DonationModalComponent } from '../donation-modal/donation-modal.component';

@Component({
  selector: 'app-donations-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donations-table.component.html',
  styleUrl: './donations-table.component.css'
})
export class DonationsTableComponent {

  constructor(
    public DateFormatService: DateFormatService,
    private mathDialog: MatDialog
  ) { }

  @Input() userType: String = "";
  @Input() donations: Donation[] = [];
  @Input() donationRequests: DonationRequest[] = [];
  @Input() error: String = "";

  // evento para mandar o parent controller atalizar os dados
  @Output() statusSaved: EventEmitter<void> = new EventEmitter<void>();


  viewMode: 'donations' | 'requests' = 'donations';

  switchView(mode: 'donations' | 'requests') {
    this.viewMode = mode;
  }

  openDonationModal(donation?: Donation, donationRequest?: DonationRequest) {
    const dialogRef = this.mathDialog.open(DonationModalComponent, {
      width: '50%',
      data: { userType: this.userType, donation: donation, donationRequest: donationRequest },
    })

    /**
     * quando o dialog é fechado, vai mandar um evento para a tabela,
     * que por usa vez vai mandar para o dashboad (componente pai)
     */
    dialogRef.afterClosed().subscribe(res => {
      this.statusSaved.emit();
    })
  }

}
