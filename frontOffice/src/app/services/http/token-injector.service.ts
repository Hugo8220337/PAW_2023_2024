import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CryptLocalStorage } from '../../services/CryptLocalStorage';

export function tokenInjector(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
 
  // Coloca o token no header do pedido, se este existir
  let token = CryptLocalStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: {
        'x-access-token': `${token}`,
      },
    });
  }
  return next(req);
}