import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

// models
import { Entity } from '../../../models/entity.model';

const endpoint = `${environment.api}/entities`
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor(private http: HttpClient) { }

  getaEntitiesData(): Observable<any> {
    let params = new HttpParams()
      .set('fieldName', "isActive")
      .set('name', true);

    return this.http.get<any>(
      `${endpoint}/filter`,
      { params: params, ...httpOptions }
    )
  }

  getEntityData(entityId: string): Observable<any> {
    return this.http.get<any>(`${endpoint}/${entityId}`, httpOptions);
  }

  updateEntityInfo(entity: Entity): Observable<any> {
    return this.http.put<any>(`${endpoint}/${entity._id}`, entity, httpOptions);
  }

}
