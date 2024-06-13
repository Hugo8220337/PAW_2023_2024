import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SuccessDialogComponent } from '../../../partials/success-dialog/success-dialog.component';

// models
import { Entity } from '../../../../models/entity.model';

// Services
import { CountriesService } from '../../../../services/data/countries/countries.service';
import { AuthService } from '../../../../services/http/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register-entity',
  standalone: true,
  imports: [FormsModule, CommonModule, SuccessDialogComponent],
  templateUrl: './register-entity.component.html',
  styleUrls: ['../../styles/login.css']
})
export class RegisterEntityComponent implements OnInit {

  registerEntity: Entity = {
    _id: "",
    name: "",
    contact: {
      email: "",
      phoneNumber: "",
      address: "",
    },
    description: "",
    password: "",
    country: "",
    aditionalInfo: "",
    isActive: undefined
  };

  country: string = "";
  countries: { [key: string]: string } = {};
  error: string = "";

  constructor(
    private countriesService: CountriesService,
    private authService: AuthService,
    private mathDialog: MatDialog,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.countries = this.countriesService.getCountries();
    this.getCountryKeys();
  }


  register(): void {
    let emailMatch = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if(!this.registerEntity.name){
      this.error = ('Nome é obrigatório.');
    }else if (!this.registerEntity.contact.email || !this.registerEntity.contact.email.match(emailMatch)){
      this.error = ('Email é obrigatório e deve ser válido.');
    }else if(!this.registerEntity.password){
      this.error = ('Password é obrigatório.');
    }else if(!this.registerEntity.contact.phoneNumber || !this.registerEntity.contact.phoneNumber.match(/^(91|93|96)\d{7}$/)){
      this.error = ('O número de telefone deve começar com 91, 93 ou 96 e ter 9 dígitos e é obrigatório.');
    }else if(!this.registerEntity.contact.address){
      this.error = ('A morada é obrigatória.');
    }else if(!this.registerEntity.country){
      this.error = ('País é obrigatório.');
    }else if(!this.registerEntity.description){
      this.error = ('A descrição é obrigatório');
    }else{
      this.authService.registerEntity(this.registerEntity).subscribe({
        next: () => {
          let dialogRef = this.mathDialog.open(SuccessDialogComponent,{
            data: { message: 'Entidade criada com suesso. Tem de ser aceito por um administrador até poder receber doações' }
          });

          // voltar para o login quando o dialog fechar
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['auth/login/entity']);
          });
        },
        error: (err) => {
          console.error('Error registering entity:', err);
          this.error = "Ocorreu um erro ao registrar a entidade!"; // Atualiza a mensagem de erro
        }
      });
    }
  }

  getCountryKeys(): Array<string> {
    return Object.keys(this.countries);
  }
}
