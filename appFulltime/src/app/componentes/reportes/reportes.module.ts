import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material/material.module';
import { FiltrosModule } from '../../filtros/filtros.module';

import { RangoFechasComponent } from './rango-fechas/rango-fechas.component';
import { ReporteFaltasComponent } from './reporte-faltas/reporte-faltas.component';
import { CriteriosBusquedaComponent } from './criterios-busqueda/criterios-busqueda.component';
import { ReporteTimbresMultiplesComponent } from './reporte-timbres-multiples/reporte-timbres-multiples.component';

import { ListaReportesComponent } from './lista-reportes/lista-reportes.component';
import { ReporteEmpleadosComponent } from './reporte-empleados/reporte-empleados.component';
import { ReporteKardexComponent } from './reporte-kardex/reporte-kardex.component';
import { ReporteHorasPedidasComponent } from './reporte-horas-pedidas/reporte-horas-pedidas.component';
import { ReporteHorasExtrasComponent } from './reporte-horas-extras/reporte-horas-extras.component';
import { AlimentosGeneralComponent } from './alimentacion/alimentos-general/alimentos-general.component';
import { DetallePlanificadosComponent } from './alimentacion/detalle-planificados/detalle-planificados.component';
import { ReporteAtrasosMultiplesComponent } from './reporte-atrasos-multiples/reporte-atrasos-multiples.component';
import { ReporteEmpleadosInactivosComponent } from './reporte-empleados-inactivos/reporte-empleados-inactivos.component';
import { ReporteHorasTrabajadasComponent } from './reporte-horas-trabajadas/reporte-horas-trabajadas.component';
import { ReportePuntualidadComponent } from './reporte-puntualidad/reporte-puntualidad.component';
import { AsistenciaConsolidadoComponent } from './reporte-asistencia-consolidado/asistencia-consolidado.component';
import { ReporteTimbresComponent } from './reporte-timbres/reporte-timbres.component';
import { ReportePermisosComponent } from './reporte-permisos/reporte-permisos.component';
import { ReporteAtrasosComponent } from './reporte-atrasos/reporte-atrasos.component';
import { ReporteEntradaSalidaComponent } from './reporte-entrada-salida/reporte-entrada-salida.component';
import { AppRoutingModule } from '../../app-routing.module';
import { AdministradorTodasComponent } from './notificaciones/administrador-todas/administrador-todas.component';
import { PorUsuarioComponent } from './notificaciones/por-usuario/por-usuario.component';
import { OptionTimbreServidorComponent } from './option-timbre-servidor/option-timbre-servidor.component';
import { TimbreAbiertosComponent } from './timbre-abiertos/timbre-abiertos.component';
import { VacunaMultipleComponent } from './vacunas/vacuna-multiple/vacuna-multiple.component';
import { AlimentosInvitadosComponent } from './alimentacion/alimentos-invitados/alimentos-invitados.component';

@NgModule({
  declarations: [
    RangoFechasComponent,
    CriteriosBusquedaComponent,
    ReporteTimbresMultiplesComponent,
    ReporteFaltasComponent,
    ReporteEmpleadosComponent,
    ReporteKardexComponent,
    ReporteHorasPedidasComponent,
    ReporteHorasExtrasComponent,
    AlimentosGeneralComponent,
    DetallePlanificadosComponent,
    ReporteAtrasosMultiplesComponent,
    ReporteEmpleadosInactivosComponent,
    ReporteHorasTrabajadasComponent,
    ReportePuntualidadComponent,
    AsistenciaConsolidadoComponent,
    ReporteTimbresComponent,
    ReportePermisosComponent,
    ReporteAtrasosComponent,
    ReporteEntradaSalidaComponent,
    ListaReportesComponent,
    AdministradorTodasComponent,
    PorUsuarioComponent,
    OptionTimbreServidorComponent,
    TimbreAbiertosComponent,
    VacunaMultipleComponent,
    AlimentosInvitadosComponent,
  ],
  exports: [
    ReporteFaltasComponent,
    ReporteTimbresMultiplesComponent,
    ReporteEmpleadosComponent,
    ReporteKardexComponent,
    ReporteHorasPedidasComponent,
    ReporteHorasExtrasComponent,
    AlimentosGeneralComponent,
    DetallePlanificadosComponent,
    ReporteAtrasosMultiplesComponent,
    ReporteEmpleadosInactivosComponent,
    ReporteHorasTrabajadasComponent,
    ReportePuntualidadComponent,
    AsistenciaConsolidadoComponent,
    ReporteTimbresComponent,
    ReportePermisosComponent,
    ReporteAtrasosComponent,
    ReporteEntradaSalidaComponent,
    ListaReportesComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    FiltrosModule
  ]
})
export class ReportesModule { }
