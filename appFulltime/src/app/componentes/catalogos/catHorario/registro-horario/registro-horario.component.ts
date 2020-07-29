import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';

@Component({
  selector: 'app-registro-horario',
  templateUrl: './registro-horario.component.html',
  styleUrls: ['./registro-horario.component.css'],
  //encapsulation: ViewEncapsulation.None
})

export class RegistroHorarioComponent implements OnInit {

  isChecked: boolean = false;
  
  // Validaciones para el formulario
  nombre = new FormControl('', [Validators.required, Validators.minLength(2)]);
  minAlmuerzo = new FormControl('', [Validators.pattern('[0-9]*')]);
  horaTrabajo = new FormControl('', [Validators.required, Validators.pattern("^[0-9]*(:[0-9][0-9])?$")]);
  flexible = new FormControl('', Validators.required);
  porHoras = new FormControl('', Validators.required);
  nombreCertificadoF = new FormControl('');
  archivoForm = new FormControl('');

  // asignar los campos en un formulario en grupo
  public nuevoHorarioForm = new FormGroup({
    horarioNombreForm: this.nombre,
    horarioMinAlmuerzoForm: this.minAlmuerzo,
    horarioHoraTrabajoForm: this.horaTrabajo,
    horarioFlexibleForm: this.flexible,
    horarioPorHorasForm: this.porHoras,
    nombreCertificadoForm: this.nombreCertificadoF
  });

  constructor(
    private rest: HorarioService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistroHorarioComponent>
  ) { }

  ngOnInit(): void {
  }

  idHorario: any;
  InsertarHorario(form) {
    let dataHorario = {
      nombre: form.horarioNombreForm,
      min_almuerzo: form.horarioMinAlmuerzoForm,
      hora_trabajo: form.horarioHoraTrabajoForm,
      flexible: form.horarioFlexibleForm,
      por_horas: form.horarioPorHorasForm,
      doc_nombre: form.nombreCertificadoForm
    };
    if (dataHorario.min_almuerzo === '') {
      dataHorario.min_almuerzo = 0;
    }
    if (form.nombreCertificadoForm === '') {
      this.rest.postHorarioRest(dataHorario).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Horario registrado');
        this.LimpiarCampos();
      }, error => {
        this.toastr.error('Operación Fallida', 'Horario no pudo ser registrado')
      });
    }
    else {
      this.GuardarDatos(dataHorario);
    }

  }

  GuardarDatos(datos) {
    if (this.archivoSubido[0].size <= 2e+6) {
      this.rest.postHorarioRest(datos).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Horario registrado');
        this.LimpiarCampos();
        this.idHorario = response;
        this.SubirRespaldo(this.idHorario.id);
      }, error => {
        this.toastr.error('Operación Fallida', 'Horario no pudo ser registrado')
      });
    }
    else {
      this.toastr.info('El archivo ha excedido el tamaño permitido', 'Tamaño de archivos permitido máximo 2MB');
    }
  }

  IngresarNumeroDecimal(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6 || keynum == 58) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
      return false;
    }
  }

  IngresarSoloNumerosEnteros(evt) {
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

  ObtenerMensajeErrorNombre() {
    if (this.nombre.hasError('required')) {
      return 'Campo obligatorio';
    }
  }

  ObtenerMensajeErrorHoraTrabajo() {
    if (this.horaTrabajo.hasError('pattern')) {
      return 'Indicar horas y minutos. Ejemplo: 12:05';
    }
  }

  LimpiarCampos() {
    this.nuevoHorarioForm.reset();
  }

  LimpiarNombreArchivo() {
    this.nuevoHorarioForm.patchValue({
      nombreCertificadoForm: '',
    });
  }

  HabilitarBtn: boolean = false;
  deseleccionarArchivo() {
    this.archivoSubido = [];
    this.isChecked = false;
    this.LimpiarNombreArchivo();
  }

  nameFile: string;
  archivoSubido: Array<File>;

  fileChange(element) {
    this.archivoSubido = element.target.files;
    if (this.archivoSubido.length != 0) {
      const name = this.archivoSubido[0].name;
      console.log(this.archivoSubido[0].name);
      this.nuevoHorarioForm.patchValue({ nombreCertificadoForm: name });
      this.HabilitarBtn = true
    }
  }

  SubirRespaldo(id: number) {
    let formData = new FormData();
    for (var i = 0; i < this.archivoSubido.length; i++) {
      formData.append("uploads[]", this.archivoSubido[i], this.archivoSubido[i].name);
    }
    this.rest.SubirArchivoRespaldo(formData, id).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Documento subido con exito');
      this.archivoForm.reset();
      this.nameFile = '';
    });
  }

  CerrarVentanaRegistroHorario() {
    this.LimpiarCampos();
    this.dialogRef.close();
  }

}
