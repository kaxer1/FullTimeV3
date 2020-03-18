import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { RolesService } from 'src/app/servicios/roles/roles.service';
import { Router } from '@angular/router';
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
    private router: Router,
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
      return 'Debe ingresar algun nombre';
    }
    return this.descripcion.hasError('pattern') ? 'No ingresar números' : '';
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
    return (!((key >= 48 && key <= 63)|| key==8 || key==46))
  }

  CerrarVentanaRegistroRol() {
    this.limpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }
}
