import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-configurar-codigo',
  templateUrl: './configurar-codigo.component.html',
  styleUrls: ['./configurar-codigo.component.css']
})
export class ConfigurarCodigoComponent implements OnInit {

  inicioF = new FormControl('');
  seleccionF = new FormControl('');

  automaticoF = false;
  manualF = false;
  HabilitarDescrip: boolean = true;
  estilo: any;

  public configuracionForm = new FormGroup({
    inicioForm: this.inicioF,
    seleccionForm: this.seleccionF,
  });

  constructor(
    private toastr: ToastrService,
    public rest: EmpleadoService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  RegistrarConfiguracion(form) {
    console.log('select', this.automaticoF, this.manualF)
    this.rest.ObtenerCodigo().subscribe(datos => {
      if (this.automaticoF === true) {
        this.ActualizarAutomatico(form);
      }
      else {
        this.ActualizarManual();
      }
    }, error => {
      if (this.automaticoF === true) {
        this.CrearAutomatico(form);
      }
      else {
        this.CrearManual();
      }
    });
  }

  CrearAutomatico(form) {
    let dataCodigo = {
      id: 1,
      valor: form.inicioForm,
      automatico: this.automaticoF,
      manual: this.manualF
    }
    if (form.inicioForm != '') {
      this.rest.CrearCodigo(dataCodigo).subscribe(datos => {
        this.toastr.success('Configuración Registrada');
        this.router.navigate(['/empleado/']);
      })
      this.Limpiar();
    }
    else {
      this.toastr.info('Por favor ingresar un valor para generación de código')
    }
  }

  CrearManual() {
    let dataCodigo = {
      id: 1,
      valor: null,
      automatico: this.automaticoF,
      manual: this.manualF
    }
    this.rest.CrearCodigo(dataCodigo).subscribe(datos => {
      this.toastr.success('Configuración Registrada');
      this.router.navigate(['/empleado/']);
    })
    this.Limpiar();
  }

  ActualizarAutomatico(form) {
    let dataCodigo = {
      id: 1,
      valor: form.inicioForm,
      automatico: this.automaticoF,
      manual: this.manualF
    }
    if (form.inicioForm != '') {
      this.rest.ObtenerCodigoMAX().subscribe(datosE => {
        if (parseInt(datosE[0].codigo) < parseInt(form.inicioForm)) {
          this.rest.ActualizarCodigoTotal(dataCodigo).subscribe(datos => {
            this.toastr.success('Configuración Registrada');
            this.router.navigate(['/empleado/']);
          })
          this.Limpiar();
        }
        else {
          this.toastr.info('Para el buen funcionamiento del sistema ingrese un nuevo valor y recuerde que ' +
            'este debe ser diferente a los valores anteriormente registrados.');
        }
      })
    }
    else {
      this.toastr.info('Por favor ingresar un valor para generación de código');
    }
  }

  ActualizarManual() {
    let dataCodigo = {
      id: 1,
      valor: null,
      automatico: this.automaticoF,
      manual: this.manualF
    }
    this.rest.ActualizarCodigoTotal(dataCodigo).subscribe(datos => {
      this.toastr.success('Configuración Registrada');
      this.router.navigate(['/empleado/']);
    })
    this.Limpiar();
  }

  VerCampo() {
    this.estilo = { 'visibility': 'visible' }; this.HabilitarDescrip = false;
    this.configuracionForm.patchValue({
      inicioForm: '',
    })
    this.automaticoF = true;
    this.manualF = false;
  }

  QuitarCampo() {
    this.estilo = { 'visibility': 'hidden' }; this.HabilitarDescrip = true;
    this.configuracionForm.patchValue({
      inicioForm: ''
    })
    this.automaticoF = false;
    this.manualF = true;
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

  Limpiar() {
    this.configuracionForm.reset();
    this.QuitarCampo();
  }

}
