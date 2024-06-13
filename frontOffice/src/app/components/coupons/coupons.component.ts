import { Component, OnInit } from '@angular/core';
import { CryptLocalStorage } from '../../services/CryptLocalStorage';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Services
import { DonorService } from '../../services/http/donor/donor.service';
import { CouponService } from '../../services/http/coupon/coupon.service';
import { StoreService } from '../../services/http/store/store.service';


// Models
import { User } from '../../models/user.model';
import { Store } from '../../models/store.model';


//Para Abrir uma model com o aviso 
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../partials/success-dialog/success-dialog.component';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.css'
})
export class CouponsComponent implements OnInit {
  private userId = CryptLocalStorage.getItem('userId');

  user = {} as User;
  // stores = {} as Store;
  stores: Store[] = []; // Lista de lojas
  error: string = "";


  constructor(
    private userService: DonorService,
    private couponService: CouponService,
    private storeService: StoreService,
    private mathDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUserData();
    this.getStores();
  }

  getUserData(): void {
    if (this.userId) {
      this.userService.getUserData(this.userId).subscribe({
        next: (value) => {
          this.user = value;
        },
        error: (err) => {
          this.error = "Erro ao procurar pelo os dados do utilizador";
        }
      });
    } else {
      this.error = "Não foi encontrado o ID de utilizador"
    }
  }

  getStores(): void {
    this.storeService.getStores().subscribe({
      next: (stores) => {
        this.stores = stores;
      },
      error: (err) => {
        this.error = "Erro ao carregar as lojas";
      }
    });
  }


  generateToken(storeId: String): void {
    if (this.userId && storeId && this.user.points !== undefined && +this.user.points >= 100) {
      this.couponService.generateCoupon(this.userId, storeId, +this.user.points).subscribe({
        next: (response) => {
          // abrir o dialog de sucesso
          this.mathDialog.open(SuccessDialogComponent,{
            data: { message: 'O cupão foi gerado com sucesso e enviado para o seu e-mail.' }
          });
        },
        error: (err) => {
          console.error('Erro ao gerar cupom:', err);
        }
      });
    } else {
      this.error = "Pontos insuficientes para resgatar este cupom, é necessário 100 pontos.";
    }
  }
}
