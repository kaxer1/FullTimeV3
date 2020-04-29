import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { RolesService } from 'src/app/servicios/catalogos/catRoles/roles.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-registro-rol',
  templateUrl: './registro-rol.component.html',
  styleUrls: ['./registro-rol.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class RegistroRolComponent implements OnInit {

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

  limpiarCampos(){
    this.nuevoRolForm.reset();
  }

  insertarRol(form){
    let dataRol= {
      nombre: form.descripcionForm,
    };

    this.rest.postRoles(dataRol).subscribe(response => {
      console.log(response);  
      this.toastr.success('Operacion Exitosa', 'Rol guardado');
      this.limpiarCampos();
    },error => {
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

  CerrarVentanaRegistroRol() {
    this.limpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }
}
