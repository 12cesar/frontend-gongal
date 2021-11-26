import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'

import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { AdminComponent } from './admin.component';
import { AdminsharedModule } from '../@adminshared/adminshared.module';



@NgModule({
  declarations: [
    DashboardComponent,
    UsuarioComponent,
    AdminComponent,
  ],
  exports:[
    DashboardComponent,
    UsuarioComponent,
    AdminComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminsharedModule
  ]
})
export class AdminModule { }
