import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';

@Component({
  selector: 'app-confirmar-desactivados',
  templateUrl: './confirmar-desactivados.component.html',
  styleUrls: ['./confirmar-desactivados.component.css']
})
export class ConfirmarDesactivadosComponent implements OnInit {

  ids: any = [];
  contenidoHabilitar: boolean = false;
  contenidoDeshabilitar: boolean = false;

  constructor(
    private toastr: ToastrService,
    private restE: EmpleadoService,
    public dialogRef: MatDialogRef<ConfirmarDesactivadosComponent>,
    @Inject(MAT_DIALOG_DATA) public Empleados: any,
  ) { }

  ngOnInit(): void {
    console.log(this.Empleados);
    this.ids = this.Empleados.lista.map(obj => {
      return obj.id
    });
    this.Opcion();
  }

  Opcion(){
    if (this.Empleados.opcion === 1) {
      this.contenidoDeshabilitar = true;
      console.log('DESACTIVAR EMPLEADO');
    } else if (this.Empleados.opcion === 2) {
      this.contenidoHabilitar = true;
      console.log('REACTIVAR EMPLEADO');
    }
  }

  ConfirmarListaEmpleados(){
    if (this.Empleados.opcion === 1) {
      console.log('DESACTIVAR EMPLEADO');
      this.restE.DesactivarVariosUsuarios(this.ids).subscribe(res => {
        console.log(res);
        this.toastr.success(res.message)
      });
      this.dialogRef.close(true);
    } else if (this.Empleados.opcion === 2) {
      console.log('REACTIVAR EMPLEADO');
      this.restE.ActivarVariosUsuarios(this.ids).subscribe(res => {
        console.log(res);
        this.toastr.success(res.message)
      });
      this.dialogRef.close(true);
    }
  }
}
