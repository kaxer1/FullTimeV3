import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ProvinciaService } from 'src/app/servicios/catalogos/catProvincias/provincia.service';

interface opcionesPais {
  valor: string;
  nombre: string
}

@Component({
  selector: 'app-registro-provincia',
  templateUrl: './registro-provincia.component.html',
  styleUrls: ['./registro-provincia.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class RegistroProvinciaComponent implements OnInit {

  continentes: any = [];
  seleccionarContinente;
  paises: any = [];
  seleccionarPaises;

  // Control de campos y validaciones del formulario
  nombreContinenteF = new FormControl('');
  nombrePaisF = new FormControl('', [Validators.required]);
  nombreProvinciaF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);

  // Asignación de validaciones a inputs del formulario
  public NuevaProvinciasForm = new FormGroup({
    nombreContinenteForm: this.nombreContinenteF,
    nombrePaisForm: this.nombrePaisF,
    nombreProvinciaForm: this.nombreProvinciaF,
  });

  constructor(
    private rest: ProvinciaService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistroProvinciaComponent>,
  ) { }

  ngOnInit(): void {
    this.continentes = this.ObtenerContinentes();
  }

  ObtenerContinentes() {
    this.continentes = [];
    this.rest.BuscarContinente().subscribe(datos => {
      this.continentes = datos;
      this.continentes[this.continentes.length] = { continente: "Seleccionar" };
      this.seleccionarContinente = this.continentes[this.continentes.length - 1].continente;
    })
  }

  ObtenerPaises(continente) {
    this.paises = [];
    this.rest.BuscarPais(continente).subscribe(datos => {
      this.paises = datos;
      this.paises[this.paises.length] = { nombre: "Seleccionar" };
      this.seleccionarPaises = this.paises[this.paises.length - 1].nombre;
    })
  }

  FiltrarPaises(form) {
    var nombreContinente = form.nombreContinenteForm;
    if (nombreContinente === 'Seleccionar' || nombreContinente === '') {
      this.toastr.info('No ha seleccionado ninguna opción')
      this.paises = [];
      this.seleccionarPaises = '';
    }
    else {
      this.seleccionarPaises = this.ObtenerPaises(nombreContinente);
    }
  }

  ObtenerMensajeProvinciaRequerido() {
    if (this.nombreProvinciaF.hasError('required')) {
      return 'Campo Obligatorio';
    }
    return this.nombreProvinciaF.hasError('pattern') ? 'Ingrese un nombre válido' : '';
  }

  InsertarProvincia(form) {
    let dataProvincia = {
      nombre: form.nombreProvinciaForm,
      id_pais: form.nombrePaisForm,
    };
    if (dataProvincia.id_pais === 'Seleccionar') {
      this.toastr.info('Seleccionar un país')
    }
    else {
      this.rest.postProvinciaRest(dataProvincia).subscribe(response => {
        this.toastr.success('Registro guardado', 'Provincia - Departamento - Estado');
        this.LimpiarCampos();
      }, error => {
        this.toastr.error('Operación Fallida', 'Provincia no pudo ser registrada')
      });
    }
  }

  LimpiarCampos() {
    this.NuevaProvinciasForm.reset();
    this.ObtenerContinentes();
    this.paises = [];
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

  CerrarVentanaRegistroProvincia() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }
}
