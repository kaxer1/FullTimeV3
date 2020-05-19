import { Component, OnInit, Input } from '@angular/core';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { ToastrService } from 'ngx-toastr';
import { VerEmpleadoComponent } from '../../ver-empleado/ver-empleado.component';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { TituloService } from 'src/app/servicios/catalogos/catTitulos/titulo.service';

@Component({
  selector: 'app-editar-titulo',
  templateUrl: './editar-titulo.component.html',
  styleUrls: ['./editar-titulo.component.css']
})
export class EditarTituloComponent implements OnInit {

  @Input() idSelect: number;
  @Input() idEmpleado: number;
  // idEmpleado: string;

  cgTitulos: any = [];

  observa = new FormControl('', [Validators.required, Validators.maxLength(255)]);
  idTitulo = new FormControl('', [Validators.required])

  public editarTituloEmpleadoForm = new FormGroup({
    observacionForm: this.observa,
    idTituloForm: this.idTitulo
  });

  constructor(
    private rest: EmpleadoService,
    private toastr: ToastrService,
    private restTitulo: TituloService,
    private verEmpleado: VerEmpleadoComponent,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.obtenerTitulos();
    this.ObtenerTituloSeleccionado();
  }

  setTitulos: any = [];
  ObtenerTituloSeleccionado(){
    this.setTitulos = []
    this.rest.getEmpleadoTituloRest(this.idEmpleado).subscribe(res => {
      this.setTitulos = res;
      this.setTitulos.map(obj => {
        if(obj.id == this.idSelect){
          this.observa.setValue(obj.observaciones);
          this.idTitulo.setValue(obj.id_titulo);
        }
      });
    });
  }

  ActualizarTituloEmpleado(form){
    let dataTituloEmpleado = {
      observacion: form.observacionForm,
      id_titulo: form.idTituloForm,
    }
    this.rest.putEmpleadoTituloRest(this.idSelect , dataTituloEmpleado).subscribe(data => {
      this.verEmpleado.obtenerTituloEmpleado(this.idEmpleado);
      this.toastr.success('Actualización Exitosa', 'Titulo asignado al empleado');
    });
  }

  obtenerTitulos() {
    this.restTitulo.getTituloRest().subscribe(data => {
      this.cgTitulos = data;
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

  VerificarTitulo() {
    window.open("https://www.senescyt.gob.ec/web/guest/consultas", "_blank");
  }
  
  cancelar(){this.verEmpleado.verTituloEdicion(true);}

}
