import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxEchartsModule } from 'ngx-echarts';

// vistas
import { VistaRolesComponent } from './componentes/catalogos/catRoles/vista-roles/vista-roles.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/empleado/registro/registro.component';
import { ListaEmpleadosComponent } from './componentes/empleado/lista-empleados/lista-empleados.component';
import { TitulosComponent } from './componentes/catalogos/catTitulos/titulos/titulos.component';
import { DiscapacidadComponent } from './componentes/empleado/discapacidad/discapacidad.component';
import { HomeComponent } from './componentes/home/home.component';
import { RegistroRolComponent } from './componentes/catalogos/catRoles/registro-rol/registro-rol.component';
import { VerEmpleadoComponent } from './componentes/empleado/ver-empleado/ver-empleado.component';
import { SeleccionarRolPermisoComponent } from './componentes/catalogos/catRoles/seleccionar-rol-permiso/seleccionar-rol-permiso.component';
import { PrincipalHorarioComponent } from './componentes/catalogos/catHorario/principal-horario/principal-horario.component'
import { RegistroHorarioComponent } from './componentes/catalogos/catHorario/registro-horario/registro-horario.component'
import { PrincipalProvinciaComponent } from './componentes/catalogos/catProvincia/listar-provincia/principal-provincia.component';
import { RegistroProvinciaComponent } from './componentes/catalogos/catProvincia/registro-provincia/registro-provincia.component';
import { PrincipalProcesoComponent } from './componentes/catalogos/catProcesos/principal-proceso/principal-proceso.component';
import { RegistroProcesoComponent } from './componentes/catalogos/catProcesos/registro-proceso/registro-proceso.component';
import { HorasExtrasComponent } from './componentes/catalogos/catHorasExtras/horas-extras.component';
import { RegimenComponent } from './componentes/catalogos/catRegimen/regimen/regimen.component';
import { TipoComidasComponent } from './componentes/catalogos/catTipoComidas/tipo-comidas/tipo-comidas.component';
import { RelojesComponent } from './componentes/catalogos/catRelojes/relojes/relojes.component';
import { NotificacionesComponent } from './componentes/catalogos/catNotificaciones/notificaciones.component';
import { ListarFeriadosComponent } from './componentes/catalogos/catFeriados/listar-feriados/listar-feriados.component';
import { PrincipalDepartamentoComponent } from './componentes/catalogos/catDepartamentos/listar-departamento/principal-departamento.component';
import { RegistroDepartamentoComponent } from './componentes/catalogos/catDepartamentos/registro-departamento/registro-departamento.component';
import { RegistrarFeriadosComponent } from './componentes/catalogos/catFeriados/registrar-feriados/registrar-feriados.component';
import { PrincipalEnroladosComponent } from './componentes/catalogos/catEnrolados/principal-enrolados/principal-enrolados.component';
import { RegistroEnroladosComponent } from './componentes/catalogos/catEnrolados/registro-enrolados/registro-enrolados.component';
import { TipoPermisosComponent } from './componentes/catalogos/catTipoPermisos/tipo-permisos/tipo-permisos.component';
import { EditarFeriadosComponent } from './componentes/catalogos/catFeriados/editar-feriados/editar-feriados.component';
import { ListarRegimenComponent } from './componentes/catalogos/catRegimen/listar-regimen/listar-regimen.component';
import { ListarTipoComidasComponent } from './componentes/catalogos/catTipoComidas/listar-tipo-comidas/listar-tipo-comidas.component';
import { ListarRelojesComponent } from './componentes/catalogos/catRelojes/listar-relojes/listar-relojes.component';
import { TituloEmpleadoComponent } from './componentes/empleado/titulo-empleado/titulo-empleado.component';
import { ListarCiudadComponent } from './componentes/ciudades/listar-ciudad/listar-ciudad.component';
import { RegistrarCiudadComponent } from './componentes/ciudades/registrar-ciudad/registrar-ciudad.component';
import { VistaElementosComponent } from './componentes/catalogos/catTipoPermisos/listarTipoPermisos/vista-elementos/vista-elementos.component';
import { AsignarCiudadComponent } from './componentes/catalogos/catFeriados/asignar-ciudad/asignar-ciudad.component';
import { RegistroContratoComponent } from './componentes/empleadoContrato/registro-contrato/registro-contrato.component';
import { EmplCargosComponent } from './componentes/empleadoCargos/empl-cargos/empl-cargos.component';
import { ListarTitulosComponent } from './componentes/catalogos/catTitulos/listar-titulos/listar-titulos.component';
import { ListarCiudadFeriadosComponent } from './componentes/catalogos/catFeriados/listar-ciudad-feriados/listar-ciudad-feriados.component';
import { EnroladoRelojComponent } from './componentes/catalogos/catEnrolados/enrolado-reloj/enrolado-reloj.component';
import { PlanificacionComidasComponent } from './componentes/planificacionComidas/planificacion-comidas/planificacion-comidas.component';
import { ListaSucursalesComponent } from './componentes/sucursales/lista-sucursales/lista-sucursales.component';
import { RegistrarNivelTitulosComponent } from './componentes/nivelTitulos/registrar-nivel-titulos/registrar-nivel-titulos.component';
import { RegistrarSucursalesComponent } from './componentes/sucursales/registrar-sucursales/registrar-sucursales.component';
import { RegistroEmpresaComponent } from './componentes/catalogos/catEmpresa/registro-empresa/registro-empresa.component';
import { DispositivosEnroladosComponent } from './componentes/catalogos/catEnrolados/dispositivos-enrolados/dispositivos-enrolados.component';
import { RegistrarPeriodoVComponent } from './componentes/periodoVacaciones/registrar-periodo-v/registrar-periodo-v.component';
import { RegistrarEmpleProcesoComponent } from './componentes/empleadoProcesos/registrar-emple-proceso/registrar-emple-proceso.component';
import { RegistrarVacacionesComponent } from './componentes/vacaciones/registrar-vacaciones/registrar-vacaciones.component';
import { RegistroPlanHorarioComponent } from './componentes/planHorarios/registro-plan-horario/registro-plan-horario.component';
import { RegistroDetallePlanHorarioComponent } from './componentes/detallePlanHorarios/registro-detalle-plan-horario/registro-detalle-plan-horario.component';
import { ListarNivelTitulosComponent } from './componentes/nivelTitulos/listar-nivel-titulos/listar-nivel-titulos.component';
import { ListarEmpresasComponent } from './componentes/catalogos/catEmpresa/listar-empresas/listar-empresas.component';
import { RegistroAutorizacionDepaComponent } from './componentes/autorizacionDepartamento/registro-autorizacion-depa/registro-autorizacion-depa.component';
import { RegistroEmpleadoPermisoComponent } from './componentes/empleadoPermisos/registro-empleado-permiso/registro-empleado-permiso.component';
import { RegistoEmpleadoHorarioComponent } from './componentes/empleadoHorario/registo-empleado-horario/registo-empleado-horario.component';
import { DetalleCatHorarioComponent } from './componentes/catalogos/catHorario/detalle-cat-horario/detalle-cat-horario.component';
import { NotiAutorizacionesComponent } from './componentes/catalogos/catNotiAutorizaciones/Registro/noti-autorizaciones/noti-autorizaciones.component';
import { DatosEmpleadoComponent } from './componentes/rolEmpleado/datos-empleado/datos-empleado.component';
import { CambiarContrasenaComponent } from './componentes/rolEmpleado/cambiar-contrasena/cambiar-contrasena.component';
import { EditarRelojComponent } from './componentes/catalogos/catRelojes/editar-reloj/editar-reloj.component';
import { EditarRolComponent } from './componentes/catalogos/catRoles/editar-rol/editar-rol.component';
import { EditarRegimenComponent } from './componentes/catalogos/catRegimen/editar-regimen/editar-regimen.component';
import { EditarDepartamentoComponent } from './componentes/catalogos/catDepartamentos/editar-departamento/editar-departamento.component';
import { EditarTipoPermisosComponent } from './componentes/catalogos/catTipoPermisos/editar-tipo-permisos/editar-tipo-permisos.component';
import { PlanificacionMultipleComponent } from './componentes/planificacion-multiple/planificacion-multiple.component';
import { VerHorarioDetalleComponent } from './componentes/catalogos/catHorario/ver-horario-detalle/ver-horario-detalle.component';
import { EditarHorarioComponent } from './componentes/catalogos/catHorario/editar-horario/editar-horario.component';
import { AutorizacionesComponent } from './componentes/autorizaciones/autorizaciones/autorizaciones.component';
import { EditarTitulosComponent } from './componentes/catalogos/catTitulos/editar-titulos/editar-titulos.component';
import { EditarNivelTituloComponent } from './componentes/nivelTitulos/editar-nivel-titulo/editar-nivel-titulo.component';
import { EditarTipoComidasComponent } from './componentes/catalogos/catTipoComidas/editar-tipo-comidas/editar-tipo-comidas.component';
import { EditarEmpleadoComponent } from './componentes/empleado/EditarEmpleado/editar-empleado/editar-empleado.component';
import { EditarTituloComponent } from './componentes/empleado/EditarTituloEmpleado/editar-titulo/editar-titulo.component';
import { OlvidarContraseniaComponent } from './componentes/login/olvidar-contrasenia/olvidar-contrasenia.component';
import { ConfirmarContraseniaComponent } from './componentes/login/confirmar-contrasenia/confirmar-contrasenia.component';
import { EditarEmpresaComponent } from './componentes/catalogos/catEmpresa/editar-empresa/editar-empresa.component';
import { EditarSucursalComponent } from './componentes/sucursales/editar-sucursal/editar-sucursal.component';
import { EditarCatProcesosComponent } from './componentes/catalogos/catProcesos/editar-cat-procesos/editar-cat-procesos.component';
import { EditarEmpleadoProcesoComponent } from './componentes/empleadoProcesos/editar-empleado-proceso/editar-empleado-proceso.component';
import { EditarEnroladosComponent } from './componentes/catalogos/catEnrolados/editar-enrolados/editar-enrolados.component';
import { MetodosComponent } from './componentes/metodoEliminar/metodos.component';
import { EditarContratoComponent } from './componentes/empleado/editar-contrato/editar-contrato.component';
import { EditarCargoComponent } from './componentes/empleado/editar-cargo/editar-cargo.component';
import { EditarEmpleadoPermisoComponent } from './componentes/empleadoPermisos/editar-empleado-permiso/editar-empleado-permiso.component';
import { HomeEmpleadoComponent } from './componentes/rolEmpleado/home-empleado/home-empleado.component';
import { ListarEmpleadoPermisoComponent } from './componentes/empleadoPermisos/listar-empleado-permiso/listar-empleado-permiso.component';

