import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-metodos',
  templateUrl: './metodos.component.html',
  styleUrls: ['./metodos.component.css']
})


export class MetodosComponent implements OnInit {

  constructor(
    public dialogo: MatDialogRef<MetodosComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string) { }

  cerrarDialogo(): void {
    this.dialogo.close(false);
  }
  confirmado(): void {
    this.dialogo.close(true);
  }


  ngOnInit(): void {
    window.onload = function Ejemplo2() {
      setTimeout(this.funcionProgramada(), this.hora());
    }
  }

  hora() {
    var horaActual = new Date();
    var horaProgramada = new Date();
    horaProgramada.setHours(20);
    horaProgramada.setMinutes(51);
    horaProgramada.setSeconds(0);
    return horaProgramada.getTime() - horaActual.getTime();

  }

  funcionProgramada() {
    alert('Este es un ejemplo');
    console.log("probando programacion")
  }



}
