import { Component, OnInit } from '@angular/core';
import { HorarioService } from 'src/app/servicios/catalogos/horario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-registro-horario',
  templateUrl: './registro-horario.component.html',
  styleUrls: ['./registro-horario.component.css']
})
export class RegistroHorarioComponent implements OnInit {


nombre = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]);
minAlmuerzo = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
horaTrabajo = new FormControl('', [Validators.required]);
flexible = new FormControl('', Validators.required);
porHoras = new FormControl('', Validators.required);



 // asignar los campos en un formulario en grupo
 public nuevoHorarioForm = new FormGroup({
  horarioNombreForm: this.nombre,
  horarioMinAlmuerzoForm: this.minAlmuerzo,
  horarioHoraTrabajoForm: this.horaTrabajo,
  horarioFlexibleForm: this.flexible,
  horarioPorHorasForm: this.porHoras
 });

  constructor(
    private rest: HorarioService,
    private toastr: ToastrService,
    private router: Router

  ) { }

  ngOnInit(): void {
  this.limpiarCampos
  }





  insertarHorario(form) {
    console.log(form.horarioPorHorasForm);

    let dataHorario = {
      nombre: form.horarioNombreForm,
      min_almuerzo: form.horarioMinAlmuerzoForm,
      hora_trabajo: form.horarioHoraTrabajoForm,
      flexible: form.horarioFlexibleForm,
      por_horas: form.horarioPorHorasForm
    };

    this.rest.postHorarioRest(dataHorario)
      .subscribe(response => {
        this.toastr.success('Operacion Exitosa', 'Proceso guardado');
        //this.limpiarCampos();
        this.router.navigate(['/', 'horario']);
      }, error => {
        console.log(error);
      });;




  }

  cancelarRegistroHorario() {
    this.router.navigate(['/', 'horario']);
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
    this.nuevoHorarioForm.setValue({
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



}
