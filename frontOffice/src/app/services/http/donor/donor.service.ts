import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

// models
import { User } from '../../../models/user.model';

const endpoint = `${environment.api}/donors`
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
const httpImageOptions = {
  headers: new HttpHeaders({
    'Accept': 'image/jpeg',
  })
};

@Injectable({
  providedIn: 'root'
})
export class DonorService {

  constructor(private http: HttpClient) { }

  getUserData(userId: String): Observable<any> {
    return this.http.get<any>(
      `${endpoint}/${userId}`, httpOptions
    )
  }

  getUserProfilePicture(userId: String): Observable<any> {
    return this.http.get(`${endpoint}/image/${userId}`, { responseType: 'blob' });
  }

  removeProfilePicture(userId: String): Observable<any> {
    return this.http.delete(
      `${endpoint}/image/${userId}`,
      httpOptions
    )
  }

  updateUserInfo(user: User): Observable<any> {

    // Dados do formulário
    const formData: any = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('phoneNumber', user.phoneNumber);
    formData.append('address', user.address);
    formData.append('country', user.country);
    formData.append('dateOfBirthday', user.dateOfBirthday);
    formData.append('profileImage', user.profileImage);

    return this.http.put<any>(
      `${endpoint}/${user._id}`,
      formData
    )
  }
}
