import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { Entity } from '../../../models/entity.model';

import { EntityService } from '../../../services/http/entity/entity.service';
import { CountriesService } from '../../../services/data/countries/countries.service';
import { DateFormatService } from '../../../services/data/dates/date-format.service';
import { DonorService } from '../../../services/http/donor/donor.service';

@Component({
  selector: 'app-user-information',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-information.component.html',
  styleUrl: './user-information.component.css'
})
export class UserInformationComponent {
  @Input() user: User = {} as User;
  @Input() entity: Entity = {} as Entity;

  // eventos para mandar atualizar as informações do utilizador ou entidade quando estes são atualizado
  @Output() userEdited: EventEmitter<void> = new EventEmitter<void>();
  @Output() entityEdited: EventEmitter<void> = new EventEmitter<void>();

  /**
   * indicador se o perfil está em modo de edição
   */
  editMode: Boolean = false;
  countries: { [key: string]: string } = {};
  editableUser = {} as User;
  editableEntity = {} as Entity;
  error: String = "";
  selectedFile: File | null = null;

  currentDate: string = "";

  constructor(
    public DateFormatService: DateFormatService,
    private entityService: EntityService,
    public countriesService: CountriesService,
    private userService: DonorService
  ) { }

  ngOnInit(): void {
    this.countries = this.countriesService.getCountries();
    this.getCurrentDate();
  }

  onSelectFile(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.editableUser.profileImage = this.selectedFile.name;
    }
  }

  submitNewUserInfo() {
    this.editableUser.profileImage = this.selectedFile;

    this.userService.updateUserInfo(this.editableUser).subscribe({
      next: () => {
        this.toggleEdit();

        // evento para simular reload da página no componente pau
        this.userEdited.emit();
      },
      error: (err) => {
        this.error = "Ocorreu um erro ao atualizar a informação! ";
      }
    });
  }

  submitNewEntityInfo() {
    this.entityService.updateEntityInfo(this.editableEntity).subscribe({
      next: () => {
        this.toggleEdit();

        // simular reload da página no componente pau
        this.entityEdited.emit();
      },
      error: (err) => {
        this.error = "Ocorreu um erro ao atualizar a informação!";
      }
    });
  }


  deleteProfileImage() {
    if (this.user._id) {
      this.userService.removeProfilePicture(this.user._id).subscribe({
        next: () => {
          this.userEdited.emit();
        },
        error: (err) => {
          this.error = "Ocorreu um erro ao remover a imagem";
        }
      })

    }
  }


  toggleEdit() {
    // criar deep clones
    if (this.user._id !== undefined) {
      this.editableUser = JSON.parse(JSON.stringify(this.user));
      this.editableUser.profileImage = undefined; // para não passar base64 para a API
    } else if (this.entity._id !== undefined) {
      this.editableEntity = JSON.parse(JSON.stringify(this.entity));
    }

    // mudar o estado
    this.editMode = (this.editMode) ? false : true;
  }

  getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.currentDate = `${year}-${month}-${day}`;
  }
  
  getCountryKeys(): Array<string> {
    return Object.keys(this.countries);
  }
}
