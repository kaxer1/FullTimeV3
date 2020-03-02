import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// vistas
import { VistaRolesComponent } from './componentes/roles/vista-roles/vista-roles.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/empleado/registro/registro.component';
import { MainNavComponent } from './share/main-nav/main-nav.component';
import { ListaEmpleadosComponent } from './componentes/empleado/lista-empleados/lista-empleados.component';
import { HomeComponent } from './componentes/home/home.component';
import { VerEmpleadoComponent } from './componentes/empleado/ver-empleado/ver-empleado.component';

// conexión Rest Postgresql Servicios
import { RolesService } from './servicios/roles/roles.service';
import { LoginService } from './servicios/login/login.service';
import {EmpleadoService} from './servicios/empleado/empleado.service'

// material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {ImageUploadModule} from 'angular2-image-upload';
import { RegistroRolComponent } from './componentes/roles/registro-rol/registro-rol.component';
import { SeleccionarRolPermisoComponent } from './componentes/roles/seleccionar-rol-permiso/seleccionar-rol-permiso.component';

@NgModule({
  declarations: [
    AppComponent,
    VistaRolesComponent,
    LoginComponent,
    RegistroComponent,
    MainNavComponent,
    ListaEmpleadosComponent,
    HomeComponent,
    VerEmpleadoComponent,
    RegistroRolComponent,
    SeleccionarRolPermisoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    ImageUploadModule.forRoot()
  ],
  providers: [
    LoginService,
    RolesService,
    EmpleadoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
