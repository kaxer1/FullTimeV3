import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { PlanComidasService } from 'src/app/servicios/planComidas/plan-comidas.service';
import { EditarPlanComidasComponent } from 'src/app/componentes/planificacionComidas/editar-plan-comidas/editar-plan-comidas.component';
import { MetodosComponent } from 'src/app/componentes/metodoEliminar/metodos.component';
import { PlanificacionComidasComponent } from 'src/app/componentes/planificacionComidas/planificacion-comidas/planificacion-comidas.component';


@Component({
  selector: 'app-planificacion-comidas-empleado',
  templateUrl: './planificacion-comidas-empleado.component.html',
  styleUrls: ['./planificacion-comidas-empleado.component.css']
})
export class PlanificacionComidasEmpleadoComponent implements OnInit {

  idEmpleado: string;

  constructor(
    public restPlanComidas: PlanComidasService,
    private toastr: ToastrService,
    public vistaRegistrarDatos: MatDialog,
    public router: Router,

  ) {
    this.idEmpleado = localStorage.getItem('empleado');
  }

  ngOnInit(): void {
  }

  /** Método para mostrar datos de planificación de almuerzos */
  planComidas: any;
  obtenerPlanComidasEmpleado(id_empleado: number) {
    this.planComidas = [];
    this.restPlanComidas.obtenerPlanComidaPorIdEmpleado(id_empleado).subscribe(res => {
      this.planComidas = res
    }, error => { console.log("") });
  }

  /* Ventana para editar planificación de comidas */
  AbrirEditarPlanComidas(datoSeleccionado): void {
    console.log(datoSeleccionado);
    this.vistaRegistrarDatos.open(EditarPlanComidasComponent, { width: '600px', data: datoSeleccionado })
      .afterClosed().subscribe(item => {
        this.obtenerPlanComidasEmpleado(parseInt(this.idEmpleado));
      });
  }

  /** Función para eliminar registro seleccionado Planificación*/
  EliminarPlanComidas(id_plan: number) {
    this.restPlanComidas.EliminarRegistro(id_plan).subscribe(res => {
      this.toastr.error('Registro eliminado');
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

  /* Ventana para ingresar planificación de comidas */
  AbrirVentanaPlanificacion(): void {
    console.log(this.idEmpleado);
    this.vistaRegistrarDatos.open(PlanificacionComidasComponent, { width: '600px', data: this.idEmpleado })
      .afterClosed().subscribe(item => {
        this.obtenerPlanComidasEmpleado(parseInt(this.idEmpleado));
      });
  }

}
