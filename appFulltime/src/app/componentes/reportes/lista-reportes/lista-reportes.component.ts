import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';

@Component({
  selector: 'app-lista-reportes',
  templateUrl: './lista-reportes.component.html',
  styleUrls: ['./lista-reportes.component.css']
})
export class ListaReportesComponent implements OnInit {

  idEmpresa: number;
  datosEmpresa: any = [];
  habilitarReportes: string = 'hidden';
  mensaje: boolean = false;
  constructor(
    private rest: EmpresaService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.idEmpresa = parseInt(localStorage.getItem('empresa'))
    this.LlamarDatos();    
  }

  LlamarDatos() {
    this.rest.ConsultarDatosEmpresa(this.idEmpresa).subscribe(datos => {
      this.datosEmpresa = datos;
      if (this.datosEmpresa[0].logo === null || this.datosEmpresa[0].color_p === null || this.datosEmpresa[0].color_s === null) {
        this.toast.error('Falta agregar estilo o logotipo de la empresa para imprimir PDFs','Error configuración', {timeOut: 10000})
        .onTap.subscribe(obj => {
          this.IrInfoEmpresa()
        })
        this.mensaje = true;
      } else {
        this.habilitarReportes = 'visible';
      }
    });
  }

  IrInfoEmpresa() {
    this.router.navigate(['/vistaEmpresa', this.idEmpresa], {relativeTo: this.route, skipLocationChange: false})
  }

}
