import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { RangoFechasComponent } from './rango-fechas/rango-fechas.component';
import { ReporteFaltasComponent } from './reporte-faltas/reporte-faltas.component';
import { CriteriosBusquedaComponent } from './criterios-busqueda/criterios-busqueda.component';
import { ReporteTimbresMultiplesComponent } from './reporte-timbres-multiples/reporte-timbres-multiples.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { PaginatePipe } from 'src/app/pipes/paginate.pipe';


//Pipe
// PaginatePipe
@NgModule({
  declarations: [
    RangoFechasComponent,
    CriteriosBusquedaComponent,
    ReporteTimbresMultiplesComponent,
    ReporteFaltasComponent,
  ],
  exports: [
    ReporteFaltasComponent,
    ReporteTimbresMultiplesComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatExpansionModule,
    FormsModule,
    MatPaginatorModule,
    MatDatepickerModule, 
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class ReportesModule { }
