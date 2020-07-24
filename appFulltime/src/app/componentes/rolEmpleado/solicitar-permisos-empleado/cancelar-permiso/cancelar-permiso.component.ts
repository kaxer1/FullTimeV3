import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PermisosService } from 'src/app/servicios/permisos/permisos.service';

@Component({
  selector: 'app-cancelar-permiso',
  templateUrl: './cancelar-permiso.component.html',
  styleUrls: ['./cancelar-permiso.component.css']
})
export class CancelarPermisoComponent implements OnInit {

  constructor(
    private restP: PermisosService,
    public dialogRef: MatDialogRef<CancelarPermisoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  aceptarAdvertencia() {
    console.log("precionaste aqui!");
    this.restP.EliminarPermiso(this.data.id, this.data.documento).subscribe(res => {
      console.log(res);
      this.dialogRef.close();
    });
  }

}
