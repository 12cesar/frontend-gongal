import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NopagefoundComponent } from './@nopagefound/nopagefound/nopagefound.component';
import { AdminRoutingModule } from './@admin/admin.routing';
import { PublicRoutingModule } from './@public/public.routing';

const routes: Routes=[
  {path:'**', component:NopagefoundComponent},
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule,
    PublicRoutingModule,
    AdminRoutingModule
  ]
})
export class AppRoutingModule { }
