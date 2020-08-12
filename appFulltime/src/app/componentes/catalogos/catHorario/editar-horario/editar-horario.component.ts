import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HorarioService } from 'src/app/servicios/catalogos/catHorarios/horario.service';
import { PrincipalHorarioComponent } from '../principal-horario/principal-horario.component';


@Component({
  selector: 'app-editar-horario',
  templateUrl: './editar-horario.component.html',
  styleUrls: ['./editar-horario.component.css']
})
export class EditarHorarioComponent implements OnInit {

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

  contador: number = 0;

  isChecked: boolean = false;

  constructor(
    private rest: HorarioService,
    private toastr: ToastrService,
    public router: Router,
    public dialogRef: MatDialogRef<EditarHorarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.nuevoHorarioForm.patchValue({
      horarioNombreForm: this.data.horario.nombre,
      horarioMinAlmuerzoForm: this.data.horario.min_almuerzo,
      horarioHoraTrabajoForm: this.data.horario.hora_trabajo,
      horarioFlexibleForm: this.data.horario.flexible,
      horarioPorHorasForm: this.data.horario.por_horas,
      nombreCertificadoForm: this.data.horario.doc_nombre,
    });
    if (this.data.horario.doc_nombre != '' && this.data.horario.doc_nombre != null) {
      this.HabilitarBtn = true;
      this.isChecked = true;
    }
    else {
      this.HabilitarBtn = false;
      this.isChecked = false;
    }
  }

  ModificarHorario(form) {
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
      dataHorario.doc_nombre = null;
      this.rest.putHorarioRest(this.data.horario.id, dataHorario).subscribe(response => {
        this.ModificarDocumento();
        this.toastr.success('Operación Exitosa', 'Horario actualizado');
        this.SalirActualizar();
      }, error => {
        this.toastr.error('Operación Fallida', 'Horario no pudo ser actualizado')
      });
    }
    else {
      if (this.contador === 0) {
        this.GuardarDatos(dataHorario);
      }
      else {
        this.ActualizarDatos(dataHorario);
      }
    }
  }

  ActualizarDatos(datos) {
    if (this.archivoSubido[0].size <= 2e+6) {
      this.rest.putHorarioRest(this.data.horario.id, datos).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Horario actualizado');
        this.SubirRespaldo(this.data.horario.id);
        this.SalirActualizar();
      }, error => {
        this.toastr.error('Operación Fallida', 'Horario no pudo ser actualizado')
      });
    }
    else {
      this.toastr.info('El archivo ha excedido el tamaño permitido', 'Tamaño de archivos permitido máximo 2MB');
    }
  }

  HabilitarBtn: boolean = false;
  deseleccionarArchivo() {
    this.archivoSubido = [];
    this.isChecked = false;
    this.LimpiarNombreArchivo();
  }

  ModificarDocumento() {
    let datoDocumento = {
      documento: null
    }
    this.rest.EditarDocumento(this.data.horario.id, datoDocumento).subscribe(response => {
    }, error => { });
  }

  GuardarDatos(datos) {
    this.rest.putHorarioRest(this.data.horario.id, datos).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Horario actualizado');
      this.SalirActualizar();
    }, error => {
      this.toastr.error('Operación Fallida', 'Horario no pudo ser actualizado')
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
      this.toastr.success('Operación Exitosa', 'Documento subido con exito');
      this.archivoForm.reset();
      this.nameFile = '';
    });
  }

  CerrarVentanaEditarHorario() {
    this.dialogRef.close();
  }

  SalirActualizar() {
    this.LimpiarCampos();
    if (this.data.actualizar === true) {
      this.dialogRef.close();
    }
    else {
      this.dialogRef.close();
      this.router.navigate(['/verHorario/', this.data.horario.id]);
    }
  }

}
