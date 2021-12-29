import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from 'src/app/@servicios/auth/authservice.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  nombre:string='';
  constructor(private loginService:AuthserviceService) { }

  ngOnInit(): void {
    this.mostrarUsuario();
  }
  mostrarUsuario(){
    this.nombre = `${this.loginService.getNombre()}`;
    
  }
}
