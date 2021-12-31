import { Component, OnInit } from '@angular/core';
import { PersonalService } from 'src/app/@servicios/admin/personal.service';
import { GeneralService } from 'src/app/@servicios/public/general.service';
import { closeAlert, loadData } from 'src/app/function/cargando';
import { General, ResultGeneral } from 'src/app/interface/general.interface';
import { ResultPersonal } from 'src/app/interface/personal.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  listServicio:General[]=[];
  listTecnologia:General[]=[];
  listBeneficio:General[]=[];
  listNosotros: General[]=[];
  cargar?: boolean = true;
  imgdefault:string = 'https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg';
  constructor(private generalService: GeneralService) { }

  ngOnInit(): void {
    this.mostrarGeneral();
  }
  mostrarGeneral(){
    if (this.cargar) {
      loadData('Cargando', 'Espere mientras carga la informacion')
    }
    this.generalService.getGeneral('servicio').subscribe(
      (data:ResultGeneral)=>{
        this.listServicio = data.modelo
      },
      (error)=>{
        console.log(error);
      }
    )
    this.generalService.getGeneral('tecnologia').subscribe(
      (data:ResultGeneral)=>{
        this.listTecnologia = data.modelo
      },
      (error)=>{
        console.log(error);
      }
    )
    this.generalService.getGeneral('beneficio').subscribe(
      (data:ResultGeneral)=>{
        this.listBeneficio = data.modelo
      },
      (error)=>{
        console.log(error);
      }
    )
    this.generalService.getGeneral('nosotros').subscribe(
      (data:ResultGeneral)=>{
        this.listNosotros = data.modelo;
        if (this.cargar) {
          closeAlert();
        }
        this.cargar = false;
      },
      (error)=>{
        console.log(error);
        
      }
    )
    
  }
}
