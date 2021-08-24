// IMPORTAR LIBRERIAS
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

// IMPORTAR SERVICIOS
import { DetalleCatHorariosService } from 'src/app/servicios/horarios/detalleCatHorarios/detalle-cat-horarios.service';
import { EmpleadoHorariosService } from 'src/app/servicios/horarios/empleadoHorarios/empleado-horarios.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { PlanGeneralService } from 'src/app/servicios/planGeneral/plan-general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-horarios-multiples',
  templateUrl: './horarios-multiples.component.html',
  styleUrls: ['./horarios-multiples.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
  ]
})

export class HorariosMultiplesComponent implements OnInit {

  // OPCIONES DE DÍAS LIBRERIAS EN HORARIOS
  miercoles = false;
  domingo = false;
  viernes = false;
  martes = false;
  jueves = false;
  sabado = false;
  lunes = false;

  horarios: any = []; // VARIABLE DE ALMACENAMIENTO DE HORARIOS

  fechaInicioF = new FormControl('', Validators.required);
  fechaFinalF = new FormControl('', Validators.required);
  horarioF = new FormControl('', Validators.required);
  miercolesF = new FormControl('');
  viernesF = new FormControl('');
  domingoF = new FormControl('');
  martesF = new FormControl('');
  juevesF = new FormControl('');
  sabadoF = new FormControl('');
  lunesF = new FormControl('');

  // ASIGNACIÓN DE VALIDACIONES A INPUTS DEL FORMULARIO
  public EmpleadoHorarioForm = new FormGroup({
    fechaInicioForm: this.fechaInicioF,
    fechaFinalForm: this.fechaFinalF,
    miercolesForm: this.miercolesF,
    horarioForm: this.horarioF,
    viernesForm: this.viernesF,
    domingoForm: this.domingoF,
    martesForm: this.martesF,
    juevesForm: this.juevesF,
    sabadoForm: this.sabadoF,
    lunesForm: this.lunesF,
  });

  constructor(
    public router: Router, // VARIABLE USADA PARA NAVEGACIÓN ENTRE PÁGINAS
    public restH: HorarioService, // SERVCIOS DE HORARIOS
    public restE: EmpleadoService, // SERVICIOS DE DATOS DE EMPLEADOS
    private toastr: ToastrService, // VARIABLE USADA PARA MOSTRAR NOTIFICACIONES
    public restP: PlanGeneralService, // SERVICIO DE DATOS DE PLANIFICACIÓN DE HORARIOS
    public rest: EmpleadoHorariosService, // SERVICIO DE DATOS DE HORARIOS ASIGNADOS A UN EMPLEADO
    public restD: DetalleCatHorariosService, // SERVICIO DE DATOS DE DETALLES DE HORARIOS
    @Inject(MAT_DIALOG_DATA) public data: any, // IMPORTACIÓN DE DATOS DE COMPONENTE HORARIOS-MULTIPLE-EMPLEADO
    public ventana: MatDialogRef<HorariosMultiplesComponent>, // VARIABLE USADA PARA ABRIR VENTANAS EXTERNAS
  ) { }

  ngOnInit(): void {
    console.log('varios', this.data.datos)
    this.BuscarHorarios();
    this.ObtenerEmpleado(this.data.datos.idEmpleado);
  }

  // VARIABLES DE ALMACENAMIENTO DE DATOS ESPECIFICOS DE UN HORARIO
  detalles_horarios: any = [];
  vista_horarios: any = [];
  hora_entrada: any;
  hora_salida: any;

