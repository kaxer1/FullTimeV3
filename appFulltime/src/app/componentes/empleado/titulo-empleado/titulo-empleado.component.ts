import { Component, OnInit, Input } from '@angular/core';
import { TituloService } from 'src/app/servicios/catalogos/titulo.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/servicios/empleado/empleado.service';
import { VerEmpleadoComponent } from '../ver-empleado/ver-empleado.component';

@Component({
  selector: 'app-titulo-empleado',
  templateUrl: './titulo-empleado.component.html',
  styleUrls: ['./titulo-empleado.component.css']
})
export class TituloEmpleadoComponent implements OnInit {

  @Input() idEmploy: string;

  cgTitulos: any = [];

  observa = new FormControl('', [Validators.required, Validators.maxLength(255)]);
  idTitulo = new FormControl('', [Validators.required])

  public nuevoTituloEmpleadoForm = new FormGroup({
    observacionForm: this.observa,
    idTituloForm: this.idTitulo
  });
  
  constructor(
    public restTitulo: TituloService,
    public restEmpleado: EmpleadoService,
    private toastr: ToastrService,
    private metodo: VerEmpleadoComponent //se usa para poder refrescar los datos ingresados
  ) { }

  ngOnInit(): void {
    this.obtenerTitulos();
    this.limpiarCampos();
  }

  obtenerTitulos(){
    this.restTitulo.getTituloRest().subscribe(data => {
      this.cgTitulos = data;
    });
  }

  insertarTituloEmpleado(form){
    let dataTituloEmpleado = {
      observacion: form.observacionForm,
      id_empleado: parseInt(this.idEmploy),
      id_titulo: form.idTituloForm,
    }
    this.restEmpleado.postEmpleadoTitulos(dataTituloEmpleado).subscribe(data => {
      this.toastr.success('Operacion Exitosa', 'Titulo asignado al empleado');
      this.limpiarCampos();
      this.metodo.obtenerTituloEmpleado(this.idEmploy);
    });
  }

  limpiarCampos(){
    this.nuevoTituloEmpleadoForm.reset();
  }

  cerrarRegistro(){
    this.metodo.mostrarTit();
  }
}
