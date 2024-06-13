import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

// models
import { Entity } from '../../../models/entity.model';
import { User } from '../../../models/user.model';

const endpoint = `${environment.api}/login`
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private host = 'http://localhost:4200';

  constructor(private http: HttpClient) { }

  donorLogin(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${endpoint}/donor`,
      {email, password},
      httpOptions
    )
  };

  entityLogin(email: String, password: String): Observable<any> {
    return this.http.post<any>(
      `${endpoint}/entity`,
      {email, password},
      httpOptions
    )
  }


  registerEntity(entity: Entity): Observable<any> {
    return this.http.post<any>(`${endpoint}/registerEntity`, entity);
  }


  registerDonor(user:User): Observable<any> {
    // Dados do formulário
    const formData: any = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('phoneNumber', user.phoneNumber);
    formData.append('address', user.address);
    formData.append('country', user.country);
    formData.append('dateOfBirthday', user.dateOfBirthday);
    formData.append('profileImage', user.profileImage);
    
    return this.http.post<any>(`${endpoint}/registerDonor`, formData);
  }

  forgotPassword(email: String, userType: String): Observable<any> {
    return this.http.post(`${endpoint}/forgotPassword`, {host: this.host, email: email, userType: userType}, httpOptions);
  }

  resetPassword(token: String, newPassword: String, userType: String): Observable<any> {
    return this.http.post(`${endpoint}/resetPassword/${token}`, {password: newPassword, userType: userType}, httpOptions);
  }


  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
  }
}
