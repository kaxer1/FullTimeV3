// IMPORTAR LIBRERIAS
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

// IMPORTAR SERVICIOS
import { VacunacionService } from 'src/app/servicios/empleado/empleadoVacunas/vacunacion.service';

@Component({
  selector: 'app-tipo-vacuna',
  templateUrl: './tipo-vacuna.component.html',
  styleUrls: ['./tipo-vacuna.component.css']
})

export class TipoVacunaComponent implements OnInit {

  constructor(
    public ventana: MatDialogRef<TipoVacunaComponent>, // VARIABLE DE MANEJO DE VENTANAS
    public restVacuna: VacunacionService, // VARIABLE DE CONSULTA DE DATOS DE VACUNAS
    public toastr: ToastrService, // VARIABLE PARA MANEJO DE NOTIFICACIONES,
  ) { }

  ngOnInit(): void {
  }

  // VALIDACIONES DE CAMPOS DE FORMULARIO
  nombreF = new FormControl('', Validators.required);

  // FORMULARIO DENTRO DE UN GRUPO
  public vacunaForm = new FormGroup({
    nombreForm: this.nombreF,
  });

  GuardarTipoVacuna(form) {
    let tipoVacunas = {
      nombre: form.nombreForm,
    }
    this.restVacuna.CrearTipoVacuna(tipoVacunas).subscribe(response => {
      if (response.message === 'error') {
        this.toastr.error('El nombre ingresado ya se encuentra registrado.', '', {
          timeOut: 2000,
        })
      }
      else {
        this.toastr.success('Registro guardado correctamente.', '', {
          timeOut: 2000,
        });
        this.ventana.close();
      }
    }, error => { });
  }

  CerrarVentana() {
    this.ventana.close();
  }

}
