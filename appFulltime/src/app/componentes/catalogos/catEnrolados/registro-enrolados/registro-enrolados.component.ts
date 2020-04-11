import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { EnroladoService } from 'src/app/servicios/catalogos/catEnrolados/enrolado.service';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/servicios/usuarios/usuario.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-registro-enrolados',
  templateUrl: './registro-enrolados.component.html',
  styleUrls: ['./registro-enrolados.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegistroEnroladosComponent implements OnInit {

  id_usuario = new FormControl('', Validators.required);
  nombre = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z0-9]*')]);
  contrasenia = new FormControl('', Validators.maxLength(10));
  finger = new FormControl('', Validators.pattern('[0-9]*'));
  activo = new FormControl('', Validators.required);
  data_finger = new FormControl('', Validators.pattern('[a-zA-z 1-9]*'));

  usuarios: any = [];

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
    public dialogRef: MatDialogRef<RegistroEnroladosComponent>,

  ) { }

  ngOnInit(): void {
    this.getUsuarios();
  }

  insertarEnrolado(form) {

    this.restUsuario.getIdByUsuarioRest(form.enroladoId_UsuarioForm)
      .subscribe(response => {

        this.idUsuario = response[0].id;

        let dataEnrolado = {
          id_usuario: this.idUsuario,
          nombre: form.enroladoNombreForm,
          contrasenia: form.enroladoContraseniaForm,
          activo: form.enroladoActivoForm,
          finger: form.enroladoFingerForm,
          data_finger: form.enroladoData_FingerForm
        };

        this.rest.postEnroladosRest(dataEnrolado)
          .subscribe(response => {
            this.toastr.success('Operacion Exitosa', 'Enrolado con éxito');
            this.limpiarCampos();
          }, error => {
            console.log(error);
          });

      }, error => {
        console.log(error);
      });
  }
  
  soloLetras(e) {
    var key = window.Event ? e.which : e.keyCode
    return (!( (key >=33 && key <= 64) || (key >= 91 && key <= 96) || (key >= 123 && key <= 128) || (key >= 131 && key <= 159) || (key >= 164 && key <= 225) ))
  }

  soloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode
    return ((key >= 48 && key <= 57) || (key === 8))
  }

  limpiarCampos() {
    this.nuevoEnroladoForm.reset();
  }

  cerrarVentanaRegistroEnrolado(){
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
