import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes Administrador
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
import { HorasExtrasComponent } from './componentes/catalogos/catHorasExtras/registrar-horas-extras/horas-extras.component';
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
import { OlvidarContraseniaComponent } from './componentes/login/olvidar-contrasenia/olvidar-contrasenia.component';
import { ConfirmarContraseniaComponent } from './componentes/login/confirmar-contrasenia/confirmar-contrasenia.component';
import { PlanificacionMultipleComponent } from './componentes/planificacion-multiple/planificacion-multiple.component';
import { VerHorarioDetalleComponent } from './componentes/catalogos/catHorario/ver-horario-detalle/ver-horario-detalle.component';
import { ListarEmpleadoPermisoComponent } from './componentes/empleadoPermisos/listar-empleado-permiso/listar-empleado-permiso.component';
import { RegistrarTimbreComponent } from './componentes/timbres/registrar-timbre/registrar-timbre.component';
import { RegistrarAsistenciaComponent } from './componentes/asistencia/registrar-asistencia/registrar-asistencia.component';
import { VerPedidoHoraExtraComponent } from './componentes/horasExtras/ver-pedido-hora-extra/ver-pedido-hora-extra.component';
import { CalculoHoraExtraComponent } from './componentes/horasExtras/calculo-hora-extra/calculo-hora-extra.component';
import { VerDetallePlanHorariosComponent } from './componentes/detallePlanHorarios/ver-detalle-plan-horarios/ver-detalle-plan-horarios.component';
import { VerEmpleadoPermisoComponent } from './componentes/empleadoPermisos/ver-empleado-permiso/ver-empleado-permiso.component';
import { VerVacacionComponent } from './componentes/vacaciones/ver-vacacion/ver-vacacion.component';
import { ListarVacacionesComponent } from './componentes/vacaciones/listar-vacaciones/listar-vacaciones.component';
import { VerDocumentosComponent } from './componentes/documentos/ver-documentos/ver-documentos.component';
import { SucListaNotiComponent } from './componentes/catalogos/catNotificaciones/suc-lista-noti/suc-lista-noti.component';
import { VerDipositivoComponent } from './componentes/catalogos/catRelojes/ver-dipositivo/ver-dipositivo.component';
import { ConfigurarCodigoComponent } from './componentes/configurar-codigo/configurar-codigo.component';
import { VerRegimenComponent } from './componentes/catalogos/catRegimen/ver-regimen/ver-regimen.component';
import { VerTipoPermisoComponent } from './componentes/catalogos/catTipoPermisos/ver-tipo-permiso/ver-tipo-permiso.component';
import { ListaHorasExtrasComponent } from './componentes/catalogos/catHorasExtras/lista-horas-extras/lista-horas-extras.component';
import { VerHorasExtrasComponent } from './componentes/catalogos/catHorasExtras/ver-horas-extras/ver-horas-extras.component';
import { VerEmpresaComponent } from './componentes/catalogos/catEmpresa/ver-empresa/ver-empresa.component';
import { VerSucursalComponent } from './componentes/sucursales/ver-sucursal/ver-sucursal.component';
import { VerBirthdayComponent } from './componentes/birthday/ver-birthday/ver-birthday.component';
import { HoraExtraRealComponent } from './componentes/calculos/hora-extra-real/hora-extra-real.component';
import { ListaEmplePlanHoraEComponent } from './componentes/horasExtras/planificacionHoraExtra/lista-emple-plan-hora-e/lista-emple-plan-hora-e.component';
import { ListaPlanHoraExtraComponent } from './componentes/horasExtras/planificacionHoraExtra/lista-plan-hora-extra/lista-plan-hora-extra.component';
import { RealtimeAvisosComponent } from './componentes/notificaciones/realtime-avisos/realtime-avisos.component';

// Seguridad
import { AuthGuard } from "./guards/auth.guard";

//Reportes
import { ReporteTimbresComponent } from './componentes/reportes/reporteTimbres/reporte-timbres/reporte-timbres.component';
import { ReportePermisosComponent } from './componentes/reportes/reporte-permisos/reporte-permisos.component';
import { ReporteAtrasosComponent } from './componentes/reportes/reporte-atrasos/reporte-atrasos.component';
import { ReporteEntradaSalidaComponent } from './componentes/reportes/reporte-entrada-salida/reporte-entrada-salida.component';
import { AsistenciaConsolidadoComponent } from './componentes/reportes/reporte-asistencia-consolidado/asistencia-consolidado.component';
import { ListaReportesComponent } from './componentes/reportes/lista-reportes/lista-reportes.component';

