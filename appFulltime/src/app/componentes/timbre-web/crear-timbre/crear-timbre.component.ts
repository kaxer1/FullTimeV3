import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
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
  idEmpleadoLogueado: any;

  // VARIABLES DE ALMACENMAIENTO DE COORDENADAS
  latitud: number;
  longitud: number;

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

  // MÉTODO DE CONTROL DE MEMORIA
  private options = {
    enableHighAccuracy: false,
    maximumAge: 30000,
    timeout: 15000
  };

  nombre: string;

  constructor(
    private toastr: ToastrService,
    private restTimbres: TimbresService,
    private restEmpleado: EmpleadoService,
    public dialogRef: MatDialogRef<CrearTimbreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.idEmpleadoLogueado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    if (this.data.length === undefined) {
      this.nombre = this.data.empleado;
    }
    this.VerDatosEmpleado(this.idEmpleadoLogueado);
    console.log(this.data);
    this.Geolocalizar();
  }

  empleadoUno: any = [];
  VerDatosEmpleado(idemploy: number) {
    this.empleadoUno = [];
    this.restEmpleado.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoUno = data;
    })
  }

  // MÉTODO PARA TOMAR CORDENAS DE UBICACIÓN
  Geolocalizar() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (objPosition) => {
          this.latitud = objPosition.coords.latitude;
          this.longitud = objPosition.coords.longitude;
          console.log(this.longitud, this.latitud);
        }, (objPositionError) => {
          switch (objPositionError.code) {
            case objPositionError.PERMISSION_DENIED:
              console.log('No se ha permitido el acceso a la posición del usuario.');
              break;
            case objPositionError.POSITION_UNAVAILABLE:
              console.log('No se ha podido acceder a la información de su posición.');
              break;
            case objPositionError.TIMEOUT:
              console.log('El servicio ha tardado demasiado tiempo en responder.');
              break;
            default:
              console.log('Error desconocido.');
          }
        }, this.options);
    }
    else {
      console.log('Su navegador no soporta la API de geolocalización.');
    }
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
        observacion: 'Timbre creado por Administrador ' + this.empleadoUno[0].nombre + ' ' + this.empleadoUno[0].apellido,
        latitud: this.latitud,
        longitud: this.longitud,
        id_empleado: this.data.id,
        id_reloj: 333,
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
          observacion: 'Timbre creado por Administrador ' + this.empleadoUno[0].nombre + ' ' + this.empleadoUno[0].apellido,
          latitud: this.latitud,
          longitud: this.longitud,
          id_empleado: obj.id,
          id_reloj: 333,
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
