import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VistaRolesComponent } from './componentes/roles/vista-roles/vista-roles.component';
import { RegistroComponent } from './componentes/empleado/registro/registro.component';
import { VisualizarEmpleadosComponent } from './componentes/empleado/visualizar-empleados/visualizar-empleados.component';

const routes: Routes = [
  { path: '', redirectTo: '/roles', pathMatch: 'full'},
  { path: 'roles', component: VistaRolesComponent},
  { path: 'registrarEmpleado', component: RegistroComponent},
  { path: 'verEmpleados', component: VisualizarEmpleadosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
