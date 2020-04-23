import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { TitulosComponent } from '../titulos/titulos.component'
import { TituloService } from 'src/app/servicios/catalogos/catTitulos/titulo.service';
import { NivelTitulosService } from 'src/app/servicios/nivelTitulos/nivel-titulos.service';
import { MatTableDataSource } from '@angular/material/table';

export interface Titulo {
  id: number;
  nombre: string;
  nivel: string;
}

@Component({
  selector: 'app-listar-titulos',
  templateUrl: './listar-titulos.component.html',
  styleUrls: ['./listar-titulos.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ListarTitulosComponent implements OnInit {

  titulos: any = [];
  verTitulos: any = [];
  filtradoNombre = '';
  filtradoNivel = '';

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);
  nivelF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")]);

  ArrayTitulos: Array<Titulo> = [];
  
  displayedColumns: string[] = ['id', 'nombre', 'nivel'];
  dataSource: any;

  // Asignación de validaciones a inputs del formulario
  public BuscarTitulosForm = new FormGroup({
    nombreForm: this.nombreF,
    nivelForm: this.nivelF,
  });

  constructor(
    public vistaRegistrarTitulo: MatDialog,
    public rest: TituloService,
    public restNivelTitulos: NivelTitulosService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.ObtenerTitulos();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ObtenerTitulos() {
    this.rest.getTituloRest().subscribe(data => {
      this.titulos = data;
      this.titulos.forEach(obj => {
        this.restNivelTitulos.getOneNivelTituloRest(obj.id_nivel).subscribe(res => {
          let dataTitulos = {
            id: obj.id,
            nombre: obj.nombre,
            nivel: res[0].nombre
          }
          this.verTitulos.push(dataTitulos);
          this.dataSource = new MatTableDataSource(this.verTitulos);
        });
      })
    });
  }

  AbrirVentanaRegistrarTitulo(): void {
    this.vistaRegistrarTitulo.open(TitulosComponent, { width: '350px' }).disableClose = true;
  }

  LimpiarCampos() {
    console.log('limpiar');
  }

  ObtenerMensajeErrorNombre() {
    if (this.nombreF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
  }

  ObtenerMensajeErrorNivel() {
    if (this.nivelF.hasError('pattern')) {
      return 'Indispensable ingresar dos letras';
    }
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
}
