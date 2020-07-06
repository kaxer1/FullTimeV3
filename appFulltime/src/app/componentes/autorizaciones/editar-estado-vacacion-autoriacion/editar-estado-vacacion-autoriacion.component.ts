import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AutorizacionService } from 'src/app/servicios/autorizacion/autorizacion.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Estado {
  id: number,
  nombre: string
}

@Component({
  selector: 'app-editar-estado-vacacion-autoriacion',
  templateUrl: './editar-estado-vacacion-autoriacion.component.html',
  styleUrls: ['./editar-estado-vacacion-autoriacion.component.css']
})
export class EditarEstadoVacacionAutoriacionComponent implements OnInit {

  estados: Estado[] = [
    { id: 1, nombre: 'Pendiente'},
    { id: 2, nombre: 'Pre-autorizado'},
    { id: 3, nombre: 'Autorizado'},
    { id: 4, nombre: 'Negado'},
  ];
  
  estado = new FormControl('', Validators.required);

  public estadoAutorizacionesForm = new FormGroup({
    estadoF: this.estado
  });

  constructor(
    private restA: AutorizacionService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditarEstadoVacacionAutoriacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.estadoAutorizacionesForm.patchValue({
      estadoF: this.data.estado
    });
  }

  ActualizarEstadoAutorizacion(form){
    let newAutorizaciones = {
      estado: form.estadoF,
      id_vacaciones: this.data.id_documento, 
      id_departamento: this.data.id_departamento
    }

    this.restA.PutEstadoAutoVacacion(this.data.id, newAutorizaciones).subscribe(res => {
      console.log(res);
      this.toastr.success('Operación exitosa','Estado Actualizado');
      // this.dialogRef.close();
      // window.location.reload();
    })
  }
}
