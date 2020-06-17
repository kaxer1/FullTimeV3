import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';

interface Estados {
  valor: string;
  nombre: string
}

@Component({
  selector: 'app-editar-empleado-permiso',
  templateUrl: './editar-empleado-permiso.component.html',
  styleUrls: ['./editar-empleado-permiso.component.css']
})
export class EditarEmpleadoPermisoComponent implements OnInit {

  estadoF = new FormControl('');

  public PermisoForm = new FormGroup({
    estadoForm: this.estadoF
  });

  estados: Estados[] = [
    { valor: 'Pendiente', nombre: 'Pendiente' },
    { valor: 'Rechazado', nombre: 'Rechazado' },
    { valor: 'Aceptado', nombre: 'Aceptado' },
    { valor: 'Eliminado', nombre: 'Eliminado' }
  ];

  constructor(
    private restP: PermisosService,
    public dialogRef: MatDialogRef<EditarEmpleadoPermisoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.PermisoForm.patchValue({
      estadoForm: this.data.estado
    })
  }

  EditarEstadoPermiso(form){
    console.log(form)
    let datosPermiso = {
      estado: form.estadoForm
    }

    this.restP.ActualizarEstado(this.data.id, datosPermiso).subscribe(res => {
      console.log(res);
      this.dialogRef.close();
      window.location.reload();
    })
  }

  CerrarVentanaPermiso() {
    this.dialogRef.close();
  }
}
