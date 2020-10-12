import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import * as moment from 'moment';

import { PlanHoraExtraService } from 'src/app/servicios/planHoraExtra/plan-hora-extra.service';
import { TiempoAutorizadoComponent } from 'src/app/componentes/horasExtras/tiempo-autorizado/tiempo-autorizado.component';
import { PlanHoraExtraAutorizaComponent } from 'src/app/componentes/autorizaciones/plan-hora-extra-autoriza/plan-hora-extra-autoriza.component';
import { ToastrService } from 'ngx-toastr';


export interface HoraExtraPlanElemento {
  apellido: string;
  cedula: string;
  codigo: string;
  empl_id: number;
  fecha_desde: string;
  fecha_hasta: string;
  fecha_timbre: string;
  hora_fin: string;
  hora_inicio: string;
  hora_total_timbre: number;
  id_plan_extra: number;
  nombre: string;
  observacion: string;
  tiempo_autorizado: string;
  timbre_entrada: string;
  timbre_salida: string
}

@Component({
  selector: 'app-lista-plan-hora-extra',
  templateUrl: './lista-plan-hora-extra.component.html',
  styleUrls: ['./lista-plan-hora-extra.component.css']
})
export class ListaPlanHoraExtraComponent implements OnInit {

  horas_extras_plan: any = [];

  horas_extras_plan_observacion: any = [];

  selectionUno = new SelectionModel<HoraExtraPlanElemento>(true, []);

  // Búsqueda
  cedula = new FormControl('', [Validators.minLength(2)]);

  filtroCedula: '';

  // Habilitar o Deshabilitar el icono de autorización individual
  auto_individual: boolean = true;

  // Items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  // Items de paginación de la tabla Observacion
  tamanio_pagina_O: number = 5;
  numero_pagina_O: number = 1;
  pageSizeOptions_O = [5, 10, 20, 50];

  // Habilitar o deshabilitar selector de empleados
  Habilitar: boolean = true;

  // Habilitar o deshabilitar lista de empleados con observaciones
  HabilitarObservacion: boolean = true;
  HabilitarAutoriza: boolean = true;

  constructor(
    private restHEP: PlanHoraExtraService,
    public toastr: ToastrService,
    private vistaFlotante: MatDialog
  ) { }

  ngOnInit(): void {
    this.obtenerPlanHorasExtras();
    this.obtenerPlanHorasExtrasObservacion();
    this.calcularHoraPaginacion1();
    this.calcularHoraPaginacion2();
  }

