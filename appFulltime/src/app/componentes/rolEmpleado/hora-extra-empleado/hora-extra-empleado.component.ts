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
    this.restHE.ObtenerListaEmpleado(this.id_user_loggin).subscribe(res => {
      console.log(res);
      this.hora_extra = res;
    });
  }

  AbrirVentanaHoraExtra(){
    this.vistaRegistrarDatos.open(PedidoHoraExtraComponent, { width: '900px' }).afterClosed().subscribe(items => {
      this.ObtenerlistaHorasExtrasEmpleado();
    });
  }

}
