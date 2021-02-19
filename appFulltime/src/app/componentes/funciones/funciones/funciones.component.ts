import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service'
import { Router } from '@angular/router';
import { FuncionesService } from 'src/app/servicios/funciones/funciones.service';

@Component({
  selector: 'app-funciones',
  templateUrl: './funciones.component.html',
  styleUrls: ['./funciones.component.css']
})

export class FuncionesComponent implements OnInit {

  seleccionF = new FormControl('');

  // Registrar
  hora_extraF = false;
  accion_personalF = false;
  alimentacionF = false;
  permisosF = false;

  // Actualizar
  hora_extra_1F = false;
  accion_personal_1F = false;
  alimentacion_1F = false;
  permisos_1F = false;

  HabilitarRegistro: boolean = true;
  HabilitarActualizacion: boolean = true;

  public configuracionForm = new FormGroup({
    seleccionForm: this.seleccionF,
  });

  constructor(
    private toastr: ToastrService,
    public restF: FuncionesService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.VerificarRegistro();
  }

  VerificarRegistro() {
    this.restF.ListarFunciones().subscribe(datos => {
      this.HabilitarRegistro = false;
      this.HabilitarActualizacion = true;
      if (datos[0].hora_extra === true) {
        this.hora_extra_1F = true;
      }
      if (datos[0].accion_personal === true) {
        this.accion_personal_1F = true;
      }
      if (datos[0].alimentacion === true) {
        this.alimentacion_1F = true;
      }
      if (datos[0].permisos === true) {
        this.permisos_1F = true;
      }
    }, error => {
      this.HabilitarRegistro = true;
      this.HabilitarActualizacion = false;
    })
  }


  RegistrarFunciones() {
    let dataCodigo = {
      id: 1,
      hora_extra: this.hora_extraF,
      accion_personal: this.accion_personalF,
      alimentacion: this.alimentacionF,
      permisos: this.permisosF
    }
    this.restF.CrearFunciones(dataCodigo).subscribe(datos => {
      this.toastr.success('Configuración Registrada', '', {
        timeOut: 6000,
      });
      window.location.reload();
      this.router.navigate(['/home/']);
      window.location.reload();
    })
  }

  ActualizarFunciones() {
    let dataCodigo = {
      hora_extra: this.hora_extra_1F,
      accion_personal: this.accion_personal_1F,
      alimentacion: this.alimentacion_1F,
      permisos: this.permisos_1F
    }
    this.restF.EditarFunciones(1, dataCodigo).subscribe(datos => {
      this.toastr.success('Configuración Registrada', '', {
        timeOut: 6000,
      });
      this.router.navigate(['/home/']);
      window.location.reload();
    })
  }

}
