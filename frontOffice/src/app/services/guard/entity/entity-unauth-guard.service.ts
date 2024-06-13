import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CryptLocalStorage } from '../../../services/CryptLocalStorage';

@Injectable({
  providedIn: 'root'
})
export class EntityUnauthGuardService {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (!CryptLocalStorage.getItem('token')) {
      return true;
    }

    // redireciona o utilizador para a rota original
    this.router.navigate(['/entity/dashboard'], {
      queryParams: { returnUrl: state.url },
    });
    
    return false;
  }
}
