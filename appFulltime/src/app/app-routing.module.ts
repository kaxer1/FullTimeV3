import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaRolesComponent } from './componentes/catalogos/catRoles/vista-roles/vista-roles.component';
import { RegistroComponent } from './componentes/empleado/registro/registro.component';
import { ListaEmpleadosComponent } from './componentes/empleado/lista-empleados/lista-empleados.component';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { VerEmpleadoComponent } from './componentes/empleado/ver-empleado/ver-empleado.component';
import { SeleccionarRolPermisoComponent } from './componentes/catalogos/catRoles/seleccionar-rol-permiso/seleccionar-rol-permiso.component'
import { ListarRegimenComponent } from './componentes/catalogos/catRegimen/listar-regimen/listar-regimen.component';
import { RegimenComponent } from './componentes/catalogos/catRegimen/regimen/regimen.component';
import { TipoComidasComponent } from './componentes/catalogos/catTipoComidas/tipo-comidas/tipo-comidas.component';
import { RelojesComponent } from './componentes/catalogos/catRelojes/relojes/relojes.component'
import { PrincipalProcesoComponent } from './componentes/catalogos/catProcesos/principal-proceso/principal-proceso.component';
import { RegistroProcesoComponent } from './componentes/catalogos/catProcesos/registro-proceso/registro-proceso.component';
import { PrincipalProvinciaComponent } from './componentes/catalogos/catProvincia/listar-provincia/principal-provincia.component';
import { PrincipalDepartamentoComponent } from './componentes/catalogos/catDepartamentos/listar-departamento/principal-departamento.component';
import { PrincipalHorarioComponent } from './componentes/catalogos/catHorario/principal-horario/principal-horario.component';
import { RegistroHorarioComponent } from './componentes/catalogos/catHorario/registro-horario/registro-horario.component';
import { HorasExtrasComponent } from './componentes/catalogos/catHorasExtras/horas-extras.component';
import { NotificacionesComponent } from './componentes/catalogos/catNotificaciones/notificaciones.component';
import { RegistrarFeriadosComponent } from './componentes/catalogos/catFeriados/registrar-feriados/registrar-feriados.component';
import { ListarFeriadosComponent } from './componentes/catalogos/catFeriados/listar-feriados/listar-feriados.component';
import { RegistroDepartamentoComponent } from './componentes/catalogos/catDepartamentos/registro-departamento/registro-departamento.component';
import { PrincipalEnroladosComponent } from './componentes/catalogos/catEnrolados/principal-enrolados/principal-enrolados.component';
import { TipoPermisosComponent } from './componentes/catalogos/catTipoPermisos/tipo-permisos/tipo-permisos.component';
import { ListarTipoComidasComponent } from './componentes/catalogos/catTipoComidas/listar-tipo-comidas/listar-tipo-comidas.component';
import { ListarRelojesComponent } from './componentes/catalogos/catRelojes/listar-relojes/listar-relojes.component';
import { ListarCiudadComponent } from './componentes/ciudades/listar-ciudad/listar-ciudad.component';
import { VistaElementosComponent } from './componentes/catalogos/catTipoPermisos/listarTipoPermisos/vista-elementos/vista-elementos.component';
import { EmplCargosComponent } from './componentes/empleadoCargos/empl-cargos/empl-cargos.component';
import { ListarTitulosComponent } from './componentes/catalogos/catTitulos/listar-titulos/listar-titulos.component';
import { ListarCiudadFeriadosComponent } from './componentes/catalogos/catFeriados/listar-ciudad-feriados/listar-ciudad-feriados.component';
import { ListaSucursalesComponent } from './componentes/sucursales/lista-sucursales/lista-sucursales.component';
import { RegistroEmpresaComponent } from './componentes/catalogos/catEmpresa/registro-empresa/registro-empresa.component';

import { AuthGuard } from "./guards/auth.guard";
import { RegistrarNivelTitulosComponent } from './componentes/nivelTitulos/registrar-nivel-titulos/registrar-nivel-titulos.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'roles', component: VistaRolesComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'registrarEmpleado', component: RegistroComponent, canActivate: [AuthGuard]},
  { path: 'empleado', component: ListaEmpleadosComponent, canActivate: [AuthGuard]},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'titulos', component: ListarTitulosComponent, canActivate: [AuthGuard]},
  { path: 'verEmpleado/:id', component: VerEmpleadoComponent, canActivate: [AuthGuard]},
  { path: 'seleccionarPermisos/:id', component: SeleccionarRolPermisoComponent, canActivate: [AuthGuard]},
  { path: 'regimenLaboral', component: RegimenComponent, canActivate: [AuthGuard]},
  { path: 'tipoComidas', component: TipoComidasComponent, canActivate: [AuthGuard]},
  { path: 'relojes', component: RelojesComponent, canActivate: [AuthGuard]},
  { path: 'proceso', component: PrincipalProcesoComponent, canActivate: [AuthGuard]},
  { path: 'registrarProceso', component: RegistroProcesoComponent, canActivate: [AuthGuard] },
  { path: 'provincia', component: PrincipalProvinciaComponent, canActivate: [AuthGuard]},
  { path: 'departamento', component: PrincipalDepartamentoComponent, canActivate: [AuthGuard]},
  { path: 'registrarDepartamento', component: RegistroDepartamentoComponent, canActivate: [AuthGuard]},
  { path: 'horario', component: PrincipalHorarioComponent, canActivate: [AuthGuard]},
  { path: 'registrarHorario', component:RegistroHorarioComponent, canActivate: [AuthGuard]},
  { path: 'horasExtras', component: HorasExtrasComponent, canActivate: [AuthGuard]},
  { path: 'notificaciones', component: NotificacionesComponent, canActivate: [AuthGuard]},
  { path: 'feriados', component: RegistrarFeriadosComponent, canActivate: [AuthGuard]},
  { path: 'listarFeriados', component: ListarFeriadosComponent, canActivate: [AuthGuard]},
  { path: 'modificarDepartamento/:id', component:RegistroDepartamentoComponent, canActivate: [AuthGuard]},
  { path: 'enrolados', component:PrincipalEnroladosComponent, canActivate: [AuthGuard]},
  { path: 'tipoPermisos', component: TipoPermisosComponent, canActivate: [AuthGuard]},
  { path: 'listarRegimen', component: ListarRegimenComponent, canActivate: [AuthGuard]},
  { path: 'listarTipoComidas', component: ListarTipoComidasComponent, canActivate: [AuthGuard]},
  { path: 'listarRelojes', component: ListarRelojesComponent, canActivate: [AuthGuard]},
  { path: 'listarCiudades', component: ListarCiudadComponent, canActivate: [AuthGuard]},
  { path: 'verTipoPermiso', component: VistaElementosComponent, canActivate: [AuthGuard]},
  { path: 'emplCargos', component: EmplCargosComponent, canActivate: [AuthGuard]},
  { path: 'verFeriados/:id', component: ListarCiudadFeriadosComponent, canActivate: [AuthGuard]},
  { path: 'sucursales', component: ListaSucursalesComponent, canActivate: [AuthGuard]},
  { path: 'nivelTitulos', component: RegistrarNivelTitulosComponent, canActivate: [AuthGuard]},
  { path: 'empresa', component: RegistroEmpresaComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
