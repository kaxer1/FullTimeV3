import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { EnroladosRelojesService } from 'src/app/servicios/enroladosRelojes/enrolados-relojes.service';
import { RelojesService } from 'src/app/servicios/catalogos/catRelojes/relojes.service';

@Component({
  selector: 'app-enrolado-reloj',
  templateUrl: './enrolado-reloj.component.html',
  styleUrls: ['./enrolado-reloj.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EnroladoRelojComponent implements OnInit {

  dispositivos: any = [];
  enroladoReloj: any = [];
  seleccionarDispositivo;
  actualizarPagina: boolean = false;

  // Control de los campos del formulario
  dispositivoF = new FormControl('', [Validators.required]);

  // Asignar los campos en un formulario en grupo
  public asignarRelojForm = new FormGroup({
    dispositivoForm: this.dispositivoF,
  });

  constructor(
    private rest: EnroladosRelojesService,
    private restR: RelojesService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EnroladoRelojComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.ObtenerDispositios();
  }

  LimpiarCampos() {
    this.asignarRelojForm.reset();
    this.ObtenerDispositios();
  }

  CerrarVentanaAsignarReloj() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

  ObtenerDispositios() {
    this.dispositivos = [];
    this.restR.ConsultarRelojes().subscribe(datos => {
      this.dispositivos = datos;
      this.dispositivos[this.dispositivos.length] = { nombre: "Seleccionar" };
      this.seleccionarDispositivo = this.dispositivos[this.dispositivos.length - 1].nombre;
    })
  }

  InsertarEnroladoReloj(form, id) {
    var idEnrolado = this.data.datosEnrolado.id;
    var nombreReloj = form.dispositivoForm;
    var buscarReloj = {
      id_reloj: nombreReloj,
      id_enrolado: idEnrolado
    }
    this.enroladoReloj = [];
    this.rest.BuscarIdReloj(buscarReloj).subscribe(datos => {
      this.enroladoReloj = datos;
      this.toastr.info('Se le recuerda que el empleado enrolado ya esta agregado a este dispositivo')
      this.LimpiarCampos();
    }, error => {
      this.rest.CrearEnroladoReloj(buscarReloj).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Empleado enrolado agregado al dispositivo');
        this.actualizarPagina = this.data.actualizar;
        if (this.actualizarPagina === true) {
          this.LimpiarCampos();
        }
        else {
          this.dialogRef.close();
          // this.router.navigate(['/verFeriados/', id]);
        }
      }, error => {
        this.toastr.error('Operación Fallida', 'Empleado enrolado no fue agregado al dispositivo')
      });
    });
  }

}
