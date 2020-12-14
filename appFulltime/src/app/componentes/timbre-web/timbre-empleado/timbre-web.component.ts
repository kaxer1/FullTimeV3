import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { TimbresService } from 'src/app/servicios/timbres/timbres.service';
import { RegistrarTimbreComponent } from '../registrar-timbre/registrar-timbre.component';

@Component({
  selector: 'app-timbre-web',
  templateUrl: './timbre-web.component.html',
  styleUrls: ['./timbre-web.component.css']
})
export class TimbreWebComponent implements OnInit {

  timbres: any = [];
  cuenta: any = [];
  info: any = [];

  // items de paginacion de la tabla
  tamanio_pagina: number = 5;
  numero_pagina: number = 1;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(
    private restTimbres: TimbresService,
    private toastr: ToastrService,
    private openView: MatDialog
  ) { }

  ngOnInit(): void {
    this.ObtenerListaTimbres();
  }

  ManejarPagina(e: PageEvent) {
    this.tamanio_pagina = e.pageSize;
    this.numero_pagina = e.pageIndex + 1;
  }

  ObtenerListaTimbres() {
    this.restTimbres.ObtenerTimbres().subscribe(res => {
      console.log(res);
      this.timbres = res.timbres;
      this.cuenta = res.cuenta;
      this.info = res.info;
      console.log(this.timbres);
      
    }, err => {
      console.log(err);
      
      this.toastr.error(err.error.message)
    })
  }

  AbrirRegistrarTimbre() {
    this.openView.open(RegistrarTimbreComponent, {width: '500px'}).afterClosed().subscribe(data => {
      console.log(data);
      if (!data.close) {
        this.restTimbres.PostTimbreWeb(data).subscribe(res => {
          console.log(res);
          this.ObtenerListaTimbres()
          this.toastr.success(res.message)
        }, err => {
          console.log(err);
          this.toastr.error(err)
        })
      }
    })
  }

}
