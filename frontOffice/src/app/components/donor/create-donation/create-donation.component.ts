import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { DonationRequestsService } from '../../../services/http/donationRequests/donation-requests.service';
import { EntityService } from '../../../services/http/entity/entity.service';
import { ConditionService } from '../../../services/http/conditions/condition.service';


// models
import { Item } from '../../../models/item.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Entity } from '../../../models/entity.model';
import { CryptLocalStorage } from '../../../services/CryptLocalStorage';
import { Condition } from '../../../models/conditions.model';

@Component({
  selector: 'app-create-donation',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-donation.component.html',
  styleUrl: './create-donation.component.css'
})
export class CreateDonationComponent implements OnInit {
  private userId = CryptLocalStorage.getItem('userId');

  entities: Entity[] = [];
  entityId: String = "";
  items: Item[] = [];
  itemConditions: Condition[] = [];
  currentItem = {} as Item;
  selectedCondition: String = "";
  error: String = "";

  previusRoute: String = "";

  constructor(
    private donationRequestsService: DonationRequestsService,
    private entityService: EntityService,
    private conditionService: ConditionService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getEntitiesData();
    this.getConditions();
  }

  addItem() {
    let temporaryId = this.items.length + 1;

    let item: Item = {
      _id: temporaryId.toString(),
      donationId: undefined,
      conditionId: this.currentItem.conditionId,
      description: this.currentItem.description,
      condition: this.selectedCondition,
      weight: this.currentItem.weight
    };

    this.items.push(item);

    // limpar após inserir no array
    this.currentItem = {} as Item;
  }

  removeItem(item: Item) {
    let index = this.items.indexOf(item);

    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  getEntitiesData(): void {
    this.entityService.getaEntitiesData().subscribe({
      next: (data) => {
        this.entities = data;
      },
      error: (error) => {
        this.error = error;
      }
    })
  }

  getConditions(): void {
    this.conditionService.getConditions().subscribe({
      next: (data) => {
        this.itemConditions = data;
      },
      error: (err) => {
        this.error = "Não foi possível obter as condições";
        console.log(err)
      }
    })
  }

  submitDonationRequest() {
    let donationRequest: Object = {
      donorId: this.userId,
      entityId: this.entityId,
      items: this.items
    }
    
    if (this.userId) {
      if (this.items.length > 0 && this.entityId !== "") {
        this.donationRequestsService.addDonationRequest(donationRequest).subscribe({
          next: (value) => {
            this.router.navigateByUrl("/donor/dashboard"); // TODO mandar sinalização a dizer que a doação foi efetuada com sucesso
          },
          error: (err) => {
            this.error = "Erro ao Submeter! ";
          }
        });
      }
      else {
        this.error = "Existem campos que não foram preenchidos";
      }
    } else {
      this.error = "Não foi encontrado o ID de utilizador"
    }
  }

  getConditionSelectedOption(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedText = selectElement.options[selectElement.selectedIndex].text;
    this.selectedCondition = selectedText;
 }

  goBack() {
    this.router.navigateByUrl('/donor/dashboard');
  }
}
