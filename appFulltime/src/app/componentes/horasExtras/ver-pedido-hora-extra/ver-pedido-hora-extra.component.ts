import { Component, OnInit } from '@angular/core';
import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';
import { Router } from '@angular/router';
import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';
import { MatDialog } from '@angular/material/dialog';
import { HoraExtraAutorizacionesComponent } from '../../autorizaciones/hora-extra-autorizaciones/hora-extra-autorizaciones.component';
import { EditarEstadoHoraExtraAutorizacionComponent } from '../../autorizaciones/editar-estado-hora-extra-autorizacion/editar-estado-hora-extra-autorizacion.component';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EstadoHoraExtraComponent } from "../estado-hora-extra/estado-hora-extra.component";

interface Estado {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-ver-pedido-hora-extra',
  templateUrl: './ver-pedido-hora-extra.component.html',
  styleUrls: ['./ver-pedido-hora-extra.component.css']
})
export class VerPedidoHoraExtraComponent implements OnInit {

  estados: Estado[] = [
    { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'Pre-autorizado' },
    { id: 3, nombre: 'Autorizado' },
    { id: 4, nombre: 'Negado' },
  ];

  dataParams: any;
  hora_extra: any = [];
  nomEstado: string; 
  HabilitarAutorizacion: boolean = true;
  autorizacion: any = [];
  estado: string = '';
  dep: any = [];
  departamento: string = '';

  constructor(
    private restHE: PedHoraExtraService,
    private router: Router,
    private restA: AutorizacionService,
    private restD: DepartamentosService,
    private vistaFolante: MatDialog
  ) { }

  ngOnInit(): void {
    this.dataParams = this.router.routerState.snapshot.root.children[0].params;
    console.log(this.dataParams.id);
    this.BuscarInfo();
  }

  id_usua_solicita: number;
  BuscarInfo() {
    this.dep = [];
    this.restHE.ObtenerUnHoraExtra(this.dataParams.id).subscribe(res => {
      this.hora_extra = res;
      this.estados.forEach(obj => {
        if (obj.id === this.hora_extra[0].estado) {
          this.nomEstado = obj.nombre
        }
      })
      console.log(this.hora_extra);
      this.id_usua_solicita = this.hora_extra[0].id_usua_solicita;
      this.restA.getUnaAutorizacionByHoraExtraRest(this.dataParams.id).subscribe(res1 => {
        console.log(res);
        this.autorizacion = res1;
        this.estados.forEach(obj => {
          if (this.autorizacion[0].estado === obj.id) {
            this.estado = obj.nombre;
          }
        });
        this.restD.EncontrarUnDepartamento(this.autorizacion[0].id_departamento).subscribe(res2 => {
          this.dep.push(res2);
          this.dep.forEach(obj => {
            this.departamento = obj.nombre;
          });
        });
      }, error => {
        console.log(error);
        this.HabilitarAutorizacion = false;
      });
    });
  }

  AbrirAutorizaciones(datosHoraExtra) {
    this.vistaFolante.open(HoraExtraAutorizacionesComponent, { width: '300px', data: datosHoraExtra}).afterClosed().subscribe(items => {
      this.BuscarInfo();
      this.HabilitarAutorizacion = true;
    });
  }

  AbrirVentanaEditar(datosHoraExtra) {
    this.vistaFolante.open(EstadoHoraExtraComponent, {width: '300px', data: datosHoraExtra}).afterClosed().subscribe(items => {
      this.BuscarInfo();
    });
  }

  AbrirVentanaEditarAutorizacion(AutoHoraExtra) {
    this.vistaFolante.open(EditarEstadoHoraExtraAutorizacionComponent, {width: '300px', data: {autorizacion: [AutoHoraExtra], empl: this.id_usua_solicita}}).afterClosed().subscribe(items => {
      this.BuscarInfo();
    })
  }

}
