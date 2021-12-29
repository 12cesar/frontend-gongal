import { Injectable } from '@angular/core';
import { httpBackend } from '../../config/backend';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  url = httpBackend;
  constructor(private http: HttpClient) { }

  getGeneral(coleccion:string):Observable<any>{
    return this.http.get(this.url+'/api/general/'+coleccion);
  }
}
