import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CiudadFeriadosService } from 'src/app/servicios/ciudadFeriados/ciudad-feriados.service';
import { ProvinciaService } from 'src/app/servicios/catalogos/catProvincias/provincia.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-asignar-ciudad',
  templateUrl: './asignar-ciudad.component.html',
  styleUrls: ['./asignar-ciudad.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class AsignarCiudadComponent implements OnInit {

  // Datos Ciudad-Feriado
  ciudadFeriados: any = [];
  nombreProvincias: any = [];

  actualizarPagina: boolean = false;

  // Datos Provincias, Continentes, Países y Ciudades
  provincias: any = [];
  seleccionarProvincia;
  continentes: any = [];
  seleccionarContinente;
  paises: any = [];
  seleccionarPaises;
  nombreCiudades: any = [];
  seleccionarCiudad;

  filteredOptPais: Observable<string[]>;
  filteredOptProv: Observable<string[]>;
  filteredOptCiud: Observable<string[]>;

  // Control de los campos del formulario
  nombreCiudadF = new FormControl('', [Validators.required]);
  idProvinciaF = new FormControl('', [Validators.required]);
  nombreContinenteF = new FormControl('', Validators.required);
  nombrePaisF = new FormControl('', Validators.required);

  // Asignar los campos en un formulario en grupo
  public asignarCiudadForm = new FormGroup({
    nombreCiudadForm: this.nombreCiudadF,
    idProvinciaForm: this.idProvinciaF,
    nombreContinenteForm: this.nombreContinenteF,
    nombrePaisForm: this.nombrePaisF,
  });

  constructor(
    private restF: CiudadFeriadosService,
    private restP: ProvinciaService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<AsignarCiudadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.continentes = this.ObtenerContinentes();
    this.filteredOptPais = this.nombrePaisF.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterPais(value))
      );
    this.filteredOptProv = this.idProvinciaF.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterProvincia(value))
      );
    this.filteredOptCiud = this.nombreCiudadF.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterCiudad(value))
      );
  }

  private _filterPais(value: string): string[] {
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

  private _filterCiudad(value: string): string[] {
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.nombreCiudades.filter(ciudades => ciudades.descripcion.toLowerCase().includes(filterValue));
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
      this.paises[this.paises.length] = { nombre: "Seleccionar" };
      this.seleccionarPaises = this.paises[this.paises.length - 1].nombre;
    })
  }

  FiltrarPaises(form) {
    var nombreContinente = form.nombreContinenteForm;
    if (nombreContinente === 'Seleccionar' || nombreContinente === '') {
      this.toastr.info('No ha seleccionado ninguna opción')
      this.paises = [];
      this.provincias = [];
      this.nombreCiudades = [];
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
      this.provincias[this.provincias.length] = { nombre: "Seleccionar" };
      this.seleccionarProvincia = this.provincias[this.provincias.length - 1].nombre;
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

  ObtenerCiudades(provincia) {
    this.nombreCiudades = [];
    this.restF.BuscarCiudadProvincia(provincia).subscribe(datos => {
      this.nombreCiudades = datos;
      this.nombreCiudades[this.nombreCiudades.length] = { descripcion: "Seleccionar" };
      this.seleccionarCiudad = this.nombreCiudades[this.nombreCiudades.length - 1].descripcion;
    }, error => {
      this.toastr.info('Provincia, Departamento o Estado no tiene ciudades registradas')
    })
  }

  FiltrarCiudades(form) {
    var nombreProvincia = form.idProvinciaForm;
    if (nombreProvincia === 'Seleccionar') {
      this.toastr.info('No ha seleccionado ninguna opción')
      this.seleccionarCiudad = '';
    }
    else {
      this.seleccionarCiudad = this.ObtenerCiudades(nombreProvincia);
    }
  }

  SeleccionarCiudad(form) {
    var nombreCiudad = form.nombreCiudadForm;
    if (nombreCiudad === undefined) {
      this.toastr.info('No ha seleccionado ninguna opción')
    }
  }

  LimpiarCampos() {
    this.asignarCiudadForm.reset();
    this.ObtenerContinentes();
    this.paises = [];
    this.provincias = [];
    this.nombreCiudades = [];
  }

  CerrarVentanaAsignarCiudad() {
    this.LimpiarCampos();
    this.dialogRef.close();
  }

  InsertarFeriadoCiudad(form, id) {
    let idCiudad;
    this.nombreCiudades.forEach(obj => {
      if (obj.descripcion === form.nombreCiudadForm) {
        idCiudad = obj.id;
        console.log(obj);
      }
    });
    if (idCiudad != 'Seleccionar') {
      var buscarCiudad = {
        id_feriado: this.data.feriado.id,
        id_ciudad: idCiudad
      }
      this.ciudadFeriados = [];
      this.restF.BuscarIdCiudad(buscarCiudad).subscribe(datos => {
        this.ciudadFeriados = datos;
        this.toastr.info('Se le recuerda que esta Ciudad ya fue asignada a este Feriado')
        this.LimpiarCampos();
      }, error => {
        this.restF.CrearCiudadFeriado(buscarCiudad).subscribe(response => {
          this.toastr.success('Operación Exitosa', 'Ciudad asignada a Feriado');
          this.actualizarPagina = this.data.actualizar;
          if(this.actualizarPagina === true){
            this.LimpiarCampos();
          }
          else {
           this.dialogRef.close();
          }          
        }, error => {
          this.toastr.error('Operación Fallida', 'Ciudad no pudo ser asignada a Feriado')
        });
      });
    } else {
      this.toastr.info('Debe seleccionar una ciudad')
    }
  }

}
