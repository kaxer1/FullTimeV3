import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'
import { ToastrService } from 'ngx-toastr';
import { rango, checkOptions, FormCriteriosBusqueda } from "src/app/model/reportes.model";

@Injectable({
  providedIn: 'root'
})

export class ReportesService {

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  ObtenerTimbres(empleado_id: any, data: any) {
    return this.http.post(`${environment.url}/reporte/reporteTimbres/listaTimbres/${empleado_id}`, data);
  }

  ObtenerPermisosHorarios(empleado_id: any) {
    return this.http.get(`${environment.url}/reporte/reportePermisos/horarios/${empleado_id}`);
  }

  ObtenerPermisosPlanificacion(empleado_id: any) {
    return this.http.get(`${environment.url}/reporte/reportePermisos/planificacion/${empleado_id}`);
  }

  ObtenerAutorizacionPermiso(empleado_id: any) {
    return this.http.get(`${environment.url}/reporte/reportePermisos/autorizaciones/${empleado_id}`);
  }

  ObtenerTimbresAtrasosHorario(empleado_id: any, data: any) {
    return this.http.post(`${environment.url}/reporte/reporteAtrasos/horarios/${empleado_id}`, data);
  }

  ObtenerTimbresAtrasosPlanificacion(empleado_id: any, data: any) {
    return this.http.post(`${environment.url}/reporte/reporteAtrasos/planificacion/${empleado_id}`, data);
  }

  ObtenerEntradaSalidaHorario(codigo: any, data: any) {
    return this.http.post(`${environment.url}/reporte/reporteEntradaSalida/horarios/${codigo}`, data);
  }

  ObtenerEntradaSalidaPlanificacion(codigo: any, data: any) {
    return this.http.post(`${environment.url}/reporte/reporteEntradaSalida/planificacion/${codigo}`, data);
  }

  ObtenerPermisosHorariosFechas(empleado_id: any, data: any) {
    return this.http.post(`${environment.url}/reporte/reportePermisos/fechas/horarios/${empleado_id}`, data);
  }

  ObtenerPermisosPlanificacionFechas(empleado_id: any, data: any) {
    return this.http.post(`${environment.url}/reporte/reportePermisos/fechas/planificacion/${empleado_id}`, data);
  }


  /**
   * SERVICIOS CENTRALIZADOS RANGO DE FECHAS
   */
  
  private _fechas: rango = {
    fec_inico: '',
    fec_final: ''
  }; 

  get rangoFechas() {
    return this._fechas
  }

  guardarRangoFechas(inicio: string, final: string) {
    this._fechas = { fec_inico: inicio, fec_final: final}
  }

  /**
   * LOS CHECKS DE LOS CRITERIOS DE BUSQUEDA
   */

  private _check: checkOptions[] = [
    {opcion: 1, valor: 'Sucursal'},
    {opcion: 2, valor: 'Departamento'},
    {opcion: 3, valor: 'Empleado'},
    {opcion: 4, valor: 'Tabulado'},
    {opcion: 5, valor: 'Incompletos'}
  ];

  checkOptions(num_items: number): checkOptions[] {
    return [...this._check.splice(0,num_items)];
  }

  /**
   * EL NUMERO DE LA OPCION ESCOGIDA YA SEA (SUCURSAL, DEPARTAMENTO, EMPLEADO, TABULADO ?, INCOMPLETO ?)
   */

  private _opcion = 0;

  GuardarCheckOpcion(o: number): void {
    this._opcion = o;
  }

  get opcion() {
    return this._opcion
  }

  /**
   * PARA MOSTRAR LOS FORMS DEACUERDO A LA OPCION SELECCIONADA
   */
  private _formCriteriosBusqueda: FormCriteriosBusqueda = {
    bool_suc: false,
    bool_dep: false,
    bool_emp: false,
    bool_tab: false,
    bool_inc: false
  }

  GuardarFormCriteriosBusqueda(bool: FormCriteriosBusqueda): void {
    this._formCriteriosBusqueda = bool;
  }
  
  get criteriosBusqueda() {
    return this._formCriteriosBusqueda
  }
   


  /**
   * METODOS PARA CONTROLAR INGRESO DE LETRAS
   */

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

  IngresarSoloNumeros(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números', {
        timeOut: 6000,
      })
      return false;
    }
  }


}