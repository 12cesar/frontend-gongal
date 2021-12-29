import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpBackend } from '../../config/backend';
import { Observable } from 'rxjs';
import { Mensaje } from '../../interface/message.interface';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  url = httpBackend;
  constructor(private http: HttpClient) { }

  postMessage(data:Mensaje):Observable<any>{
    return this.http.post(this.url+'/api/mensaje',data);
  }
}
