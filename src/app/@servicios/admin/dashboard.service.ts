import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpBackend } from '../../config/backend';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  url = httpBackend;
  constructor(private http: HttpClient) { }

  getTotal(tipo:string):Observable<any>{
    return this.http.get(this.url+'/api/total/'+tipo);
  }
}
