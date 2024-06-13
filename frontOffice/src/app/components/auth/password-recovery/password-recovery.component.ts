import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// serviços
import { AuthService } from '../../../services/http/auth/auth.service';

import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../partials/success-dialog/success-dialog.component';


@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './password-recovery.component.html',
  styleUrl: '../styles/login.css'
})
export class PasswordRecoveryComponent {
  userType: String = "";

  token: string;
  newPassword: string = "";
  confirmPassword: string = "";
  error: string = "";


  constructor(
    private authService: AuthService,
    private router : Router,
    private route: ActivatedRoute,
    private mathDialog: MatDialog
  ) {
    this.token = this.route.snapshot.params['token'];
    this.userType = this.route.snapshot.params['userType'];
  }


  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = "Passwords não condizem";
      return;
    }


    this.authService.resetPassword(this.token, this.newPassword, this.userType).subscribe({
      next: (response) => {
        // abrir o dialog de sucesso
        let dialogRef = this.mathDialog.open(SuccessDialogComponent,{
          data: { message: 'Password alterada com sucesso' }
        });

        // voltar para o login quando o dialog fechar
        dialogRef.afterClosed().subscribe(() => {          
          switch(this.userType) {
            case "donor":
              this.router.navigate(['auth/login']);
              break;
            case "entity":
              this.router.navigate(['auth/login/entity']);
              break;
          }
        });
      },
      error: (err) => {
        console.log(err);
        this.error = "Erro ao repor a password";
      }
    });
  }
}