  // MÉTODO PARA MOSTRAR NOMBRE DE HORARIO CON DETALLE DE ENTRADA Y SALIDA
  BuscarHorarios() {
    this.horarios = [];
    this.vista_horarios = [];
    // BÚSQUEDA DE HORARIOS
    this.restH.getHorariosRest().subscribe(datos => {
      this.horarios = datos;
      this.horarios.map(hor => {
        // BÚSQUEDA DE DETALLES DE ACUERDO AL ID DE HORARIO
        this.restD.ConsultarUnDetalleHorario(hor.id).subscribe(res => {
          this.detalles_horarios = res;
          this.detalles_horarios.map(det => {
            if (det.tipo_accion === 'E') {
              this.hora_entrada = det.hora.slice(0, 5)
            }
            if (det.tipo_accion === 'S') {
              this.hora_salida = det.hora.slice(0, 5)
            }
          })
          let datos_horario = [{
            id: hor.id,
            nombre: '(' + this.hora_entrada + '-' + this.hora_salida + ') ' + hor.nombre
          }]
          if (this.vista_horarios.length === 0) {
            this.vista_horarios = datos_horario;
          } else {
            this.vista_horarios = this.vista_horarios.concat(datos_horario);
          }
        }, error => {
          let datos_horario = [{
            id: hor.id,
            nombre: hor.nombre
          }]
          if (this.vista_horarios.length === 0) {
            this.vista_horarios = datos_horario;
          } else {
            this.vista_horarios = this.vista_horarios.concat(datos_horario);
          }
        })
      })
    })
  }

