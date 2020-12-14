import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CiudadService } from 'src/app/servicios/ciudad/ciudad.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';
import { ProvinciaService } from 'src/app/servicios/catalogos/catProvincias/provincia.service';
import { CiudadFeriadosService } from 'src/app/servicios/ciudadFeriados/ciudad-feriados.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-registrar-sucursales',
  templateUrl: './registrar-sucursales.component.html',
  styleUrls: ['./registrar-sucursales.component.css']
})
export class RegistrarSucursalesComponent implements OnInit {

  // Datos Provincias, Continentes, Países y Ciudades
  empresas: any = [];
  provincias: any = [];
  seleccionarProvincia;
  continentes: any = [];
  seleccionarContinente;
  paises: any = [];
  seleccionarPaises;
  nombreCiudades: any = [];
  seleccionarCiudad;
  ultimoId: any = [];

  Habilitar: boolean;

  filteredOptPais: Observable<string[]>;
  filteredOptProv: Observable<string[]>;
  filteredOptCiud: Observable<string[]>;
  filteredOptEmpr: Observable<string[]>;

  nombre = new FormControl('', [Validators.required, Validators.minLength(4)]);
  idCiudad = new FormControl('', [Validators.required]);
  idProvinciaF = new FormControl('', [Validators.required]);
  nombreContinenteF = new FormControl('', Validators.required);
  nombrePaisF = new FormControl('', Validators.required);
  idEmpresaF = new FormControl('');

  public nuevaSucursalForm = new FormGroup({
    sucursalNombreForm: this.nombre,
    idCiudadForm: this.idCiudad,
    idProvinciaForm: this.idProvinciaF,
    nombreContinenteForm: this.nombreContinenteF,
    nombrePaisForm: this.nombrePaisF,
    idEmpresaForm: this.idEmpresaF,

  });

  /**
   * Variables progress spinner
   */
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 10;
  habilitarprogress: boolean = false;

  constructor(
    public restCiudad: CiudadService,
    public restSucursal: SucursalService,
    private restP: ProvinciaService,
    private restF: CiudadFeriadosService,
    private restE: EmpresaService,
    private restD: DepartamentosService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistrarSucursalesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.continentes = this.ObtenerContinentes();
    this.BuscarEmpresas();
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
    this.filteredOptCiud = this.idCiudad.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterCiudad(value))
      );
    this.filteredOptEmpr = this.idEmpresaF.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterEmpresa(value))
      );

    if (this.data != undefined) {
      this.Habilitar = true;
    }
    else {
      this.Habilitar = false;
    }
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

  private _filterEmpresa(value: string): string[] {
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.empresas.filter(empresas => empresas.nombre.toLowerCase().includes(filterValue));
    }
  }

  ObtenerContinentes() {
    this.continentes = [];
    this.restP.BuscarContinente().subscribe(datos => {
      this.continentes = datos;
      this.continentes[this.continentes.length] = { continente: "Seleccionar" };
      this.seleccionarContinente = this.continentes[this.continentes.length - 1].continente;
    });
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
      this.toastr.info('No ha seleccionado ninguna opción','', {
        timeOut: 6000,
      })
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
      this.seleccionarProvincia = '';
    }, error => {
      this.toastr.info('El País seleccionado no tiene Provincias, Departamentos o Estados registrados','', {
        timeOut: 6000,
      })
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
      this.toastr.info('No ha seleccionado ninguna opción','', {
        timeOut: 6000,
      })
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
      this.seleccionarCiudad = '';
    }, error => {
      this.toastr.info('Provincia, Departamento o Estado no tiene ciudades registradas','', {
        timeOut: 6000,
      })
    })
  }

  FiltrarCiudades(form) {
    let nombreProvincia = form.idProvinciaForm;
    if (nombreProvincia === 'Seleccionar') {
      this.toastr.info('No ha seleccionado ninguna opción','', {
        timeOut: 6000,
      })
      this.seleccionarCiudad = '';
    }
    else {
      this.seleccionarCiudad = this.ObtenerCiudades(nombreProvincia);
    }
  }

  SeleccionarCiudad(form) {
    var nombreCiudad = form.idCiudadForm;
    if (nombreCiudad === undefined) {
      this.toastr.info('No ha seleccionado ninguna opción','', {
        timeOut: 6000,
      })
    }
  }

  BuscarEmpresas() {
    this.empresas = [];
    this.restE.ConsultarEmpresas().subscribe(datos => {
      this.empresas = datos;
    })
  }

  InsertarSucursal(form) {
    this.habilitarprogress = true;
    let idEmpr;
    if (this.data != undefined) {
      idEmpr = this.data;
    }
    else {
      this.empresas.forEach(obj => {
        if (obj.nombre === form.idEmpresaForm) {
          idEmpr = obj.id
        }
      });
    }
    let idCiud;
    this.nombreCiudades.forEach(obj => {
      if (obj.descripcion === form.idCiudadForm) {
        idCiud = obj.id
      }
    });
    let dataSucursal = {
      nombre: form.sucursalNombreForm,
      id_ciudad: idCiud,
      id_empresa: idEmpr
    };

    this.restSucursal.postSucursalRest(dataSucursal).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Sucursal guardada', {
        timeOut: 6000,
      });
      this.LimpiarCampos();
      //Obtener ultimo ID para registrar un departamento de nombre Ninguno -- útil para cada sucursal registrada
      this.restSucursal.EncontrarUltimoId().subscribe(datos => {
        this.ultimoId = datos;
        console.log("id sucursal: ", this.ultimoId[0].max);
        let datosDepartamentos = {
          nombre: 'Ninguno',
          nivel: 1,
          depa_padre: null,
          id_sucursal: this.ultimoId[0].max
        };
        console.log("insertar departamento: ", datosDepartamentos);
        this.restD.postDepartamentoRest(datosDepartamentos).subscribe(response => {
          this.ultimoId = [];
          this.habilitarprogress = false;
          console.log('depa-guardado')
        });
      }, error => { console.log(error); });
    }, error => { console.log(error); });
  }

  LimpiarCampos() {
    this.nuevaSucursalForm.reset();
    this.ObtenerContinentes();
    this.paises = [];
    this.provincias = [];
    this.nombreCiudades = [];
  }

  CerrarVentanaRegistroSucursal() {
    this.LimpiarCampos();
    this.dialogRef.close({actualizar: true});
  }

  ObtenerMensajeErrorNombre() {
    if (this.nombre.hasError('required')) {
      return 'Campo Obligatorio';
    }
  }

}
