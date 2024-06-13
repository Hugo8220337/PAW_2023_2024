import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Serviços
import { AuthService } from '../../../services/http/auth/auth.service';
import { CryptLocalStorage } from '../../../services/CryptLocalStorage';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['../styles/login.css']
})
export class LoginComponent implements OnInit {
  userType: String = "";

  error: string = "";
  email: string = "";
  password: string = "";


  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.userType = data['userType'];
    });
  }

  login(): void {
    if (this.email == null || this.password == null) {
      this.error = "email ou password inválidos";
      return;
    }

    switch (this.userType) {
      case "donor":
        this.authService.donorLogin(this.email, this.password).subscribe({
          next: (response) => {
            // criar variável com o token de autenticação e o Id do utilizador
            CryptLocalStorage.setItem('token', response.token);
            CryptLocalStorage.setItem('userId', response.userId);


            this.router.navigateByUrl("/donor/dashboard");
          },
          error: (err) => {
            if (err.status == 500) {
              this.error = "Erro no servidor, tente mais tarde";
            } else {
              this.error = "Email ou password Inválidos";
            }
          },
        })
        break;

      case "entity":
        this.authService.entityLogin(this.email, this.password).subscribe({
          next: (response) => {
            // criar variável com o token de autenticação e o Id do utilizador
            CryptLocalStorage.setItem('token', response.token);
            CryptLocalStorage.setItem('userId', response.userId);

            this.router.navigateByUrl("/entity/dashboard");
          },
          error: (err) => {
            if (err.status == 500) {
              this.error = "Erro no servidor, tente mais tarde";
            } else {
              this.error = "Email ou password Inválidos";
            }
          },
        })
        break;

      default:
        this.error = "Não foi especificado o tipo de utilizador"
    }

  }

  redirectForgotPassword() {
    switch (this.userType) {
      case "donor":
        this.router.navigateByUrl("auth/forgotPassword");
        break;
      case "entity":
        this.router.navigateByUrl("auth/forgotPassword/entity");
        break;
    }
  }

  redirectToRegister() {
    switch (this.userType) {
      case "donor":
        this.router.navigateByUrl("auth/registerDonor");
        break;
      case "entity":
        this.router.navigateByUrl("auth/registerEntity");
        break;
    }
  }
}
