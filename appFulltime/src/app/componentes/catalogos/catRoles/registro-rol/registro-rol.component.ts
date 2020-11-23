import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RolesService } from 'src/app/servicios/catalogos/catRoles/roles.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-registro-rol',
  templateUrl: './registro-rol.component.html',
  styleUrls: ['./registro-rol.component.css'],
})

export class RegistroRolComponent implements OnInit {

  salir: boolean = false;

  descripcion = new FormControl('', Validators.required);

  public nuevoRolForm = new FormGroup({
    descripcionForm: this.descripcion
  });

  constructor(
    public rest: RolesService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistroRolComponent>,
  ) {
    this.nuevoRolForm.setValue({
      descripcionForm: '',
    });
  }

  ngOnInit(): void {
    this.limpiarCampos();
  }

  obtenerMensajeErrorDescripcion() {
    if (this.descripcion.hasError('required')) {
      return 'Debe ingresar alguna Descripción';
    }
  }

  limpiarCampos() {
    this.nuevoRolForm.reset();
  }

  contador: number = 0;
  roles: any = [];
  insertarRol(form) {
    this.contador = 0;
    this.roles = [];
    let dataRol = {
      nombre: form.descripcionForm,
    };
    this.rest.getRoles().subscribe(response => {
      this.roles = response;
      this.roles.forEach(obj => {
        if (obj.nombre.toUpperCase() === dataRol.nombre.toUpperCase()) {
          this.contador = this.contador + 1;
        }
      })
      if (this.contador === 0) {
        this.rest.postRoles(dataRol).subscribe(response => {
          console.log(response);
          this.toastr.success('Operacion Exitosa', 'Rol guardado', {
            timeOut: 6000,
          });
          this.limpiarCampos();
          this.salir = true;
        });
      }
      else {
        this.toastr.error('Para el correcto funcionamiento del sistema ingresar un nuevo nombre rol ' +
          'que no se encuentre registrado en el sistema.',
          'Nombre de Rol Duplicado', {
            timeOut: 6000,
          });
      }
    })
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
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras', {
        timeOut: 6000,
      })
      return false;
    }
  }

  CerrarVentanaRegistroRol() {
    this.limpiarCampos();
    this.dialogRef.close(this.salir);
  }
}
