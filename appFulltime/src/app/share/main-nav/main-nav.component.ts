import { Component, OnInit, } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { SettingsComponent } from "src/app/componentes/settings/settings.component";
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { RealTimeService } from 'src/app/servicios/notificaciones/real-time.service';
import { LoginService } from 'src/app/servicios/login/login.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { TimbresService } from 'src/app/servicios/timbres/timbres.service';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { AyudaComponent } from '../ayuda/ayuda.component';
import { MenuNode } from '../../model/menu.model'
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';
import { FraseSeguridadComponent } from 'src/app/componentes/frase-seguridad/frase-seguridad.component';
import { FuncionesService } from 'src/app/servicios/funciones/funciones.service';
import { AccionesTimbresComponent } from 'src/app/componentes/settings/acciones-timbres/acciones-timbres.component';
import { environment } from 'src/environments/environment';

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

  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 800px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  pestania: string;

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  id_empleado_logueado: number;
  noti_real_time: any = [];
  num_noti_false: number = 0;
  num_noti: number = 0;

  timbres_noti: any = [];
  num_timbre_false: number = 0;
  num_timbre: number = 0;

  buscar_empl: any = [];

  treeControl = new NestedTreeControl<MenuNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<MenuNode>();

  idEmpresa: number;
  datosEmpresa: any = [];
  habilitarReportes: string = 'hidden';
  mensaje: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public location: Location,
    public restUsuario: UsuarioService,
    public loginService: LoginService,
    private empleadoService: EmpleadoService,
    public restEmpresa: EmpresaService,
    public restF: FuncionesService,
    public vistaFlotante: MatDialog,
    private router: Router,
    private toaster: ToastrService,
    private socket: Socket,
    private realTime: RealTimeService,
    private timbresNoti: TimbresService,
    private rest: EmpresaService,
    private route: ActivatedRoute
  ) {

    if (this.loginService.loggedIn()) {

      this.socket.on('enviar_notification', (data) => {
        if (parseInt(data.id_receives_empl) === this.id_empleado_logueado) {
          // console.log(data);
          this.realTime.ObtenerUnaNotificaciones(data.id).subscribe(res => {
            // console.log(res);
            this.estadoNotificacion = false;
            if (this.noti_real_time.length < 5) {
              this.noti_real_time.unshift(res[0]);
            } else if (this.noti_real_time.length >= 5) {
              this.noti_real_time.unshift(res[0]);
              this.noti_real_time.pop();
            }
            this.num_noti_false = this.num_noti_false + 1;
          }, err => {
            console.log(err);
          })
        }
      });

    }

  }

  hasChild = (_: number, node: MenuNode) => !!node.children && node.children.length > 0;

  isExpanded = true;
  isShowing = false;
  barraInicial = false;
  barraUno = false;
  barraDos = false;

  recargar = false;
  /**
   * Variables progress spinner
   */
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 10;
  habilitarprogress: boolean = false;

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

    if (this.loginService.loggedIn()) {

      this.idEmpresa = parseInt(localStorage.getItem('empresa'))
      this.LlamarDatos();
      this.infoUser();
    }

  }

  FuncionLlamadaAsync() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.id_empleado_logueado = parseInt(localStorage.getItem('empleado'));
    this.LlamarNotificaciones(this.id_empleado_logueado);
    this.LlamarNotificacionesTimbres(this.id_empleado_logueado);

    this.breakpointObserver.observe('(max-width: 800px)').subscribe((result: BreakpointState) => {

      this.barraInicial = result.matches;
      this.barraUno = result.matches;
      this.barraDos = result.matches;
      // console.log('Result breakpoints: ', result.matches);

      this.recargar = result.matches;
      if (result.matches === true) {
        let cont = 0;
        do {
          cont = cont + 1;
        } while (cont === 3);
        // console.log('Recarga antes: ', this.recargar);
        this.recargar = false;
        // console.log('Recarga despues: ', this.recargar);
      }
    });

    this.SeleccionMenu();
    this.BarraBusquedaEmpleados();
    this.ConfigurarSeguridad();
  }

  BarraBusquedaEmpleados() {
    if (!!sessionStorage.getItem('lista-empleados')) {
      // console.log('ya hay lista en la sesion iniciada');
      let empleados = JSON.parse(sessionStorage.getItem('lista-empleados'));

      empleados.forEach(obj => {
        this.options.push(obj.empleado)
      });
      this.buscar_empl = empleados
    } else {
      // console.log('entra aqui solo al iniciar sesion');
      this.empleadoService.getBuscadorEmpledosRest().subscribe(res => {
        let ObjetoJSON = JSON.stringify(res)
        sessionStorage.setItem('lista-empleados', ObjetoJSON)
        res.forEach(obj => {
          this.options.push(obj.empleado)
        });
        this.buscar_empl = res
      })
    }
  };

  LlamarDatos() {
    this.rest.ConsultarDatosEmpresa(this.idEmpresa).subscribe(datos => {
      this.datosEmpresa = datos;
      const { logo, color_p, color_s } = this.datosEmpresa[0];
      this.FuncionLlamadaAsync()

      if (logo === null || color_p === null || color_s === null) {
        this.toaster.error('Falta agregar estilo o logotipo de la empresa para imprimir PDFs', 'Error configuración', { timeOut: 10000 })
          .onTap.subscribe(obj => {
            this.IrInfoEmpresa()
          })
        this.mensaje = true;
      } else {
        this.habilitarReportes = 'visible';
      }
    }, err => {
      console.log(err);
      this.loginService.logout()
    });
  }

  IrInfoEmpresa() {
    this.router.navigate(['/vistaEmpresa', this.idEmpresa], { relativeTo: this.route, skipLocationChange: false })
  }

  ConfigurarSeguridad() {

    this.rest.ConsultarDatosEmpresa(this.idEmpresa).subscribe(datos => {
      this.datosEmpresa = datos;
      if (this.datosEmpresa[0].seg_frase === true) {
        this.restUsuario.BuscarDatosUser(this.id_empleado_logueado).subscribe(data => {
          if (data[0].id_rol === 1) {
            if (data[0].frase === null || data[0].frase === '') {
              this.toaster.info('Debe registrar su frase de seguridad.', 'Configuración doble seguridad', { timeOut: 10000 })
                .onTap.subscribe(obj => {
                  this.RegistrarFrase()
                })
            }
          }
        });
      }
    });
  }

  RegistrarFrase() {
    this.vistaFlotante.open(FraseSeguridadComponent, { width: '350px', data: this.id_empleado_logueado }).disableClose = true;
  }

  confRes: any = [];
  LlamarNotificaciones(id: number) {
    this.realTime.ObtenerNotificacionesReceives(id).subscribe(res => {
      this.noti_real_time = res;
      // console.log(this.noti_real_time);
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
    }, err => {
      console.log(err);
    });
    this.realTime.ObtenerConfigNotiEmpleado(id).subscribe(res => {
      // console.log(res);
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
      // console.log(res);
    }, err => {
      console.log(err);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  abrirInfoEmpleado(nombre: string) {
    this.buscar_empl.forEach(element => {
      if (element.empleado === nombre) {
        this.router.navigate(['/verEmpleado/', element.id], { relativeTo: this.route, skipLocationChange: false });
      }
    });
  }

  estadoNotificacion: boolean = true;
  numeroNotificacion() {
    if (this.num_noti_false > 0) {
      this.num_noti_false = 0;
      this.estadoNotificacion = !this.estadoNotificacion;
    }
  }

  mensaje_inicio: string = '';
  mensaje_fin: string = '';
  LlamarNotificacionesTimbres(id: number) {
    this.timbresNoti.NotiTimbresRealTime(id).subscribe(res => {
      this.timbres_noti = res;
      console.log(this.timbres_noti, ' verificando vista de timbres ' + this.timbres_noti.message);
      if (!this.timbres_noti.message) {
        if (this.timbres_noti.length > 0) {
          this.timbres_noti.forEach(obj => {
            if (obj.visto === false) {
              this.num_timbre_false = this.num_timbre_false + 1;
              this.estadoTimbres = false;
            }
            if (obj.descripcion.split(' ')[0] === 'Alimentación') {
              console.log('verificando espacios', obj.descripcion.split(' '))
              this.mensaje_inicio = obj.descripcion.split(' ')[0] + ' ' + obj.descripcion.split(' ')[1] + ' ' + obj.descripcion.split(' ')[2] + ' ' + obj.descripcion.split(' ')[3];
              this.mensaje_fin = obj.descripcion.split(' ')[4] + ' ' + obj.descripcion.split(' ')[5] + ' ' + obj.descripcion.split(' ')[6];
            }
          });
        }
      }
    }, err => {
      console.log(err);
    });
  }

  CambiarVistaTimbres(id_realtime: number) {
    this.timbresNoti.PutVistaTimbre(id_realtime).subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    });
  }

  estadoTimbres: boolean = true;
  numeroTimbres() {
    if (this.num_timbre_false > 0) {
      this.num_timbre_false = 0;
      this.estadoTimbres = !this.estadoTimbres;
    }
  }

  infoUser() {
    const id_empleado = parseInt(localStorage.getItem('empleado'));
    if (id_empleado.toString() === 'NaN') return id_empleado;

    let fullname = localStorage.getItem('fullname');
    let correo = localStorage.getItem('correo');
    let iniciales = localStorage.getItem('iniciales');
    let view_imagen = localStorage.getItem('view_imagen');
    // console.log(fullname, correo, iniciales, view_imagen);

    if (fullname === null && correo === null && iniciales === null && view_imagen === null) {
      this.empleadoService.getOneEmpleadoRest(id_empleado).subscribe(res => {

        localStorage.setItem('fullname', res[0].nombre.split(" ")[0] + " " + res[0].apellido.split(" ")[0])
        localStorage.setItem('fullname_print', res[0].nombre + " " + res[0].apellido)
        localStorage.setItem('correo', res[0].correo)

        this.UserEmail = localStorage.getItem('correo');
        this.UserName = localStorage.getItem('fullname');
        if (res[0]['imagen'] != null) {
          localStorage.setItem('view_imagen', `${environment.url}/empleado/img/` + res[0]['imagen'])
          this.urlImagen = localStorage.getItem('view_imagen');
          this.mostrarImagen = true;
          this.mostrarIniciales = false;
        } else {
          localStorage.setItem('iniciales', res[0].nombre.split(" ")[0].slice(0, 1) + res[0].apellido.split(" ")[0].slice(0, 1))
          this.iniciales = localStorage.getItem('iniciales');
          this.mostrarIniciales = true
          this.mostrarImagen = false;
        }

      });
    } else {
      this.UserEmail = correo;
      this.UserName = fullname;
      if (iniciales === null) {
        this.urlImagen = view_imagen;
        this.mostrarImagen = true;
        this.mostrarIniciales = false;
      } else {
        this.iniciales = iniciales;
        this.mostrarImagen = false;
        this.mostrarIniciales = true;
      }
    }

  }

  AbrirSettings() {
    const id_empleado = parseInt(localStorage.getItem('empleado'));
    this.vistaFlotante.open(SettingsComponent, { width: '350px', data: { id_empleado } });
  }

  AbrirAccionesTimbres() {
    const id_empresa = parseInt(localStorage.getItem('empresa'));
    this.vistaFlotante.open(AccionesTimbresComponent, { width: '350px', data: { id_empresa } });
  }

  AbrirVentanaAyuda() {
    this.vistaFlotante.open(AyudaComponent, { width: '500px' })
  }

  irHome() {
    if (this.loginService.getRol() === 1) {
      this.router.navigate(['/home'], { relativeTo: this.route, skipLocationChange: false });
    } else {
      this.router.navigate(['/estadisticas'], { relativeTo: this.route, skipLocationChange: false });
    }
  }

  VerAccionPersonal() {
    this.restEmpresa.ConsultarEmpresas().subscribe(res => {
      if (res[0].tipo_empresa === 'Pública') {
        this.HabilitarAccion = true;
      }
      else {
        this.HabilitarAccion = false;
      }
    })
  }

  HabilitarHoraExtra: boolean;
  HabilitarAlimentacion: boolean;
  HabilitarPermisos: boolean;


  /**
   * MENU PRINCIPAL
  */

  nombreSelect: string = '';
  manejarEstadoActivo(name) {
    this.nombreSelect = name;
  }

  SeleccionMenu() {

    this.restEmpresa.ConsultarEmpresas().subscribe(res => {

      // console.log(this.loginService.getRolMenu(), this.loginService.getEstado() , this.estado);
      if (this.loginService.getRolMenu() === true) {
        localStorage.setItem('name_empresa', res[0].nombre)
        this.dataSource.data = this.MenuAdministracion(localStorage.getItem('name_empresa')) as MenuNode[];
      } else {
        this.dataSource.data = this.MenuEmpleado() as MenuNode[];
      }
      this.restF.ListarFunciones().subscribe(datos => {
        console.log('datos', datos)
        if (datos[0].hora_extra === true) {
          this.HabilitarHoraExtra = true;
        }
        if (datos[0].accion_personal === true) {
          if (res[0].tipo_empresa === 'Pública') {
            this.HabilitarAccion = true;
          }
          else {
            this.HabilitarAccion = false;
          }
        }
        if (datos[0].alimentacion === true) {
          this.HabilitarAlimentacion = true;
        }
        if (datos[0].permisos === true) {
          this.HabilitarPermisos = true;
        }

        // console.log(this.loginService.getRolMenu(), this.loginService.getEstado() , this.estado);
        if (this.loginService.getRolMenu() === true) {
          this.dataSource.data = this.MenuAdministracion(res[0].nombre) as MenuNode[];
        } else {
          this.dataSource.data = this.MenuEmpleado() as MenuNode[];
        }


      }, error => {
        this.HabilitarHoraExtra = false;
        this.HabilitarAlimentacion = false;
        this.HabilitarPermisos = false;
      })
    })
  }

  MenuAdministracion(nombre: string) {
    return [
      {
        name: 'Administración',
        accion: true,
        estado: true,
        icono: 'dashboard',
        children: [
          { name: 'Inicio', url: '/home' },
          { name: 'Crear Rol', url: '/roles' },
          { name: 'Crear Feriados', url: '/listarFeriados' },
          { name: 'Crear Régimen Laboral', url: '/listarRegimen' },
          { name: 'Crear Título Profesional', url: '/titulos' },
          { name: 'Crear Nivel de Educación', url: '/nivelTitulos' },
        ]
      },
      {
        name: 'Empleado',
        accion: true,
        estado: true,
        icono: 'account_circle',
        children: [
          { name: 'Configurar Código', url: '/codigo' },
          { name: 'Crear Empleado', url: '/empleado' },
        ]
      },
      {
        name: 'Alimentación',
        accion: this.HabilitarAlimentacion,
        estado: true,
        icono: 'local_dining',
        children: [
          { name: 'Comidas', url: '/listarTipoComidas' },
          { name: 'Planificar', url: '/alimentacion' },
          { name: 'Solicitudes', url: '/listaSolicitaComida' },
          { name: 'Planificaciones', url: '/listaPlanComida' },
        ]
      },
      {
        name: 'Ubicación',
        accion: true,
        estado: true,
        icono: 'location_on',
        children: [
          { name: nombre, url: '/vistaEmpresa/' + localStorage.getItem('empresa') },
          { name: 'Registrar Provincia', url: '/provincia' },
          { name: 'Registrar Ciudad', url: '/listarCiudades' },
          { name: 'Registrar Establecimiento', url: '/sucursales' },
          { name: 'Registrar Departamento', url: '/departamento' },
        ]
      },
      {
        name: 'Solicitudes',
        accion: this.HabilitarPermisos,
        estado: true,
        icono: 'email',
        children: [
          //{ name: 'Notificaciones', url: '/suc-notificaciones' },
          { name: 'Configurar Permisos', url: '/verTipoPermiso' },
          { name: 'Permisos Solicitados', url: '/permisos-solicitados' },
          { name: 'Vacaciones Solicitadas', url: '/vacaciones-solicitados' },
          { name: 'Permisos Múltiples', url: '/permisosMultiples' },
        ]
      },
      {
        name: 'Horas Extras',
        accion: this.HabilitarHoraExtra,
        estado: true,
        icono: 'email',
        children: [
          { name: 'Configurar Horas Extras', url: '/listaHorasExtras' },
          { name: 'Horas Extras Solicitadas', url: '/horas-extras-solicitadas' },
          { name: 'Horas Extras Planificadas', url: '/planificacionesHorasExtras' },
          { name: 'Planificar Hora Extra', url: '/planificaHoraExtra' },
          { name: 'Planificaciones', url: '/listadoPlanificaciones' },
          { name: 'Calcular Hora Extra', url: '/horaExtraReal' },
        ]
      },
      {
        name: 'Dispositivos',
        accion: true,
        estado: true,
        icono: 'schedule',
        children: [
          { name: 'Enrolar Empleado', url: '/enrolados' },
          { name: 'Registrar Dispositivo', url: '/listarRelojes' },
        ]
      },
      {
        name: 'Horarios',
        accion: true,
        estado: true,
        icono: 'assignment',
        children: [
          { name: 'Registrar Horario', url: '/horario' },
          { name: 'Horarios Múltiples', url: '/horariosMultiples' },
          { name: 'Planificación Múltiple', url: '/planificacion' },
        ]
      },
      {
        name: 'Timbres',
        accion: true,
        estado: true,
        icono: 'fingerprint',
        children: [
          { name: 'Administrar Timbres', url: '/timbres-admin' },
          { name: 'Timbres personales', url: '/timbres-personal' },
        ]
      },
      {
        name: 'Documentos',
        accion: true,
        estado: true,
        icono: 'insert_drive_file',
        children: [
          { name: 'Archivos', url: '/archivos' },
        ]
      },
      {
        name: 'Acción Personal',
        accion: this.HabilitarAccion,
        estado: true,
        icono: 'how_to_reg',
        children: [
          { name: 'Crear Proceso', url: '/proceso' },
          { name: 'Tipo Acción Personal', url: '/acciones-personal' },
          { name: 'Pedido Acción Personal', url: '/pedidoAccion' },
          { name: 'Acción Personal', url: '/listaPedidos' },
        ]
      },
      {
        name: 'Cumpleaños',
        accion: true,
        estado: true,
        icono: 'card_giftcard',
        children: [
          { name: 'Cumpleaños', url: '/cumpleanios' },
        ]
      },
      {
        name: 'Reportería',
        accion: true,
        estado: true,
        icono: 'import_contacts',
        children: [
          { name: 'Reportes - Kardex', url: '/listaReportes' },
        ]
      }
    ];
  }

  MenuEmpleado() {
    return [
      {
        name: 'Perfil',
        accion: true,
        estado: true,
        icono: 'account_circle',
        children: [
          { name: 'Datos Generales', url: '/datosEmpleado' },
          { name: 'Contrato de Trabajo', url: '/cargoEmpleado' },
        ]
      },
      {
        name: 'Asistencia',
        accion: true,
        estado: true,
        icono: 'mobile_friendly',
        children: [
          { name: 'Planificación', url: '/planificacionHorario' },
          { name: 'Horarios', url: '/horariosEmpleado' },
        ]
      },
      {
        name: 'Horas Extras',
        accion: this.HabilitarHoraExtra,
        estado: true,
        icono: 'hourglass_full',
        children: [
          { name: 'Solicitar Hora Extra', url: '/horaExtraEmpleado' },
        ]
      },
      {
        name: 'Vacaciones',
        accion: true,
        estado: true,
        icono: 'flight',
        children: [
          { name: 'Solicitar Vacaciones', url: '/vacacionesEmpleado' },
        ]
      },
      {
        name: 'Permisos',
        accion: this.HabilitarPermisos,
        estado: true,
        icono: 'transfer_within_a_station',
        children: [
          { name: 'Solicitar Permiso', url: '/solicitarPermiso' },
        ]
      },
      {
        name: 'Alimentación',
        accion: this.HabilitarAlimentacion,
        estado: true,
        icono: 'restaurant',
        children: [
          { name: 'Planificación', url: '/almuerzosEmpleado' },
        ]
      },
      {
        name: 'Timbres',
        accion: true,
        estado: true,
        icono: 'fingerprint',
        children: [
          { name: 'Timbres personal', url: '/timbres-personal' },
        ]
      },
      {
        name: 'Acción Personal',
        accion: this.HabilitarAccion,
        estado: true,
        icono: 'how_to_reg',
        children: [
          { name: 'Procesos', url: '/procesosEmpleado' },
        ]
      },
      {
        name: 'Autorización',
        accion: true,
        estado: true,
        icono: 'lock_open',
        children: [
          { name: 'Autoridad', url: '/autorizaEmpleado' },
        ]
      },
      {
        name: 'Información',
        accion: true,
        estado: true,
        icono: 'info',
        children: [
          { name: 'Autoridades', url: '/informacion' },
          { name: 'Archivos', url: '/verDocumentacion' },
          { name: 'Estadísticas Generales', url: '/estadisticas' },
        ]
      },
      {
        name: 'Notificaciones',
        accion: true,
        estado: this.loginService.getEstado(),
        icono: 'notifications',
        children: [
          { name: 'Lista notificaciones', url: '/lista-notificaciones' },
        ]
      },
    ]
  }

}

