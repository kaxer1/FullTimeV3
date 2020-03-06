import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { TituloService } from 'src/app/servicios/catalogos/titulo.service';
import { ToastrService } from 'ngx-toastr';

// Interface para creación de selección de niveles
interface Nivel {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-titulos',
  templateUrl: './titulos.component.html',
  styleUrls: ['./titulos.component.css']
})
export class TitulosComponent implements OnInit {
  
  // Control de los campos del formulario
  nombre = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]);
  nivel = new FormControl('', Validators.required)

  // asignar los campos en un formulario en grupo
  public nuevoTituloForm = new FormGroup({
    tituloNombreForm: this.nombre,
    tituloNivelForm: this.nivel,
  });

  // Arreglo de niveles existentes
  niveles: Nivel[] = [
    {value: '1', viewValue: 'Primaria'},
    {value: '2', viewValue: 'Secundaria'},
    {value: '3', viewValue: 'Bachillerato'},
    {value: '4', viewValue: 'Universidad'},
    {value: '5', viewValue: 'MBS'}
  ];

  constructor(
    private rest: TituloService,
    private toastr: ToastrService,
  ) { 
    this.limpiarCampos();
  }

  ngOnInit(): void {
  }

  obtenerMensajeErrorNombre() {
    if (this.nombre.hasError('required')) {
      return 'Debe ingresar algun nombre';
    }
    return this.nombre.hasError('pattern') ? 'No ingresar números' : '';
  }

  insertarTitulo(form){
    let dataTitulo = {
      nombre: form.tituloNombreForm,
      nivel: form.tituloNivelForm,
    };

    this.rest.postTituloRest(dataTitulo)
    .subscribe(response => {
        this.toastr.success('Operacion Exitosa', 'Titulo guardado');
        this.limpiarCampos();
      }, error => {
        console.log(error);
      });;
  }

  limpiarCampos(){
    this.nuevoTituloForm.setValue({
      tituloNombreForm: '',
      tituloNivelForm: '',
    });
  }

}
