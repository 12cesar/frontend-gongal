import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpBackend } from '../../config/backend';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  url = httpBackend;
  constructor(private http: HttpClient) { }
  getSocials(unblock:boolean):Observable<any>{
    return this.http.get(this.url+'/api/social',{params:{unblock}});
  }
  getSocial(id:string):Observable<any>{
    return this.http.get(this.url+'/api/social/'+id);
  }
  postSocial(formData: FormData):Observable<any>{
    return this.http.post(this.url+'/api/social', formData);
  }
  putSocial(formData: FormData, id:string):Observable<any>{
    return this.http.put(this.url+'/api/social/'+id, formData);
  }
  putImagen(id:string, formdata:FormData):Observable<any>{
    return this.http.put(this.url+'/api/uploads/social/'+id,formdata);
  }
  deleteSocial(id:string, unblock:boolean):Observable<any>{
    return this.http.delete(this.url+'/api/social/'+id, {params:{unblock}});
  }
}
