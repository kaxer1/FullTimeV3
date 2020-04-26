import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { EnroladoService } from 'src/app/servicios/catalogos/catEnrolados/enrolado.service';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';

@Component({
  selector: 'app-registro-enrolados',
  templateUrl: './registro-enrolados.component.html',
  styleUrls: ['./registro-enrolados.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class RegistroEnroladosComponent implements OnInit {

  id_usuario = new FormControl('', Validators.required);
  nombre = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z0-9]*')]);
  contrasenia = new FormControl('', Validators.maxLength(10));
  finger = new FormControl('', Validators.pattern('[0-9]*'));
  activo = new FormControl('', Validators.required);
  data_finger = new FormControl('', Validators.pattern('[a-zA-z 1-9]*'));

  usuarios: any = [];
  idUltimoEnrolado: any = [];

  hide = true;
  public idUsuario: number;

  // asignar los campos en un formulario en grupo
  public nuevoEnroladoForm = new FormGroup({
    enroladoId_UsuarioForm: this.id_usuario,
    enroladoNombreForm: this.nombre,
    enroladoContraseniaForm: this.contrasenia,
    enroladoActivoForm: this.activo,
    enroladoFingerForm: this.finger,
    enroladoData_FingerForm: this.data_finger
  });

  constructor(
    private rest: EnroladoService,
    private toastr: ToastrService,
    private restUsuario: UsuarioService,
    private router: Router,
    public dialogRef: MatDialogRef<RegistroEnroladosComponent>,

  ) { }

  ngOnInit(): void {
    this.getUsuarios();
  }

  insertarEnrolado(form) {
    this.restUsuario.getIdByUsuarioRest(form.enroladoId_UsuarioForm).subscribe(response => {
      this.idUsuario = response[0].id;
      let dataEnrolado = {
        id_usuario: this.idUsuario,
        nombre: form.enroladoNombreForm,
        contrasenia: form.enroladoContraseniaForm,
        activo: form.enroladoActivoForm,
        finger: form.enroladoFingerForm,
        data_finger: form.enroladoData_FingerForm
      };
      this.rest.postEnroladosRest(dataEnrolado).subscribe(response => {
        this.toastr.success('Operacion Exitosa', 'Enrolado con éxito');
        this.rest.BuscarUltimoId().subscribe(response => {
          this.idUltimoEnrolado = response;
          console.log(this.idUltimoEnrolado);
          this.limpiarCampos();
          this.dialogRef.close();
          this.router.navigate(['/enroladoDispositivo/', this.idUltimoEnrolado[0].max]);
        }, error => { });

      }, error => {
        console.log(error);
      });

    }, error => {
      console.log(error);
    });
  }

  IngresarSoloLetras(e) {
    let key = e.keyCode || e.which;
    let tecla = String.fromCharCode(key).toString();
    //Se define todo el abecedario que se va a usar.
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    //Es la validación del KeyCodes, que teclas recibe el campo de texto.
    let especiales = [8, 37, 39, 46, 6, 13];
    let tecla_especial = false
    for (var i in especiales) {
      if (key == especiales[i]) {
        tecla_especial = true;
        break;
      }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras')
      return false;
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

  limpiarCampos() {
    this.nuevoEnroladoForm.reset();
  }

  cerrarVentanaRegistroEnrolado() {
    this.limpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

  obtenerMensajeErrorNombre() {
    if (this.nombre.hasError('required')) {
      return 'Debe ingresar algun nombre';
    }
    return this.nombre.hasError('pattern') ? 'No ingresar números' : '';
  }

  getIdUsuario(usuario: string) {
    this.restUsuario.getIdByUsuarioRest(usuario).subscribe(response => {
      this.idUsuario = response[0].id;
    }, error => {
      console.log(error);
    });
  }

  getUsuarios() {
    this.usuarios = [];
    this.restUsuario.getUsuariosRest().subscribe(data => {
      this.usuarios = data
    })
  }


}
