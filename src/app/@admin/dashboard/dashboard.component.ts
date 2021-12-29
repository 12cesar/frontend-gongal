import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/@servicios/admin/dashboard.service';
import { closeAlert, loadData } from 'src/app/function/cargando';
import { resultTotal } from 'src/app/interface/total.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  totalMensaje:Number=0;
  totalTecnologia:Number=0;
  totalServicio:Number=0;
  totalBeneficio:Number=0;
  cargar?: boolean = true;
  constructor(private dashboardService:DashboardService) { }

  ngOnInit(): void {
    this.mostrarMensaje();
  }
  mostrarMensaje(){
    if (this.cargar) {
      loadData('Cargando', 'Espere mientras carga la informacion')
    }
    this.dashboardService.getTotal('mensaje').subscribe(
      (data:resultTotal)=>{
        this.totalMensaje = data.count;
      }
    );
    this.dashboardService.getTotal('servicio').subscribe(
      (data:resultTotal)=>{
        this.totalServicio = data.count;
      }
    );
    this.dashboardService.getTotal('tecnologia').subscribe(
      (data:resultTotal)=>{
        this.totalTecnologia = data.count;
      }
    );
    this.dashboardService.getTotal('beneficio').subscribe(
      (data:resultTotal)=>{
        this.totalBeneficio = data.count;
        if (this.cargar) {
          closeAlert();
        }
        this.cargar = false;
      }
    )

  }
  /* mostrarServicio(){
    this.dashboardService.getTotal('servicio').subscribe(
      (data:resultTotal)=>{
        this.totalMensaje = data.count;
      }
    )
  }
  mostrarTecnologia(){
    this.dashboardService.getTotal('tecnologia').subscribe(
      (data:resultTotal)=>{
        this.totalMensaje = data.count;
      }
    )
  }
  mostrarBeneficio(){
    this.dashboardService.getTotal('beneficio').subscribe(
      (data:resultTotal)=>{
        this.totalMensaje = data.count;
      }
    )
  } */
}
