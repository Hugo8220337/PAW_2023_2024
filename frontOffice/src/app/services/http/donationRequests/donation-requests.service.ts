import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// models
import { DonationRequest } from '../../../models/donationRequest.model';

const endpoint = `${environment.api}/donationRequests`
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DonationRequestsService {

  constructor(private http: HttpClient) { }

  getDonationRequestsFromUser(userId: String): Observable<any> {
    return this.http.get<any>(
      `${endpoint}/donor/${userId}`, httpOptions
    )
  }

  getDonationRequestsFromEntity(entityId: String): Observable<any> {
    return this.http.get<any>(
      `${endpoint}/entity/${entityId}`, httpOptions
    )
  }

  addDonationRequest(donationRequest: Object): Observable<DonationRequest> { // TODO este Object é pragramar à trolha, acho melhor mudar o model e a maneira como os dados são mandados na API
    return this.http.post<DonationRequest>(
      `${endpoint}`,
      donationRequest, 
      httpOptions
      )
  }

  updateDonationRequestStatus(donationRequestId: String, status: String) : Observable<DonationRequest> {
    return this.http.patch<DonationRequest>(
      `${endpoint}/status/${donationRequestId}`,
      { "status": status },
      httpOptions
    )
  }
}
