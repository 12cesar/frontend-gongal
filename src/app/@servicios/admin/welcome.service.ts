import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpBackend } from '../../config/backend';

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {

  url = httpBackend;
  constructor(private http: HttpClient) { }
  getWelcome():Observable<any>{
    return this.http.get(this.url+'/api/welcome');
  }
  putWelcome(formdata:FormData, id:string):Observable<any>{
    return this.http.put(this.url+'/api/welcome/'+id, formdata);
  }
  putImagen(formdata:FormData,id:string,tipo:string):Observable<any>{
    return this.http.put(this.url+`/api/uploads/${tipo}/${id}`, formdata);
  }
}
