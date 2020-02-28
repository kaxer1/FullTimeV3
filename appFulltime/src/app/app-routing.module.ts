import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VistaRolesComponent } from './componentes/roles/vista-roles/vista-roles.component';
import { RegistroComponent } from './componentes/empleado/registro/registro.component';
import { ListaEmpleadosComponent } from './componentes/empleado/lista-empleados/lista-empleados.component';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'roles', component: VistaRolesComponent},
  { path: 'login', component: LoginComponent},
  { path: 'registrarEmpleado', component: RegistroComponent},
  { path: 'empleado', component: ListaEmpleadosComponent},
  { path: 'home', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
