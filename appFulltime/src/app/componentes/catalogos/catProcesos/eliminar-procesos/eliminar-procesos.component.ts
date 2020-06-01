import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProcesoService } from 'src/app/servicios/catalogos/catProcesos/proceso.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eliminar-procesos',
  templateUrl: './eliminar-procesos.component.html',
  styleUrls: ['./eliminar-procesos.component.css']
})
export class EliminarProcesosComponent implements OnInit {

  constructor(
    private rest: ProcesoService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EliminarProcesosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  nombres: any = [];
  eliminarRegistro() {
    this.nombres = [];
    this.rest.deleteProcesoRest(this.data.id).subscribe(res => {
      console.log(res);
      this.nombres = res;
      this.toastr.error('Registro eliminado');
      this.dialogRef.close();
      window.location.reload();
    });
  }
}
