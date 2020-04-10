import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { FeriadosService } from 'src/app/servicios/catalogos/catFeriados/feriados.service';
import { CiudadFeriadosService } from 'src/app/servicios/ciudadFeriados/ciudad-feriados.service';
import { AsignarCiudadComponent } from 'src/app/componentes/catalogos/catFeriados/asignar-ciudad/asignar-ciudad.component';

@Component({
  selector: 'app-listar-ciudad-feriados',
  templateUrl: './listar-ciudad-feriados.component.html',
  styleUrls: ['./listar-ciudad-feriados.component.css']
})

export class ListarCiudadFeriadosComponent implements OnInit {

  idFeriado: string;
  datosFeriado: any = [];
  datosCiudades: any = [];

  constructor(
    public router: Router,
    private rest: FeriadosService,
    private restF: CiudadFeriadosService,
    public vistaAsignarCiudad: MatDialog,
  ) {
    var cadena = this.router.url;
    var aux = cadena.split("/");
    this.idFeriado = aux[2];
  }

  ngOnInit(): void {
    this.BuscarDatosFeriado(this.idFeriado);
    this.ListarCiudadesFeriados(this.idFeriado);
  }

  BuscarDatosFeriado(idFeriado: any) {
    this.datosFeriado = [];
    this.rest.ConsultarUnFeriado(idFeriado).subscribe(data => {
      this.datosFeriado = data;
      for (let i = this.datosFeriado.length - 1; i >= 0; i--) {
        var cadena1 = this.datosFeriado[i]['fecha'];
        var aux1 = cadena1.split("T");
        this.datosFeriado[i]['fecha'] = aux1[0];
        if (this.datosFeriado[i]['fec_recuperacion'] != null) {
          var cadena2 = this.datosFeriado[i]['fec_recuperacion'];
          var aux2 = cadena2.split("T");
          this.datosFeriado[i]['fec_recuperacion'] = aux2[0];
        }
      }
    })
  }

  ListarCiudadesFeriados(idFeriado: any) {
    this.datosCiudades = [];
    this.restF.BuscarCiudadesFeriado(idFeriado).subscribe(datos => {
      this.datosCiudades = datos;
      console.log(this.datosCiudades)
    })
  }

  AbrirVentanaAsignarCiudad(datosSeleccionados): void {
    this.vistaAsignarCiudad.open(AsignarCiudadComponent, { width: '600px', data: { feriado: datosSeleccionados, actualizar: true} }).disableClose = true;
  }

}