import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

import { Store } from '../../../models/store.model'; // Importa o modelo

const endpoint = `${environment.api}/stores`
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http: HttpClient) { }

  // getStoreById(storeId: string): Observable<any> {
  //   return this.http.get<any>(`${endpoint}/${storeId}`, httpOptions);
  // }
  getStoreById(storeId: string): Observable<Store> {
    return this.http.get<Store>(`${endpoint}/${storeId}`, httpOptions);
  }

  // Adiciona o método para buscar todas as lojas
  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(`${endpoint}/list`, httpOptions);
  }
}