// Componentes Empleado
import { ContratoCargoEmpleadoComponent } from './componentes/rolEmpleado/contrato-cargo-empleado/contrato-cargo-empleado.component';
import { DatosEmpleadoComponent } from './componentes/rolEmpleado/datos-empleado/datos-empleado.component';
import { HomeEmpleadoComponent } from './componentes/rolEmpleado/home-empleado/home-empleado.component';
import { InformacionJefeComponent } from './componentes/rolEmpleado/informacion-jefe/informacion-jefe.component';
import { PlanificacionHorarioEmpleadoComponent } from './componentes/rolEmpleado/planificacion-horario-empleado/planificacion-horario-empleado.component';
import { DetalleHorarioEmpleadoComponent } from './componentes/rolEmpleado/detalle-horario-empleado/detalle-horario-empleado.component';
import { HorariosEmpleadoComponent } from './componentes/rolEmpleado/horarios-empleado/horarios-empleado.component';
import { VacacionesEmpleadoComponent } from './componentes/rolEmpleado/vacaciones-empleado/vacaciones-empleado.component';
import { SolicitarPermisosEmpleadoComponent } from './componentes/rolEmpleado/solicitar-permisos-empleado/solicitar-permisos-empleado.component';
import { RealtimeNotificacionComponent } from './componentes/notificaciones/realtime-notificacion/realtime-notificacion.component';
import { VerDocumentacionComponent } from './componentes/rolEmpleado/ver-documentacion/ver-documentacion.component';
import { ListaPedidoHoraExtraComponent } from './componentes/horasExtras/lista-pedido-hora-extra/lista-pedido-hora-extra.component';
import { HoraExtraEmpleadoComponent } from './componentes/rolEmpleado/hora-extra-empleado/hora-extra-empleado.component';
import { PlanificacionComidasEmpleadoComponent } from './componentes/rolEmpleado/planificacion-comidas-empleado/planificacion-comidas-empleado.component';
import { ProcesosEmpleadoComponent } from './componentes/rolEmpleado/procesos-empleado/procesos-empleado.component';
import { AutorizaEmpleadoComponent } from './componentes/rolEmpleado/autoriza-empleado/autoriza-empleado.component';
import { ReporteKardexComponent } from './componentes/reportes/reporte-kardex/reporte-kardex.component';
import { ReporteEmpleadosComponent } from './componentes/reportes/reporte-empleados/reporte-empleados.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Para rol Administrador
  { path: 'roles', component: VistaRolesComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'registrarEmpleado', component: RegistroComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'empleado', component: ListaEmpleadosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'titulos', component: ListarTitulosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'regimenLaboral', component: RegimenComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'tipoComidas', component: TipoComidasComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'relojes', component: RelojesComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'proceso', component: PrincipalProcesoComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'registrarProceso', component: RegistroProcesoComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'provincia', component: PrincipalProvinciaComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'departamento', component: PrincipalDepartamentoComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'registrarDepartamento', component: RegistroDepartamentoComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'horario', component: PrincipalHorarioComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'registrarHorario', component: RegistroHorarioComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'horasExtras', component: HorasExtrasComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'suc-notificaciones', component: SucListaNotiComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'feriados', component: RegistrarFeriadosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'listarFeriados', component: ListarFeriadosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'enrolados', component: PrincipalEnroladosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'tipoPermisos', component: TipoPermisosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'listarRegimen', component: ListarRegimenComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'listarTipoComidas', component: ListarTipoComidasComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'listarRelojes', component: ListarRelojesComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'listarCiudades', component: ListarCiudadComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'verTipoPermiso', component: VistaElementosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'emplCargos', component: EmplCargosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'sucursales', component: ListaSucursalesComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'nivelTitulos', component: ListarNivelTitulosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'empresa', component: ListarEmpresasComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'planificacion', component: PlanificacionMultipleComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'permisos-solicitados', component: ListarEmpleadoPermisoComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'vacaciones-solicitados', component: ListarVacacionesComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'horas-extras-solicitadas', component: ListaPedidoHoraExtraComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'timbres', component: RegistrarTimbreComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'asistencia', component: RegistrarAsistenciaComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'calcularHoraExtra', component: CalculoHoraExtraComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'archivos', component: VerDocumentosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'codigo', component: ConfigurarCodigoComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'cumpleanios', component: VerBirthdayComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'verEmpleado/:id', component: VerEmpleadoComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'seleccionarPermisos/:id', component: SeleccionarRolPermisoComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'modificarDepartamento/:id', component: RegistroDepartamentoComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'verFeriados/:id', component: ListarCiudadFeriadosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'enroladoDispositivo/:id', component: DispositivosEnroladosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'verHorario/:id', component: VerHorarioDetalleComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'verDetalles/:id/:id_empleado', component: VerDetallePlanHorariosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'verDispositivos/:id', component: VerDipositivoComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'verRegimen/:id', component: VerRegimenComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'vistaPermiso/:id', component: VerTipoPermisoComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'listaHorasExtras', component: ListaHorasExtrasComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'verHoraExtra/:id', component: VerHorasExtrasComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'vistaEmpresa/:id', component: VerEmpresaComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'vistaSucursales/:id', component: VerSucursalComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'planificacionesHorasExtras', component: ListaPlanHoraExtraComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'horaExtraReal', component: HoraExtraRealComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'planificaHoraExtra', component: ListaEmplePlanHoraEComponent, canActivate: [AuthGuard], data: { roles: 1 } },

  // Reportes
  { path: 'reporteAsistenciaConsolidado', component: AsistenciaConsolidadoComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'reporteEmpleados', component: ReporteEmpleadosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'reporteKardex', component: ReporteKardexComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'reporteTimbres', component: ReporteTimbresComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'reportePermisos', component: ReportePermisosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'reporteAtrasos', component: ReporteAtrasosComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'reporteEntradaSalida', component: ReporteEntradaSalidaComponent, canActivate: [AuthGuard], data: { roles: 1 } },
  { path: 'listaReportes', component: ListaReportesComponent, canActivate: [AuthGuard], data: { roles: 1 } },

  // Rol mixto para las autorizacines
  { path: 'lista-notificaciones', component: RealtimeNotificacionComponent, canActivate: [AuthGuard], data: { rolMix: 0 } },
  { path: 'lista-avisos', component: RealtimeAvisosComponent, canActivate: [AuthGuard], data: { rolMix: 0 } },
  { path: 'ver-permiso/:id', component: VerEmpleadoPermisoComponent, canActivate: [AuthGuard], data: { rolMix: 0 } },
  { path: 'ver-vacacion/:id', component: VerVacacionComponent, canActivate: [AuthGuard], data: { rolMix: 0 } },
  { path: 'ver-hora-extra/:id', component: VerPedidoHoraExtraComponent, canActivate: [AuthGuard], data: { rolMix: 0 } },

  // Para rol empleado
  { path: 'datosEmpleado', component: DatosEmpleadoComponent, canActivate: [AuthGuard], data: { roles: 2 } },
  { path: 'estadisticas', component: HomeEmpleadoComponent, canActivate: [AuthGuard], data: { roles: 2 } },
  { path: 'informacion', component: InformacionJefeComponent, canActivate: [AuthGuard], data: { roles: 2 } },
  { path: 'cargoEmpleado', component: ContratoCargoEmpleadoComponent, canActivate: [AuthGuard], data: { roles: 2 } },
  { path: 'planificacionHorario', component: PlanificacionHorarioEmpleadoComponent, canActivate: [AuthGuard], data: { roles: 2 } },
  { path: 'horariosEmpleado', component: HorariosEmpleadoComponent, canActivate: [AuthGuard], data: { roles: 2 } },
  { path: 'vacacionesEmpleado', component: VacacionesEmpleadoComponent, canActivate: [AuthGuard], data: { roles: 2 } },
  { path: 'solicitarPermiso', component: SolicitarPermisosEmpleadoComponent, canActivate: [AuthGuard], data: { roles: 2 } },
  { path: 'verDocumentacion', component: VerDocumentacionComponent, canActivate: [AuthGuard], data: { roles: 2 } },
  { path: 'horaExtraEmpleado', component: HoraExtraEmpleadoComponent, canActivate: [AuthGuard], data: { roles: 2 } },
  { path: 'almuerzosEmpleado', component: PlanificacionComidasEmpleadoComponent, canActivate: [AuthGuard], data: { roles: 2 } },
  { path: 'procesosEmpleado', component: ProcesosEmpleadoComponent, canActivate: [AuthGuard], data: { roles: 2 } },
  { path: 'autorizaEmpleado', component: AutorizaEmpleadoComponent, canActivate: [AuthGuard], data: { roles: 2 } },
  { path: 'detallesHEmpleado/:id/:id_empleado', component: DetalleHorarioEmpleadoComponent, canActivate: [AuthGuard], data: { roles: 2 } },

  // pantalla inicial
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard], data: { log: false } },
  { path: 'olvidar-contrasenia', component: OlvidarContraseniaComponent, canActivate: [AuthGuard], data: { log: false } },
  { path: 'confirmar-contrasenia/:token', component: ConfirmarContraseniaComponent, canActivate: [AuthGuard], data: { log: false } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
