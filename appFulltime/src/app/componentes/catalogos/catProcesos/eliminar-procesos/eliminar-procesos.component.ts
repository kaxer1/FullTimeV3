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
      // this.nombres.forEach(obj => {
      //   if (obj.message = "Registro eliminado") {
      //     this.toastr.error("Operación Exitosa", "Registro eliminado");
      //     window.location.reload();
      //   }
      // });

      if (this.nombres.length > 0 ){
        this.toastr.error('presente en otros registros', 'Proceso padre no se puede eliminar')
      }
      this.dialogRef.close();
    });
  }
}
