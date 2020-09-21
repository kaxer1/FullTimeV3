import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service'

@Component({
  selector: 'app-configurar-codigo',
  templateUrl: './configurar-codigo.component.html',
  styleUrls: ['./configurar-codigo.component.css']
})
export class ConfigurarCodigoComponent implements OnInit {

  inicioF = new FormControl('');
  seleccionF = new FormControl('');

  selec1 = false;
  HabilitarDescrip: boolean = true;
  estilo: any;

  datosCodigo: any = [];

  public configuracionForm = new FormGroup({
    inicioForm: this.inicioF,
    seleccionForm: this.seleccionF
  });

  constructor(
    private toastr: ToastrService,
    public rest: EmpleadoService,
  ) { }

  ngOnInit(): void {
    this.rest.ObtenerCodigo().subscribe(datos => {
      this.toastr.info('La configuración de código ya fue realizada.');
      this.Limpiar();
    }, error => { });
  }

  RegistrarConfiguracion(form) {
    this.rest.ObtenerCodigo().subscribe(datos => {
      this.toastr.info('La configuración de código ya fue realizada.');
      this.Limpiar();
    }, error => {
      let dataCodigo = {
        id: 1,
        valor: form.inicioForm,
      }
      if (form.inicioForm != '') {
        this.rest.CrearCodigo(dataCodigo).subscribe(datos => {
          this.toastr.success('Configuración Registrada')
        })
        this.Limpiar();
      }
      else {
        this.toastr.info('Por favor ingresar un valor para generación de código')
      }
    });
  }

  VerCampo() {
    this.estilo = { 'visibility': 'visible' }; this.HabilitarDescrip = false;
    this.configuracionForm.patchValue({
      inicioForm: '',
    })

  }

  QuitarCampo() {
    this.estilo = { 'visibility': 'hidden' }; this.HabilitarDescrip = true;
    this.configuracionForm.patchValue({
      inicioForm: ''
    })
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