import { FooterComponent } from './share/footer/footer.component';
import { MainNavComponent } from './share/main-nav/main-nav.component';



// conexión Rest Postgresql Servicios
import { RolesService } from './servicios/catalogos/catRoles/roles.service';
import { LoginService } from './servicios/login/login.service';
import { TituloService } from './servicios/catalogos/catTitulos/titulo.service';
import { EmpleadoService } from './servicios/empleado/empleadoRegistro/empleado.service'
import { DiscapacidadService } from './servicios/discapacidad/discapacidad.service';
import { ProvinciaService } from './servicios/catalogos/catProvincias/provincia.service';
import { HorarioService } from './servicios/catalogos/catHorarios/horario.service';
import { HorasExtrasService } from './servicios/catalogos/catHorasExtras/horas-extras.service';
import { EnroladoService } from './servicios/catalogos/catEnrolados/enrolado.service';
import { DepartamentosService } from './servicios/catalogos/catDepartamentos/departamentos.service';
import { RolPermisosService } from './servicios/catalogos/catRolPermisos/rol-permisos.service';
import { TipoPermisosService } from './servicios/catalogos/catTipoPermisos/tipo-permisos.service';
import { NotificacionesService } from './servicios/catalogos/catNotificaciones/notificaciones.service';
import { CiudadFeriadosService } from './servicios/ciudadFeriados/ciudad-feriados.service';
import { EmpleadoHorariosService } from './servicios/horarios/empleadoHorarios/empleado-horarios.service';
import { EmplCargosService } from './servicios/empleado/empleadoCargo/empl-cargos.service';
import { CiudadService } from './servicios/ciudad/ciudad.service';
import { TokenInterceptorService } from './servicios/login/token-interceptor.service';

