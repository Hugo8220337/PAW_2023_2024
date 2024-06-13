import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

const endpoint = `${environment.api}/donations`
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DonationsService {

  constructor(private http: HttpClient) { }

  getDonationsFromUser(userId: String): Observable<any> {
    return this.http.get<any>(
      `${endpoint}/donor/${userId}`, httpOptions
    )
  }

  getDonationFromEntity(entityId: String): Observable<any> {
    return this.http.get<any>(
      `${endpoint}/entity/${entityId}`, httpOptions
    )
  }

  updateDonationStatus(donationId: String, status: String) : Observable<any> {
    return this.http.patch<any>(
      `${endpoint}/status/${donationId}`,
      { "status": status },
      httpOptions
    )
  }
}
