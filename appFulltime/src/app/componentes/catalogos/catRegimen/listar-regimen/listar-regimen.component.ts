import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegimenService } from 'src/app/servicios/catalogos/regimen/regimen.service';
import { RegimenComponent } from 'src/app/componentes/catalogos/catRegimen/regimen/regimen.component';

@Component({
  selector: 'app-listar-regimen',
  templateUrl: './listar-regimen.component.html',
  styleUrls: ['./listar-regimen.component.css']
})

export class ListarRegimenComponent implements OnInit {

  // Control de campos y validaciones del formulario
  descripcionF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{3,48}")]);

  // Asignación de validaciones a inputs del formulario
  public BuscarRegimenForm = new FormGroup({
    descripcionForm: this.descripcionF,
  });

  // Almacenamiento de datos consultados  
  regimen: any = [];

  constructor(
    private rest: RegimenService,
    public router: Router,
    public vistaRegistrarRegimen: MatDialog,
    private toastr: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.ObtenerRegimen();
  }

  // Lectura de datos
  ObtenerRegimen() {
    this.regimen = [];
    this.rest.ConsultarRegimen().subscribe(datos => {
      this.regimen = datos;
    })
  }

  AbrirVentanaRegistrarRegimen(): void {
    this.vistaRegistrarRegimen.open(RegimenComponent, { width: '300px'})
  }

  LimpiarCampos() {
    this.BuscarRegimenForm.reset();
  }

}
