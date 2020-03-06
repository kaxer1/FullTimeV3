import { Component, OnInit } from '@angular/core';
import { ProvinciaService } from 'src/app/servicios/catalogos/provincia.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-provincia',
  templateUrl: './registro-provincia.component.html',
  styleUrls: ['./registro-provincia.component.css']
})
export class RegistroProvinciaComponent implements OnInit {


  public nuevaProvinciaForm = new FormGroup({
    // idForm: new FormControl('', Validators.required),
    nombreForm: new FormControl('',[ Validators.required, Validators.pattern('[a-zA-Z ]*')]),
  });
  
  constructor(
    private rest: ProvinciaService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  obtenerMensajeErrorNombre() {
    if (this.nuevaProvinciaForm.hasError('required')) {
      return 'Debe ingresar algun nombre';
    }
    return this.nuevaProvinciaForm.hasError('pattern') ? 'No ingresar números' : '';
  }

  insertarProvincia(form){
    let dataTitulo = {
      nombre: form.nombreForm,
      
    };

    this.rest.postProvinciaRest(dataTitulo)
    .subscribe(response => {
        this.toastr.success('Operacion Exitosa', 'Provincia guardada');
        this.limpiarCampos();
        this.router.navigate(['/','provincia']);
      }, error => {
        console.log(error);
      });;
  }

  limpiarCampos(){
    this.nuevaProvinciaForm.setValue({
     nombreForm: '',
     
    });
  }


  cancelarProvincia(){
    this.router.navigate(['/','provincia']);
  }
}
