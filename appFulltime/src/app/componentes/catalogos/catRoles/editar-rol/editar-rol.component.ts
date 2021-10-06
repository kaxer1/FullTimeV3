import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RolesService } from 'src/app/servicios/catalogos/catRoles/roles.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { ValidacionesService } from 'src/app/servicios/validaciones/validaciones.service';

@Component({
  selector: 'app-editar-rol',
  templateUrl: './editar-rol.component.html',
  styleUrls: ['./editar-rol.component.css']
})

export class EditarRolComponent implements OnInit {

  // Datos empleado logueado
  empleadoLogueado: any = [];
  idEmpleadoLogueado: number;

  salir: boolean = false;

  descripcion = new FormControl('', Validators.required);

  public nuevoRolForm = new FormGroup({
    descripcionForm: this.descripcion
  });

  constructor(
    public rest: RolesService,
    public restEmpleado: EmpleadoService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditarRolComponent>,
    public validar: ValidacionesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.idEmpleadoLogueado = parseInt(localStorage.getItem('empleado'));
  }

  ngOnInit(): void {
    this.ObtenerEmpleadoLogueado(this.idEmpleadoLogueado);
    this.nuevoRolForm.setValue({
      descripcionForm: this.data.datosRol.nombre,
    });
  }

  // Método para ver la información del empleado 
  ObtenerEmpleadoLogueado(idemploy: any) {
    this.empleadoLogueado = [];
    this.restEmpleado.getOneEmpleadoRest(idemploy).subscribe(data => {
      this.empleadoLogueado = data;
    })
  }

  obtenerMensajeErrorDescripcion() {
    if (this.descripcion.hasError('required')) {
      return 'Debe ingresar alguna Descripción';
    }
  }

  limpiarCampos() {
    this.nuevoRolForm.reset();
  }

  roles: any = [];
  contador: number = 0;
  insertarRol(form) {
    this.contador = 0;
    this.roles = [];
    let dataRol = {
      id: this.data.datosRol.id,
      nombre: form.descripcionForm,
      logged: parseInt(this.empleadoLogueado[0].codigo)
    };
    this.rest.ListarRolesActualiza(this.data.datosRol.id).subscribe(response => {
      this.roles = response;
      this.roles.forEach(obj => {
        if (obj.nombre.toUpperCase() === dataRol.nombre.toUpperCase()) {
          this.contador = this.contador + 1;
        }
      })
      if (this.contador === 0) {
        this.rest.ActualizarRol(dataRol).subscribe(response => {
          this.toastr.success('Operacion Exitosa', 'Rol actualizado', {
            timeOut: 6000,
          });
          this.validar.Auditar('public', 'cg_roles');
          this.limpiarCampos();
          this.salir = true;
          this.dialogRef.close(this.salir);
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