  // Evento para manejar paginación 
  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
    this.calcularHoraPaginacion1();
  }

  sumaHoras: any = [];
  horasSumadas;
  SumatoriaHoras1(inicio, fin) {
    var t1 = new Date();
    var tt = new Date();
    var hora1 = '00:00:00', horaT = '00:00:00'.split(":");
    this.restHEP.ConsultarPlanHoraExtra().subscribe(res => {
      this.sumaHoras = res;
      for (var i = inicio; i < fin; i++) {
        console.log('bucle', inicio, fin, i)
        if (i < this.sumaHoras.length) {
          hora1 = (this.sumaHoras[i].hora_total_timbre).split(":");
          t1.setHours(parseInt(hora1[0]), parseInt(hora1[1]), parseInt(hora1[2]));
          tt.setHours(parseInt(horaT[0]), parseInt(horaT[1]), parseInt(horaT[2]));

          //Aquí hago la suma
          tt.setHours(tt.getHours() + t1.getHours(), tt.getMinutes() + t1.getMinutes(), tt.getSeconds() + tt.getSeconds());
          horaT = (moment(tt).format('HH:mm:ss')).split(':');
          this.horasSumadas = (moment(tt).format('HH:mm:ss'));
          console.log('sjhuwhduw', this.horasSumadas);
        }
        else {
          console.log('break', this.horasSumadas);
          break;
        }
      }
      console.log(res);
    });
  }

  inicioFor = 0;
  calcularHoraPaginacion1() {
    if (this.numero_pagina != 1) {
      console.log("datos originales", this.numero_pagina, this.tamanio_pagina);

      this.inicioFor = (this.numero_pagina - 1) * this.tamanio_pagina;
      this.SumatoriaHoras1(this.inicioFor, ((this.numero_pagina) * this.tamanio_pagina))

    } else {
      console.log("datos originales else ", this.numero_pagina, this.tamanio_pagina);
      this.inicioFor = 0;
      this.SumatoriaHoras1(this.inicioFor, ((this.tamanio_pagina) * this.numero_pagina))
    }
    // this.SumatoriaHoras(this.inicioFor, ((this.tamanio_pagina - 1) * this.numero_pagina))
  }

  // Evento para manejar paginación 
  ManejarPaginaObserva(e: PageEvent) {
    this.tamanio_pagina_O = e.pageSize;
    this.numero_pagina_O = e.pageIndex + 1;
    this.calcularHoraPaginacion2();
  }

  sumaHoras2: any = [];
  horasSumadas2;
  SumatoriaHoras2(inicio, fin) {
    var t1 = new Date();
    var tt = new Date();
    var hora1 = '00:00:00', horaT = '00:00:00'.split(":");
    this.restHEP.ConsultarPlanHoraExtraObservacion().subscribe(res => {
      this.sumaHoras2 = res;
      for (var i = inicio; i < fin; i++) {
        console.log('bucle', inicio, fin, i)
        if (i < this.sumaHoras2.length) {
          hora1 = (this.sumaHoras2[i].hora_total_timbre).split(":");
          t1.setHours(parseInt(hora1[0]), parseInt(hora1[1]), parseInt(hora1[2]));
          tt.setHours(parseInt(horaT[0]), parseInt(horaT[1]), parseInt(horaT[2]));
          //Aquí hago la suma
          tt.setHours(tt.getHours() + t1.getHours(), tt.getMinutes() + t1.getMinutes(), tt.getSeconds() + tt.getSeconds());
          horaT = (moment(tt).format('HH:mm:ss')).split(':');
          this.horasSumadas2 = (moment(tt).format('HH:mm:ss'));
          console.log('sjhuwhduw', this.horasSumadas2);
        }
        else {
          console.log('break', this.horasSumadas2);
          break;
        }
      }
      console.log(res);
    });
  }

  inicioFor2 = 0;
  calcularHoraPaginacion2() {
    if (this.numero_pagina_O != 1) {
      console.log("datos originales", this.numero_pagina_O, this.tamanio_pagina_O);

      this.inicioFor2 = (this.numero_pagina_O - 1) * this.tamanio_pagina_O;
      this.SumatoriaHoras2(this.inicioFor2, ((this.numero_pagina_O) * this.tamanio_pagina_O))

    } else {
      console.log("datos originales else ", this.numero_pagina_O, this.tamanio_pagina_O);
      this.inicioFor2 = 0;
      this.SumatoriaHoras2(this.inicioFor2, ((this.tamanio_pagina_O) * this.numero_pagina_O))
    }
    // this.SumatoriaHoras(this.inicioFor, ((this.tamanio_pagina - 1) * this.numero_pagina))
  }

  // Lista de empleados que han realizado horas extras planificadas
  totalHorasExtras;
  obtenerPlanHorasExtras() {
    var t1 = new Date();
    var tt = new Date();
    var hora1 = '00:00:00', horaT = '00:00:00'.split(":");
    this.restHEP.ConsultarPlanHoraExtra().subscribe(res => {
      this.horas_extras_plan = res;
      console.log(this.horas_extras_plan);
      for (var i = 0; i <= this.horas_extras_plan.length - 1; i++) {

        if (this.horas_extras_plan[i].plan_estado === '1') {
          this.horas_extras_plan[i].plan_estado = 'Pendiente';
        }
        else if (this.horas_extras_plan[i].plan_estado === '2') {
          this.horas_extras_plan[i].plan_estado = 'Pre-Autorizado';
        }
        else if (this.horas_extras_plan[i].plan_estado === '3') {
          this.horas_extras_plan[i].plan_estado = 'Autorizado';
        }
        else if (this.horas_extras_plan[i].plan_estado === '4') {
          this.horas_extras_plan[i].plan_estado = 'Negado';
        }

        hora1 = (this.horas_extras_plan[i].hora_total_timbre).split(":");
        t1.setHours(parseInt(hora1[0]), parseInt(hora1[1]), parseInt(hora1[2]));
        tt.setHours(parseInt(horaT[0]), parseInt(horaT[1]), parseInt(horaT[2]));
        //Aquí hago la suma
        tt.setHours(tt.getHours() + t1.getHours(), tt.getMinutes() + t1.getMinutes(), tt.getSeconds() + tt.getSeconds());
        horaT = (moment(tt).format('HH:mm:ss')).split(':');
        this.totalHorasExtras = (moment(tt).format('HH:mm:ss'));
      }
      console.log('probando', this.horas_extras_plan);
    });
  }

  // Lista de empleados que han realizado horas extras planificadas y tienen observacion
  totalHorasExtrasO;
  obtenerPlanHorasExtrasObservacion() {
    var t1 = new Date();
    var tt = new Date();
    var hora1 = '00:00:00', horaT = '00:00:00'.split(":");
    this.restHEP.ConsultarPlanHoraExtraObservacion().subscribe(res => {
      this.horas_extras_plan_observacion = res;
      if (this.horas_extras_plan_observacion.length != 0) {
        this.HabilitarObservacion = false;
      } else {
        this.HabilitarObservacion = true;
      }
      for (var i = 0; i <= this.horas_extras_plan_observacion.length - 1; i++) {

        if (this.horas_extras_plan_observacion[i].plan_estado === '1') {
          this.horas_extras_plan_observacion[i].plan_estado = 'Pendiente';
        }
        else if (this.horas_extras_plan_observacion[i].plan_estado === '2') {
          this.horas_extras_plan_observacion[i].plan_estado = 'Pre-Autorizado';
        }
        else if (this.horas_extras_plan_observacion[i].plan_estado === '3') {
          this.horas_extras_plan_observacion[i].plan_estado = 'Autorizado';
        }
        else if (this.horas_extras_plan_observacion[i].plan_estado === '4') {
          this.horas_extras_plan_observacion[i].plan_estado = 'Negado';
        }

        hora1 = (this.horas_extras_plan_observacion[i].hora_total_timbre).split(":");
        t1.setHours(parseInt(hora1[0]), parseInt(hora1[1]), parseInt(hora1[2]));
        tt.setHours(parseInt(horaT[0]), parseInt(horaT[1]), parseInt(horaT[2]));
        //Aquí hago la suma
        tt.setHours(tt.getHours() + t1.getHours(), tt.getMinutes() + t1.getMinutes(), tt.getSeconds() + tt.getSeconds());
        horaT = (moment(tt).format('HH:mm:ss')).split(':');
        this.totalHorasExtrasO = (moment(tt).format('HH:mm:ss'));
      }
      console.log(this.horas_extras_plan_observacion);
    });
  }

  // Autorizar horas realizadas o indicar cuantas horas se autorizan
  AbrirTiempoAutorizacion(num_hora, id, datos) {
    let h = {
      id: id,
      hora: num_hora
    }
    this.vistaFlotante.open(TiempoAutorizadoComponent, {
      width: '300px',
      data: { horas_calculadas: h, pagina: 'plan_hora_extra' }
    }).afterClosed().subscribe(items => {
      if (items === true) {
        this.AbrirAutorizaciones(datos, 'individual');
      }
    });
  }

  // Autorización individual de horas extras planificadas
  AbrirAutorizaciones(datosHoraExtra, forma: string) {
    this.vistaFlotante.open(PlanHoraExtraAutorizaComponent,
      { width: '300px', data: { datosHora: datosHoraExtra, carga: forma } }).afterClosed().subscribe(items => {
        this.obtenerPlanHorasExtras();
      });
  }

  /* // Autorización multiple de horas extras planificadas
   AutorizarHoras() {
     for (var i = 0; i <= this.empleadosSeleccionados.length - 1; i++) {
       let h = {
         hora: this.empleadosSeleccionados[i].hora_total_timbre
       }
       this.restHEP.AutorizarTiempoHoraExtra(this.empleadosSeleccionados[i].id_plan_extra, h).subscribe(res => {
       })
     }
     this.AbrirAutorizaciones(this.empleadosSeleccionados, 'multiple');
     //this.habilitado = { 'visibility': 'visible' };
     this.Habilitar = true;
     (<HTMLInputElement>document.getElementById('selecTodo')).checked = false;
     this.obtenerPlanHorasExtras();
   }*/





  /** Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelected() {
    const numSelected = this.selectionUno.selected.length;
    const numRows = this.horas_extras_plan.length;
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario, selección clara. */
  masterToggle() {
    this.isAllSelected() ?
      this.selectionUno.clear() :
      this.horas_extras_plan.forEach(row => this.selectionUno.select(row));
  }

  /** La etiqueta de la casilla de verificación en la fila pasada*/
  checkboxLabel(row?: HoraExtraPlanElemento): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionUno.isSelected(row) ? 'deselect' : 'select'} row ${row.id_plan_extra + 1}`;
  }

  btnCheckHabilitar: boolean = false;
  HabilitarSeleccion() {
    if (this.btnCheckHabilitar === false) {
      this.btnCheckHabilitar = true;
      this.auto_individual = false;
    } else if (this.btnCheckHabilitar === true) {
      this.btnCheckHabilitar = false;
      this.auto_individual = true;
    }
  }


  AutorizarHoras() {
    let EmpleadosSeleccionados;
    EmpleadosSeleccionados = this.selectionUno.selected.map(obj => {
      return {
        id_plan_extra: obj.id_plan_extra,
        hora_total_timbre: obj.hora_total_timbre,

      }
    })
    for (var i = 0; i <= EmpleadosSeleccionados.length - 1; i++) {
      let h = {
        hora: EmpleadosSeleccionados[i].hora_total_timbre
      }
      this.restHEP.AutorizarTiempoHoraExtra(EmpleadosSeleccionados[i].id_plan_extra, h).subscribe(res => {
      })
    }
    this.AbrirAutorizaciones(EmpleadosSeleccionados, 'multiple');

    /*  for (var i = 0; i <= this.empleadosSeleccionados.length - 1; i++) {
        let h = {
          hora: this.empleadosSeleccionados[i].hora_total_timbre
        }
        this.restHEP.AutorizarTiempoHoraExtra(this.empleadosSeleccionados[i].id_plan_extra, h).subscribe(res => {
        })
      }
      this.AbrirAutorizaciones(this.empleadosSeleccionados, 'multiple');
      //this.habilitado = { 'visibility': 'visible' };
      this.Habilitar = true;
      (<HTMLInputElement>document.getElementById('selecTodo')).checked = false;
      this.obtenerPlanHorasExtras();
  */

  }


  /** Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelectedO() {
    const numSelected = this.selectionUno.selected.length;
    const numRows = this.horas_extras_plan.length;
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario, selección clara. */
  masterToggleO() {
    this.isAllSelected() ?
      this.selectionUno.clear() :
      this.horas_extras_plan_observacion.forEach(row => this.selectionUno.select(row));
  }

  /** La etiqueta de la casilla de verificación en la fila pasada*/
  checkboxLabelO(row?: HoraExtraPlanElemento): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionUno.isSelected(row) ? 'deselect' : 'select'} row ${row.id_plan_extra + 1}`;
  }

  btnCheckHabilitarO: boolean = false;
  auto_individualO: boolean = true;
  HabilitarSeleccionO() {
    if (this.btnCheckHabilitarO === false) {
      this.btnCheckHabilitarO = true;
      this.auto_individualO = false;
    } else if (this.btnCheckHabilitarO === true) {
      this.btnCheckHabilitarO = false;
      this.auto_individualO = true;
    }
  }

  limpiarCampos() {
    this.cedula.reset();
  }

  
  IngresarSoloNumeros(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
      return false;
    }
  }

}