// Filtros de búsqueda
import { FiltroDepartamentoPipe } from './filtros/catDepartamentos/nombreDepartamento/filtro-departamento.pipe';
import { DepartamentoPadrePipe } from './filtros/catDepartamentos/departamentoPadre/departamento-padre.pipe';
import { ProvinciaPipe } from './filtros/catProvincias/filtroProvincia/provincia.pipe';
import { BPaisesPipe } from './filtros/catProvincias/filtroPaises/b-paises.pipe';
import { FiltroRegionPipe } from './filtros/catRegimen/filtro-region.pipe';
import { FiltroNombrePipe } from './filtros/catFeriados/filtroNombre/filtro-nombre.pipe';
import { FiltroFechaPipe } from './filtros/catFeriados/filtroFecha/filtro-fecha.pipe';
import { RolesPipe } from './filtros/catRolesPermiso/roles.pipe';
import { PadrePipe } from './filtros/catProcesos/filtroProcesoPadre/padre.pipe';
import { NivelPipe } from './filtros/catProcesos/filtroNivel/nivel.pipe';
import { NombrePipe } from './filtros/catProcesos/filtroNombre/nombre.pipe';
import { IduserPipe } from './filtros/catEnrolados/filtroUsuario/iduser.pipe';
import { ActivoPipe } from './filtros/catEnrolados/filtroActivo/activo.pipe';
import { FingerPipe } from './filtros/catEnrolados/filtroFinger/finger.pipe';
import { EnrNombrePipe } from './filtros/catEnrolados/filtroEnrNombre/enr-nombre.pipe';
import { FiltrosNombresPipe } from './filtros/filtrosNombre/filtros-nombres.pipe';
import { FiltroModeloPipe } from './filtros/catRelojes/filtroModelo/filtro-modelo.pipe';
import { FiltroIpPipe } from './filtros/catRelojes/filtroIp/filtro-ip.pipe';
import { EmplCodigoPipe } from './filtros/empleado/filtroEmpCod/empl-codigo.pipe';
import { EmplCedulaPipe } from './filtros/empleado/filtroEmpCed/empl-cedula.pipe';
import { EmplNombrePipe } from './filtros/empleado/filtroEmpNom/empl-nombre.pipe';
import { EmplApellidoPipe } from './filtros/empleado/filtroEmpApe/empl-apellido.pipe';
import { FitroNivelPipe } from './filtros/catTitulos/filtroNivel/fitro-nivel.pipe';
import { FiltrarRucPipe } from './filtros/catEmpresa/filtrarRuc/filtrar-ruc.pipe';
import { SucEmpresaPipe } from './filtros/sucursales/filtroSucEmpresa/suc-empresa.pipe';
import { FiltroEmpresaRPipe } from './filtros/catRelojes/filtroEmpresa/filtro-empresa-r.pipe';
import { FiltroSucursalRPipe } from './filtros/catRelojes/filtroSucursal/filtro-sucursal-r.pipe';
import { FiltroDepartamentoRPipe } from './filtros/catRelojes/filtroDepartamento/filtro-departamento-r.pipe';
import { SucNombrePipe } from './filtros/sucursales/filtroSucNom/suc-nombre.pipe';
import { SucCiudadPipe } from './filtros/sucursales/filtroSucCiu/suc-ciudad.pipe';
import { PaginatePipe } from './pipes/paginate.pipe';
import { CustomMatPaginatorIntl } from './pipes/paginator-es';

