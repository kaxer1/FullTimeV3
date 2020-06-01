import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NivelTitulosService } from 'src/app/servicios/nivelTitulos/nivel-titulos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eliminar-nivel-titulos',
  templateUrl: './eliminar-nivel-titulos.component.html',
  styleUrls: ['./eliminar-nivel-titulos.component.css']
})
export class EliminarNivelTitulosComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private restNivelTitulos: NivelTitulosService,
    public dialogRef: MatDialogRef<EliminarNivelTitulosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void { }

  eliminarRegistro() {
    this.restNivelTitulos.deleteNivelTituloRest(this.data.id).subscribe(res => {
      this.toastr.error("Registro eliminado");
      this.dialogRef.close();
      window.location.reload();
    });
  }

}
