import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpBackend } from '../../config/backend';

@Injectable({
  providedIn: 'root'
})
export class MailboxService {

  url = httpBackend;
  constructor(private http: HttpClient) { }
  getMensajes(unblock:boolean):Observable<any>{
    return this.http.get(this.url+'/api/mensaje',{params:{unblock}});
  }
  getMensaje(id:string):Observable<any>{
    return this.http.get(this.url+'/api/mensaje/'+id);
  }
  putMensaje(unblock:boolean, id:string):Observable<any>{
    return this.http.put(this.url+'/api/mensaje/'+id, {unblock});
  }
  deleteMensaje(id:string):Observable<any>{
    return this.http.delete(this.url+'/api/mensaje/'+id);
  }
}
