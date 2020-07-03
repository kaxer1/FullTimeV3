import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AutorizacionService } from "src/app/servicios/autorizacion/autorizacion.service";
import { ToastrService } from 'ngx-toastr';

interface Estado {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-editar-estado-autorizaccion',
  templateUrl: './editar-estado-autorizaccion.component.html',
  styleUrls: ['./editar-estado-autorizaccion.component.css']
})
export class EditarEstadoAutorizaccionComponent implements OnInit {

  estados: Estado[] = [
    { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'Pre-autorizado' },
    { id: 3, nombre: 'Autorizado' },
    { id: 4, nombre: 'Negado' },
  ];

  estado = new FormControl('', Validators.required);

  public estadoAutorizacionesForm = new FormGroup({
    estadoF: this.estado
  });

  constructor(
    private restA: AutorizacionService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditarEstadoAutorizaccionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.estadoAutorizacionesForm.patchValue({
      estadoF: this.data.auto.estado
    });
  }

  ActualizarEstadoAutorizacion(form) {
    let newAutorizaciones = {
      estado: form.estadoF,
      id_vacaciones: this.data.auto.id_documento, 
      id_departamento: this.data.auto.id_departamento
    }

    this.restA.PutEstadoAutoPermiso(this.data.auto.id, newAutorizaciones).subscribe(res => {
      console.log(res);
      this.toastr.success('Operación exitosa', 'Estado Actualizado');
      this.dialogRef.close();
    })
  }

}
