import { Component, OnInit } from '@angular/core';
import { ServicioService } from 'src/app/@servicios/admin/servicio.service';
import { ResultService, Servicio } from 'src/app/interface/servicio.interface';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {
  listServicio: Servicio[]=[];
  constructor(private serviceService:ServicioService) { }

  ngOnInit(): void {
    this.mostrarServicio();
  }
  mostrarServicio(){
    this.serviceService.getServicios(true).subscribe(
      (data:ResultService)=>{
        this.listServicio = data.servicio;
        
      },
      (error)=>{
        console.log(error);
        
      }
    )
  }
}
