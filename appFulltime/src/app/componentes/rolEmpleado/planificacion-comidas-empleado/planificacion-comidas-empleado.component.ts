import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import { PlanComidasService } from 'src/app/servicios/planComidas/plan-comidas.service';
import { EditarPlanComidasComponent } from 'src/app/componentes/planificacionComidas/editar-plan-comidas/editar-plan-comidas.component';
import { MetodosComponent } from 'src/app/componentes/metodoEliminar/metodos.component';
import { SolicitaComidaComponent } from '../../planificacionComidas/solicita-comida/solicita-comida.component';

@Component({
  selector: 'app-planificacion-comidas-empleado',
  templateUrl: './planificacion-comidas-empleado.component.html',
  styleUrls: ['./planificacion-comidas-empleado.component.css']
})
export class PlanificacionComidasEmpleadoComponent implements OnInit {

  idEmpleado: string;
  /* Items de paginación de la tabla */
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    public restPlanComidas: PlanComidasService,
    private toastr: ToastrService,
    public vistaRegistrarDatos: MatDialog,
    public router: Router,

  ) {
    this.idEmpleado = localStorage.getItem('empleado');
  }

  ngOnInit(): void {
    this.obtenerPlanComidasEmpleado(parseInt(this.idEmpleado));
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  /** Método para mostrar datos de planificación de servicio de alimentación */
  planComidas: any;
  obtenerPlanComidasEmpleado(id_empleado: number) {
    this.planComidas = [];
    this.restPlanComidas.ObtenerPlanComidaPorIdEmpleado(id_empleado).subscribe(res => {
      this.planComidas = res;
      console.log('comidas 1', this.planComidas);
      this.restPlanComidas.ObtenerSolComidaPorIdEmpleado(id_empleado).subscribe(sol => {
        this.planComidas = this.planComidas.concat(sol);
        console.log('comidas 2', this.planComidas);
      });
    }, error => {
      this.restPlanComidas.ObtenerSolComidaPorIdEmpleado(id_empleado).subscribe(sol2 => {
        this.planComidas = sol2;
        console.log('comidas 3', this.planComidas);
      });
    });
  }

  /* Ventana para editar planificación de comidas */
  AbrirEditarPlanComidas(datoSeleccionado): void {
    console.log(datoSeleccionado);
    this.vistaRegistrarDatos.open(EditarPlanComidasComponent, { width: '1200px', data: datoSeleccionado })
      .afterClosed().subscribe(item => {
        this.obtenerPlanComidasEmpleado(parseInt(this.idEmpleado));
      });
  }

  /** Función para eliminar registro seleccionado Planificación*/
  EliminarPlanComidas(id_plan: number) {
    this.restPlanComidas.EliminarRegistro(id_plan).subscribe(res => {
      this.toastr.error('Registro eliminado', '', {
        timeOut: 6000,
      });
      this.obtenerPlanComidasEmpleado(parseInt(this.idEmpleado));
    });
  }

  /** Función para confirmar si se elimina o no un registro */
  ConfirmarDeletePlanComidas(datos: any) {
    console.log(datos);
    this.vistaRegistrarDatos.open(MetodosComponent, { width: '450px' }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.EliminarPlanComidas(datos.id);
        } else {
          this.router.navigate(['/almuerzosEmpleado/', this.idEmpleado]);
        }
      });
  }

  /* Ventana para ingresar solicitud de comidas */
  AbrirVentanaPlanificacion(): void {
    console.log(this.idEmpleado);
    this.vistaRegistrarDatos.open(SolicitaComidaComponent, {
      width: '1200px',
      data: { idEmpleado: this.idEmpleado, modo: 'solicitud' }
    })
      .afterClosed().subscribe(item => {
        this.obtenerPlanComidasEmpleado(parseInt(this.idEmpleado));
      });
  }

}
