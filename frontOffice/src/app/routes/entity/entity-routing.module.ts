import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntityDashboardComponent } from '../../components/entity/dashboard/entity-dashboard.component';
import { EntityAuthGuardService } from '../../services/guard/entity/entity-auth-guard.service';

const routes: Routes = [
  {
    path: 'dashboard',
    component: EntityDashboardComponent,
    title: 'Painel da Entidade',
    canActivate: [EntityAuthGuardService]
  },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityRoutingModule { }
