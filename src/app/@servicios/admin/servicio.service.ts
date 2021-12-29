import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpBackend } from '../../config/backend';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  url = httpBackend;
  constructor(private http: HttpClient) { }
  getServicios(unblock:boolean):Observable<any>{
    return this.http.get(this.url+'/api/servicio',{params:{unblock}});
  }
  getServicio(id:string):Observable<any>{
    return this.http.get(this.url+'/api/servicio/'+id);
  }
  postServicio(formData: FormData):Observable<any>{
    return this.http.post(this.url+'/api/servicio', formData);
  }
  putServicio(formData: FormData, id:string):Observable<any>{
    return this.http.put(this.url+'/api/servicio/'+id, formData);
  }
  putSelect(id:string, unblock:boolean):Observable<any>{
    return this.http.put(this.url+'/api/select/servicio/'+id,{},{params:{select:unblock}});
  }
  putImagen(id:string, formdata:FormData, tipo:string):Observable<any>{
    return this.http.put(this.url+`/api/uploadservicio/${tipo}/${id}`,formdata);
  }
  deleteServicio(id:string, unblock:boolean):Observable<any>{
    return this.http.delete(this.url+'/api/servicio/'+id, {params:{unblock}});
  }
}
