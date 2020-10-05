import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';

interface Orden {
  valor: number
}

interface Estado {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-plan-hora-extra-autoriza',
  templateUrl: './plan-hora-extra-autoriza.component.html',
  styleUrls: ['./plan-hora-extra-autoriza.component.css']
})
export class PlanHoraExtraAutorizaComponent implements OnInit {

  idDocumento = new FormControl('', Validators.required);
  TipoDocumento = new FormControl('');
  orden = new FormControl('', Validators.required);
  estado = new FormControl('', Validators.required);
  idDepartamento = new FormControl('', Validators.required);

  public nuevaAutorizacionesForm = new FormGroup({
    idDocumentoF: this.idDocumento,
    ordenF: this.orden,
    estadoF: this.estado,
    idDepartamentoF: this.idDepartamento
  });

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
    public restDepartamento: DepartamentosService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<PlanHoraExtraAutorizaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log('datos, planificacion', this.data);
    this.obtenerDepartamento();
  }

  insertarAutorizacion(form) {
    let newAutorizaciones = {
      orden: form.ordenF,
      estado: form.estadoF,
      id_departamento: form.idDepartamentoF,
      id_permiso: null,
      id_vacacion: null,
      id_hora_extra: null,
      id_plan_hora_extra: this.data.datosHora.id_plan_extra,
      id_documento: form.idDocumentoF
    }
    console.log(newAutorizaciones);

    if (this.data.carga === 'individual') {
      this.restAutorizaciones.postAutorizacionesRest(newAutorizaciones).subscribe(res => {
        this.toastr.success('Operación Exitosa', 'Autorizacion guardada'),
          this.limpiarCampos();
        this.dialogRef.close();
      }, error => {
        console.log(error);
      })
    }
    else {
      this.data.datosHora.map(obj => {
        // console.log('i', i, ' ', this.data.datosHora.length - 1, this.data.datosHora.length);
        newAutorizaciones.id_plan_hora_extra = obj.id_plan_extra;
        //console.log('ejecuta 1', i);
        this.restDepartamento.ConsultarDepartamentoPorContrato(obj.id_empl_contrato).subscribe(res => {
          this.departamentos = res;
          //console.log('ejecuta 2', i);
          newAutorizaciones.id_departamento = this.departamentos[0].id_departamento;
          this.restAutorizaciones.postAutorizacionesRest(newAutorizaciones).subscribe(res => {
            this.toastr.success('Operación Exitosa', 'Autorizacion guardada');
            console.log(obj.id, this.departamentos[0].id_departamento, obj.id_usua_solicita, form.estadoF)
            //this.EditarEstadoHoraExtra(obj.id, this.departamentos[0].id_departamento, obj.id_usua_solicita, form.estadoF)
          }, error => { })
        })
      })

      this.limpiarCampos();
      this.dialogRef.close();
    }
  }

  obtenerDepartamento() {
    this.restDepartamento.ConsultarDepartamentoPorContrato(this.data.datosHora.id_empl_contrato).subscribe(res => {
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

}
