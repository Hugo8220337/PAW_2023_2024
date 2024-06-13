import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// services
import { AuthService } from '../../../services/http/auth/auth.service';

import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../partials/success-dialog/success-dialog.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: '../styles/login.css'
})
export class ForgotPasswordComponent implements OnInit {
  userType: String = "";

  error: string = "";
  success: String = "";
  email: string = "";
  password: string = "";

  constructor(
    private authService: AuthService,
    private router : Router,
    private route: ActivatedRoute,
    private mathDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.userType = data['userType'];
    });
  }

  sendEmail() {
    if(this.email) {
      this.authService.forgotPassword(this.email, this.userType).subscribe({
        next: (response) => {
          this.success = "Email enviado para fazer a reposição da senha. Por favor vá até à caixa de entrada do seu email.";
          this.mathDialog.open(SuccessDialogComponent,{
            data: { message: 'Email enviado para fazer a reposição da senha. Por favor vá até à caixa de entrada do seu email.' }
          });
        },
        error: (err) => {
          console.log(err);
          this.error = "Email não encontrado"
        }
      });
    } else {
      this.error = "Email não preenchido";
    }
  }
}
