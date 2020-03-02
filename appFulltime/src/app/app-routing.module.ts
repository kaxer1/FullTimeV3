import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VistaRolesComponent } from './componentes/roles/vista-roles/vista-roles.component';
import { RegistroComponent } from './componentes/empleado/registro/registro.component';
import { ListaEmpleadosComponent } from './componentes/empleado/lista-empleados/lista-empleados.component';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { TitulosComponent } from './componentes/catalogos/titulos/titulos.component';
import { DiscapacidadComponent } from './componentes/empleado/discapacidad/discapacidad.component';
import { VerEmpleadoComponent } from './componentes/empleado/ver-empleado/ver-empleado.component';
import {SeleccionarRolPermisoComponent} from './componentes/roles/seleccionar-rol-permiso/seleccionar-rol-permiso.component'
import { RegistroRolComponent } from './componentes/roles/registro-rol/registro-rol.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'roles', component: VistaRolesComponent},
  { path: 'login', component: LoginComponent},
  { path: 'registrarEmpleado', component: RegistroComponent},
  { path: 'empleado', component: ListaEmpleadosComponent},
  { path: 'home', component: HomeComponent},
  { path: 'titulos', component: TitulosComponent},
  { path: 'discapacidad', component: DiscapacidadComponent},
  { path: 'verEmpleado/:id', component: VerEmpleadoComponent},
  { path: 'registrarRol', component: RegistroRolComponent},
  { path: 'seleccionarPermisos/:id', component: SeleccionarRolPermisoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
