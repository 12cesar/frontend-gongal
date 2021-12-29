import { Component, OnInit } from '@angular/core';
import { PersonalService } from 'src/app/@servicios/admin/personal.service';
import { SocialService } from 'src/app/@servicios/admin/social.service';
import { UbicacionService } from 'src/app/@servicios/admin/ubicacion.service';
import { closeAlert } from 'src/app/function/cargando';
import { ResultLugar } from 'src/app/interface/lugar.interface';
import { Personal, ResultPersonal } from 'src/app/interface/personal.interface';
import { ResultSocial, Social } from 'src/app/interface/social.interface';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  cargar?: boolean = true;
  listPersonal: Personal[] = [];
  address: string = '';
  listSocial:Social[]=[];
  imgdefault :string= 'https://res.cloudinary.com/dertftoym/image/upload/v1640663378/settings_ipl9tf.png'
  constructor(
    private personalService: PersonalService,
    private ubicacionService: UbicacionService,
    private socialService:SocialService
  ) {}

  ngOnInit(): void {
    this.getubicacion();
    this.getPersonal();
    this.getSocial();
  }
  getubicacion() {
    this.ubicacionService.getUbicacion().subscribe(
      (data: ResultLugar) => {
        this.address = data.ubicacion[0].address;
        if (this.cargar) {
          closeAlert();
        }
        this.cargar = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getPersonal() {
    this.personalService.getPersonal().subscribe(
      (data: ResultPersonal) => {
        this.listPersonal = data.personal;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getSocial(){
    this.socialService.getSocials(true).subscribe(
      (data:ResultSocial)=>{
        this.listSocial = data.social;
      },
      (error)=>{
        console.log(error);
        
      }
    )
  }
}
