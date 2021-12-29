import { Component, OnInit } from '@angular/core';
import { NosotrosService } from 'src/app/@servicios/admin/nosotros.service';
import { Nosotro, ResultNosotros } from 'src/app/interface/nosotros.interface';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent implements OnInit {
  listNosotros: Nosotro[]=[];
  imgdefault:string = 'https://res.cloudinary.com/dertftoym/image/upload/v1638987062/no-image_tvywlm.jpg';
  constructor(private nosotrosService:NosotrosService) { }

  ngOnInit(): void {
    this.mostrarNosotros();
  }
  mostrarNosotros(){
    this.nosotrosService.getNosotros(true).subscribe(
      (data:ResultNosotros)=>{
        this.listNosotros = data.nosotros;
        
      },
      (error)=>{
        console.log(error);
        
      }
    )
  }
}