// Seguridad
import { AuthGuard } from "./guards/auth.guard";

// material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ImageUploadModule } from 'angular2-image-upload';
import { MatTableModule } from '@angular/material/table';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { EditarPeriodoVacacionesComponent } from './componentes/periodoVacaciones/editar-periodo-vacaciones/editar-periodo-vacaciones.component';
import { EditarNotificacionComponent } from './componentes/catalogos/catNotificaciones/editar-notificacion/editar-notificacion.component';
import { ListarNotiAutorizacionesComponent } from './componentes/catalogos/catNotiAutorizaciones/listar/listar-noti-autorizaciones/listar-noti-autorizaciones.component';
import { RegistrarTimbreComponent } from './componentes/timbres/registrar-timbre/registrar-timbre.component';
import { RegistrarAsistenciaComponent } from './componentes/asistencia/registrar-asistencia/registrar-asistencia.component';
import { PedidoHoraExtraComponent } from './componentes/horasExtras/pedido-hora-extra/pedido-hora-extra.component';
import { CalculoHoraExtraComponent } from './componentes/horasExtras/calculo-hora-extra/calculo-hora-extra.component';
import { InformacionJefeComponent } from './componentes/rolEmpleado/informacion-jefe/informacion-jefe.component';
import { VerEmpleadoPermisoComponent } from './componentes/empleadoPermisos/ver-empleado-permiso/ver-empleado-permiso.component';
import { EditarEstadoAutorizaccionComponent } from './componentes/autorizaciones/editar-estado-autorizaccion/editar-estado-autorizaccion.component';


