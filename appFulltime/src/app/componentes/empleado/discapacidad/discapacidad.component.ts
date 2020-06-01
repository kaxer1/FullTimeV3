import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DiscapacidadService } from 'src/app/servicios/discapacidad/discapacidad.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { VerEmpleadoComponent } from '../ver-empleado/ver-empleado.component';

@Component({
  selector: 'app-discapacidad',
  templateUrl: './discapacidad.component.html',
  styleUrls: ['./discapacidad.component.css']
})
export class DiscapacidadComponent implements OnInit {

  @Input() idEmploy: string;
  @Input() editar: string;

  userDiscapacidad: any = [];
  tipoDiscapacidad: any = [];
  unTipo: any = [];
  ultimoId: any = [];

  carnet = new FormControl('', [Validators.required, Validators.maxLength(8)]);
  porcentaje = new FormControl('', [Validators.required, Validators.maxLength(6)]);
  tipo = new FormControl('', [Validators.required, Validators.maxLength(10)])
  nombreF = new FormControl('', [Validators.minLength(5)])

  public nuevoCarnetForm = new FormGroup({
    carnetForm: this.carnet,
    porcentajeForm: this.porcentaje,
    tipoForm: this.tipo,
    nombreForm: this.nombreF
  });

  constructor(
    private rest: DiscapacidadService,
    private toastr: ToastrService,
    private router: Router,
    private metodo: VerEmpleadoComponent
  ) { }

  ngOnInit(): void {
    this.limpiarCampos();
    this.editarFormulario();
    this.ObtenerTiposDiscapacidad();
  }

  texto: string = 'Anadir'
  editarFormulario() {
    if (this.editar == 'editar') {
      this.rest.getDiscapacidadUsuarioRest(parseInt(this.idEmploy)).subscribe(data => {
        this.userDiscapacidad = data;
        this.carnet.setValue(this.userDiscapacidad[0].carn_conadis);
        this.porcentaje.setValue(this.userDiscapacidad[0].porcentaje);
        this.tipo.setValue(this.userDiscapacidad[0].tipo);
        this.texto = 'Modificar'
      });
    }
  }

  insertarCarnet(form) {
    if (this.editar != 'editar') {
      let dataCarnet = {
        id_empleado: parseInt(this.idEmploy),
        carn_conadis: form.carnetForm,
        porcentaje: form.porcentajeForm,
        tipo: form.tipoForm,
      }
      this.GuardarDiscapacidad(form, dataCarnet);
    } else {
      let dataUpdate = {
        carn_conadis: form.carnetForm,
        porcentaje: form.porcentajeForm,
        tipo: form.tipoForm,
      }
      this.CambiarDiscapacidad(form, dataUpdate);

    }
  }

  GuardarDiscapacidad(form1, datos) {
    this.rest.BuscarTipoD(form1.tipoForm).subscribe(data => {
      this.unTipo = data;
      if (this.unTipo[0].nombre === 'OTRO') {
        if (form1.nombreForm != '') {
          this.GuardarTipo(form1);
          this.rest.ConsultarUltimoIdTD().subscribe(data => {
            this.ultimoId = data;
            datos.tipo = this.ultimoId[0].max;
            this.RegistarDatos(datos);
          });
        }
        else {
          this.toastr.info('Ingresar nombre del nuevo Tipo de Discapacidad')
        }
      }
      else {
        this.RegistarDatos(datos);
      }
    });
  }

  CambiarDiscapacidad(form1, datos) {
    this.rest.BuscarTipoD(form1.tipoForm).subscribe(data => {
      this.unTipo = data;
      if (this.unTipo[0].nombre === 'OTRO') {
        if (form1.nombreForm != '') {
          this.GuardarTipo(form1);
          this.rest.ConsultarUltimoIdTD().subscribe(data => {
            this.ultimoId = data;
            datos.tipo = this.ultimoId[0].max;
            this.ActualizarDatos(datos);
          });
        }
        else {
          this.toastr.info('Ingresar nombre del nuevo Tipo de Discapacidad')
        }
      }
      else {
        this.ActualizarDatos(datos);
      }
    });
  }

  RegistarDatos(datos) {
    this.rest.postDiscapacidadRest(datos).subscribe(response => {
      this.toastr.success('Operacion Exitosa', 'Discapacidad guardada');
      this.limpiarCampos();
      this.metodo.obtenerDiscapacidadEmpleado(this.idEmploy);
      this.texto = 'Añadir';
    }, error => { });
  }

  ActualizarDatos(datos) {
    this.rest.putDiscapacidadUsuarioRest(parseInt(this.idEmploy), datos).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Discapacidad Actualiza');
      this.metodo.obtenerDiscapacidadEmpleado(this.idEmploy);
      this.cerrarRegistro();
    });
  }

  GuardarTipo(form) {
    let datosTD = {
      nombre: form.nombreForm,
    }
    this.rest.InsertarTipoD(datosTD).subscribe(response => {
      console.log(response)
    }, error => { });
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

  obtenerMensajeErrorCarnet() {
    if (this.carnet.hasError('required')) {
      return 'Debe ingresar N° de carnet';
    }
    return this.carnet.hasError('maxLength') ? 'ingresar hasta 7 caracteres' : '';
  }

  formatLabel(value: number) {
    return value + '%';
  }


  limpiarCampos() {
    this.nuevoCarnetForm.reset();
  }

  cerrarRegistro() {
    this.metodo.mostrarDis();
    //window.location.reload();
  }


  /* TIPO DE DESCAPACIDAD */

  ObtenerTiposDiscapacidad() {
    this.rest.ListarTiposD().subscribe(data => {
      this.tipoDiscapacidad = data;
    });
  }

  ActivarDesactivarNombre(form1) {
    this.rest.BuscarTipoD(form1.tipoForm).subscribe(data => {
      this.unTipo = data;
      if (this.unTipo[0].nombre === 'OTRO') {
        (<HTMLInputElement>document.getElementById('nombreTD')).style.visibility = 'visible';
        this.toastr.info('Ingresar nombre del nuevo Tipo de Discapacidad', 'Etiqueta Nuevo Tipo activa')
      }
      else {
        this.nuevoCarnetForm.patchValue({
          nombreForm: '',
        });
        (<HTMLInputElement>document.getElementById('nombreTD')).style.visibility = 'hidden';
      }
    });
  }

}
