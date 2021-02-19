import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { TipoComidasService } from 'src/app/servicios/catalogos/catTipoComidas/tipo-comidas.service';
import { PlanComidasService } from 'src/app/servicios/planComidas/plan-comidas.service';

@Component({
  selector: 'app-tipo-comidas',
  templateUrl: './tipo-comidas.component.html',
  styleUrls: ['./tipo-comidas.component.css'],
})

export class TipoComidasComponent implements OnInit {

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.required, Validators.minLength(4)]);
  tipoF = new FormControl('');
  servicioF = new FormControl('', [Validators.minLength(3)]);

  // Asignación de validaciones a inputs del formulario
  public TipoComidaForm = new FormGroup({
    nombreForm: this.nombreF,
    servicioForm: this.servicioF,
    tipoForm: this.tipoF,
  });

  constructor(
    private rest: TipoComidasService,
    public restPlan: PlanComidasService,
    private toastr: ToastrService,
    private router: Router,
    public dialogRef: MatDialogRef<TipoComidasComponent>,
  ) { }

  ngOnInit(): void {
    this.ObtenerServicios();
    this.servicios[this.servicios.length] = { nombre: "OTRO" };
  }

  GuardarDatos(datos: any) {
    this.rest.CrearNuevoTipoComida(datos).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Menú registrado', {
        timeOut: 6000,
      })
      this.rest.ObtenerUltimoId().subscribe(ultimo => {
        this.CerrarVentanaRegistroTipoComidas();
        this.router.navigate(['/verMenu/', ultimo[0].max]);
      });
    }, error => {
      this.toastr.error('Operación Fallida', 'Menú no registrado', {
        timeOut: 6000,
      })
    });
  }

  InsertarTipoComida(form) {
    let datosTipoComida = {
      nombre: form.nombreForm,
      tipo_comida: form.tipoForm
    };
    if (form.tipoForm === undefined) {
      this.RegistrarServicio(form, datosTipoComida);
    }
    else {
      this.GuardarDatos(datosTipoComida);
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
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6 || keynum == 46) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números', {
        timeOut: 6000,
      })
      return false;
    }
  }

  ObtenerMensajeErrorNombreRequerido() {
    if (this.nombreF.hasError('required')) {
      return 'Campo obligatorio';
    }
  }

  LimpiarCampos() {
    this.TipoComidaForm.reset();
  }

  CerrarVentanaRegistroTipoComidas() {
    this.LimpiarCampos();
    this.dialogRef.close();
  }

  estilo: any;
  habilitarServicio: boolean = false;
  IngresarServicio(form) {
    if (form.tipoForm === undefined) {
      this.TipoComidaForm.patchValue({
        servicioForm: '',
      });
      this.estilo = { 'visibility': 'visible' }; this.habilitarServicio = true;
      this.toastr.info('Ingresar nombre del nuevo tipo de servicio.', 'Etiqueta Ingresar Servicio activa', {
        timeOut: 6000,
      })
      this.habilitarSeleccion = false;
    }
  }

  habilitarSeleccion: boolean = true;
  VerTiposServicios() {
    this.TipoComidaForm.patchValue({
      servicioForm: '',
    });
    this.estilo = { 'visibility': 'hidden' }; this.habilitarServicio = false;
    this.habilitarSeleccion = true;
  }

  servicios: any = [];
  ObtenerServicios() {
    this.servicios = [];
    this.restPlan.ObtenerTipoComidas().subscribe(datos => {
      this.servicios = datos;
      this.servicios[this.servicios.length] = { nombre: "OTRO" };
    })
  }

  RegistrarServicio(form, datos: any) {
    if (form.servicioForm != '') {
      let tipo_servicio = {
        nombre: form.servicioForm
      }
      this.restPlan.CrearTipoComidas(tipo_servicio).subscribe(res => {
        // Buscar id de último tipo de servicio ingresado
        this.restPlan.ObtenerUltimoTipoComidas().subscribe(data => {
          datos.tipo_comida = data[0].max;
          this.GuardarDatos(datos);
        });
      });
    }
    else {
      this.toastr.info('Ingresar el tipo de servicio', 'Verificar datos', {
        timeOut: 6000,
      });
    }
  }

}
