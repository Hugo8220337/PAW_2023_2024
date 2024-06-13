import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

// models
import { Condition } from '../../../models/conditions.model';

const endpoint = `${environment.api}/conditions`
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ConditionService {

  constructor(private http: HttpClient) { }

  getConditions(): Observable<any> {
    return this.http.get<any>(`${endpoint}/list`, httpOptions);
  }

  getConditionById(conditionId: String): Observable<any> {
    return this.http.get<any>(`${endpoint}/${conditionId}`, httpOptions);
  }
}
