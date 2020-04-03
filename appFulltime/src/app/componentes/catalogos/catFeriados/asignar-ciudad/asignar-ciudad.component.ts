import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CiudadFeriadosService } from 'src/app/servicios/CiudadFeriados/ciudad-feriados.service';

@Component({
  selector: 'app-asignar-ciudad',
  templateUrl: './asignar-ciudad.component.html',
  styleUrls: ['./asignar-ciudad.component.css']
})
export class AsignarCiudadComponent implements OnInit {

  // Datos Departamento
  nombreCiudades: any = [];
  ciudadFeriados: any = [];
  nombreProvincias: any = [];
  seleccionarCiudad;
  seleccionarProvincia;

  // Control de los campos del formulario
  nombreProvinciaF = new FormControl('');
  nombreCiudadF = new FormControl('', [Validators.required]);

  // Asignar los campos en un formulario en grupo
  public asignarCiudadForm = new FormGroup({
    nombreProvinciaForm: this.nombreProvinciaF,
    nombreCiudadForm: this.nombreCiudadF,
  });

  constructor(
    private restF: CiudadFeriadosService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AsignarCiudadComponent>,
    @Inject(MAT_DIALOG_DATA) public feriadoSeleccionado: any
  ) { }

  ngOnInit(): void {
    this.seleccionarProvincia = this.ObtenerProvincias();
  }

  ObtenerProvincias() {
    this.nombreProvincias = [];
    this.restF.BuscarProvincia().subscribe(datos => {
      this.nombreProvincias = datos;
      this.nombreProvincias[this.nombreProvincias.length] = { nombre: "Seleccionar Provincia" };
      this.seleccionarProvincia = this.nombreProvincias[this.nombreProvincias.length - 1].nombre;
    })
  }

  ObtenerCiudades(provincia) {
    this.nombreCiudades = [];
    this.restF.BuscarCiudadProvincia(provincia).subscribe(datos => {
      this.nombreCiudades = datos;
      console.log(this.nombreCiudades);
      this.nombreCiudades[this.nombreCiudades.length] = { descripcion: "Seleccionar Ciudad" };
      this.seleccionarCiudad = this.nombreCiudades[this.nombreCiudades.length - 1].descripcion;
    })
  }

  FiltrarCiudades(form) {
    var nombreProvincia = form.nombreProvinciaForm;
    console.log(nombreProvincia);
    if (nombreProvincia === 'Seleccionar Provincia' || nombreProvincia === '') {
      this.toastr.info('No ha seleccionado ninguna opción')
    }
    else {
      this.seleccionarCiudad = this.ObtenerCiudades(nombreProvincia);
    }
  }

  LimpiarCampos() {
    this.asignarCiudadForm.reset();
    this.ObtenerProvincias();
    this.nombreCiudades = [];
  }

  CerrarVentanaAsignarCiudad() {
    this.LimpiarCampos();
    this.dialogRef.close();
  }

  InsertarFeriadoCiudad(form) {
    var idFeriado = this.feriadoSeleccionado.id;
    var nombreCiudad = form.nombreCiudadForm;
    if (nombreCiudad != 'Seleccionar Ciudad') {
      this.ciudadFeriados = [];
      let buscarCiudad = {
        id_feriado: idFeriado,
        id_ciudad: nombreCiudad
      }
      this.restF.BuscarIdCiudad(buscarCiudad).subscribe(datos => {
        this.ciudadFeriados = datos;
        if (this.ciudadFeriados.length > 0) {
          this.toastr.info('Se le recuerda que esta Ciudad ya fue asignada a este Feriado')
          this.LimpiarCampos();
        }
      }, error => {
        let datosCiudadFeriado = {
          id_feriado: idFeriado,
          id_ciudad: nombreCiudad,
        };
        console.log("datos", datosCiudadFeriado)
        this.restF.CrearCiudadFeriado(datosCiudadFeriado).subscribe(response => {
          this.toastr.success('Operación Exitosa', 'Ciudad asignada a Feriado');
          this.LimpiarCampos();
        }, error => {
          this.toastr.error('Operación Fallida', 'Ciudad no pudo ser asignada a Feriado')
        });
      });
    } else {
      this.toastr.info('Debe seleccionar una ciudad')
    }
  }

}
