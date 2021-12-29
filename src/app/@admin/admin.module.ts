import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'

import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { AdminComponent } from './admin.component';
import { AdminsharedModule } from '../@adminshared/adminshared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServicioComponent } from './servicio/servicio.component';
import { BeneficioComponent } from './beneficio/beneficio.component';
import { TecnologiaComponent } from './tecnologia/tecnologia.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SocialComponent } from './social/social.component';
import { PersonalComponent } from './personal/personal.component';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { MensajeComponent } from './mensaje/mensaje.component';
import { UbicacionComponent } from './ubicacion/ubicacion.component';



@NgModule({
  declarations: [
    DashboardComponent,
    UsuarioComponent,
    AdminComponent,
    ServicioComponent,
    BeneficioComponent,
    TecnologiaComponent,
    NosotrosComponent,
    SocialComponent,
    PersonalComponent,
    BienvenidoComponent,
    MensajeComponent,
    UbicacionComponent,
  ],
  exports:[
    DashboardComponent,
    UsuarioComponent,
    AdminComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminsharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularEditorModule
  ]
})
export class AdminModule { }
