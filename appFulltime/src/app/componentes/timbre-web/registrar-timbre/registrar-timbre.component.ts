import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registrar-timbre',
  templateUrl: './registrar-timbre.component.html',
  styleUrls: ['./registrar-timbre.component.css']
})

export class RegistrarTimbreComponent implements OnInit {

  accionF = new FormControl('', [Validators.required]);
  teclaFuncionF = new FormControl('',);
  observacionF = new FormControl('');

  public TimbreForm = new FormGroup({
    accionForm: this.accionF,
    teclaFuncionForm: this.teclaFuncionF,
    observacionForm: this.observacionF
  });

  latitud: number;
  longitud: number;

  private options = {
    enableHighAccuracy: false,
    maximumAge: 30000,
    timeout: 15000
  };

  f: Date = new Date();
  timbre: String;
  Hora: string;
  
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistrarTimbreComponent>,
  ) { }

  ngOnInit(): void {
    var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
    this.timbre = diasSemana[this.f.getDay()] + ", " + this.f.getDate() + " de " + meses[this.f.getMonth()] + " de " + this.f.getFullYear();
    this.Hora = this.f.getHours() + ':' + this.f.getMinutes() + ':' + this.f.getSeconds();
    this.Geolocalizar()
  }

  AlmacenarDatos(opcion:number) {
    console.log(opcion);
    switch (opcion) {
      case 1:
        this.accionF.setValue('EoS')
        this.teclaFuncionF.setValue(0)
        break;
      case 2:
        this.accionF.setValue('EoS')
        this.teclaFuncionF.setValue(0)
      break;
      case 3:
        this.accionF.setValue('AES')
        this.teclaFuncionF.setValue(1)
      break;
      case 4:
        this.accionF.setValue('AES')
        this.teclaFuncionF.setValue(1)
      break;
      case 5:
        this.accionF.setValue('PES')
        this.teclaFuncionF.setValue(2)
      break;
      case 6:
        this.accionF.setValue('PES')
        this.teclaFuncionF.setValue(2)
        break;
      default:
        this.accionF.setValue('code 99')
        break;
    }
  }

  Geolocalizar() {
    if (navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(
        (objPosition) => {
          // console.log(objPosition);
          
          this.latitud = objPosition.coords.latitude;
          this.longitud = objPosition.coords.longitude;

          console.log(this.longitud, this.latitud);
          
        }, (objPositionError) => {
          switch (objPositionError.code)
          {
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
    else
    {
      console.log('Su navegador no soporta la API de geolocalización.');
    }
  }

  insertarTimbre(form1) {
    console.log(this.f.toLocaleString());
    
    let dataTimbre = {
      fec_hora_timbre: this.f.toLocaleString(),
      accion: form1.accionForm,
      tecl_funcion: form1.teclaFuncionForm,
      observacion: form1.observacionForm,
      latitud: this.latitud,
      longitud: this.longitud,
      // id_empleado: form1.nombreEmpleadoForm,
      id_reloj: null,
    }
    this.dialogRef.close(dataTimbre)

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
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras', {
        timeOut: 6000,
      })
      return false;
    }
  }

}
