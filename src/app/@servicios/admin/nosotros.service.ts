import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpBackend } from '../../config/backend';

@Injectable({
  providedIn: 'root'
})
export class NosotrosService {

  url = httpBackend;
  constructor(private http: HttpClient) { }
  getNosotros(unblock:boolean):Observable<any>{
    return this.http.get(this.url+'/api/nosotros',{params:{unblock}});
  }
  getNosotro(id:string):Observable<any>{
    return this.http.get(this.url+'/api/nosotros/'+id);
  }
  postNosotro(formData: FormData):Observable<any>{
    return this.http.post(this.url+'/api/nosotros', formData);
  }
  putNosotro(formData: FormData, id:string):Observable<any>{
    return this.http.put(this.url+'/api/nosotros/'+id, formData);
  }
  putSelect(id:string, unblock:boolean):Observable<any>{
    return this.http.put(this.url+'/api/select/nosotros/'+id,{},{params:{select:unblock}});
  }
  deleteNosotro(id:string, unblock:boolean):Observable<any>{
    return this.http.delete(this.url+'/api/nosotros/'+id, {params:{unblock}});
  }
  putImagen(id:string, formdata:FormData):Observable<any>{
    return this.http.put(this.url+'/api/uploads/nosotros/'+id,formdata);
  }
}
