import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

const endpoint = `${environment.api}/coupons/generate`
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(private http: HttpClient) { }

  /**
   * Função para chamar o método 'generate' da API para gerar um cupom
   * @param userId 
   * @param storeId 
   * @param pointsGiven 
   * @returns 
   */
  generateCoupon(userId: string, storeId: String, pointsGiven: number): Observable<any> {
    const body = { userId, storeId, pointsGiven };
    return this.http.post<any>(endpoint, body, httpOptions);
  }
}
