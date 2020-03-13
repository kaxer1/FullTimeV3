import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegimenService } from 'src/app/servicios/catalogos/regimen/regimen.service';
import { TipoComidasComponent } from 'src/app/componentes/catalogos/catTipoComidas/tipo-comidas/tipo-comidas.component';


@Component({
  selector: 'app-listar-tipo-comidas',
  templateUrl: './listar-tipo-comidas.component.html',
  styleUrls: ['./listar-tipo-comidas.component.css']
})
export class ListarTipoComidasComponent implements OnInit {

  // Control de campos y validaciones del formulario
  nombreF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{3,48}")]);

  // Asignación de validaciones a inputs del formulario
  public BuscarTipoComidaForm = new FormGroup({
    nombreForm: this.nombreF,
  });

  // Almacenamiento de datos consultados  
  tipoComidas: any = [];

  constructor(
    private rest: RegimenService,
    public router: Router,
    public vistaRegistrarTipoComida: MatDialog,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.ObtenerTipoComidas();
  }

  // Lectura de datos
  ObtenerTipoComidas() {
    this.tipoComidas = [];
    this.rest.ConsultarRegimen().subscribe(datos => {
      this.tipoComidas = datos;
    })
  }

  AbrirVentanaRegistrarTipoComidas(): void {
    this.vistaRegistrarTipoComida.open(TipoComidasComponent, { width: '300px'})
  }

  LimpiarCampos() {
    this.BuscarTipoComidaForm.reset();
  }

}
