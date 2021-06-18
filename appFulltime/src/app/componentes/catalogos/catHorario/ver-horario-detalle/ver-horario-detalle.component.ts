import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

import { DetalleCatHorariosService } from 'src/app/servicios/horarios/detalleCatHorarios/detalle-cat-horarios.service';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { DetalleCatHorarioComponent } from 'src/app/componentes/catalogos/catHorario/detalle-cat-horario/detalle-cat-horario.component';
import { EditarHorarioComponent } from 'src/app/componentes/catalogos/catHorario/editar-horario/editar-horario.component';
import { EditarDetalleCatHorarioComponent } from 'src/app/componentes/catalogos/catHorario/editar-detalle-cat-horario/editar-detalle-cat-horario.component';
import { MetodosComponent } from 'src/app/componentes/metodoEliminar/metodos.component';

@Component({
  selector: 'app-ver-horario-detalle',
  templateUrl: './ver-horario-detalle.component.html',
  styleUrls: ['./ver-horario-detalle.component.css']
})
export class VerHorarioDetalleComponent implements OnInit {

  idHorario: string;
  datosHorario: any = [];
  datosDetalle: any = [];

  // items de paginación de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  booleanMap = { 'true': 'Si', 'false': 'No' };
  hipervinculo: string = environment.url;

  constructor(
    public router: Router,
    private rest: HorarioService,
    private restD: DetalleCatHorariosService,
    private toastr: ToastrService,
    public vistaRegistrarDatos: MatDialog,
  ) {
    var cadena = this.router.url;
    var aux = cadena.split("/");
    this.idHorario = aux[2];
  }

  ngOnInit(): void {
    this.BuscarDatosHorario(this.idHorario);
    this.ListarDetalles(this.idHorario);
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1
  }

  BuscarDatosHorario(id_horario: any) {
    this.datosHorario = [];
    this.rest.getOneHorarioRest(id_horario).subscribe(data => {
      this.datosHorario = data;
    })
  }

  ListarDetalles(id_horario: any) {
    this.datosDetalle = [];
    this.restD.ConsultarUnDetalleHorario(id_horario).subscribe(datos => {
      this.datosDetalle = datos;
    })
  }

  AbrirVentanaDetalles(datosSeleccionados): void {
    this.vistaRegistrarDatos.open(DetalleCatHorarioComponent,
      { width: '600px', data: { datosHorario: datosSeleccionados, actualizar: true } })
      .afterClosed().subscribe(item => {
        this.BuscarDatosHorario(this.idHorario);
        this.ListarDetalles(this.idHorario);
      });
  }

  AbrirVentanaEditar(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EditarHorarioComponent, { width: '900px', data: { horario: datosSeleccionados, actualizar: true } })
      .afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.datosHorario = result
        }
      });
  }

  AbrirVentanaEditarDetalle(datosSeleccionados: any): void {
    console.log(datosSeleccionados);
    this.vistaRegistrarDatos.open(EditarDetalleCatHorarioComponent,
      { width: '600px', data: datosSeleccionados }).afterClosed().subscribe(item => {
        this.BuscarDatosHorario(this.idHorario);
        this.ListarDetalles(this.idHorario);
      });
  }

  /** Función para eliminar registro seleccionado Planificación*/
  EliminarDetalle(id_detalle: number) {
    this.restD.EliminarRegistro(id_detalle).subscribe(res => {
      this.toastr.error('Registro eliminado','', {
        timeOut: 6000,
      });
      this.BuscarDatosHorario(this.idHorario);
      this.ListarDetalles(this.idHorario);
    });
  }

  /** Función para confirmar si se elimina o no un registro */
  ConfirmarDelete(datos: any) {
    console.log(datos);
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.EliminarDetalle(datos.id);
        } else {
          this.router.navigate(['/verHorario/', this.idHorario]);
        }
      });
  }

  CalcularHorasTrabaja() {

    if (this.datosDetalle.length === 0 ) return this.toastr.error('Falta ingresar el detalle de los horarios.')
    if (this.datosDetalle.length === 1 ) return this.toastr.error('Falta ingresar el detalle de los horarios. Debe tener al menos 2 detalles de horarios')
    if (this.datosDetalle.length === 3 ) return this.toastr.error('Falta ingresar el detalle de los horarios. Debe tener al menos 4 detalles de horarios')

    const [ cg_horario ] = this.datosHorario;
    const { nocturno, id, min_almuerzo } = cg_horario;

    if (nocturno === true) {

      const hora_ini_horario_nocturno = this.StringTimeToSegundosTime('19:00:00');
      const median_noche = this.StringTimeToSegundosTime('24:00:00');
      
      const detalleNocturno = this.datosDetalle.map(o => {

        let tiempo = this.StringTimeToSegundosTime(o.hora);
        let value = (hora_ini_horario_nocturno <= tiempo && median_noche > tiempo) ? tiempo :  tiempo + median_noche

        return {
          orden: o.orden,
          hora: value
        }
      })

      this.ActulizarHorasTrabajaSegunHorario(detalleNocturno, id, min_almuerzo)
    } else {

      const detalleDiurno = this.datosDetalle.map(o => {
        return {
          orden: o.orden,
          hora: this.StringTimeToSegundosTime(o.hora)
        }
      })

      this.ActulizarHorasTrabajaSegunHorario(detalleDiurno, id, min_almuerzo)
    }
    
  }

  ActulizarHorasTrabajaSegunHorario(detalle: any[], id: number, min_almuerzo: number ) {
    const [det_uno, det_dos, det_tres, det_cuatro ] = detalle;
    
    const diferencia2 = (det_tres === undefined) ? 0 : det_tres.hora - det_dos.hora;
    console.log(diferencia2);
    
    let minutos: number = Math.floor((diferencia2 / 60));

    console.log('Almuerzo:', minutos, '===', min_almuerzo);
    if (minutos !== min_almuerzo) return this.toastr.warning('Los minutos de almuerzo del horario no coincide con la diferencia realizada en el detalle del horario.')
    
    const diferencia1 = det_dos.hora - det_uno.hora;
    const diferencia3 = (det_cuatro === undefined) ? 0 : det_cuatro.hora - det_tres.hora;

    const hora_trabajo = diferencia1 + diferencia3;
    const ht = this.SegundosToStringTime(hora_trabajo);
    
    console.log('Horas trabaja segun detalle horario:', ht, '=====', this.datosHorario[0].hora_trabajo);
    if (ht !== this.datosHorario[0].hora_trabajo) {
      this.rest.updateHorasTrabajaByDetalleHorario(id, { hora_trabajo: ht }).subscribe(res => {
        this.datosHorario = res;
        this.toastr.success('Hora de trabajo actualizado.')
      }, err => {
        console.log(err);
        this.toastr.error(err.message)
      })
    } else {
      this.toastr.success('Hora de trabajo actualizado.')
    }

  }

  StringTimeToSegundosTime(stringTime: string) {

    const h = parseInt(stringTime.split(':')[0]) * 3600;
    const m = parseInt(stringTime.split(':')[1]) * 60;
    const s = parseInt(stringTime.split(':')[2]);

    return h + m + s
  }

  SegundosToStringTime(segundos: number) {
    let h: string | number = Math.floor(segundos / 3600);
    h = (h < 10)? '0' + h : h;
    let m: string | number = Math.floor((segundos / 60) % 60);
    m = (m < 10)? '0' + m : m;
    let s: string | number = segundos % 60;
    s = (s < 10)? '0' + s : s;

    return h + ':' + m + ':' + s;
  }

}
