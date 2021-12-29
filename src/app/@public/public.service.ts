import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpBackend } from '../config/backend';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  url = httpBackend;
  constructor(private http: HttpClient) { }

  getHeader():Observable<any>{
    return this.http.get(this.url+'/api/personal');
  }
}
