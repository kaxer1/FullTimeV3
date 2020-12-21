import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-timbre',
  templateUrl: './crear-timbre.component.html',
  styleUrls: ['./crear-timbre.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class CrearTimbreComponent implements OnInit {

  // Control de campos y validaciones del formulario
  FechaF = new FormControl('', [Validators.required]);
  HoraF = new FormControl('', [Validators.required]);
  accionF = new FormControl('', [Validators.required]);
  teclaFuncionF = new FormControl('',);

  accion: any = [
    {value: 'EoS', name: 'Entrada'},
    {value: 'EoS', name: 'Salida'},
    {value: 'AES', name: 'Almuerso Entrada'},
    {value: 'AES', name: 'Almuerso Salida'},
    {value: 'PES', name: 'Permiso Entrada'},
    {value: 'PES', name: 'Permiso Salida'}
  ]
  
  public TimbreForm = new FormGroup({
    fechaForm: this.FechaF,
    horaForm: this.HoraF,
    accionForm: this.accionF,
    teclaFuncionForm: this.teclaFuncionF,
  });

  nombre: string;
  
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CrearTimbreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.nombre = this.data.empleado;
    console.log(this.data);
    
  }

  TeclaFuncion(opcion: string) {
    console.log(opcion);
    if (opcion == 'EoS') {
      return 0;
    } else if (opcion == 'AES') {
      return 1
    } else {
      return 2
    }
  }

  insertarTimbre(form1) {
    console.log(form1.fechaForm.toJSON());
    
    let dataTimbre = {
      fec_hora_timbre: form1.fechaForm.toJSON().split('T')[0] + 'T' + form1.horaForm + ':00',
      accion: form1.accionForm,
      tecl_funcion: this.TeclaFuncion(form1.accionForm),
      observacion: 'Timbre creado por administrador '+ ' ' + localStorage.getItem('usuario'),
      latitud: null,
      longitud: null,
      id_empleado: this.data.id,
      id_reloj: null,
    }
    this.dialogRef.close(dataTimbre)

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

}
