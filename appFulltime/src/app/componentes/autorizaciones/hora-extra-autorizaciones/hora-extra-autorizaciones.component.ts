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
  selector: 'app-hora-extra-autorizaciones',
  templateUrl: './hora-extra-autorizaciones.component.html',
  styleUrls: ['./hora-extra-autorizaciones.component.css']
})
export class HoraExtraAutorizacionesComponent implements OnInit {

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
    public dialogRef: MatDialogRef<HoraExtraAutorizacionesComponent>,
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
      id_permiso: null,
      id_vacacion: null,
      id_hora_extra: this.data.id,
      id_documento: form.idDocumentoF
    }
    console.log(newAutorizaciones);
    this.restAutorizaciones.postAutorizacionesRest(newAutorizaciones).subscribe(res => {
      this.toastr.success('Operación Exitosa', 'Autorizacion guardada'),
        this.limpiarCampos();
        this.dialogRef.close();
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

}