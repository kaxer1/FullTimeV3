import { Component, OnInit, Inject } from '@angular/core';
import { NotiAutorizacionesService } from 'src/app/servicios/catalogos/catNotiAutorizaciones/noti-autorizaciones.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-listar-noti-autorizaciones',
  templateUrl: './listar-noti-autorizaciones.component.html',
  styleUrls: ['./listar-noti-autorizaciones.component.css']
})
export class ListarNotiAutorizacionesComponent implements OnInit {

  constructor(
    private restN: NotiAutorizacionesService,
    public dialogRef: MatDialogRef<ListarNotiAutorizacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.restN.getNotiAutoriRest().subscribe(res => {
      console.log(res);
    })
  }

}
