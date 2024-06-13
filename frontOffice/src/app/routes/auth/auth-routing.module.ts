import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// componentes
import { LoginComponent } from '../../components/auth/login/login.component';
import { ForgotPasswordComponent } from '../../components/auth/forgot-password/forgot-password.component';
import { RegisterDonorComponent } from '../../components/auth/register/register-donor/register-donor.component';
import { RegisterEntityComponent } from '../../components/auth/register/register-entity/register-entity.component';
import { PasswordRecoveryComponent } from '../../components/auth/password-recovery/password-recovery.component';
import { EntityUnauthGuardService } from '../../services/guard/entity/entity-unauth-guard.service';
import { DonorUnauthGuardService } from '../../services/guard/donor/donor-unauth-guard.service';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    data: { userType: 'donor' },
    canActivate: [DonorUnauthGuardService]
  },
  {
    path: 'login/entity',
    component: LoginComponent,
    title: 'Login',
    data: { userType: 'entity'},
    canActivate: [EntityUnauthGuardService]
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent,
    title: 'Forgot Password',
    data: { userType: 'donor' },
    canActivate: [DonorUnauthGuardService]
    
  },
  {
    path: 'forgotPassword/entity',
    component: ForgotPasswordComponent,
    title: 'Forgot Password',
    data: { userType: 'entity' },
    canActivate: [EntityUnauthGuardService]
    
  },
  {
    path: 'passwordRecovery/:userType/:token',
    component: PasswordRecoveryComponent,
    title: 'Recover Password',
  },
  {
    path: 'registerDonor',
    component: RegisterDonorComponent,
    title: 'Register',
    canActivate: [DonorUnauthGuardService]
  },
  {
    path: 'registerEntity',
    component: RegisterEntityComponent,
    title: 'Register',
    canActivate: [EntityUnauthGuardService]
  },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
