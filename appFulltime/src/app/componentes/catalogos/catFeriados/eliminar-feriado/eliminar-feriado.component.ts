import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FeriadosService } from "src/app/servicios/catalogos/catFeriados/feriados.service";

@Component({
  selector: 'app-eliminar-feriado',
  templateUrl: './eliminar-feriado.component.html',
  styleUrls: ['./eliminar-feriado.component.css']
})
export class EliminarFeriadoComponent implements OnInit {

  constructor(
    private restF: FeriadosService,
    public dialogRef: MatDialogRef<EliminarFeriadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {}

  eliminar() {
    this.restF.EliminarFeriado(this.data.id).subscribe(res => {
      console.log(res);
      this.dialogRef.close();
    });
  }

}
