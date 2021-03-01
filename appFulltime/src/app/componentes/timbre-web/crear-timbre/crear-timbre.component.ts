import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TimbresService } from 'src/app/servicios/timbres/timbres.service';

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
    { value: 'E', name: 'Entrada' },
    { value: 'S', name: 'Salida' },
    { value: 'E/A', name: 'Almuerzo Entrada' },
    { value: 'S/A', name: 'Almuerzo Salida' },
    { value: 'E/P', name: 'Permiso Entrada' },
    { value: 'S/P', name: 'Permiso Salida' }
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
    private restTimbres: TimbresService,
    public dialogRef: MatDialogRef<CrearTimbreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    if (this.data.length === undefined) {
      this.nombre = this.data.empleado;
    }

    console.log(this.data);

  }

  TeclaFuncion(opcion: string) {
    console.log(opcion);
    if (opcion == 'E') {
      return 0;
    } else if (opcion == 'S') {
      return 1
    } else if (opcion == 'S/A') {
      return 2
    } else if (opcion == 'E/A') {
      return 3
    } else if (opcion == 'S/P') {
      return 4
    } else if (opcion == 'E/P') {
      return 5
    }
  }

  contador: number = 0;
  insertarTimbre(form1) {
    console.log(form1.fechaForm.toJSON());
    if (this.data.length === undefined) {
      let dataTimbre = {
        fec_hora_timbre: form1.fechaForm.toJSON().split('T')[0] + 'T' + form1.horaForm + ':00',
        accion: form1.accionForm,
        tecl_funcion: this.TeclaFuncion(form1.accionForm),
        observacion: 'Timbre creado por un Administrador',
        latitud: null,
        longitud: null,
        id_empleado: this.data.id,
        id_reloj: null,
      }
      this.dialogRef.close(dataTimbre)
    }
    else {
      console.log('entra')
      this.contador = 0;
      this.data.map(obj => {
        let dataTimbre = {
          fec_hora_timbre: form1.fechaForm.toJSON().split('T')[0] + 'T' + form1.horaForm + ':00',
          accion: form1.accionForm,
          tecl_funcion: this.TeclaFuncion(form1.accionForm),
          observacion: 'Timbre creado por un Administrador',
          latitud: null,
          longitud: null,
          id_empleado: obj.id,
          id_reloj: null,
        }
        this.restTimbres.PostTimbreWebAdmin(dataTimbre).subscribe(res => {
          this.contador = this.contador + 1;
          if (this.contador === this.data.length) {
            console.log(res, this.contador);
            this.dialogRef.close();
            window.location.reload();
            this.toastr.success('Operación Exitosa', 'Se creo un total de ' + this.data.length + ' timbres exitosamente.', {
              timeOut: 6000,
            })
          }
        })
      })
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
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números', {
        timeOut: 6000,
      })
      return false;
    }
  }



}
