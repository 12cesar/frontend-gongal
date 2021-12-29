import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { SocialService } from '../@servicios/admin/social.service';
import { ResultPersonal } from '../interface/personal.interface';
import { ResultSocial, Social } from '../interface/social.interface';
import { PublicService } from './public.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})
export class PublicComponent implements OnInit {
  page:string='Dashboard';
  imgPri:string='';
  imgSec:string='';
  listSocial:Social[]=[];
  constructor(private headerService:PublicService, private router:Router, private socialService:SocialService) { 
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
          // Show loading indicator
           const url= event.url;
           if (url === '/home') {
            this.headerService.getHeader().subscribe(
              (data:ResultPersonal)=>{
                this.imgPri = data.personal[0].imgpri; 
                this.imgSec = '';
                 
              },
              (error)=>{
                console.log(error);
                
              }
            )
             
           }else{
            this.headerService.getHeader().subscribe(
              (data:ResultPersonal)=>{
                this.imgSec = data.personal[0].imgcontact;
                 this.imgPri = '';
              },
              (error)=>{
                console.log(error);
                
              }
            )
                      
           }
           
      }

      if (event instanceof NavigationEnd) {
          // Hide loading indicator
      }

      if (event instanceof NavigationError) {
          // Hide loading indicator

          // Present error to user
          console.log(event.error);
      }
  });
  }
  
  ngOnInit(): void {
    this.mostrarImagen();
  }
  mostrarImagen(){
    this.headerService.getHeader().subscribe(
      (data:ResultPersonal)=>{
        this.imgPri = data.personal[0].imgpri;
         
      },
      (error)=>{
        console.log(error);
        
      }
    )
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
