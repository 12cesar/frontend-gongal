import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PublicComponent } from './public.component';
import { HomeComponent } from './home/home.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ContactoComponent } from './contacto/contacto.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { TecnologiaComponent } from './tecnologia/tecnologia.component';
import { BeneficiosComponent } from './beneficios/beneficios.component';


const routes: Routes = [
    {
        path: '',
        component: PublicComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'nosotros', component: NosotrosComponent },
            { path: 'contacto', component: ContactoComponent },
            { path: 'servicios', component: ServiciosComponent },
            { path: 'tecnologia', component: TecnologiaComponent },
            { path: 'beneficio', component: BeneficiosComponent },
            { path: 'home', redirectTo:'', pathMatch:'full'}
        ]
    },
    //{ path: 'path/:routeParam', component: MyComponent },
    //{ path: 'staticPath', component: ... },
    //{ path: '**', component: ... },
    //{ path: 'oldPath', redirectTo: '/staticPath' },
    //{ path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PublicRoutingModule { }
