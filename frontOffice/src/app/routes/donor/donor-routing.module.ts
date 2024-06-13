import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { DonorDashboardComponent } from '../../components/donor/dashboard/donorDashboard.component';
import { CreateDonationComponent } from '../../components/donor/create-donation/create-donation.component';

import { DonorAuthGuardService } from '../../services/guard/donor/donor-auth-guard.service';
import { CouponsComponent } from '../../components/coupons/coupons.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DonorDashboardComponent,
    title: 'Painel do Doador',
    canActivate: [DonorAuthGuardService],
  },
  {
    path: 'createDonation',
    component: CreateDonationComponent,
    title: 'Fazer Doação',
    canActivate: [DonorAuthGuardService],
  },
  {
    path: 'coupons',
    component: CouponsComponent,
    title: 'Cupões',
    canActivate: [DonorAuthGuardService],
  },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DonorRoutingModule { }
