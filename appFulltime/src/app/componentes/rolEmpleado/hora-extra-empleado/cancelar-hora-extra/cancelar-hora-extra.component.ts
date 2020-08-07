import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';

@Component({
  selector: 'app-cancelar-hora-extra',
  templateUrl: './cancelar-hora-extra.component.html',
  styleUrls: ['./cancelar-hora-extra.component.css']
})
export class CancelarHoraExtraComponent implements OnInit {

  constructor(
    private restHE: PedHoraExtraService,
    public dialogRef: MatDialogRef<CancelarHoraExtraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  aceptarAdvertencia() {
    this.restHE.EliminarHoraExtra(this.data).subscribe(res => {
      console.log(res);
      this.dialogRef.close(true);
    });
  }
}
