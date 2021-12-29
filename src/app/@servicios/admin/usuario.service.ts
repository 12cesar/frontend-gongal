import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpBackend } from '../../config/backend';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url = httpBackend;
  constructor(private http: HttpClient) { }

  getUsuarios(unblock:boolean):Observable<any>{
    return this.http.get(this.url+'/api/usuario',{params:{unblock}});
  }
  getUsuario(id:string):Observable<any>{
    return this.http.get(this.url+'/api/usuario/'+id);
  }
  getRoles():Observable<any>{
    return this.http.get(this.url+'/api/role');
  }
  postUsuario(formData: FormData):Observable<any>{
    return this.http.post(this.url+'/api/usuario', formData);
  }
  putUsuario(formData: FormData, id:string):Observable<any>{
    return this.http.put(this.url+'/api/usuario/'+id, formData);
  }
  putImagen(id:string, formdata:FormData):Observable<any>{
    return this.http.put(this.url+'/api/uploads/usuarios/'+id,formdata);
  }
  deleteUsuario(id:string, unblock:boolean):Observable<any>{
    return this.http.delete(this.url+'/api/usuario/'+id, {params:{unblock}});
  }
}
