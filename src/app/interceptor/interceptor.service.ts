import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthserviceService } from '../@servicios/auth/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private authService: AuthserviceService) { }

  intercept(req:HttpRequest<any>, next:HttpHandler):Observable<HttpEvent<any>>{
    const tokenizeReq = req.clone({
      setHeaders:{
        'x-token':`${this.authService.getToken()}`
      }
    });
    return next.handle(tokenizeReq);
  }
}
