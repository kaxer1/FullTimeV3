import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-tipo-permisos',
  templateUrl: './tipo-permisos.component.html',
  styleUrls: ['./tipo-permisos.component.css']
})
export class TipoPermisosComponent implements OnInit {

  descripcion = new FormControl('', Validators.required); 
  tipoDescuento = new FormControl('', Validators.required);
  numDiaMaximo = new FormControl('', Validators.required);
  numHoraMaximo = new FormControl('', Validators.required);
  numDiaIngreso = new FormControl('', Validators.required);
  vacaAfecta = new FormControl('', Validators.required); 
  anioAcumula = new FormControl('', Validators.required);
  correo = new FormControl('', Validators.required);
  geneJustificacion = new FormControl('', Validators.required);
  fecValidar = new FormControl('', Validators.required);
  acceEmpleado = new FormControl('', Validators.required);
  actualizar = new FormControl('', Validators.required);
  autorizar = new FormControl('', Validators.required);
  crear = new FormControl('', Validators.required);
  eliminar = new FormControl('', Validators.required);
  legalizar = new FormControl('', Validators.required);
  noautorizar = new FormControl('', Validators.required);
  preautorizar = new FormControl('', Validators.required);
  almuIncluir = new FormControl('', Validators.required);
  numDiaJustifica = new FormControl('', Validators.required);


  constructor() { }

  ngOnInit(): void {
  
  }

  insertarTipoPermiso(form){
    let dataTipoPermiso = {
        descripcion: "d1", 
        tipo_descuento: "sa",
        num_dia_maximo: 3,
        num_hora_maximo: 4,
        num_dia_ingreso: 5,
        vaca_afecta: true, 
        anio_acumula: true,
        correo: false,
        gene_justificacion: false,
        fec_validar: true,
        acce_empleado: 4,
        actualizar: false,
        autorizar: true,
        crear: true,
        eliminar: false,
        legalizar: true,
        noautorizar: false,
        preautorizar: false,
        almu_incluir: true,
        num_dia_justifica: 2
    }
  }
}
