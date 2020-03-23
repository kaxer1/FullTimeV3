import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TipoComidasService } from 'src/app/servicios/catalogos/tipoComidas/tipo-comidas.service';
import { TipoComidasComponent } from 'src/app/componentes/catalogos/catTipoComidas/tipo-comidas/tipo-comidas.component';


@Component({
  selector: 'app-listar-tipo-comidas',
  templateUrl: './listar-tipo-comidas.component.html',
  styleUrls: ['./listar-tipo-comidas.component.css']
})

export class ListarTipoComidasComponent implements OnInit {

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.minLength(2)]);

  // Asignación de validaciones a inputs del formulario
  public BuscarTipoComidaForm = new FormGroup({
    nombreForm: this.nombreF,
  });

  // Almacenamiento de datos consultados  
  tipoComidas: any = [];
  filtroNombre = '';

  constructor(
    private rest: TipoComidasService,
    public router: Router,
    public vistaRegistrarTipoComida: MatDialog,
  ) { }

  ngOnInit(): void {
    this.ObtenerTipoComidas();
  }

  // Lectura de datos
  ObtenerTipoComidas() {
    this.tipoComidas = [];
    this.rest.ConsultarTipoComida().subscribe(datos => {
      this.tipoComidas = datos;
    })
  }

  AbrirVentanaRegistrarTipoComidas(): void {
    this.vistaRegistrarTipoComida.open(TipoComidasComponent, { width: '300px' }).disableClose = true;
  }

  LimpiarCampos() {
    this.BuscarTipoComidaForm.setValue({
      nombreForm: '',
    });
    this.ObtenerTipoComidas();
  }

}
