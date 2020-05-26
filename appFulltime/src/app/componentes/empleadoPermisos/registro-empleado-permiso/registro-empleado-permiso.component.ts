import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { TipoPermisosService } from 'src/app/servicios/catalogos/catTipoPermisos/tipo-permisos.service';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';

interface opcionesDiasHoras {
  valor: string;
  nombre: string
}

@Component({
  selector: 'app-registro-empleado-permiso',
  templateUrl: './registro-empleado-permiso.component.html',
  styleUrls: ['./registro-empleado-permiso.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})

export class RegistroEmpleadoPermisoComponent implements OnInit {

  permiso: any = [];
  tipoPermisos: any = [];
  diasHoras: opcionesDiasHoras[] = [
    { valor: 'Días', nombre: 'Días' },
    { valor: 'Horas', nombre: 'Horas' },
  ];

  // Control de campos y validaciones del formulario
  idPermisoF = new FormControl('', [Validators.required]);
  fecCreacionF = new FormControl('', [Validators.required]);
  descripcionF = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{3,48}")]);
  solicitarF = new FormControl('', [Validators.required]);
  diasF = new FormControl('');
  horasF = new FormControl('');
  fechaInicioF = new FormControl('', [Validators.required]);
  fechaFinalF = new FormControl('', [Validators.required]);
  diaLibreF = new FormControl('');
  estadoF = new FormControl('');
  legalizarF = new FormControl('', [Validators.required]);

  // Asignación de validaciones a inputs del formulario
  public PermisoForm = new FormGroup({
    idPermisoForm: this.idPermisoF,
    fecCreacionForm: this.fecCreacionF,
    descripcionForm: this.descripcionF,
    solicitarForm: this.solicitarF,
    diasForm: this.diasF,
    horasForm: this.horasF,
    fechaInicioForm: this.fechaInicioF,
    fechaFinalForm: this.fechaFinalF,
    diaLibreForm: this.diaLibreF,
    estadoForm: this.estadoF,
    legalizarForm: this.legalizarF
  });

  constructor(
    private restTipoP: TipoPermisosService,
    private restP: PermisosService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistroEmpleadoPermisoComponent>,
    @Inject(MAT_DIALOG_DATA) public datoEmpleado: any,
  ) { }

  ngOnInit(): void {
    this.ObtenerTiposPermiso();
  }

  ObtenerTiposPermiso() {
    this.tipoPermisos = [];
    this.restTipoP.getTipoPermisoRest().subscribe(datos => {
      this.tipoPermisos = datos;
    })
  }

  ActivarDiasHoras(form) {
    if (form.solicitarForm === 'Días') {
      this.PermisoForm.patchValue({
        diasForm: '',
      });
      (<HTMLInputElement>document.getElementById('dias')).style.visibility = 'visible';
      (<HTMLInputElement>document.getElementById('horas')).style.visibility = 'hidden';
      this.toastr.info('Ingresar número de días de permiso');
    }
    else {
      this.PermisoForm.patchValue({
        horasForm: '',
      });
      (<HTMLInputElement>document.getElementById('horas')).style.visibility = 'visible';
      (<HTMLInputElement>document.getElementById('dias')).style.visibility = 'hidden';
      this.toastr.info('Ingresar número de horas y minutos de permiso');
    }
  }

  CambiarValoresDiasHoras(form, datos) {
    if (form.solicitarForm === 'Días') {
      if (datos.dia === '') {
        this.toastr.info('Ingresar número de días de permiso');
      }
      else {
        datos.hora_numero = '00:00';
      }
    }
    else {
      if (datos.hora_numero === '') {
        this.toastr.info('Ingresar número de horas y minutos máximos de permiso');
      }
      else {
        datos.dia = 0;
      }
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
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
      return false;
    }
  }

  InsertarPermiso(form) {
    let datosPermiso = {
      fec_creacion: form.fecCreacionForm,
      descripcion: form.descripcionForm,
      fec_inicio: form.fechaInicioForm,
      fec_final: form.fechaFinalForm,
      dia: parseInt(form.diasForm),
      legalizado: form.legalizarForm,
      estado: form.estadoForm,
      dia_libre: form.diaLibreForm,
      id_tipo_permiso: form.idPermisoForm,
      id_empl_contrato: this.datoEmpleado.idContrato,
      id_peri_vacacion: this.datoEmpleado.idPerVacacion,
      hora_numero: form.horasForm,
    }
    console.log(datosPermiso);
    this.CambiarValoresDiasHoras(form, datosPermiso);
    console.log(datosPermiso);
    this.CambiarValorDiaLibre(datosPermiso);
  }

  CambiarValorDiaLibre(datos) {
    if (datos.dia_libre === '') {
      datos.dia_libre = 0;
      this.GuardarDatos(datos);
    }
    else {
      this.GuardarDatos(datos);
    }
  }

  GuardarDatos(datos) {
    this.restP.IngresarEmpleadoPermisos(datos).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Permiso registrado');
      this.LimpiarCampos();
      console.log(res);
      // this.SubirRespaldo(id)
    });
  }

  LimpiarCampos() {
    this.PermisoForm.reset();
  }

  CerrarVentanaPermiso() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

  ObtenerMensajeErrorDescripcion() {
    if (this.descripcionF.hasError('pattern')) {
      return 'Ingresar una descripción válida';
    }
    return this.descripcionF.hasError('required') ? 'Campo Obligatorio' : '';
  }

  /**
   * 
   * Subida de archivo
   * 
   */

  archivoForm = new FormControl('');
  nameFile: string;
  archivoSubido: Array < File > ;

  fileChange(element) {
    this.archivoSubido = element.target.files;
    console.log(element.target.files);
  }
  
  SubirRespaldo(id: number) {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    this.restP.SubirArchivoRespaldo(formData, id).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Documento subido con exito');
      this.archivoForm.reset();
      this.nameFile = '';
    });
  }

}
