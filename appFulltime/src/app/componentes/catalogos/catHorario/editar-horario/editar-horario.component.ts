import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { PrincipalHorarioComponent } from '../principal-horario/principal-horario.component';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-editar-horario',
  templateUrl: './editar-horario.component.html',
  styleUrls: ['./editar-horario.component.css']
})

export class EditarHorarioComponent implements OnInit {

  nocturno = false;
  detalle = false;

  // Validaciones para el formulario
  nombre = new FormControl('', [Validators.required, Validators.minLength(2)]);
  minAlmuerzo = new FormControl('', [Validators.pattern('[0-9]*')]);
  horaTrabajo = new FormControl('', [Validators.required, Validators.pattern("^[0-9]*(:[0-9][0-9])?$")]);
  tipoF = new FormControl('');
  nombreCertificadoF = new FormControl('');
  archivoForm = new FormControl('');
  detalleF = new FormControl('');

  // asignar los campos en un formulario en grupo
  public nuevoHorarioForm = new FormGroup({
    horarioNombreForm: this.nombre,
    horarioMinAlmuerzoForm: this.minAlmuerzo,
    horarioHoraTrabajoForm: this.horaTrabajo,
    nombreCertificadoForm: this.nombreCertificadoF,
    tipoForm: this.tipoF,
    detalleForm: this.detalleF,
  });

  contador: number = 0;

  isChecked: boolean = false;

  /**
   * Variables progress spinner
   */
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 10;
  habilitarprogress: boolean = false;

  constructor(
    private rest: HorarioService,
    private toastr: ToastrService,
    public router: Router,
    public dialogRef: MatDialogRef<EditarHorarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log('edit', this.data)
    this.nuevoHorarioForm.patchValue({
      horarioNombreForm: this.data.horario.nombre,
      horarioMinAlmuerzoForm: this.data.horario.min_almuerzo,
      horarioHoraTrabajoForm: this.data.horario.hora_trabajo.split(':')[0] + ':' + this.data.horario.hora_trabajo.split(':')[1],
      nombreCertificadoForm: this.data.horario.doc_nombre,
      detalleForm: this.data.horario.detalle,
      tipoForm: this.data.horario.nocturno,
    });

    if (this.data.horario.doc_nombre != '' && this.data.horario.doc_nombre != null) {
      this.HabilitarBtn = true;
      this.isChecked = true;
    }
    else {
      this.HabilitarBtn = false;
      this.isChecked = false;
    }
    if (this.data.horario.nocturno === true) {
      this.nocturno = true;
    } else {
      this.nocturno = false;
    }
    if (this.data.horario.detalle === true) {
      this.detalle = true;
    } else {
      this.detalle = false;
    }
  }

  ModificarHorario(form) {
    this.habilitarprogress = true;
    let dataHorario = {
      nombre: form.horarioNombreForm,
      min_almuerzo: form.horarioMinAlmuerzoForm,
      hora_trabajo: form.horarioHoraTrabajoForm,
      doc_nombre: form.nombreCertificadoForm,
      nocturno: form.tipoForm,
      detalle: form.detalleForm,
    };
    if (dataHorario.detalle === false) {
      dataHorario.hora_trabajo = this.StringTimeToSegundosTime(form.horarioHoraTrabajoForm)
    }
    else {
      dataHorario.hora_trabajo = this.CambiarFormato(form.horarioHoraTrabajoForm)
    }
    if (dataHorario.min_almuerzo === '' || dataHorario.min_almuerzo === null || dataHorario.min_almuerzo === undefined) {
      dataHorario.min_almuerzo = 0;
    }
    if (form.nombreCertificadoForm === '') {
      this.rest.VerificarDuplicadosEdicion(this.data.horario.id, form.horarioNombreForm).subscribe(response => {
        console.log(response);
        this.toastr.info('Nombre de horario ya se encuentra registrado.', 'Verificar Datos.', {
          timeOut: 6000,
        });
        this.habilitarprogress = false;
      }, error => {
        console.log(error);
        dataHorario.doc_nombre = null;
        this.rest.putHorarioRest(this.data.horario.id, dataHorario).subscribe(response => {
          this.ModificarDocumento();
          this.toastr.success('Operación Exitosa', 'Horario actualizado.', {
            timeOut: 6000,
          });
          this.SalirActualizar(dataHorario, response);
        }, error => {
          console.log(error);
          this.toastr.error('Operación Fallida', 'Horario no pudo ser actualizado.', {
            timeOut: 6000,
          })
        });
      });
    }
    else {
      if (this.contador === 0) {
        this.rest.VerificarDuplicadosEdicion(this.data.horario.id, form.horarioNombreForm).subscribe(response => {
          console.log(response);
          this.habilitarprogress = false;
          this.toastr.info(response.message, 'Verificar Datos', {
            timeOut: 6000,
          });
        }, error => {
          console.log(error);

          this.GuardarDatos(dataHorario);
        });
      }
      else {
        this.rest.VerificarDuplicadosEdicion(this.data.horario.id, form.horarioNombreForm).subscribe(response => {
          this.habilitarprogress = false;
          console.log(response);
          this.toastr.info(response.message, 'Verificar Datos', {
            timeOut: 6000,
          });
        }, error => {
          console.log(error);
          this.ActualizarDatos(dataHorario);
        });
      }
    }
  }

