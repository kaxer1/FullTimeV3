import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { RolesService } from 'src/app/servicios/roles/roles.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-registro-rol',
  templateUrl: './registro-rol.component.html',
  styleUrls: ['./registro-rol.component.css']
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

  soloLetras(e) {
    var key = window.Event ? e.which : e.keyCode
    return (!( (key >=33 && key <= 64) || (key >= 91 && key <= 96) || (key >= 123 && key <= 128) || (key >= 131 && key <= 159) || (key >= 164 && key <= 225) ))
  }

  CerrarVentanaRegistroRol() {
    this.limpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }
}
