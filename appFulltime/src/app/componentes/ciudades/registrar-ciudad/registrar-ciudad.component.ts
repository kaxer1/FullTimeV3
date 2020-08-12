import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CiudadService } from 'src/app/servicios/ciudad/ciudad.service';
import { ProvinciaService } from 'src/app/servicios/catalogos/catProvincias/provincia.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-registrar-ciudad',
  templateUrl: './registrar-ciudad.component.html',
  styleUrls: ['./registrar-ciudad.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class RegistrarCiudadComponent implements OnInit {

  // Control de los campos del formulario
  nombreF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);
  idProvinciaF = new FormControl('', Validators.required);
  nombreContinenteF = new FormControl('', Validators.required);
  nombrePaisF = new FormControl('', Validators.required);
  filteredOptions: Observable<string[]>;
  filteredOpt: Observable<string[]>;

  // Datos Provincias
  provincias: any = [];
  seleccionarProvincia;
  continentes: any = [];
  seleccionarContinente;
  paises: any = [];
  seleccionarPaises;

  // Asignar los campos en un formulario en grupo
  public nuevaCiudadForm = new FormGroup({
    nombreForm: this.nombreF,
    idProvinciaForm: this.idProvinciaF,
    nombreContinenteForm: this.nombreContinenteF,
    nombrePaisForm: this.nombrePaisF,
  });

  constructor(
    private restP: ProvinciaService,
    private rest: CiudadService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistrarCiudadComponent>,
  ) { }

  ngOnInit(): void {
    this.continentes = this.ObtenerContinentes();
    this.filteredOptions = this.nombrePaisF.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.filteredOpt = this.idProvinciaF.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterProvincia(value))
      );
  }

  private _filter(value: string): string[] {
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.paises.filter(pais => pais.nombre.toLowerCase().includes(filterValue));
    }
  }

  private _filterProvincia(value: string): string[] {
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.provincias.filter(provincias => provincias.nombre.toLowerCase().includes(filterValue));
    }
  }

  ObtenerContinentes() {
    this.continentes = [];
    this.restP.BuscarContinente().subscribe(datos => {
      this.continentes = datos;
      this.continentes[this.continentes.length] = { continente: "Seleccionar" };
      this.seleccionarContinente = this.continentes[this.continentes.length - 1].continente;
    })
  }

  ObtenerPaises(continente) {
    this.paises = [];
    this.restP.BuscarPais(continente).subscribe(datos => {
      this.paises = datos;
      this.seleccionarPaises = '';
    })
  }

  FiltrarPaises(form) {
    var nombreContinente = form.nombreContinenteForm;
    if (nombreContinente === 'Seleccionar' || nombreContinente === '') {
      this.toastr.info('No ha seleccionado ninguna opción')
      this.paises = [];
      this.provincias = [];
      this.seleccionarPaises = '';
    }
    else {
      this.seleccionarPaises = this.ObtenerPaises(nombreContinente);
    }
  }

  ObtenerProvincias(pais) {
    this.provincias = [];
    this.restP.BuscarUnaProvincia(pais).subscribe(datos => {
      this.provincias = datos;
      this.seleccionarProvincia = '';
    }, error => {
      this.toastr.info('El País seleccionado no tiene Provincias, Departamentos o Estados registrados')
    })
  }

  FiltrarProvincias(form) {
    let idPais;
    this.paises.forEach(obj => {
      if (obj.nombre === form.nombrePaisForm) {
        idPais = obj.id
      }
    });
    if (idPais === undefined) {
      this.toastr.info('No ha seleccionado ninguna opción')
      this.provincias = [];
      this.seleccionarProvincia = '';
    }
    else {
      this.seleccionarProvincia = this.ObtenerProvincias(idPais);
    }
  }

  InsertarCiudad(form) {
    let provinciaId;
    this.provincias.forEach(obj => {
      if (obj.nombre === form.idProvinciaForm) {
        provinciaId = obj.id
      }
    });
    if (provinciaId === 'Seleccionar') {
      this.toastr.info('Seleccione una provincia')
    }
    else {
      let datosCiudad = {
        descripcion: form.nombreForm,
        id_provincia: provinciaId,
      };
      this.rest.postCiudades(datosCiudad).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Ciudad registrada');
        this.LimpiarCampos();
      }, error => {
        this.toastr.error('Operación Fallida', 'Ciudad no pudo ser registrada')
      });
    }
  }

  LimpiarCampos() {
    this.nuevaCiudadForm.reset();
    this.ObtenerContinentes();
    this.paises = [];
    this.provincias = [];
  }

  CerrarVentanaRegistroCiudad() {
    this.LimpiarCampos();
    this.dialogRef.close();
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

  ObtenerMensajeErrorNombre() {
    if (this.nombreF.hasError('required')) {
      return 'Campo obligatorio';
    }
    return this.nombreF.hasError('pattern') ? 'Ingresar un nombre válido' : '';
  }
}
