import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { checkOptions, FormCriteriosBusqueda } from 'src/app/model/reportes.model';
import { ReportesService } from 'src/app/servicios/reportes/reportes.service';

@Component({
  selector: 'app-criterios-busqueda',
  templateUrl: './criterios-busqueda.component.html',
  styleUrls: ['./criterios-busqueda.component.css']
})
export class CriteriosBusquedaComponent implements OnInit {

  codigo = new FormControl('');
  cedula = new FormControl('', [Validators.minLength(2)]);
  nombre_emp = new FormControl('', [Validators.minLength(2)]);
  nombre_dep = new FormControl('', [Validators.minLength(2)]);
  nombre_suc = new FormControl('', [Validators.minLength(2)]);

  filtroCodigo: number;
  filtroCedula: '';
  filtroNombreEmp: '';
  filtroNombreDep: '';
  filtroNombreSuc: '';

  filtroCodigo_tab: number;
  filtroCedula_tab: '';
  filtroNombreTab: '';

  filtroCodigo_inc: number;
  filtroCedula_inc: '';
  filtroNombreInc: '';

  public _booleanOptions: FormCriteriosBusqueda = {
    bool_suc: false, 
    bool_dep: false, 
    bool_emp: false, 
    bool_tab: false, 
    bool_inc: false
  } ;

  public check: checkOptions[];

  @Input('num_option') num_option: number = 0;

  constructor(
    private reporteService: ReportesService
  ) { }

  ngOnInit(): void {
    console.log('atributo',this.num_option);
    
    this.check = this.reporteService.checkOptions(this.num_option);
    console.log('CHECK ',this.check);
    
  }

  opcion: number;
  BuscarPorTipo(e: MatRadioChange) {
  
    this.opcion = e.value;
    switch (this.opcion) {
      case 1:
        this._booleanOptions.bool_suc = true;
        this._booleanOptions.bool_dep = false; 
        this._booleanOptions.bool_emp = false;
        this._booleanOptions.bool_tab = false;
        this._booleanOptions.bool_inc = false;
      break;
      case 2:
        this._booleanOptions.bool_suc = false;
        this._booleanOptions.bool_dep = true; 
        this._booleanOptions.bool_emp = false;
        this._booleanOptions.bool_tab = false;
        this._booleanOptions.bool_inc = false;
      break;
      case 3:
        this._booleanOptions.bool_suc = false;
        this._booleanOptions.bool_dep = false; 
        this._booleanOptions.bool_emp = true;
        this._booleanOptions.bool_tab = false;
        this._booleanOptions.bool_inc = false;
      break;
      case 4:
        this._booleanOptions.bool_suc = false;
        this._booleanOptions.bool_dep = false; 
        this._booleanOptions.bool_emp = false;
        this._booleanOptions.bool_tab = true;
        this._booleanOptions.bool_inc = false;
      break;
      case 5:
        this._booleanOptions.bool_suc = false;
        this._booleanOptions.bool_dep = false; 
        this._booleanOptions.bool_emp = false;
        this._booleanOptions.bool_tab = false;
        this._booleanOptions.bool_inc = true;
      break;
      default:
        this.reporteService.GuardarFormCriteriosBusqueda(this._booleanOptions);
        break;
    }
    this.reporteService.GuardarFormCriteriosBusqueda(this._booleanOptions);
    this.reporteService.GuardarCheckOpcion(this.opcion)
    
  }

  IngresarSoloLetras(e) {
    return this.reporteService.IngresarSoloLetras(e);
  }
  
  IngresarSoloNumeros(evt) {
    return this.reporteService.IngresarSoloNumeros(evt);
  }

  limpiarCampos() {
    if (this._booleanOptions.bool_emp === true || this._booleanOptions.bool_tab === true || this._booleanOptions.bool_inc === true ) {
      this.codigo.reset();
      this.cedula.reset();
      this.nombre_emp.reset();
    }
    if (this._booleanOptions.bool_dep) {
      this.nombre_dep.reset();
    }
    if (this._booleanOptions.bool_suc) {
      this.nombre_suc.reset();
    }
    
  }

}
