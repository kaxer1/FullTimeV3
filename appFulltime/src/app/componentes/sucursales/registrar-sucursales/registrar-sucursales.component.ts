import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CiudadService } from 'src/app/servicios/ciudad/ciudad.service'
import { MatDialogRef } from '@angular/material/dialog';

import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';
import { ProvinciaService } from 'src/app/servicios/catalogos/catProvincias/provincia.service';
import { CiudadFeriadosService } from 'src/app/servicios/ciudadFeriados/ciudad-feriados.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';

@Component({
  selector: 'app-registrar-sucursales',
  templateUrl: './registrar-sucursales.component.html',
  styleUrls: ['./registrar-sucursales.component.css'],
  //encapsulation: ViewEncapsulation.None
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

  nombre = new FormControl('', [Validators.required, Validators.minLength(4)]);
  idCiudad = new FormControl('', [Validators.required]);
  idProvinciaF = new FormControl('', [Validators.required]);
  nombreContinenteF = new FormControl('', Validators.required);
  nombrePaisF = new FormControl('', Validators.required);
  idEmpresaF = new FormControl('', Validators.required);

  public nuevaSucursalForm = new FormGroup({
    sucursalNombreForm: this.nombre,
    idCiudadForm: this.idCiudad,
    idProvinciaForm: this.idProvinciaF,
    nombreContinenteForm: this.nombreContinenteF,
    nombrePaisForm: this.nombrePaisF,
    idEmpresaForm: this.idEmpresaF,

  });

  constructor(
    public restCiudad: CiudadService,
    public restSucursal: SucursalService,
    private restP: ProvinciaService,
    private restF: CiudadFeriadosService,
    private restE: EmpresaService,
    private restD: DepartamentosService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistrarSucursalesComponent>,
  ) { }

  ngOnInit(): void {
    this.continentes = this.ObtenerContinentes();
    this.BuscarEmpresas();
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
    var nombrePais = form.nombrePaisForm;
    if (nombrePais === undefined) {
      this.toastr.info('No ha seleccionado ninguna opción')
      this.provincias = [];
      this.seleccionarProvincia = '';
    }
    else {
      this.seleccionarProvincia = this.ObtenerProvincias(nombrePais);
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
    var nombreCiudad = form.idCiudadForm;
    if (nombreCiudad === undefined) {
      this.toastr.info('No ha seleccionado ninguna opción')
    }
  }

  BuscarEmpresas() {
    this.empresas = [];
    this.restE.ConsultarEmpresas().subscribe(datos => {
      this.empresas = datos;
    })
  }

  InsertarSucursal(form) {
    let dataSucursal = {
      nombre: form.sucursalNombreForm,
      id_ciudad: form.idCiudadForm,
      id_empresa: form.idEmpresaForm
    };
    this.restSucursal.postSucursalRest(dataSucursal).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Sucursal guardada');
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
        });
      }, error => {
      });
    }, error => {
    });
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
    this.dialogRef.close();
    window.location.reload();
  }

  ObtenerMensajeErrorNombre() {
    if (this.nombre.hasError('required')) {
      return 'Campo Obligatorio';
    }
  }

}
