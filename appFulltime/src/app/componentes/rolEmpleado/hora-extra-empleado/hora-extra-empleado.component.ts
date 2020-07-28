import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PedidoHoraExtraComponent } from '../../horasExtras/pedido-hora-extra/pedido-hora-extra.component';
import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';

@Component({
  selector: 'app-hora-extra-empleado',
  templateUrl: './hora-extra-empleado.component.html',
  styleUrls: ['./hora-extra-empleado.component.css']
})
export class HoraExtraEmpleadoComponent implements OnInit {

  id_user_loggin: number;

  constructor(
    private restHE: PedHoraExtraService,
    private vistaRegistrarDatos: MatDialog,
  ) { }

  ngOnInit(): void {
    this.id_user_loggin = parseInt(localStorage.getItem("empleado"));
    this.ObtenerlistaHorasExtrasEmpleado();
  }

  hora_extra: any = [];
  ObtenerlistaHorasExtrasEmpleado() {
    this.hora_extra = [];
    this.restHE.ObtenerListaEmpleado(this.id_user_loggin).subscribe(res => {
      console.log('estado', res);
      this.hora_extra = res;
      for (var i = 0; i <= this.hora_extra.length - 1; i++) {
        if (this.hora_extra[i].estado === 1) {
          this.hora_extra[i].estado = 'Pendiente';
        }
        else if (this.hora_extra[i].estado === 2) {
          this.hora_extra[i].estado = 'Pre-autorizado';
        }
        else if (this.hora_extra[i].estado === 3) {
          this.hora_extra[i].estado = 'Autorizado';
        }
        else if (this.hora_extra[i].estado === 4) {
          this.hora_extra[i].estado = 'Negado';
        }
      }

    });
  }

  AbrirVentanaHoraExtra() {
    this.vistaRegistrarDatos.open(PedidoHoraExtraComponent, { width: '9iipx' }).afterClosed().subscribe(items => {
      this.ObtenerlistaHorasExtrasEmpleado();
    });
  }

}
