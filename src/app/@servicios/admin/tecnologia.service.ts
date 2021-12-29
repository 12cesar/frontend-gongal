import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpBackend } from '../../config/backend';

@Injectable({
  providedIn: 'root'
})
export class TecnologiaService {

  url = httpBackend;
  constructor(private http: HttpClient) { }
  getTecnologias(unblock:boolean):Observable<any>{
    return this.http.get(this.url+'/api/tecnologia',{params:{unblock}});
  }
  getTecnologia(id:string):Observable<any>{
    return this.http.get(this.url+'/api/tecnologia/'+id);
  }
  postTecnologia(formData: FormData):Observable<any>{
    return this.http.post(this.url+'/api/tecnologia', formData);
  }
  putSTecnologia(formData: FormData, id:string):Observable<any>{
    return this.http.put(this.url+'/api/tecnologia/'+id, formData);
  }
  putSelect(id:string, unblock:boolean):Observable<any>{
    return this.http.put(this.url+'/api/select/tecnologia/'+id,{},{params:{select:unblock}});
  }
  putImagen(id:string, formdata:FormData):Observable<any>{
    return this.http.put(this.url+'/api/uploads/tecnologia/'+id,formdata);
  }
  deleteTecnologia(id:string, unblock:boolean):Observable<any>{
    return this.http.delete(this.url+'/api/tecnologia/'+id, {params:{unblock}});
  }
}
