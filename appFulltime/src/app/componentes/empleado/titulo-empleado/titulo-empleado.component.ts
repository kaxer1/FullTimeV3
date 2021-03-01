import { Component, OnInit, Input } from '@angular/core';
import { TituloService } from 'src/app/servicios/catalogos/catTitulos/titulo.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';
import { VerEmpleadoComponent } from '../ver-empleado/ver-empleado.component';

@Component({
  selector: 'app-titulo-empleado',
  templateUrl: './titulo-empleado.component.html',
  styleUrls: ['./titulo-empleado.component.css'],
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

  obtenerTitulos() {
    this.restTitulo.getTituloRest().subscribe(data => {
      this.cgTitulos = data;
    });
  }

  insertarTituloEmpleado(form) {
    let dataTituloEmpleado = {
      observacion: form.observacionForm,
      id_empleado: parseInt(this.idEmploy),
      id_titulo: form.idTituloForm,
    }
    this.restEmpleado.postEmpleadoTitulos(dataTituloEmpleado).subscribe(data => {
      this.toastr.success('Operacion Exitosa', 'Titulo asignado al empleado', {
        timeOut: 6000,
      });
      this.limpiarCampos();
      this.metodo.obtenerTituloEmpleado(parseInt(this.idEmploy));
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
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras', {
        timeOut: 6000,
      })
      return false;
    }
  }

  limpiarCampos() {
    this.nuevoTituloEmpleadoForm.reset();
  }

  cerrarRegistro() {
    this.metodo.mostrarTit();
    //window.location.reload();
  }

  VerificarTitulo() {
    window.open("https://www.senescyt.gob.ec/web/guest/consultas", "_blank");
  }
}
