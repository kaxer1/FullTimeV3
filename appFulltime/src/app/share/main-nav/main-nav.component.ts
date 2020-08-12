import { Component, OnInit, } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { SettingsComponent } from "src/app/componentes/settings/settings.component";
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';
import { LoginService } from 'src/app/servicios/login/login.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']

})
export class MainNavComponent implements OnInit {

  estado: boolean = true;
  UserEmail: string;
  UserName: string;
  iniciales: string;
  urlImagen: any;
  mostrarImagen: boolean = false;
  mostrarIniciales: boolean = false;
  HabilitarAccion: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  pestania: string;

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  id_empleado_logueado: number;
  noti_real_time: any = [];
  num_noti_false: number = 0;
  num_noti: number = 0;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public location: Location,
    public loginService: LoginService,
    private empleadoService: EmpleadoService,
    public restEmpresa: EmpresaService,
    public vistaFlotante: MatDialog,
    private router: Router,
    private toaster: ToastrService,
    private socket: Socket,
    private realTime: RealTimeService
  ) {
    this.socket.on('enviar_notification', (data) => {
      if (parseInt(data.id_receives_empl) === this.id_empleado_logueado) {
        console.log(data);
        this.realTime.ObtenerUnaNotificaciones(data.id).subscribe(res => {
          console.log(res);
          this.estadoNotificacion = false;
          if (this.noti_real_time.length < 5) {
            this.noti_real_time.unshift(res[0]);
          } else if (this.noti_real_time.length >= 5) {
            this.noti_real_time.unshift(res[0]);
            this.noti_real_time.pop();
          }
          this.num_noti_false = this.num_noti_false + 1;
        })
      }
    });
  }

  isExpanded = true;
  isShowing = false;
  barraInicial = false;
  barraUno = false;
  barraDos = false;

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }
  
  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
  
  ngOnInit() {
    this.infoUser();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.id_empleado_logueado = parseInt(localStorage.getItem('empleado'));
    this.LlamarNotificaicones(this.id_empleado_logueado);
    this.VerAccionPersonal();
    this.breakpointObserver.observe('(max-width: 663px)').subscribe(result => {
      this.barraInicial = result.matches;
      this.barraUno = result.matches;
      this.barraDos = result.matches;
    });
  }

  confRes: any = [];
  LlamarNotificaicones(id: number) {
    this.realTime.ObtenerNotificacionesReceives(id).subscribe(res => {
      this.noti_real_time = res;
      console.log(this.noti_real_time);
      if (!this.noti_real_time.text) {
        if (this.noti_real_time.length > 0) {
          this.noti_real_time.forEach(obj => {
            if (obj.visto === false) {
              this.num_noti_false = this.num_noti_false + 1;
              this.estadoNotificacion = false
            }
          });
        }
      }
    });
    this.realTime.ObtenerConfigNotiEmpleado(id).subscribe(res => {
      console.log(res);
      this.confRes = res;
      if (!this.confRes.text) {
        if (res[0].vaca_noti === false || res[0].permiso_noti === false || res[0].hora_extra_noti === false) {
          this.num_noti_false = 0;
          this.estadoNotificacion = true
        }
      }
    }, error => {
      console.log(error);
      this.router.url
      if (this.router.url !== '/login') {
        this.toaster.info('Configure si desea que le lleguen notficaciones y avisos al correo electrónico', 
        'Falta Ajustes del Sistema').onTap.subscribe(items => {
          this.AbrirSettings();
        });
      }
      
    });
  }

  CambiarVistaNotificacion(id_realtime: number) {
    this.realTime.PutVistaNotificacion(id_realtime).subscribe(res => {
      console.log(res);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  estadoNotificacion: boolean = true;
  numeroNotificacion() {
    if (this.num_noti_false > 0) {
      this.num_noti_false = 0;
      this.estadoNotificacion = !this.estadoNotificacion;
    }
  }

  infoUser() {
    const id_empleado = parseInt(localStorage.getItem('empleado'));
    if (id_empleado.toString() === 'NaN') return id_empleado;

    this.empleadoService.getOneEmpleadoRest(id_empleado).subscribe(res => {

      this.UserEmail = res[0].correo;
      this.UserName = res[0].nombre.split(" ")[0] + " " + res[0].apellido.split(" ")[0];
      if ( res[0]['imagen'] != null){
        this.urlImagen = 'http://192.168.0.192:3001/empleado/img/' + res[0]['imagen'];
        this.mostrarImagen = true;
        this.mostrarIniciales = false;
      } else {
        this.iniciales = res[0].nombre.split(" ")[0].slice(0, 1) + res[0].apellido.split(" ")[0].slice(0, 1);
        this.mostrarIniciales = true
        this.mostrarImagen = false;
      }
    });
  }

  AbrirSettings() {
    const id_empleado = parseInt(localStorage.getItem('empleado'));
    this.vistaFlotante.open(SettingsComponent, { width: '350px', data: {id_empleado} });
  }

  VerAccionPersonal() {
    this.restEmpresa.ConsultarEmpresas().subscribe(res => {
      if (res[0].tipo_empresa === 'Pública') {
        this.HabilitarAccion = false;
      }
      else {
        this.HabilitarAccion = true;
      }
    })
  }

}
