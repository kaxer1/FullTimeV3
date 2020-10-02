import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { PedHoraExtraService } from 'src/app/servicios/horaExtra/ped-hora-extra.service';
import { PlanHoraExtraService } from 'src/app/servicios/planHoraExtra/plan-hora-extra.service';

@Component({
  selector: 'app-tiempo-autorizado',
  templateUrl: './tiempo-autorizado.component.html',
  styleUrls: ['./tiempo-autorizado.component.css']
})
export class TiempoAutorizadoComponent implements OnInit {

  Observacion: boolean = true;
  Horas: boolean = false;

  timer = new FormControl('', Validators.required);
  mensaje = new FormControl('', Validators.required);

  public TiempoHoraExtraForm = new FormGroup({
    timerForm: this.timer,
  });

  public MensajeForm = new FormGroup({
    mensajeF: this.mensaje
  });

  constructor(
    private restPH: PedHoraExtraService,
    private restPlanH: PlanHoraExtraService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<TiempoAutorizadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  GuardarTiempoAutorizado(form) {
    if (this.data.pagina === 'plan_hora_extra') {
      let h = {
        hora: form.timerForm + ':00'
      }
      this.restPlanH.AutorizarTiempoHoraExtra(this.data.horas_calculadas.id, h).subscribe(res => {
        console.log(res);
        this.toastr.success(res.message);
        this.dialogRef.close(true)
      })
    }
    else {
      console.log(form.timerForm + ':00');
      let h = {
        hora: form.timerForm + ':00'
      }
      this.restPH.AutorizarTiempoHoraExtra(this.data.id_hora, h).subscribe(res => {
        console.log(res);
        this.toastr.success(res.message);
        this.dialogRef.close(true)
      })
    }

  }

  TiempoAceptado() {
    if (this.data.pagina === 'plan_hora_extra') {
      console.log(this.data);
      let h = {
        hora: this.data.horas_calculadas.hora
      }
      this.restPlanH.AutorizarTiempoHoraExtra(this.data.horas_calculadas.id, h).subscribe(res => {
        console.log(res);
        this.toastr.success(res.message);
        this.dialogRef.close(true)
      })
    }
    else {
      let h = {
        hora: this.data.hora
      }
      this.restPH.AutorizarTiempoHoraExtra(this.data.id_hora, h).subscribe(res => {
        console.log(res);
        this.toastr.success(res.message);
        this.dialogRef.close(true)
      })
    }
  }

  IngresarSoloNumeros(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números')
      return false;
    }
  }

  LimpiarCampoHoras() {
    this.TiempoHoraExtraForm.patchValue({ timerForm: '' })
  }

  MostrarObservacion() {
    this.Observacion = false;
    this.Horas = true;
  }

  MostrarHoras() {
    this.Observacion = true;
    this.Horas = false;
  }

  EnviarMensaje(form){
    
  }
}
