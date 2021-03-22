import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { AccionPersonalService } from 'src/app/servicios/accionPersonal/accion-personal.service';
import { ProcesoService } from 'src/app/servicios/catalogos/catProcesos/proceso.service';

@Component({
  selector: 'app-crear-tipoaccion',
  templateUrl: './crear-tipoaccion.component.html',
  styleUrls: ['./crear-tipoaccion.component.css']
})

export class CrearTipoaccionComponent implements OnInit {

  procesos: any = [];
  selec1: boolean = false;
  selec2: boolean = false;
  selec3: boolean = false;

  // Control de campos y validaciones del formulario
  idProcesoF = new FormControl('', [Validators.required]);
  descripcionF = new FormControl('', [Validators.required]);
  baseLegalF = new FormControl('', [Validators.required]);
  tipoF = new FormControl('');

  // Asignación de validaciones a inputs del formulario
  public AccionesForm = new FormGroup({
    idProcesoForm: this.idProcesoF,
    descripcionForm: this.descripcionF,
    baseLegalForm: this.baseLegalF,
    tipoForm: this.tipoF,
  });

  constructor(
    private rest: AccionPersonalService,
    private restP: ProcesoService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CrearTipoaccionComponent>,
  ) { }

  ngOnInit(): void {
    this.ListarProcesos();
  }

  ListarProcesos() {
    this.procesos = [];
    this.restP.getProcesosRest().subscribe(datos => {
      this.procesos = datos;
    });
  }

  InsertarAccion(form) {
    let datosAccion = {
      id_proceso: form.idProcesoForm,
      descripcion: form.descripcionForm,
      base_legal: form.baseLegalForm,
      tipo_permiso: this.selec1,
      tipo_vacacion: this.selec2,
      tipo_situacion_propuesta: this.selec3
    };
    this.rest.IngresarTipoAccionPersonal(datosAccion).subscribe(response => {
      this.toastr.success('Operación Exitosa', '', {
        timeOut: 6000,
      })
      this.CerrarVentanaRegistro();
    }, error => {
      this.toastr.error('Revisar los datos',
        'Operación Fallida', {
        timeOut: 6000,
      })
    });
  }

  IngresarSoloNumeros(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números', {
        timeOut: 6000,
      })
      return false;
    }
  }

  LimpiarCampos() {
    this.AccionesForm.reset();
  }

  CerrarVentanaRegistro() {
    this.LimpiarCampos();
    this.dialogRef.close();
  }

  CambiarEstadosPermisos() {
    this.selec2 = false;
    this.selec3 = false;
  }

  CambiarEstadosVacaciones() {
    this.selec1 = false;
    this.selec3 = false;
  }

  CambiarEstadosSituacion() {
    this.selec1 = false;
    this.selec2 = false;
  }

}