@NgModule({
  declarations: [
    AppComponent,
    VistaRolesComponent,
    LoginComponent,
    RegistroComponent,
    MainNavComponent,
    ListaEmpleadosComponent,
    HomeComponent,
    TitulosComponent,
    DiscapacidadComponent,
    VerEmpleadoComponent,
    RegistroRolComponent,
    SeleccionarRolPermisoComponent,
    RegimenComponent,
    TipoComidasComponent,
    RelojesComponent,
    PrincipalProvinciaComponent,
    RegistroProvinciaComponent,
    PrincipalProcesoComponent,
    RegistroProcesoComponent,
    PrincipalHorarioComponent,
    RegistroHorarioComponent,
    FooterComponent,
    HorasExtrasComponent,
    NotificacionesComponent,
    ListarFeriadosComponent,
    PrincipalDepartamentoComponent,
    RegistroDepartamentoComponent,
    RegistrarFeriadosComponent,
    PrincipalEnroladosComponent,
    RegistroEnroladosComponent,
    TipoPermisosComponent,
    EditarFeriadosComponent,
    ListarRegimenComponent,
    ListarTipoComidasComponent,
    ListarRelojesComponent,
    FiltroDepartamentoPipe,
    DepartamentoPadrePipe,
    ProvinciaPipe,
    BPaisesPipe,
    FiltroRegionPipe,
    TituloEmpleadoComponent,
    FiltroNombrePipe,
    FiltroFechaPipe,
    ListarCiudadComponent,
    RegistrarCiudadComponent,
    AsignarCiudadComponent,
    FiltrosNombresPipe,
    FiltroModeloPipe,
    FiltroIpPipe,
    RolesPipe,
    PadrePipe,
    NivelPipe,
    NombrePipe,
    VistaElementosComponent,
    IduserPipe,
    ActivoPipe,
    FingerPipe,
    EnrNombrePipe,
    RegistroContratoComponent,
    EmplCargosComponent,
    EmplCodigoPipe,
    EmplCedulaPipe,
    EmplNombrePipe,
    EmplApellidoPipe,
    ListarTitulosComponent,
    FitroNivelPipe,
    ListarCiudadFeriadosComponent,
    EnroladoRelojComponent,
    PlanificacionComidasComponent,
    ListaSucursalesComponent,
    RegistrarSucursalesComponent,
    SucNombrePipe,
    SucCiudadPipe,
    RegistroEmpresaComponent,
    SucEmpresaPipe,
    RegistrarNivelTitulosComponent,
    PaginatePipe,
    DispositivosEnroladosComponent,
    RegistrarPeriodoVComponent,
    FiltroEmpresaRPipe,
    FiltroSucursalRPipe,
    FiltroDepartamentoRPipe,
    RegistrarEmpleProcesoComponent,
    RegistrarVacacionesComponent,
    RegistroPlanHorarioComponent,
    RegistroDetallePlanHorarioComponent,
    ListarNivelTitulosComponent,
    ListarEmpresasComponent,
    FiltrarRucPipe,
    RegistroAutorizacionDepaComponent,
    RegistroEmpleadoPermisoComponent,
    RegistoEmpleadoHorarioComponent,
    DetalleCatHorarioComponent,
    NotiAutorizacionesComponent,
    AutorizacionesComponent,
    EditarTitulosComponent,
    EditarNivelTituloComponent,
    EditarTipoComidasComponent,
    EditarEmpresaComponent,
    EditarSucursalComponent,
    EditarCatProcesosComponent,
    EditarEmpleadoProcesoComponent,
    EditarEnroladosComponent,
    EditarEmpleadoComponent,
    EditarTituloComponent,
    OlvidarContraseniaComponent,
    ConfirmarContraseniaComponent,
    MetodosComponent,
    EditarContratoComponent,
    EditarCargoComponent,
    DatosEmpleadoComponent,
    CambiarContrasenaComponent,
    EditarRelojComponent,
    EditarRolComponent,
    EditarRegimenComponent,
    EditarDepartamentoComponent,
    EditarTipoPermisosComponent,
    PlanificacionMultipleComponent,
    VerHorarioDetalleComponent,
    EditarHorarioComponent,
    EditarEmpleadoPermisoComponent,
    HomeEmpleadoComponent,
    ListarEmpleadoPermisoComponent,
    EditarPeriodoVacacionesComponent,
    RegistrarTimbreComponent,
    RegistrarAsistenciaComponent,
    PedidoHoraExtraComponent,
    CalculoHoraExtraComponent,
    InformacionJefeComponent,
    ListarNotiAutorizacionesComponent,
    VerEmpleadoPermisoComponent,
    EditarEstadoAutorizaccionComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    ImageUploadModule.forRoot(),
    FontAwesomeModule,
    ChartsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatSliderModule,
    MatCheckboxModule,
    MatRadioModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatGridListModule,
    MatDialogModule,
    NgMaterialMultilevelMenuModule,
    MatExpansionModule,
    FormsModule,
    MatStepperModule,
    DragDropModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    NgxEchartsModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    MatTabsModule,
    MatMenuModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
    LoginService,
    RolesService,
    TituloService,
    EmpleadoService,
    DiscapacidadService,
    ProvinciaService,
    HorarioService,
    EnroladoService,
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    HorasExtrasService,
    NotificacionesService,
    RolPermisosService,
    TipoPermisosService,
    DepartamentosService,
    CiudadFeriadosService,
    CiudadService,
    EmpleadoHorariosService,
    EmplCargosService,

  ],

  bootstrap: [AppComponent],

  exports: [
    MatButtonModule, MatDialogModule, DragDropModule,
    MatDatepickerModule, MatNativeDateModule
  ],

})
export class AppModule { }
export class CustomMaterialModule { }
export class DatePickerModule { }
