import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';
import { NotiAutorizacionesService } from 'src/app/servicios/catalogos/catNotiAutorizaciones/noti-autorizaciones.service';
import { NotificacionesService } from 'src/app/servicios/catalogos/catNotificaciones/notificaciones.service';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EmplCargosService } from 'src/app/servicios/empleado/empleadoCargo/empl-cargos.service';

interface Orden {
  valor: number
}

interface Estado {
  id: number,
  nombre: string
}

interface Documento {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-autorizaciones',
  templateUrl: './autorizaciones.component.html',
  styleUrls: ['./autorizaciones.component.css']
})
export class AutorizacionesComponent implements OnInit {

  // idDocumento = new FormControl('', Validators.required);
  orden = new FormControl('', Validators.required);
  estado = new FormControl('', Validators.required);
  idDepartamento = new FormControl('', Validators.required);

  public nuevaAutorizacionesForm = new FormGroup({
    // idDocumentoF: this.idDocumento,
    ordenF: this.orden,
    estadoF: this.estado,
    idDepartamentoF: this.idDepartamento
  });

  notificacion: any = [];
  notiAutrizaciones: any = [];
  departamentos: any = [];

  ordenes: Orden[] = [
    { valor: 1 },
    { valor: 2 },
    { valor: 3 },
    { valor: 4 },
    { valor: 5 }
  ];

  estados: Estado[] = [
    { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'Pre-autorizado' },
    { id: 3, nombre: 'Autorizado' },
    { id: 4, nombre: 'Negado' },
  ];

  constructor(
    public restAutorizaciones: AutorizacionService,
    // public restNotiAutorizaciones: NotiAutorizacionesService,
    // public restNotificaciones: NotificacionesService,
    public restDepartamento: DepartamentosService,
    public restCargo: EmplCargosService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AutorizacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.obtenerDepartamento();
  }

  insertarAutorizacion(form) {
    let newAutorizaciones = {
      orden: form.ordenF,
      estado: form.estadoF,
      id_departamento: form.idDepartamentoF,
      id_permiso: this.data.id,
      id_vacacion: null,
      id_hora_extra: null,
      id_documento: localStorage.getItem('empleado') + '_' + form.estadoF + ',',
      id_plan_hora_extra: null,
      // id_documento: form.idDocumentoF
    }
    console.log(newAutorizaciones);
    this.restAutorizaciones.postAutorizacionesRest(newAutorizaciones).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Autorizacion guardada'),
        this.limpiarCampos();
      this.dialogRef.close();
      window.location.reload();
    }, error => {
      console.log(error);
    })
  }

  obtenerDepartamento() {
    this.restDepartamento.ConsultarDepartamentoPorContrato(this.data.id_contrato).subscribe(res => {
      console.log(res);
      this.departamentos = res;
      this.nuevaAutorizacionesForm.patchValue({
        ordenF: 1,
        estadoF: 1,
        idDepartamentoF: this.departamentos[0].id_departamento
      })
    })
  }

  limpiarCampos() {
    this.nuevaAutorizacionesForm.reset();
  }

  CerrarVentanaRegistroNoti() {
    this.limpiarCampos();
    this.dialogRef.close();
  }

}
