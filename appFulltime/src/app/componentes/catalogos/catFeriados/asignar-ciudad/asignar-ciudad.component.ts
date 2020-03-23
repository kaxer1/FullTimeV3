import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CiudadService } from 'src/app/servicios/ciudad/ciudad.service';
import { CiudadFeriadosService } from 'src/app/servicios/CiudadFeriados/ciudad-feriados.service';

@Component({
  selector: 'app-asignar-ciudad',
  templateUrl: './asignar-ciudad.component.html',
  styleUrls: ['./asignar-ciudad.component.css']
})
export class AsignarCiudadComponent implements OnInit {

  // Control de los campos del formulario
  nombreCiudadF = new FormControl('', [Validators.required]);

  // Datos Departamento
  nombreCiudades: any = [];
  ciudadFeriados: any = [];
  seleccionarCiudad;

  // Asignar los campos en un formulario en grupo
  public asignarCiudadForm = new FormGroup({
    nombreCiudadForm: this.nombreCiudadF,
  });

  constructor(
    private rest: CiudadService,
    private restF: CiudadFeriadosService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AsignarCiudadComponent>,
    @Inject(MAT_DIALOG_DATA) public feriadoSeleccionado: any
  ) { }

  ngOnInit(): void {
    this.seleccionarCiudad = this.ObtenerCiudades();
  }

  ObtenerCiudades() {
    this.nombreCiudades = [];
    this.rest.ConsultarCiudades().subscribe(datos => {
      this.nombreCiudades = datos;
      this.nombreCiudades[this.nombreCiudades.length] = { descripcion: "Seleccionar Ciudad" };
      this.seleccionarCiudad = this.nombreCiudades[this.nombreCiudades.length - 1].descripcion;
    })
  }

  LimpiarCampos() {
    this.asignarCiudadForm.reset();
    this.ObtenerCiudades();
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
