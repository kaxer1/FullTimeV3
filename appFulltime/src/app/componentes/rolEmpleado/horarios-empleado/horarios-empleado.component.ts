import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';
import { PlanHorarioService } from 'src/app/servicios/horarios/planHorario/plan-horario.service';
import { EmpleadoHorariosService } from 'src/app/servicios/horarios/empleadoHorarios/empleado-horarios.service';

import { RegistoEmpleadoHorarioComponent } from 'src/app/componentes/empleadoHorario/registo-empleado-horario/registo-empleado-horario.component';

@Component({
  selector: 'app-horarios-empleado',
  templateUrl: './horarios-empleado.component.html',
  styleUrls: ['./horarios-empleado.component.css']
})
export class HorariosEmpleadoComponent implements OnInit {

  idEmpleado: string;
  idCargo: any = [];

  /* Items de paginación de la tabla */
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];
  selectedIndex: number;

  /** Contador */
  cont = 0;

  constructor(
    public restCargo: EmplCargosService,
    public restPlanH: PlanHorarioService,
    public vistaRegistrarDatos: MatDialog,
    public restEmpleHorario: EmpleadoHorariosService,
    public router: Router,
    private toastr: ToastrService,
  ) {
    this.idEmpleado = localStorage.getItem('empleado');
  }

  ngOnInit(): void {
    this.ObtenerHorariosEmpleado(parseInt(this.idEmpleado));
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  /* 
   * ***************************************************************************************************
   *                               MÉTODO PARA MOSTRAR DATOS
   * ***************************************************************************************************
  */

  /* Método para mostrar datos de horario */
  horariosEmpleado: any;
  horariosEmpleadoTotales: any = [];
  ObtenerHorariosEmpleado(id_empleado: number) {
    this.horariosEmpleado = [];
    this.horariosEmpleadoTotales = [];
    this.restCargo.BuscarIDCargo(id_empleado).subscribe(datos => {
      this.idCargo = datos;
      console.log("idCargo ", this.idCargo[0].id);
      for (let i = 0; i <= this.idCargo.length - 1; i++) {
        this.restEmpleHorario.BuscarHorarioCargo(this.idCargo[i]['id']).subscribe(datos => {
          this.horariosEmpleado = datos;
          if (this.horariosEmpleado.length === 0) {
            console.log("No se encuentran registros")
          }
          else {
            if (this.cont === 0) {
              this.horariosEmpleadoTotales = datos
              this.cont++;
            }
            else {
              this.horariosEmpleadoTotales = this.horariosEmpleadoTotales.concat(datos);
              console.log("Datos autorizacion" + i + '', this.horariosEmpleadoTotales)
            }
          }
        })
      }
    });
  }

  /* 
   ****************************************************************************************************
   *                               ABRIR VENTANAS PARA REGISTRAR DATOS DEL EMPLEADO
   ****************************************************************************************************
  */

  /* Ventana para registrar horario */
  AbrirVentanaEmplHorario(): void {
    this.restCargo.BuscarIDCargoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      console.log("idcargo ", this.idCargo[0].max)
      this.vistaRegistrarDatos.open(RegistoEmpleadoHorarioComponent,
        { width: '600px', data: { idEmpleado: this.idEmpleado, idCargo: this.idCargo[0].max } }).afterClosed().subscribe(item => {
          this.ObtenerHorariosEmpleado(parseInt(this.idEmpleado));
        });
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo')
    });
  }

  /* ****************************************************************************************************
   *                               CARGAR HORARIOS DEL EMPLEADO CON PLANTILLA
   * ****************************************************************************************************/
  nameFileHorario: string;
  archivoSubidoHorario: Array<File>;
  archivoHorarioForm = new FormControl('');

  fileChangeHorario(element) {
    this.restCargo.BuscarIDCargoActual(parseInt(this.idEmpleado)).subscribe(datos => {
      this.idCargo = datos;
      this.archivoSubidoHorario = element.target.files;
      this.nameFileHorario = this.archivoSubidoHorario[0].name;
      let arrayItems = this.nameFileHorario.split(".");
      let itemExtencion = arrayItems[arrayItems.length - 1];
      let itemName = arrayItems[0].slice(0, 50);
      console.log(itemName.toLowerCase());
      if (itemExtencion == 'xlsx' || itemExtencion == 'xls') {
        if (itemName.toLowerCase() == 'horario empleado') {
          this.plantillaHorario();
          //this.ObtenerHorariosEmpleado(parseInt(this.idEmpleado));
        } else {
          this.toastr.error('Plantilla seleccionada incorrecta');
        }
      } else {
        this.toastr.error('Error en el formato del documento', 'Plantilla no aceptada');
      }
    }, error => {
      this.toastr.info('El empleado no tiene registrado un Cargo', 'Primero Registrar Cargo')
    });
  }

  plantillaHorario() {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubidoHorario.length; i++) {
      formData.append("uploads[]", this.archivoSubidoHorario[i], this.archivoSubidoHorario[i].name);
      console.log("toda la data", formData)
    }
    this.restEmpleHorario.SubirArchivoExcel(formData, this.idEmpleado).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Plantilla de Horario importada.');
      this.ObtenerHorariosEmpleado(parseInt(this.idEmpleado));
      this.archivoHorarioForm.reset();
      this.nameFileHorario = '';
    });
  }

}
