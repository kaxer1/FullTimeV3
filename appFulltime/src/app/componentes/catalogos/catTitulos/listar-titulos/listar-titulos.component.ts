import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { TitulosComponent } from '../titulos/titulos.component'
import { TituloService } from 'src/app/servicios/catalogos/catTitulos/titulo.service';

interface Nivel {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-listar-titulos',
  templateUrl: './listar-titulos.component.html',
  styleUrls: ['./listar-titulos.component.css']
})

export class ListarTitulosComponent implements OnInit {

  titulos: any = [];
  verTitulos: any = [];
  filtradoNombre = '';
  filtradoNivel = '';

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);
  nivelF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);

  // Asignación de validaciones a inputs del formulario
  public BuscarTitulosForm = new FormGroup({
    nombreForm: this.nombreF,
    nivelForm: this.nivelF,
  });

  niveles: Nivel[] = [
    { value: '1', viewValue: 'Educación Básica' },
    { value: '2', viewValue: 'Bachillerato' },
    { value: '3', viewValue: 'Técnico Superior' },
    { value: '4', viewValue: 'Tercer Nivel' },
    { value: '5', viewValue: 'Ingenieria' },
    { value: '6', viewValue: 'Postgrado' }
  ];

  constructor(
    public vistaRegistrarTitulo: MatDialog,
    public rest: TituloService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.ObtenerTitulos();
  }

  ObtenerTitulos() {
    this.rest.getTituloRest().subscribe(data => {
      this.titulos = data;
      this.titulos.forEach(obj => {
        this.niveles.forEach(niv => {
          if (niv.value == obj.nivel) {
            let dataTitulos = {
              id: obj.id,
              nombre: obj.nombre,
              nivel: niv.viewValue
            }
            this.verTitulos.push(dataTitulos);
          }
        })
      })
    });
  }

  AbrirVentanaRegistrarTitulo(): void {
    this.vistaRegistrarTitulo.open(TitulosComponent, { width: '300px' }).disableClose = true;
  }

  LimpiarCampos() {
    console.log('limpiar');
  }

  ObtenerMensajeErrorNombre() {
    if (this.nombreF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
  }

  ObtenerMensajeErrorNivel() {
    if (this.nivelF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
  }

  IngresarSoloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    //Se define todo el abecedario que se va a usar.
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    //Es la validación del KeyCodes, que teclas recibe el campo de texto.
    let especiales = [8, 37, 39, 46, 6, 13];
    let tecla_especial = false
    for (var i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras')
      return false;
    }
  }
}