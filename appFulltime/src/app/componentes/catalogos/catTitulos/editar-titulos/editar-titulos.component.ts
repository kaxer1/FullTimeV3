import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TituloService } from 'src/app/servicios/catalogos/catTitulos/titulo.service';
import { NivelTitulosService } from 'src/app/servicios/nivelTitulos/nivel-titulos.service';

@Component({
  selector: 'app-editar-titulos',
  templateUrl: './editar-titulos.component.html',
  styleUrls: ['./editar-titulos.component.css']
})
export class EditarTitulosComponent implements OnInit {

  // Control de los campos del formulario
  nombre = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);
  nivelF = new FormControl('', Validators.required)

  // asignar los campos en un formulario en grupo
  public nuevoTituloForm = new FormGroup({
    tituloNombreForm: this.nombre,
    tituloNivelForm: this.nivelF,
  });

  // Arreglo de niveles existentes
  niveles: any = [];
  idNivel: any = [];
  selectNivel: any;

  constructor(
    private rest: TituloService,
    private restNivelTitulo: NivelTitulosService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditarTitulosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.obtenerNivelesTitulo();
    this.ImprimirDatos();
  }

  obtenerNivelesTitulo() {
    this.niveles = [];
    this.restNivelTitulo.getNivelesTituloRest().subscribe(res => {
      this.niveles = res;
      //this.niveles[this.niveles.length] = { nombre: "Seleccionar" };
      this.selectNivel = this.niveles[this.niveles.length - 1].nombre;
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

  ObtenerMensajeErrorNombre() {
    if (this.nombre.hasError('required')) {
      return 'Campo Obligatorio';
    }
    return this.nombre.hasError('pattern') ? 'Ingrese un nombre válido' : '';
  }

  InsertarTitulo(form) {
    let dataTitulo = {
      id: this.data.id,
      nombre: form.tituloNombreForm,
      id_nivel: form.tituloNivelForm,
    };
    this.rest.ActualizarUnTitulo(dataTitulo).subscribe(response => {
      this.toastr.success('Operación Exitosa', 'Título actualizado');
      this.CerrarVentanaRegistroTitulo();
    }, error => {
    });
  }

  ImprimirDatos() {
    this.idNivel = [];
    console.log("nivel_nombre", this.data.nivel);
    this.restNivelTitulo.BuscarNivelNombre(this.data.nivel).subscribe(datos => {
      this.idNivel = datos;
      this.nuevoTituloForm.setValue({
        tituloNombreForm: this.data.nombre,
        tituloNivelForm: this.data.nivel
      })
      this.selectNivel = this.idNivel[0].id;
      console.log("nivel_id", this.idNivel[0].id, this.idNivel[0].nombre, "otro datos", this.selectNivel);
    })
  }

  LimpiarCampos() {
    this.nuevoTituloForm.reset();
  }

  CerrarVentanaRegistroTitulo() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

}
