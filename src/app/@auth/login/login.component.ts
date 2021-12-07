import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResultLogin } from 'src/app/interface/login.interface';
import { AuthserviceService } from '../../@servicios/auth/authservice.service';
import { loadData, closeAlert } from '../../function/cargando';
import { ToastSuccess } from '../../function/validarpost';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  cargar:boolean=true;
  constructor(private authService: AuthserviceService, private fb: FormBuilder, private router:Router) {
    this.loginForm = this.fb.group({
      usuario:['', Validators.required],
      password:['', Validators.required]
    })
  }

  ngOnInit(): void {
  }
  crearToken(){
    if (this.cargar) {
      loadData('Validando datos','Porfavor espere');
    }
    const data = new FormData();
    data.append('usuario', this.loginForm.get('usuario')?.value);
    data.append('password', this.loginForm.get('password')?.value);
    this.authService.crearToken(data).subscribe(
      (data:ResultLogin)=>{
        if (data.ok===true && data.user.rol=== 'ADMIN_ROLE') {
          if (this.cargar) {
            closeAlert();
          }
          this.cargar=false;
          ToastSuccess('success', data.msg)
          localStorage.setItem('x-token', data.token);  
          localStorage.setItem('usuario', data.user.name);  
          this.router.navigate(['/admin'])
        }  
        else{
          ToastSuccess('error', data.msg);
        }
      },
      (error)=>{
        console.log(error);
        
      }
    )
  }
}
