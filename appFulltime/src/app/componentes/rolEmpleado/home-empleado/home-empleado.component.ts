import { Component, OnInit } from '@angular/core';
import { GraficasService } from 'src/app/servicios/graficas/graficas.service';
import { ActivatedRoute, Router } from '@angular/router';
declare const require: any;

@Component({
  selector: 'app-home-empleado',
  templateUrl: './home-empleado.component.html',
  styleUrls: ['./home-empleado.component.css']
})
export class HomeEmpleadoComponent implements OnInit {

  fecha: string;
  horas_extras: any;
  vacaciones: any;
  permisos: any;
  atrasos: any;


  constructor(
    private restGraficas: GraficasService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
    var f=new Date();
    this.fecha = diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
    this.ModeloGraficas();
  }

  ModeloGraficas() {
    this.GraficaUno()
    this.GraficaDos();
    this.GraficaTres();
    this.GraficaCuatro();
  }

  GraficaUno() {
    let local = sessionStorage.getItem('horasExtras');
    if (local === null) {
      this.restGraficas.EmpleadoHoraExtra().subscribe(res => {
        // console.log('************* Horas extras **************');
        sessionStorage.setItem('horasExtras', JSON.stringify(res))
        // console.log(res);
        this.horas_extras = res
      });
    } else {
      this.horas_extras = JSON.parse(local);
    }
  }

  GraficaDos() {
    let local = sessionStorage.getItem('vacaciones');
    if (local === null) {
      this.restGraficas.EmpleadoVacaciones().subscribe(res => {
        // console.log('************* Vacaciones **************');
        sessionStorage.setItem('vacaciones', JSON.stringify(res))
        // console.log(res);
        this.vacaciones = res
      });
    } else {
      this.vacaciones = JSON.parse(local);
    }
  }

  GraficaTres() {
    let local = sessionStorage.getItem('permisos');
    if (local === null) {
      this.restGraficas.EmpleadoPermisos().subscribe(res => {
        // console.log('************* Permisos **************');
        // console.log(res);
        sessionStorage.setItem('permisos', JSON.stringify(res))
        this.permisos = res
      });
    } else {
      this.permisos = JSON.parse(local);
    }
  }

  GraficaCuatro() {
    let local = sessionStorage.getItem('atrasos');
    if (local === null) {
      this.restGraficas.EmpleadoAtrasos().subscribe(res => {
        // console.log('*************  **************');
        // console.log(res);
        sessionStorage.setItem('atrasos', JSON.stringify(res))
        this.atrasos = res
      });
    } else {
      this.atrasos = JSON.parse(local);
    }
  }

  RefrescarGraficas() {
    sessionStorage.removeItem('atrasos');
    sessionStorage.removeItem('permisos');
    sessionStorage.removeItem('vacaciones');
    sessionStorage.removeItem('horasExtras');
    this.ModeloGraficas();
  }

  MenuRapido(num: number) {
    switch (num) {
      case 1: //Horas Extras
        this.router.navigate(['/horas-extras-solicitadas'], {relativeTo: this.route, skipLocationChange: false});
        break;
      case 2: //Vacaciones
        this.router.navigate(['/vacaciones-solicitados'], {relativeTo: this.route, skipLocationChange: false});
        break;
      case 3: //Permisos
        this.router.navigate(['/permisos-solicitados'], {relativeTo: this.route, skipLocationChange: false});
        break;
      case 4: //Retrasos
        this.router.navigate(['/macro/retrasos'], {relativeTo: this.route, skipLocationChange: false});
        break;
      default:
        this.router.navigate(['/datosEmpleado'], {relativeTo: this.route, skipLocationChange: false});
        break;
    }
  }

}
