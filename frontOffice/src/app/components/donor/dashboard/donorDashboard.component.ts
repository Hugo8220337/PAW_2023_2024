import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// models
import { User } from '../../../models/user.model';
import { DonationRequest } from '../../../models/donationRequest.model';
import { Donation } from '../../../models/donation.model';

// Services
import { DonationsService } from '../../../services/http/donations/donations.service';
import { DonationRequestsService } from '../../../services/http/donationRequests/donation-requests.service';
import { DonorService } from '../../../services/http/donor/donor.service';
import { DateFormatService } from '../../../services/data/dates/date-format.service';

// components
import { DonationsTableComponent } from '../../partials/donations-table/donations-table.component';
import { DonationModalComponent } from '../../partials/donation-modal/donation-modal.component';


import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/http/auth/auth.service';
import { UserInformationComponent } from '../../partials/user-information/user-information.component';
import { UserProfileComponent } from '../../partials/user-profile/user-profile.component';
import { CryptLocalStorage } from '../../../services/CryptLocalStorage';
import { style } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    UserProfileComponent,
    UserInformationComponent,
    DonationsTableComponent,
    DonationModalComponent,
  ],
  templateUrl: './donorDashboard.component.html',
  styleUrl: './donorDashboard.component.css'
})
export class DonorDashboardComponent implements OnInit {
  private userId = CryptLocalStorage.getItem('userId');

  user = {} as User;
  editableUser = {} as User;
  donations: Donation[] = [];
  donationRequests: DonationRequest[] = [];
  error: String = "";

  @ViewChild('paypal', { static: true }) private paypalRef!: ElementRef;

  constructor(
    public DateFormatService: DateFormatService,
    private authService: AuthService,
    private userService: DonorService,
    private donationsService: DonationsService,
    private donationRequestsService: DonationRequestsService,
    public router: Router,
    private mathDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUserData();
    this.getUserDonationsData();
    this.getUserDonationRequestsData();
    this.initializePayPal();
  }

  getUserData(): void {
    if (this.userId) {
      this.userService.getUserData(this.userId).subscribe({
        next: (value) => {
          this.user = value;

          // carregar imagem de perfil caso receba o utilizador
          this.getUserProfilePicture();
        },
        error: (err) => {
          this.logout();
        }
      });
    } else {
      this.error = "Não foi encontrado o ID de utilizador"
    }
  }

  getUserProfilePicture(): void {
    if (this.userId) {
      this.userService.getUserProfilePicture(this.userId).subscribe({
        next: (response) => {
          this.createImageFromBlob(response);
        },
        error: (err) => {
          this.error = "Não foi encontrado o ID de utilizador";
        }
      });
    }
  }

  createImageFromBlob(image: Blob): void {
    let reader = new FileReader();

    reader.addEventListener("load", () => {
      // Define o resultado da leitura (imagem em base64) na propriedade profileImage do usuário.
      this.user.profileImage = reader.result as string;
    }, false);

    // Se o Blob de imagem estiver presente, lê o Blob como URL de dados (base64).
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getUserDonationsData(): void {
    if (this.userId) {
      this.donationsService.getDonationsFromUser(this.userId).subscribe({
        next: (value) => {
          this.donations = value;
        },
        error: (err) => {
          this.error = "Ocorreu um erro ao Obter a informação das doações";
        }
      });
    } else {
      this.error = "Não foi encontrado o ID de utilizador"
    }
  }


  getUserDonationRequestsData() {
    if (this.userId) {
      this.donationRequestsService.getDonationRequestsFromUser(this.userId).subscribe({
        next: (value) => {
          this.donationRequests = value;
        },
        error: (err) => {
          this.error = "Ocorreu um erro ao Obter a informação das doações";
        }

      })
    } else {
      this.error = "Não foi encontrado o ID de utilizador"
    }
  }

  openDonationModal() {
    this.mathDialog.open(DonationModalComponent, {
      width: '50%',
    })
  }

  initializePayPal() {
    window.paypal.Buttons(
      {
        style: {
          layout: 'horizontal',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        },

        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: '100',
                  currency_code: 'EUR'
                }
              }
            ]
          })
        },

        onApprouve: (data: any, actions: any) => {
          return actions.order.capture().then(() => {
            alert('Transaction Completed');
          })
        },

        onError: (error: any) => {
          console.log(error);
        }
      }
    ).render(this.paypalRef.nativeElement);
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }
}
