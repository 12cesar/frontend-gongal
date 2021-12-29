import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpBackend } from '../../config/backend';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  url = httpBackend;
  constructor(private http: HttpClient) { }
  getUbicacion():Observable<any>{
    return this.http.get(this.url+'/api/ubicacion');
  }
  postBeneficio(formData:FormData):Observable<any>{
    return this.http.post(this.url+'/api/ubicacion',formData);
  }
  deleteUbicacion(id:string):Observable<any>{
    return this.http.delete(this.url+'/api/ubicacion/'+id);
  }
}
