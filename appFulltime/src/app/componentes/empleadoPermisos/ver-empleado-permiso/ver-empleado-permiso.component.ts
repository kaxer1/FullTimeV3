import { Component, OnInit } from '@angular/core';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditarEmpleadoPermisoComponent } from '../editar-empleado-permiso/editar-empleado-permiso.component';
import { AutorizacionesComponent } from '../../autorizaciones/autorizaciones/autorizaciones.component';
import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EditarEstadoAutorizaccionComponent } from '../../autorizaciones/editar-estado-autorizaccion/editar-estado-autorizaccion.component';

interface Estado {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-ver-empleado-permiso',
  templateUrl: './ver-empleado-permiso.component.html',
  styleUrls: ['./ver-empleado-permiso.component.css']
})
export class VerEmpleadoPermisoComponent implements OnInit {

  InfoPermiso: any = [];
  autorizacion: any = [];

  departamento: string = '';
  estado: string = '';

  estados: Estado[] = [
    { id: 1, nombre: 'Pendiente'},
    { id: 2, nombre: 'Pre-autorizado'},
    { id: 3, nombre: 'Autorizado'},
    { id: 4, nombre: 'Negado'},
  ];

  constructor(
    private restP: PermisosService,
    private restA: AutorizacionService,
    private router: Router,
    private restD: DepartamentosService,
    public vistaFlotante: MatDialog
  ) { }

  ngOnInit(): void {
    let id_permiso = this.router.url.split('/')[2];
    this.restP.obtenerUnPermisoEmleado(parseInt(id_permiso)).subscribe(res => {
      this.InfoPermiso = res;
      console.log(this.InfoPermiso[0].id);

      this.restA.getUnaAutorizacionPorPermisoRest(this.InfoPermiso[0].id).subscribe(res1 => {
        console.log(res1);
        this.autorizacion = res1;
        this.estados.forEach(obj => {
          if (this.autorizacion[0].estado === obj.id) {
            this.estado = obj.nombre;
          }
        })
        this.restD.EncontrarUnDepartamento(this.autorizacion[0].id_departamento);
      })
    })
  }

  AbrirVentanaEditar(datosSeleccionados: any): void {
    this.vistaFlotante.open(EditarEmpleadoPermisoComponent, { width: '300px', data: datosSeleccionados }).disableClose = true;
  }
  
  AbrirAutorizaciones(datosSeleccionados: any): void {
    this.vistaFlotante.open(AutorizacionesComponent, { width: '350px', data: datosSeleccionados }).disableClose = true;
  }

  AbrirVentanaEditarAutorizacion(datosSeleccionados: any): void {
    this.vistaFlotante.open(EditarEstadoAutorizaccionComponent, { width: '350px', data: datosSeleccionados }).disableClose = true;
  }
}
