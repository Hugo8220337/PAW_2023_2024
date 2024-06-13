import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SuccessDialogComponent } from '../../../partials/success-dialog/success-dialog.component';

// models
import { User } from '../../../../models/user.model';

// Services
import { CountriesService } from '../../../../services/data/countries/countries.service';
import { AuthService } from '../../../../services/http/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register-donor',
  standalone: true,
  imports: [FormsModule, CommonModule, SuccessDialogComponent],
  templateUrl: './register-donor.component.html',
  styleUrls: ['../../styles/login.css']
})
export class RegisterDonorComponent implements OnInit {

  currentDate: string = "";
  selectedFile: File | null = null;

  registerDonor = {} as User;

  country: string = "";
  countries: { [key: string]: string } = {};
  error: string = "";

  constructor(
    private countriesService: CountriesService,
    private authService: AuthService,
    private mathDialog: MatDialog,
    public router: Router
  ) { }

  onSelectFile(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.registerDonor.profileImage = this.selectedFile.name;
    }
  }

  ngOnInit(): void {
    this.countries = this.countriesService.getCountries();
    this.getCountryKeys();
    this.getCurrentDate();
  }

  register(): void {
    let emailMatch = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!this.registerDonor.name) {
      this.error = ('Nome é obrigatório.');
    } else if (!this.registerDonor.email || !this.registerDonor.email.match(emailMatch)) {
      this.error = ('Email é obrigatório e deve ser válido.');
    } else if (!this.registerDonor.password) {
      this.error = ('Password é obrigatório.');
    } else if (!this.registerDonor.phoneNumber || !this.registerDonor.phoneNumber.match(/^(91|93|96)\d{7}$/)) {
      this.error = ('O número de telefone deve começar com 91, 93 ou 96 e ter 9 dígitos.');
    } else if (!this.registerDonor.address) {
      this.error = ('A morada é obrigatória.');
    } else if (!this.registerDonor.country) {
      this.error = ('País é obrigatório.');
    } else if (!this.registerDonor.dateOfBirthday) {
      this.error = ('A data de nascimento é obrigatória.');
    } else {
      this.registerDonor.profileImage = this.selectedFile;

      this.authService.registerDonor(this.registerDonor).subscribe({
        next: () => {
          let dialogRef = this.mathDialog.open(SuccessDialogComponent, {
            data: { message: 'Utilizador criado com suesso' }
          });

          // voltar para o login quando o dialog fechar
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['auth/login']);
          });
        },
        error: (err) => {
          console.error('Error registering donor:', err);
          this.error = "Ocorreu um erro ao registrar o doador!"; // Atualiza a mensagem de erro
        }
      });
    }
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
