import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpBackend } from '../../config/backend';

@Injectable({
  providedIn: 'root'
})
export class BeneficioService {

  url = httpBackend;
  constructor(private http: HttpClient) { }
  getBeneficios(unblock:boolean):Observable<any>{
    return this.http.get(this.url+'/api/beneficio',{params:{unblock}});
  }
  getBeneficio(id:string):Observable<any>{
    return this.http.get(this.url+'/api/beneficio/'+id);
  }
  postBeneficio(formData: FormData):Observable<any>{
    return this.http.post(this.url+'/api/beneficio', formData);
  }
  putBeneficio(formData: FormData, id:string):Observable<any>{
    return this.http.put(this.url+'/api/beneficio/'+id, formData);
  }
  putSelect(id:string, unblock:boolean):Observable<any>{
    return this.http.put(this.url+'/api/select/beneficio/'+id,{},{params:{select:unblock}});
  }
  putImagen(id:string, formdata:FormData):Observable<any>{
    return this.http.put(this.url+'/api/uploads/beneficio/'+id,formdata);
  }
  deleteBeneficio(id:string, unblock:boolean):Observable<any>{
    return this.http.delete(this.url+'/api/beneficio/'+id, {params:{unblock}});
  }
}
