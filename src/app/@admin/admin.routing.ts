import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { AuthGuard } from '../guard/auth.guard';
import { ServicioComponent } from './servicio/servicio.component';
import { TecnologiaComponent } from './tecnologia/tecnologia.component';
import { BeneficioComponent } from './beneficio/beneficio.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { SocialComponent } from './social/social.component';
import { PersonalComponent } from './personal/personal.component';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { MensajeComponent } from './mensaje/mensaje.component';
import { UbicacionComponent } from './ubicacion/ubicacion.component';

const routes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            { path: '', component: DashboardComponent },
            { path: 'usuario', component: UsuarioComponent },
            { path: 'servicio', component: ServicioComponent },
            { path: 'beneficio', component: BeneficioComponent },
            { path: 'tecnologia', component: TecnologiaComponent },
            { path: 'nosotros', component: NosotrosComponent },
            { path: 'social', component: SocialComponent },
            { path: 'personal', component: PersonalComponent },
            { path: 'bienvenido', component: BienvenidoComponent },
            { path: 'mensaje', component: MensajeComponent },
            { path: 'ubicacion', component: UbicacionComponent },
        ],
        canActivateChild:[
            AuthGuard
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
export class AdminRoutingModule { }
