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
import { ListarEmpresasComponent } from './componentes/catalogos/catEmpresa/listar-empresas/listar-empresas.component';
import { ListarNivelTitulosComponent } from './componentes/nivelTitulos/listar-nivel-titulos/listar-nivel-titulos.component';
import { DispositivosEnroladosComponent } from './componentes/catalogos/catEnrolados/dispositivos-enrolados/dispositivos-enrolados.component';
import { NotiAutorizacionesComponent } from './componentes/catalogos/catNotiAutorizaciones/Registro/noti-autorizaciones/noti-autorizaciones.component';
import { AutorizacionesComponent } from './componentes/autorizaciones/autorizaciones/autorizaciones.component';
import { OlvidarContraseniaComponent } from './componentes/login/olvidar-contrasenia/olvidar-contrasenia.component';
import { ConfirmarContraseniaComponent } from './componentes/login/confirmar-contrasenia/confirmar-contrasenia.component';
import { DatosEmpleadoComponent } from './componentes/rolEmpleado/datos-empleado/datos-empleado.component';
import { PlanificacionMultipleComponent } from './componentes/planificacion-multiple/planificacion-multiple.component';
import { VerHorarioDetalleComponent } from './componentes/catalogos/catHorario/ver-horario-detalle/ver-horario-detalle.component';

import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'roles', component: VistaRolesComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'registrarEmpleado', component: RegistroComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'empleado', component: ListaEmpleadosComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'titulos', component: ListarTitulosComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'verEmpleado/:id', component: VerEmpleadoComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'seleccionarPermisos/:id', component: SeleccionarRolPermisoComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'regimenLaboral', component: RegimenComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'tipoComidas', component: TipoComidasComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'relojes', component: RelojesComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'proceso', component: PrincipalProcesoComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'registrarProceso', component: RegistroProcesoComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'provincia', component: PrincipalProvinciaComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'departamento', component: PrincipalDepartamentoComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'registrarDepartamento', component: RegistroDepartamentoComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'horario', component: PrincipalHorarioComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'registrarHorario', component:RegistroHorarioComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'horasExtras', component: HorasExtrasComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'notificaciones', component: NotificacionesComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'feriados', component: RegistrarFeriadosComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'listarFeriados', component: ListarFeriadosComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'modificarDepartamento/:id', component:RegistroDepartamentoComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'enrolados', component:PrincipalEnroladosComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'tipoPermisos', component: TipoPermisosComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'listarRegimen', component: ListarRegimenComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'listarTipoComidas', component: ListarTipoComidasComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'listarRelojes', component: ListarRelojesComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'listarCiudades', component: ListarCiudadComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'verTipoPermiso', component: VistaElementosComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'emplCargos', component: EmplCargosComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'verFeriados/:id', component: ListarCiudadFeriadosComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'sucursales', component: ListaSucursalesComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'nivelTitulos', component: ListarNivelTitulosComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'empresa', component: ListarEmpresasComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'enroladoDispositivo/:id', component: DispositivosEnroladosComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'noti-autorizaciones', component: NotiAutorizacionesComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'autorizaciones', component: AutorizacionesComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'planificacion', component: PlanificacionMultipleComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'verHorario/:id', component: VerHorarioDetalleComponent, canActivate: [AuthGuard], data: { roles: 1 }},
  { path: 'datosEmpleado', component: DatosEmpleadoComponent, canActivate: [AuthGuard], data: { roles: 2 }},
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard], data: { log: false } },
  { path: 'olvidar-contrasenia', component: OlvidarContraseniaComponent, canActivate: [AuthGuard], data: { log: false }},
  { path: 'confirmar-contrasenia/:token', component: ConfirmarContraseniaComponent, canActivate: [AuthGuard], data: { log: false }},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
