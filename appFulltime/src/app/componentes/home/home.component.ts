import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GraficasService } from 'src/app/servicios/graficas/graficas.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit{
 
  fecha: string;
  asistencia: any;
  hora_extra: any;
  inasistencia: any;
  jornada_hora_extra: any;
  marcaciones: any;
  retrasos: any;
  tiempo_jornada: any;
  salidas_antes: any;

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
    this.GraficaCinco();
    this.GraficaSeis();
    this.GraficaSiete();
    this.GraficaOcho();
  }

  GraficaUno() {
    let local = sessionStorage.getItem('asistencia');
    // console.log('LOCAL ASISTENCIA: ',local_asistencia);
    if (local === null) {
      this.restGraficas.MetricaAsistenciaMicro().subscribe(res => {
        // console.log('************* Asistencia Micro **************');
        sessionStorage.setItem('asistencia', JSON.stringify(res))
        // console.log(res);
        this.asistencia = res
      });
    } else {
      this.asistencia = JSON.parse(local);
    }
  }

  GraficaDos() {
    let local = sessionStorage.getItem('HoraExtra');
    if (local === null) {
      this.restGraficas.MetricaHoraExtraMicro().subscribe(res => {
        // console.log('************* Hora Extra Micro **************');
        sessionStorage.setItem('HoraExtra', JSON.stringify(res))
        // console.log(res);
        this.hora_extra = res
      });
    } else {
      this.hora_extra = JSON.parse(local);
    }
  }

  GraficaTres() {
    let local = sessionStorage.getItem('inasistencia');
    if (local === null) {
      this.restGraficas.MetricaInasistenciaMicro().subscribe(res => {
        // console.log('************* Inasistencia Micro **************');
        // console.log(res);
        sessionStorage.setItem('inasistencia', JSON.stringify(res))
        this.inasistencia = res
      });
    } else {
      this.inasistencia = JSON.parse(local);
    }
  }

  GraficaCuatro() {

    let local = sessionStorage.getItem('JornadaHoraExtra');
    if (local === null) {
      this.restGraficas.MetricaJornadaHoraExtraMicro().subscribe(res => {
        // console.log('************* Jornada Hora Extra Micro **************');
        // console.log(res);
        sessionStorage.setItem('JornadaHoraExtra', JSON.stringify(res))
        this.jornada_hora_extra = res
      });
    } else {
      this.jornada_hora_extra = JSON.parse(local);
    }
  }

  GraficaCinco() {
    let local = sessionStorage.getItem('marcaciones');
    if (local === null) {
      this.restGraficas.MetricaMarcacionesMicro().subscribe(res => {
        // console.log('************* Marcaciones Micro **************');
        // console.log(res);
        sessionStorage.setItem('marcaciones', JSON.stringify(res))
        this.marcaciones = res
      });
    } else {
      this.marcaciones = JSON.parse(local);
    }
  }

  GraficaSeis() {
    let local = sessionStorage.getItem('retrasos');
    if (local === null) {
      this.restGraficas.MetricaRetrasoMicro().subscribe(res => {
        // console.log('************* Retrasos Micro **************');
        // console.log(res);
        sessionStorage.setItem('retrasos', JSON.stringify(res))
        this.retrasos = res
      });
    } else {
      this.retrasos = JSON.parse(local);
    }
  }

  GraficaSiete() {
    let local = sessionStorage.getItem('tiempo_jornada');
    if (local === null) {
      this.restGraficas.MetricaTiempoJornadaHoraExtraMicro().subscribe(res => {
        // console.log('************* Tiempo Jornada Micro **************');
        // console.log(res);
        sessionStorage.setItem('tiempo_jornada', JSON.stringify(res))
        this.tiempo_jornada = res
      });
    } else {
      this.tiempo_jornada = JSON.parse(local);
    }
  }

  GraficaOcho() {
    let local = sessionStorage.getItem('salida_antes');
    if (local === null) {
      this.restGraficas.MetricaSalidasAntesMicro().subscribe(res => {
        // console.log('************* Salida Antes Micro **************');
        sessionStorage.setItem('salida_antes', JSON.stringify(res))
        this.salidas_antes = res
      });
    } else {
      this.salidas_antes = JSON.parse(local);
    }
  }

  RefrescarGraficas() {
    sessionStorage.removeItem('JornadaHoraExtra');
    sessionStorage.removeItem('retrasos');
    sessionStorage.removeItem('asistencia');
    sessionStorage.removeItem('inasistencia');
    sessionStorage.removeItem('HoraExtra');
    sessionStorage.removeItem('marcaciones');
    sessionStorage.removeItem('tiempo_jornada');
    sessionStorage.removeItem('salida_antes');
    this.ModeloGraficas();
  }

  MenuRapido(num: number) {
    switch (num) {
      case 1: //Reportes
        this.router.navigate(['/listaReportes'], {relativeTo: this.route, skipLocationChange: false});
        break;
      case 2: //Horas Extras
        this.router.navigate(['/horas-extras-solicitadas'], {relativeTo: this.route, skipLocationChange: false});
        break;
      case 3: //Vacaciones
        this.router.navigate(['/vacaciones-solicitados'], {relativeTo: this.route, skipLocationChange: false});
        break;
      case 4: //Permisos
        this.router.navigate(['/permisos-solicitados'], {relativeTo: this.route, skipLocationChange: false});
        break;
      case 5: //Retrasos
        this.router.navigate(['/macro/retrasos'], {relativeTo: this.route, skipLocationChange: false});
        break;
      case 6: //Métricas
        this.router.navigate(['/home'], {relativeTo: this.route, skipLocationChange: false});
        break;
      default:
        this.router.navigate(['/home'], {relativeTo: this.route, skipLocationChange: false});
        break;
    }
  }

}
