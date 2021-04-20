import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
/** IMPORTACIÓN DE SERVICIOS */
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { AccionPersonalService } from 'src/app/servicios/accionPersonal/accion-personal.service';
import { Router } from '@angular/router';
import { ProcesoService } from 'src/app/servicios/catalogos/catProcesos/proceso.service';
@Component({
  selector: 'app-ver-pedido-accion',
  templateUrl: './ver-pedido-accion.component.html',
  styleUrls: ['./ver-pedido-accion.component.css']
})
export class VerPedidoAccionComponent implements OnInit {

  idPedido: string = '';
  // INICIACIÓN DE VARIABLES 
  idEmpleadoLogueado: any;
  empleados: any = [];
  departamento: any;

  constructor(
    public router: Router,
    public restAccion: AccionPersonalService,
    public restProcesos: ProcesoService,
    public restEmpresa: EmpresaService,
    private toastr: ToastrService,
    public restE: EmpleadoService,
  ) {
    var cadena = this.router.url;
    var aux = cadena.split("/");
    this.idPedido = aux[2];
    this.idEmpleadoLogueado = parseInt(localStorage.getItem('empleado'));
    this.departamento = parseInt(localStorage.getItem("departamento"));
  }

  ngOnInit(): void {
    this.CargarInformacion();
  }

  datosPedido: any = [];
  datoEmpleado: string = '';
  CargarInformacion() {
    this.restAccion.BuscarDatosPedidoId(parseInt(this.idPedido)).subscribe(data => {
      this.datosPedido = data;
      console.log('datos', this.datosPedido);
      this.restAccion.BuscarDatosPedidoEmpleados(this.datosPedido[0].id_empleado).subscribe(data1 => {
        this.datoEmpleado = data1[0].apellido + ' ' + data1[0].nombre
        this.restAccion.BuscarDatosPedidoEmpleados(this.datosPedido[0].firma_empl_uno).subscribe(data2 => {
          this.restAccion.BuscarDatosPedidoEmpleados(this.datosPedido[0].firma_empl_dos).subscribe(data3 => {

          });
        })
      })
    })
  }

}
