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
import { SeleccionarRolPermisoComponent} from './componentes/roles/seleccionar-rol-permiso/seleccionar-rol-permiso.component'
import { RegistroRolComponent } from './componentes/roles/registro-rol/registro-rol.component';
import { RegimenComponent} from './componentes/catalogos/regimen/regimen.component';
import { TipoComidasComponent} from './componentes/catalogos/tipo-comidas/tipo-comidas.component';
import { RelojesComponent} from './componentes/catalogos/relojes/relojes.component'
import { PrincipalProcesoComponent } from './componentes/catalogos/cg_proceso/principal-proceso/principal-proceso.component';
import { RegistroProcesoComponent } from './componentes/catalogos/cg_proceso/registro-proceso/registro-proceso.component';
import { PrincipalProvinciaComponent } from './componentes/catalogos/cg_provincia/principal-provincia/principal-provincia.component';
import { PrincipalDepartamentoComponent } from './componentes/catalogos/cg_departamento/principal-departamento/principal-departamento.component';
import { PrincipalHorarioComponent } from './componentes/catalogos/cg_horario/principal-horario/principal-horario.component';
import { RegistroHorarioComponent } from './componentes/catalogos/cg_horario/registro-horario/registro-horario.component';
import { HorasExtrasComponent } from './componentes/catalogos/horas-extras/horas-extras.component';
import { NotificacionesComponent } from './componentes/catalogos/notificaciones/notificaciones.component';
import { TipoPermisosComponent } from './componentes/catalogos/tipo-permisos/tipo-permisos.component';
import { RegistrarFeriadosComponent } from './componentes/catalogos/catFeriados/registrar-feriados/registrar-feriados.component';
import { ListarFeriadosComponent } from './componentes/catalogos/catFeriados/listar-feriados/listar-feriados.component';
import { RegistroDepartamentoComponent } from './componentes/catalogos/cg_departamento/registro-departamento/registro-departamento.component';
import { PrincipalEnroladosComponent } from './componentes/catalogos/cg_enrolados/principal-enrolados/principal-enrolados.component';

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
  { path: 'seleccionarPermisos/:id', component: SeleccionarRolPermisoComponent},
  { path: 'regimenLaboral', component: RegimenComponent},
  { path: 'tipoComidas', component: TipoComidasComponent},
  { path: 'relojes', component: RelojesComponent},
  { path: 'proceso', component: PrincipalProcesoComponent},
  { path: 'registrarProceso', component: RegistroProcesoComponent },
  { path: 'provincia', component: PrincipalProvinciaComponent},
  { path: 'departamento', component: PrincipalDepartamentoComponent},
  { path: 'registrarDepartamento', component: RegistroDepartamentoComponent},
  { path: 'horario', component: PrincipalHorarioComponent},
  { path: 'registrarHorario', component:RegistroHorarioComponent},
  { path: 'horasExtras', component: HorasExtrasComponent},
  { path: 'notificaciones', component: NotificacionesComponent},
  { path: 'tipoPermisos', component: TipoPermisosComponent},
  { path: 'feriados', component: RegistrarFeriadosComponent},
  { path: 'listarFeriados', component: ListarFeriadosComponent},
  { path: 'modificarDepartamento/:id', component:RegistroDepartamentoComponent},
  { path: 'enrolados', component:PrincipalEnroladosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
