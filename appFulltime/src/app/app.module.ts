import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// vistas
import { VistaRolesComponent } from './componentes/roles/vista-roles/vista-roles.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/empleado/registro/registro.component';
import { MainNavComponent } from './share/main-nav/main-nav.component';
import { ListaEmpleadosComponent } from './componentes/empleado/lista-empleados/lista-empleados.component';
import { TitulosComponent } from './componentes/catalogos/titulos/titulos.component';
import { DiscapacidadComponent } from './componentes/empleado/discapacidad/discapacidad.component';
import { HomeComponent } from './componentes/home/home.component';
import { RegistroRolComponent } from './componentes/roles/registro-rol/registro-rol.component';
import { VerEmpleadoComponent } from './componentes/empleado/ver-empleado/ver-empleado.component';
import { SeleccionarRolPermisoComponent } from './componentes/roles/seleccionar-rol-permiso/seleccionar-rol-permiso.component';
import { PrincipalHorarioComponent } from './componentes/catalogos/cg_horario/principal-horario/principal-horario.component'
import { RegistroHorarioComponent } from './componentes/catalogos/cg_horario/registro-horario/registro-horario.component'
import { PrincipalProvinciaComponent } from './componentes/catalogos/cg_provincia/principal-provincia/principal-provincia.component';
import { RegistroProvinciaComponent } from './componentes/catalogos/cg_provincia/registro-provincia/registro-provincia.component';
import { PrincipalProcesoComponent } from './componentes/catalogos/cg_proceso/principal-proceso/principal-proceso.component';
import { RegistroProcesoComponent } from './componentes/catalogos/cg_proceso/registro-proceso/registro-proceso.component';
import { HorasExtrasComponent } from './componentes/catalogos/horas-extras/horas-extras.component';
import { RegimenComponent } from './componentes/catalogos/regimen/regimen.component';
import { TipoPermisosComponent } from './componentes/catalogos/tipo-permisos/tipo-permisos.component';
import { TipoComidasComponent } from './componentes/catalogos/tipo-comidas/tipo-comidas.component';
import { RelojesComponent } from './componentes/catalogos/relojes/relojes.component';
import { NotificacionesComponent } from './componentes/catalogos/notificaciones/notificaciones.component';
import { ListarFeriadosComponent } from './componentes/catalogos/catFeriados/listar-feriados/listar-feriados.component';
import { PrincipalDepartamentoComponent } from './componentes/catalogos/cg_departamento/principal-departamento/principal-departamento.component';
import { RegistroDepartamentoComponent } from './componentes/catalogos/cg_departamento/registro-departamento/registro-departamento.component';
import { RegistrarFeriadosComponent } from './componentes/catalogos/catFeriados/registrar-feriados/registrar-feriados.component';
import { PrincipalEnroladosComponent } from './componentes/catalogos/cg_enrolados/principal-enrolados/principal-enrolados.component';
import { RegistroEnroladosComponent } from './componentes/catalogos/cg_enrolados/registro-enrolados/registro-enrolados.component';
import { FooterComponent } from './share/footer/footer.component';

// conexión Rest Postgresql Servicios
import { RolesService } from './servicios/roles/roles.service';
import { LoginService } from './servicios/login/login.service';
import { TituloService } from './servicios/catalogos/titulo.service';
import { EmpleadoService } from './servicios/empleado/empleado.service'
import { DiscapacidadService } from './servicios/discapacidad/discapacidad.service';
import { ProvinciaService } from './servicios/catalogos/provincia.service';
import { HorarioService } from './servicios/catalogos/horario.service';
import { HorasExtrasService } from './servicios/catalogos/horas-extras.service';
import { RolPermisosService } from './servicios/catalogos/rol-permisos.service';
import { TipoPermisosService } from './servicios/catalogos/tipo-permisos.service';
import { EnroladoService } from './servicios/catalogos/enrolado.service';
import { NotificacionesService } from './servicios/catalogos/notificaciones.service';
import { DepartamentoService } from './servicios/catalogos/departamento.service';

// material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ImageUploadModule } from 'angular2-image-upload';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';


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
    TipoPermisosComponent
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule
  ],
  providers: [
    LoginService,
    RolesService,
    TituloService,
    EmpleadoService,
    DiscapacidadService,
    ProvinciaService,
    HorarioService,
    DepartamentoService,
    EnroladoService,
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    HorasExtrasService,
    NotificacionesService,
    RolPermisosService, 
    TipoPermisosService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
