import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { EnroladoService } from 'src/app/servicios/catalogos/enrolado.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/catalogos/usuario.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-registro-enrolados',
  templateUrl: './registro-enrolados.component.html',
  styleUrls: ['./registro-enrolados.component.css']
})
export class RegistroEnroladosComponent implements OnInit {



  id_usuario = new FormControl('', Validators.required);
  nombre = new FormControl('', [Validators.required, Validators.pattern('[A-Z a-z0-9]*')]);
  contrasenia = new FormControl('');
  finger = new FormControl('',  Validators.pattern('[0-9]*'));
  activo = new FormControl('', Validators.required);
  data_finger = new FormControl('', Validators.pattern('[a-zA-z 1-9]*'));
  
  usuarios: any =[];

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
      private router: Router,
      private restUsuario: UsuarioService
  
    ) { }
  
    ngOnInit(): void {
      this.getUsuarios();
    }
  
  
  
  
  
    insertarEnrolado(form) {
      
      this.restUsuario.getIdByUsuarioRest(form.enroladoId_UsuarioForm)
      .subscribe(response => {
        
        this.idUsuario=response[0].id;

        let dataEnrolado = {
          id_usuario: this.idUsuario,
          nombre: form.enroladoNombreForm,
         contrasenia: form.enroladoContraseniaForm,
          activo: form.enroladoActivoForm,
          finger: form.enroladoFingerForm,
          data_finger:form.enroladoData_FingerForm
        };
        
        this.rest.postEnroladosRest(dataEnrolado)
        .subscribe(response => {
          this.toastr.success('Operacion Exitosa', 'Enrolado con éxito');
         
          this.router.navigate(['/', 'enrolados']);
        }, error => {
          console.log(error);
        });

      }, error => {
        console.log(error);
      });

      

      


      
  
  
  
  
    }
  
    cancelarRegistroEnrolado() {
      this.router.navigate(['/', 'enrolados']);
    }
  
    soloNumeros(e) {
      var key = window.Event ? e.which : e.keyCode
      return ((key >= 48 && key <= 57) || (key === 8)|| (key==46))
    }
  
    soloEnteros(e) {
      var key = window.Event ? e.which : e.keyCode
      return ((key >= 48 && key <= 57) || (key === 8))
    }
  
    limpiarCampos(){
      this.nuevoEnroladoForm.setValue({
        horarioNombreForm: "",
        horarioMinAlmuerzoForm:"",
        horarioHoraTrabajoForm:""
      })
        
      
    }
  
  
    obtenerMensajeErrorNombre() {
      if (this.nombre.hasError('required')) {
        return 'Debe ingresar algun nombre';
      }
      return this.nombre.hasError('pattern') ? 'No ingresar números' : '';
    }


    getIdUsuario(usuario: string){
      this.restUsuario.getIdByUsuarioRest(usuario)
      .subscribe(response => {
        
        this.idUsuario=response[0].id;
        
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
