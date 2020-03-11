import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProcesoService } from 'src/app/servicios/catalogos/proceso.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CompileShallowModuleMetadata } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

// ayuda para crear los niveles
interface Nivel {
  valor: string;
  nombre: string

}

@Component({
  selector: 'app-registro-proceso',
  templateUrl: './registro-proceso.component.html',
  styleUrls: ['./registro-proceso.component.css']
})
export class RegistroProcesoComponent implements OnInit {

  // Control de los campos del formulario
  nombre = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]);
  nivel = new FormControl('', Validators.required);
  procesoPadre = new FormControl('');
  procesos: any = [];
  //procesoPadreId;

  // asignar los campos en un formulario en grupo
  public nuevoProcesoForm = new FormGroup({
    procesoNombreForm: this.nombre,
    procesoNivelForm: this.nivel,
    procesoProcesoPadreForm: this.procesoPadre
  });

  // Arreglo de niveles existentes
  niveles: Nivel[] = [
    { valor: '0', nombre: '0' },
    { valor: '1', nombre: '1' },
    { valor: '2', nombre: '2' },
    { valor: '3', nombre: '3' },
    { valor: '4', nombre: '4' },
    { valor: '5', nombre: '5' }
  ];
  

  constructor(
    private rest: ProcesoService,
    private toastr: ToastrService,
    private router: Router
  ) {
    //this.limpiarCampos();
  }

  ngOnInit(): void {
    this.procesos = this.getProcesos();
  }

  obtenerMensajeErrorNombre() {
    if (this.nombre.hasError('required')) {
      return 'Campo obligatorio';
    }
    return this.nombre.hasError('pattern') ? 'No ingresar números' : '';
  }

  insertarProceso(form) {

    var procesoPadreId

    var procesoPadreNombre = form.procesoProcesoPadreForm;

    if (procesoPadreNombre != '') {
      this.rest.getIdProcesoPadre(procesoPadreNombre).subscribe(data => {

        procesoPadreId = data[0].id;

        let dataProceso = {
          nombre: form.procesoNombreForm,
          nivel: form.procesoNivelForm,
          proc_padre: procesoPadreId
        };

        console.log(dataProceso);

        this.rest.postProcesoRest(dataProceso)
          .subscribe(response => {
            this.toastr.success('Operacion Exitosa', 'Proceso guardado');
            //this.limpiarCampos();
            this.router.navigate(['/', 'proceso']);
          }, error => {
            console.log(error);
          });;

      })
    } else {

      let dataProceso = {
        nombre: form.procesoNombreForm,
        nivel: form.procesoNivelForm,
        proc_padre: null
      };

      console.log(dataProceso);

      this.rest.postProcesoRest(dataProceso)
        .subscribe(response => {
          this.toastr.success('Operacion Exitosa', 'Proceso guardado');
          //this.limpiarCampos();
          this.router.navigate(['/', 'proceso']);
        }, error => {
          console.log(error);
        });;



    }

  }

  limpiarCampos() {
    this.nuevoProcesoForm.setValue({
      tituloNombreForm: '',
      tituloNivelForm: '',
      procesoProcesoPadreForm: ''
    });
  }

  getProcesos() {
    this.procesos = [];
    this.rest.getProcesosRest().subscribe(data => {
      
      this.procesos = data
    })
  }



  cancelarRegistroProceso() {
    this.router.navigate(['/', 'proceso']);
  }




}
