import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FeriadosService } from 'src/app/servicios/catalogos/feriados/feriados.service';
import { RegistrarFeriadosComponent } from 'src/app/componentes/catalogos/catFeriados/registrar-feriados/registrar-feriados.component';

@Component({
  selector: 'app-listar-feriados',
  templateUrl: './listar-feriados.component.html',
  styleUrls: ['./listar-feriados.component.css']
})
export class ListarFeriadosComponent implements OnInit {

  // Control de campos y validaciones del formulario
  descripcionF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{3,48}")]);
  fechaF = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public BuscarFeriadosForm = new FormGroup({
    descripcionForm: this.descripcionF,
    fechaForm: this.fechaF,
  });

  // Almacenamiento de datos consultados  
  feriados: any = [];
  fechaFeriado: any = [];
  fechaRecuperacion: any = [];
  idEmpleado: string;

  constructor(
    private rest: FeriadosService,
    public router: Router,
    public vistaRegistrarFeriado: MatDialog,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.ObtenerFeriados();
  }

  // Lectura de datos
  ObtenerFeriados() {
    this.feriados = [];
    this.rest.ConsultarFeriado().subscribe(datos => {
      this.feriados = datos;
      for (let i = this.feriados.length - 1; i >= 0; i--) {
        var cadena1 = this.feriados[i]['fecha'];
        var aux1 = cadena1.split("T");
        this.feriados[i]['fecha'] = aux1[0];
        var cadena2 = this.feriados[i]['fec_recuperacion'];
        var aux2 = cadena2.split("T");
        this.feriados[i]['fec_recuperacion'] = aux2[0];
      }
    })
  }

  BuscarFeriado(form) {
    let datosBusqueda = {
      descripcion: form.descripcionForm,
      fecha: form.fechaForm,
    };
    let descripcionB = String(datosBusqueda.descripcion);
    let fechaB = String(datosBusqueda.fecha);
    if (descripcionB === '' && fechaB === '') {
      this.ObtenerFeriados();

    } else if (descripcionB != '' && fechaB === '') {
      this.ObtenerFeriadoDescripcion(descripcionB);
      this.BuscarFeriadosForm.setValue({
        descripcionForm: '',
        fechaForm: ''
      });
    }
  }

  ObtenerFeriadoDescripcion(datoDescripcion: any) {
    this.rest.BuscarFeriadoDescripcion(datoDescripcion).subscribe(datos => {
      this.feriados = datos;
        for (let i = this.feriados.length - 1; i >= 0; i--) {
          var cadena1 = this.feriados[i]['fecha'];
          var aux1 = cadena1.split("T");
          this.feriados[i]['fecha'] = aux1[0];
          var cadena2 = this.feriados[i]['fec_recuperacion'];
          var aux2 = cadena2.split("T");
          this.feriados[i]['fec_recuperacion'] = aux2[0];
        }
      
    },  (error) => {     
      this.toastr.info('Dato ingresado no concide con los registros')
      
    })
  }

  AbrirVentanaRegistrarFeriado(): void {
    this.vistaRegistrarFeriado.open(RegistrarFeriadosComponent, { width: '300px' })
  }

  LimpiarCampos() {
    this.BuscarFeriadosForm.reset();
  }
}
