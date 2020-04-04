import { Component, OnInit } from '@angular/core';
import { TipoPermisosService } from 'src/app/servicios/catalogos/catTipoPermisos/tipo-permisos.service';

@Component({
  selector: 'app-vista-elementos',
  templateUrl: './vista-elementos.component.html',
  styleUrls: ['./vista-elementos.component.css']
})
export class VistaElementosComponent implements OnInit {

  tipoPermiso: any = [];

  constructor(
    private rest: TipoPermisosService
  ) { }

  ngOnInit(): void {
    this.getTipoPermiso();
  }

  getTipoPermiso(){
    this.rest.getTipoPermisoRest().subscribe(data => {
      this.tipoPermiso = data
    }, error => {

    });
  }

}