  ActualizarDatos(datos) {
    this.habilitarprogress = true;
    if (this.archivoSubido[0].size <= 2e+6) {
      this.rest.putHorarioRest(this.data.horario.id, datos).subscribe(response => {
        this.habilitarprogress = false;
        this.toastr.success('Operación Exitosa', 'Horario actualizado', {
          timeOut: 6000,
        });
        this.SubirRespaldo(this.data.horario.id);
        this.SalirActualizar(datos, response);
      }, error => {
        console.log(error);

        this.toastr.error('Operación Fallida', 'Horario no pudo ser actualizado', {
          timeOut: 6000,
        })
      });
    }
    else {
      this.toastr.info('El archivo ha excedido el tamaño permitido', 'Tamaño de archivos permitido máximo 2MB', {
        timeOut: 6000,
      });
    }
  }

  CambiarFormato(stringTime: string) {
    let horaT = '';
    if (stringTime.split(':').length === 1) {
      if (parseInt(stringTime) < 10) {
        horaT = '0' + parseInt(stringTime) + ':00';
        return horaT;
      }
      else {
        horaT = stringTime + ':00';
        return horaT;
      }
    }
    else if (stringTime.split(':').length === 2) {
      if (parseInt(stringTime.split(':')[0]) < 10) {
        horaT = '0' + String(parseInt(stringTime)).split(':')[0] + ':' + stringTime.split(':')[1];
        return horaT;
      }
      else {
        horaT = stringTime.split(':')[0] + ':' + stringTime.split(':')[1];
        return horaT;
      }
    }
  }

  HabilitarBtn: boolean = false;
  deseleccionarArchivo() {
    this.archivoSubido = [];
    this.isChecked = false;
    this.LimpiarNombreArchivo();
  }

  ModificarDocumento() {
    this.habilitarprogress = true;
    let datoDocumento = {
      documento: null
    }
    this.rest.EditarDocumento(this.data.horario.id, datoDocumento).subscribe(response => {
      this.habilitarprogress = false;
    }, error => {
      console.log(error);
    });
  }

  GuardarDatos(datos) {
    this.habilitarprogress = true;
    this.rest.putHorarioRest(this.data.horario.id, datos).subscribe(response => {
      this.habilitarprogress = false;
      this.toastr.success('Operación Exitosa', 'Horario actualizado', {
        timeOut: 6000,
      });
      this.SalirActualizar(datos, response);
    }, error => {
      this.habilitarprogress = false;
      console.log(error);
      this.toastr.error('Operación Fallida', 'Horario no pudo ser actualizado', {
        timeOut: 6000,
      })
    });
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
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números', {
        timeOut: 6000,
      })
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
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números', {
        timeOut: 6000,
      })
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

  nameFile: string;
  archivoSubido: Array<File>;

  fileChange(element) {
    this.contador = 1;
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
      this.toastr.success('Operación Exitosa', 'Documento subido con exito', {
        timeOut: 6000,
      });
      this.archivoForm.reset();
      this.nameFile = '';
    });
  }

  CerrarVentanaEditarHorario() {
    this.dialogRef.close();
  }

  SalirActualizar(datos, response) {

    if (this.data.actualizar === false) {
      console.log('verificar entrada false', this.data.actualizar)
      this.LimpiarCampos();
      this.dialogRef.close(response);
      if (datos.detalle != false) {
        this.router.navigate(['/verHorario/', this.data.horario.id]);
      }
    }
    else {
      this.LimpiarCampos();
      console.log('verificar entrada true', this.data.actualizar)
      this.dialogRef.close(response);
      if (datos.detalle != true) {
        this.router.navigate(['/horario']);
      }
    }

  }

  StringTimeToSegundosTime(stringTime: string) {
    let hora = '';
    if (stringTime.split(':').length === 1) {
      if (parseInt(stringTime) < 10) {
        hora = '0' + parseInt(stringTime) + ':00:00';
        return hora;
      }
      else {
        hora = stringTime + ':00:00';
        return hora;
      }
    }
    else if (stringTime.split(':').length === 2) {
      if (parseInt(stringTime.split(':')[0]) < 10) {
        hora = '0' + String(parseInt(stringTime)).split(':')[0] + ':' + stringTime.split(':')[1] + ':00';
        return hora;
      }
      else {
        hora = stringTime.split(':')[0] + ':' + stringTime.split(':')[1] + ':00';
        return hora;
      }
    }
  }

}
