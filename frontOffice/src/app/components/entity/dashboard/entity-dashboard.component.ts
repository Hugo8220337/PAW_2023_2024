import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// models
import { Entity } from '../../../models/entity.model';
import { DonationRequest } from '../../../models/donationRequest.model';
import { Donation } from '../../../models/donation.model';

// Services
import { EntityService } from '../../../services/http/entity/entity.service';
import { DonationsService } from '../../../services/http/donations/donations.service';
import { DonationRequestsService } from '../../../services/http/donationRequests/donation-requests.service';
import { CountriesService } from '../../../services/data/countries/countries.service';

// components
import { DonationsTableComponent } from '../../partials/donations-table/donations-table.component';
import { DonationModalComponent } from '../../partials/donation-modal/donation-modal.component';
import { AuthService } from '../../../services/http/auth/auth.service';
import { UserInformationComponent } from '../../partials/user-information/user-information.component';
import { UserProfileComponent } from '../../partials/user-profile/user-profile.component';
import { CryptLocalStorage } from '../../../services/CryptLocalStorage';


@Component({
  selector: 'app-entity-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    UserInformationComponent,
    DonationsTableComponent,
    UserProfileComponent
  ],
  templateUrl: './entity-dashboard.component.html',
  styleUrl: './entity-dashboard.component.css'
})

export class EntityDashboardComponent implements OnInit {

  private entityId = CryptLocalStorage.getItem('userId');

  entity = {} as Entity;
  countries: { [key: string]: string } = {};
  donations: Donation[] = [];
  donationRequests: DonationRequest[] = [];
  error: String = "";


  /**
   * indicador se o perfil está em modo de edição
   */
  editMode: Boolean = false;

  constructor(
    private authService: AuthService,
    private countriesService: CountriesService,
    private entityService: EntityService,
    private donationsService: DonationsService,
    private donationRequestsService: DonationRequestsService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.countries = this.countriesService.getCountries();    
  }

  loadData(): void {
    this.getEntityData();
    this.getEntityDonationsData();
    this.getEntityDonationRequestsData();
  }


  getEntityData(): void {
    if (this.entityId) {
      this.entityService.getEntityData(this.entityId).subscribe({
        next: (value) => {
          this.entity = value;
        },
        error: (err) => {
          this.logout();
        }
      });
    } else {
      this.error = "Não foi encontrado o ID da entidade"
    }
  }


  getEntityDonationsData(): void {
    if (this.entityId) {
      this.donationsService.getDonationFromEntity(this.entityId).subscribe({
        next: (value) => {
          this.donations = value;
        },
        error: (err) => {
          this.error = "Ocorreu um erro ao Obter a informação das doações";
        }
      });
    } else {
      this.error = "Não foi encontrado o ID da entidade"
    }
  }

  getEntityDonationRequestsData() {
    if (this.entityId) {
      this.donationRequestsService.getDonationRequestsFromEntity(this.entityId).subscribe({
        next: (value) => {
          this.donationRequests = value;
        },
        error: (err) => {
          this.error = "Ocorreu um erro ao Obter a informação dos pedidos de doação";
        }
      });
    } else {
      this.error = "Não foi encontrado o ID da entidade"
    }
  }

  getCountryKeys(): Array<string> {
    return Object.keys(this.countries);
  }

  toggleEdit() {
    this.editMode = (this.editMode) ? false : true;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('')
  }
}