  // MÉTODO PARA VER LA INFORMACIÓN DEL EMPLEADO
  empleado: any = [];
  ObtenerEmpleado(idemploy: any) {
    this.empleado = [];
    this.restE.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleado = data;
    })
  }

  // MÉTODO PARA VERIFICAR QUE CAMPOS DE FECHAS NO SE ENCUENTREN VACIOS
  VerificarIngresoFechas(form) {
    if (form.fechaInicioForm === '' || form.fechaInicioForm === null || form.fechaInicioForm === undefined ||
      form.fechaFinalForm === '' || form.fechaFinalForm === null || form.fechaFinalForm === undefined) {
      this.toastr.warning('Por favor ingrese fechas de inicio y fin de actividades.', '', {
        timeOut: 6000,
      });
      this.EmpleadoHorarioForm.patchValue({
        horarioForm: 0
      })
    }
    else {
      this.ValidarFechas(form);
    }
  }

  // MÉTODO PARA VERIFICAR SI EL EMPLEADO INGRESO CORRECTAMENTE LAS FECHAS
  ValidarFechas(form) {
    if (Date.parse(form.fechaInicioForm) < Date.parse(form.fechaFinalForm)) {
      this.VerificarFormatoHoras(form);
    }
    else {
      this.toastr.warning('Fecha de inicio de actividades debe ser mayor a la fecha fin de actividades.', '', {
        timeOut: 6000,
      });
      this.EmpleadoHorarioForm.patchValue({
        horarioForm: 0
      })
    }
  }

  // MÉTODO PARA VERIFICAR EL FORMATO DE HORAS DE UN HORARIO
  VerificarFormatoHoras(form) {
    const [obj_res] = this.horarios.filter(o => {
      return o.id === parseInt(form.horarioForm)
    })
    if (!obj_res) return this.toastr.warning('Horario no válido.');
    if (obj_res.detalle === true) {
      const { hora_trabajo, id } = obj_res;
      console.log('horario_horas', this.StringTimeToSegundosTime(hora_trabajo))
      // VERIFICACIÓN DE FORMATO CORRECTO DE HORARIOS
      if (!this.StringTimeToSegundosTime(hora_trabajo)) {
        this.EmpleadoHorarioForm.patchValue({ horarioForm: 0 });
        this.toastr.warning('Formato de horas en horario seleccionado no son válidas.', 'Dar click para verificar registro de detalle de horario.', {
          timeOut: 6000,
        }).onTap.subscribe(obj => {
          this.ventana.close();
          this.router.navigate(['/verHorario', id]);
        });
      }
    }
  }


  // MÉTODO PARA LIMPIAR CAMPO SELECCIÓN DE HORARIO
  LimpiarHorario() {
    this.EmpleadoHorarioForm.patchValue({ horarioForm: 0 });
  }

  // MÉTODO PARA VERIFICAR QUE LOS USUARIOS NO DUPLIQUEN SU ASIGNACIÓN DE HORARIO
  emplHorarioDuplicado: any = [];
  empleadosH: any = [];

  emplProblemas: any = [];
  emplCorrectos: any = [];

  VerificarDuplicidad(form) {
    this.contador = 0;
    let fechas = {
      fechaInicio: form.fechaInicioForm,
      fechaFinal: form.fechaFinalForm,
      id_horario: form.horarioForm
    };
    let duplicados = [];
    let correctos = [];
    this.data.datos.map(dh => {
      // MÉTODO PARA BUSCAR DATOS DUPLICADOS DE HORARIOS
      this.rest.VerificarDuplicidadHorarios(dh.id, fechas).subscribe(response => {
        duplicados = duplicados.concat(dh);
        this.contador = this.contador + 1;
        if (this.contador === this.data.datos.length) {
          this.VerificarContrato(form, correctos, duplicados);
        }
      }, error => {
        correctos = correctos.concat(dh);
        this.contador = this.contador + 1;
        if (this.contador === this.data.datos.length) {
          this.VerificarContrato(form, correctos, duplicados);
        }
      });
    })
  }

  // MÉTODO PARA VERIFICAR FECHAS DE CONTRATO 
  cont2: number = 0;
  VerificarContrato(form, correctos, problemas) {
    this.cont2 = 0;
    let contrato = [];
    correctos.map(dh => {
      let datosBusqueda = {
        id_cargo: dh.id_cargo,
        id_empleado: dh.id
      }
      // MÉTODO PARA BUSCAR FECHA DE CONTRATO REGISTRADO EN FICHA DE EMPLEADO
      this.restE.BuscarFechaContrato(datosBusqueda).subscribe(response => {
        // VERIFICAR SI LAS FECHAS SON VALIDAS DE ACUERDO A LOS REGISTROS Y FECHAS INGRESADAS
        if (Date.parse(response[0].fec_ingreso.split('T')[0]) < Date.parse(form.fechaInicioForm)) {
          contrato = contrato.concat(dh);
          this.cont2 = this.cont2 + 1;
          if (this.cont2 === correctos.length) {
            this.ventana.close(problemas);
            console.log('errores', problemas)
            console.log('CORRECTO', contrato)
          }
        }
        else {
          problemas = problemas.concat(dh);
          this.cont2 = this.cont2 + 1;
          if (this.cont2 === correctos.length) {
            this.ventana.close(problemas);
            console.log('errores', problemas)
            console.log('CORRECTO', contrato)
          }
        }
      }, error => { });
    })
  }

  fechasHorario: any = [];
  inicioDate: any;
  finDate: any;
  contador: number = 0;
  InsertarEmpleadoHorario(form) {


    this.contador = 0;
    this.data.datos.map(obj => {
      let datosempleH = {
        id_empl_cargo: obj.id_cargo,
        id_hora: 0,
        fec_inicio: form.fechaInicioForm,
        fec_final: form.fechaFinalForm,
        lunes: form.lunesForm,
        martes: form.martesForm,
        miercoles: form.miercolesForm,
        jueves: form.juevesForm,
        viernes: form.viernesForm,
        sabado: form.sabadoForm,
        domingo: form.domingoForm,
        id_horarios: form.horarioForm,
        estado: form.estadoForm,
        codigo: obj.codigo
      };
      console.log(datosempleH);
      this.rest.IngresarEmpleadoHorarios(datosempleH).subscribe(response => {

        //this.IngresarPlanGeneral(form);
        //this.CerrarVentanaEmpleadoHorario();
        this.contador = this.contador + 1;
        if (this.contador === this.data.datos.length) {
          this.ventana.close();
          window.location.reload();
          this.toastr.success('Operación Exitosa', 'Se registra un total de  ' + this.data.datos.length + ' Registros de horarios.', {
            timeOut: 6000,
          })
        }
      });
    })

  }

  detalles: any = [];
  IngresarPlanGeneral(form) {
    this.detalles = [];
    this.restD.ConsultarUnDetalleHorario(form.horarioForm).subscribe(res => {
      this.detalles = res;

      this.fechasHorario = []; // ARRAY QUE CONTIENE TODAS LAS FECHAS DEL MES INDICADO 
      this.inicioDate = moment(form.fechaInicioForm).format('MM-DD-YYYY');
      this.finDate = moment(form.fechaFinalForm).format('MM-DD-YYYY');

      // INICIALIZAR DATOS DE FECHA
      var start = new Date(this.inicioDate);
      var end = new Date(this.finDate);

      // LÓGICA PARA OBTENER EL NOMBRE DE CADA UNO DE LOS DÍA DEL PERIODO INDICADO
      while (start <= end) {
        this.fechasHorario.push(moment(start).format('YYYY-MM-DD'));
        var newDate = start.setDate(start.getDate() + 1);
        start = new Date(newDate);
      }
      this.fechasHorario.map(obj => {
        this.detalles.map(element => {
          var accion = 0;
          if (element.tipo_accion === 'E') {
            accion = element.minu_espera;
          }
          let plan = {
            estado: null,
            fec_horario: obj,
            maxi_min_espera: accion,
            id_det_horario: element.id,
            id_horario: form.horarioForm,
            codigo: this.empleado[0].codigo,
            tipo_entr_salida: element.tipo_accion,
            id_empl_cargo: this.data.datos.idCargo,
            fec_hora_horario: obj + ' ' + element.hora,
          };
          this.restP.CrearPlanGeneral(plan).subscribe(res => {
          })

        })
      })
      this.toastr.success('Operación Exitosa', 'Horario del Empleado registrado', {
        timeOut: 6000,
      });
    });
  }

  LimpiarCampos() {
    this.EmpleadoHorarioForm.reset();
    this.EmpleadoHorarioForm.patchValue({
      lunesForm: false,
      martesForm: false,
      miercolesForm: false,
      juevesForm: false,
      viernesForm: false,
      sabadoForm: false,
      domingoForm: false
    });
  }

  CerrarVentanaEmpleadoHorario() {
    this.LimpiarCampos();
    this.ventana.close(this.data.datosItem);
  }

  // MÉTODO PARA VALIDAR HORAS DE TRABAJO SEGÚN CONTRATO
  sumHoras: any;
  suma = '00:00:00';
  horariosEmpleado: any = []
  ValidarHorarioByHorasTrabaja(form, correctos) {
    const [obj_res] = this.horarios.filter(o => {
      return o.id === parseInt(form.horarioForm)
    })
    if (!obj_res) return this.toastr.warning('Horario no válido.');
    if (obj_res.detalle === false) {
    }
    else {
      correctos.map(dh => {

        const seg = this.SegundosToStringTime(dh.horas_trabaja * 3600)
        const { hora_trabajo, id } = obj_res;
        console.log('horario_horas', this.StringTimeToSegundosTime(hora_trabajo))
        console.log(obj_res, hora_trabajo, ' ====== ', seg);

        // VERIFICACIÓN DE FORMATO CORRECTO DE HORARIOS
        if (!this.StringTimeToSegundosTime(hora_trabajo)) {
          this.EmpleadoHorarioForm.patchValue({ horarioForm: 0 });
          this.toastr.warning('Formato de horas en horario seleccionado no son válidas.', 'Dar click para verificar registro de detalle de horario.', {
            timeOut: 6000,
          }).onTap.subscribe(obj => {
            this.ventana.close();
            this.router.navigate(['/verHorario', id]);
          });
        }
        else {
          // MÉTODO PARA LECTURA DE HORARIOS DE EMPLEADO
          this.horariosEmpleado = [];
          let fechas = {
            fechaInicio: form.fechaInicioForm,
            fechaFinal: form.fechaFinalForm,
          };
          this.rest.VerificarHorariosExistentes(this.data.idEmpleado, fechas).subscribe(existe => {
            this.horariosEmpleado = existe;
            console.log('ver horas horarios', this.horariosEmpleado);
            this.horariosEmpleado.map(h => {
              console.log('ver horas', h.hora_trabajo);
              // SUMA DE HORAS DE CADA UNO DE LOS HORARIOS DEL EMPLEADO
              this.suma = moment(this.suma, 'HH:mm:ss').add(moment.duration(h.hora_trabajo)).format('HH:mm:ss');
            })
            // SUMA DE HORAS TOTALES DE HORARIO CON HORAS DE HORARIO SELECCIONADO
            this.sumHoras = moment(this.suma, 'HH:mm:ss').add(moment.duration(hora_trabajo)).format('HH:mm:ss');
            console.log('horas totales de horarios', this.sumHoras);

            // MÉTODO PARA COMPARAR HORAS DE TRABAJO CON HORAS DE CONTRATO
            if (this.StringTimeToSegundosTime(this.sumHoras) === this.StringTimeToSegundosTime(seg)) {
              return this.toastr.info('Va a cumplir un total de: ' + this.sumHoras + ' horas.')
            } else if (this.StringTimeToSegundosTime(this.sumHoras) < this.StringTimeToSegundosTime(seg)) {
              return this.toastr.info('Cumplirá un total de ' + this.sumHoras + ' horas.',
                'Recuerde que de acuerdo a su contrato debe cumplir un total de ' + seg + ' horas.', {
                timeOut: 6000,
              });
            }
            else {
              this.EmpleadoHorarioForm.patchValue({ horarioForm: 0 });
              return this.toastr.warning('Esta registrando un total de ' + this.sumHoras + ' horas.',
                'Recuerde que de acuerdo a su contrato debe cumplir un total de ' + seg + ' horas.', {
                timeOut: 6000,
              });
            }
          }, error => {
            // MÉTODO PARA COMPARAR HORAS DE TRABAJO CON HORAS DE CONTRATO CUANDO NO EXISTEN HORARIOS EN LAS FECHAS INDICADAS
            if (this.StringTimeToSegundosTime(hora_trabajo) === this.StringTimeToSegundosTime(seg)) {
              return this.toastr.info('Va a cumplir un total de: ' + hora_trabajo + ' horas.')
            } else if (this.StringTimeToSegundosTime(hora_trabajo) < this.StringTimeToSegundosTime(seg)) {
              return this.toastr.info('Cumplirá un total de ' + hora_trabajo + ' horas.',
                'Recuerde que de acuerdo a su contrato debe cumplir un total de ' + seg + ' horas.', {
                timeOut: 6000,
              });
            }
            else {
              this.EmpleadoHorarioForm.patchValue({ horarioForm: 0 });
              return this.toastr.warning('El horario seleccionado indica un total de ' + hora_trabajo + ' horas.',
                'Recuerde que de acuerdo a su contrato debe cumplir un total de ' + seg + ' horas.', {
                timeOut: 6000,
              });
            }
          });
        }


      })

    }
  }

  SegundosToStringTime(segundos: number) {
    let h: string | number = Math.floor(segundos / 3600);
    h = (h < 10) ? '0' + h : h;
    let m: string | number = Math.floor((segundos / 60) % 60);
    m = (m < 10) ? '0' + m : m;
    let s: string | number = segundos % 60;
    s = (s < 10) ? '0' + s : s;
    return h + ':' + m + ':' + s;
  }

  StringTimeToSegundosTime(stringTime: string) {
    const h = parseInt(stringTime.split(':')[0]) * 3600;
    const m = parseInt(stringTime.split(':')[1]) * 60;
    const s = parseInt(stringTime.split(':')[2]);
    return h + m + s
  }


}
