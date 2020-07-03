import { Component, OnInit } from '@angular/core';
import { VacacionesService } from 'src/app/servicios/vacaciones/vacaciones.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AutorizacionesComponent } from '../../autorizaciones/autorizaciones/autorizaciones.component';
import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EditarEstadoVacacionAutoriacionComponent } from '../../autorizaciones/editar-estado-vacacion-autoriacion/editar-estado-vacacion-autoriacion.component';
import { EstadoVacacionesComponent } from "../estado-vacaciones/estado-vacaciones.component";
interface Estado {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-ver-vacacion',
  templateUrl: './ver-vacacion.component.html',
  styleUrls: ['./ver-vacacion.component.css']
})
export class VerVacacionComponent implements OnInit {

  vacacion: any = [];
  autorizacion: any = [];
  departamento: string = '';
  estado: string = '';
  dep: any = [];

  HabilitarAutorizacion: boolean = true;

  estados: Estado[] = [
    { id: 1, nombre: 'Pendiente'},
    { id: 2, nombre: 'Pre-autorizado'},
    { id: 3, nombre: 'Autorizado'},
    { id: 4, nombre: 'Negado'},
  ];

  constructor(
    private restV: VacacionesService,
    private toastr: ToastrService,
    private router: Router,
    private restD: DepartamentosService,
    private restA: AutorizacionService,
    public vistaFlotante: MatDialog
  ) { }

  ngOnInit(): void {
    let id_vacaciones = this.router.url.split('/')[2];
    this.restV.ObtenerUnaVacacion(parseInt(id_vacaciones)).subscribe(res => {
      this.vacacion = res;
      console.log(this.vacacion)
      this.restA.getUnaAutorizacionPorPermisoRest(this.vacacion[0].id).subscribe(res1 => {
        this.autorizacion = res1;
        this.estados.forEach(obj => {
          if (this.autorizacion[0].estado === obj.id) {
            this.estado = obj.nombre;
          }
        })
        this.restD.EncontrarUnDepartamento(this.autorizacion[0].id_departamento).subscribe(res2 => {
          this.dep.push(res2);
          this.dep.forEach(obj => {
            this.departamento = obj.nombre;
          });
        });
      }, error => {
        this.HabilitarAutorizacion = false;
      });
    });
  }

  AbrirVentanaEditar(datosSeleccionados: any): void {
    this.vistaFlotante.open(EstadoVacacionesComponent, { width: '300px', data: {vacacion: datosSeleccionados, depa: this.dep} }).disableClose = true;
  }

  AbrirVentanaEditarAutorizacion(datosSeleccionados: any): void {
    this.vistaFlotante.open(EditarEstadoVacacionAutoriacionComponent, { width: '350px', data: datosSeleccionados}).disableClose = true;
  }

  AbrirAutorizaciones(datosSeleccionados: any): void {
    this.vistaFlotante.open(AutorizacionesComponent, { width: '350px', data: datosSeleccionados }).disableClose = true;
  }

}
