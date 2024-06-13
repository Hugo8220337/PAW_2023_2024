import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

const endpoint = `${environment.api}/statistics`
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) { }

  getNumbers(): Observable<any> {
    return this.http.get<any>(
      `${endpoint}/numbers`,
      httpOptions
    )
  }
}
