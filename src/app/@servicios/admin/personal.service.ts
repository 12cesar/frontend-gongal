import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpBackend } from '../../config/backend';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  url = httpBackend;
  constructor(private http: HttpClient) { }
  getPersonal():Observable<any>{
    return this.http.get(this.url+'/api/personal');
  }
  putPersonal(formdata:FormData, id:string):Observable<any>{
    return this.http.put(this.url+'/api/personal/'+id, formdata);
  }
  putImagen(formdata:FormData,id:string,tipo:string):Observable<any>{
    return this.http.put(this.url+`/api/uploadspersonal/${tipo}/${id}`, formdata)
  }
}
