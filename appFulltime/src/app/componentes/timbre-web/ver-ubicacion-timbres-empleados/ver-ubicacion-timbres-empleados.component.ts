import { Component, OnInit } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { EmpleadoService } from '../../../servicios/empleado/empleadoRegistro/empleado.service';
import { TimbresService } from '../../../servicios/timbres/timbres.service';

@Component({
  selector: 'app-ver-ubicacion-timbres-empleados',
  templateUrl: './ver-ubicacion-timbres-empleados.component.html',
  styleUrls: ['./ver-ubicacion-timbres-empleados.component.css']
})
export class VerUbicacionTimbresEmpleadosComponent implements OnInit {

  timbresEmpleado: any[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // this.activatedRoute.params
    //   .pipe(
    //     switchMap(({ codigo }) => this.TimbresService.ObtenerTimbres(codigo) ), //this.servicio.metodo()
    //     tap(console.log)
    //   )
    //   .subscribe((res) => {
    //     this.timbresEmpleado = res
    //   })
  }

}
