import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RelojesService } from 'src/app/servicios/catalogos/relojes/relojes.service';
import { RelojesComponent } from 'src/app/componentes/catalogos/catRelojes/relojes/relojes.component';


@Component({
  selector: 'app-listar-relojes',
  templateUrl: './listar-relojes.component.html',
  styleUrls: ['./listar-relojes.component.css']
})
export class ListarRelojesComponent implements OnInit {

    // Control de campos y validaciones del formulario
    nombreF = new FormControl('', [Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{3,48}")]);
    ipF = new FormControl('');
    modeloF = new FormControl('');
    fabricanteF = new FormControl('');
  
    // Asignación de validaciones a inputs del formulario
    public BuscarRelojesForm = new FormGroup({
      nombreForm: this.nombreF,
      ipForm: this.ipF,
      modeloForm: this.modeloF,
      fabricanteForm: this.fabricanteF,
    });
  
    // Almacenamiento de datos consultados  
    relojes: any = [];
  
    constructor(
      private rest: RelojesService,
      public router: Router,
      public vistaRegistrarRelojes: MatDialog,
      private toastr: ToastrService,
    ) {
  
    }
  
    ngOnInit(): void {
      this.ObtenerReloj();
    }
  
    // Lectura de datos
    ObtenerReloj() {
      this.relojes = [];
      this.rest.ConsultarRelojes().subscribe(datos => {
        this.relojes = datos;
      })
    }
  
  
    AbrirVentanaRegistrarReloj(): void {
      this.vistaRegistrarRelojes.open(RelojesComponent, { width: '300px' })
    }
  
    LimpiarCampos() {
      this.BuscarRelojesForm.reset();
    }

}
