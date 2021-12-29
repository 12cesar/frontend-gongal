import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'

import { HomeComponent } from './home/home.component';
import { PublicComponent } from './public.component';
import { PublicsharedModule } from '../@publicshared/publicshared.module';
import { ServiciosComponent } from './servicios/servicios.component';
import { BeneficiosComponent } from './beneficios/beneficios.component';
import { TecnologiaComponent } from './tecnologia/tecnologia.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ContactoComponent } from './contacto/contacto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HomeComponent,
    PublicComponent,
    ServiciosComponent,
    BeneficiosComponent,
    TecnologiaComponent,
    NosotrosComponent,
    ContactoComponent,
  ],
  exports:[
    HomeComponent,
    PublicComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PublicsharedModule
  ]
})
export class PublicModule { }
