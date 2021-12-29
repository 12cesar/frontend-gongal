import { Component, OnInit } from '@angular/core';
import { PersonalService } from 'src/app/@servicios/admin/personal.service';
import { loadData, closeAlert } from 'src/app/function/cargando';
import { ResultPersonal } from 'src/app/interface/personal.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  logo:string='';
  cargar?: boolean = true;
  constructor(private personalService: PersonalService) { 
    if (this.cargar) {
      loadData('Cargando', 'Espere mientras carga la informacion')
    }
    this.personalService.getPersonal().subscribe(
      (data: ResultPersonal) => {
        this.logo = data.personal[0].logo;
        if (this.cargar) {
          closeAlert();
        }
        this.cargar = false;
        
      },
      (error) => {
        console.log(error);
  
      }
    )
  }

  ngOnInit(): void {
  }


  showMenu() {
    const navLinks = document.getElementById("navLinks");
    navLinks!.style.right = "0";
  }
  hideMenu() {
    const navLinks = document.getElementById("navLinks");
    navLinks!.style.right = "-200px";
  }
  getPersonal(){
    
  }
}
