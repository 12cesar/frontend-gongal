import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'

import { HomeComponent } from './home/home.component';
import { PublicComponent } from './public.component';
import { PublicsharedModule } from '../@publicshared/publicshared.module';



@NgModule({
  declarations: [
    HomeComponent,
    PublicComponent,
  ],
  exports:[
    HomeComponent,
    PublicComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    PublicsharedModule
  ]
})
export class PublicModule { }
