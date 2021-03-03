import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { GraficasService } from 'src/app/servicios/graficas/graficas.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import * as echarts from 'echarts/core';
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

@Component({
  selector: 'app-marcaciones-emp-macro',
  templateUrl: './marcaciones-emp-macro.component.html',
  styleUrls: ['./marcaciones-emp-macro.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ]
})
export class MarcacionesEmpMacroComponent implements OnInit {

  anio_inicio = new FormControl('', Validators.required);
  anio_final = new FormControl('', Validators.required);

  public fechasConsultaForm = new FormGroup({
    fec_inicio: this.anio_inicio,
    fec_final: this.anio_final
  });

  habilitar: boolean = false;
  f_inicio_req: string = '';
  f_final_req: string = '';
  
  marcaciones: any;
  datos_marcaciones: any = [];
  constructor(
    private restGraficas: GraficasService,
    private toastr: ToastrService,
    private restEmpre: EmpresaService,
  ) { 
    this.ObtenerLogo();
    this.ObtenerColores();
  }

  ngOnInit(): void {
    echarts.use(
      [TooltipComponent, LegendComponent, GridComponent, LineChart, CanvasRenderer]
    );
    this.llamarGraficaOriginal()
  }

  thisChart: any;
  chartDom: any;
  llamarGraficaOriginal() {
    let local = sessionStorage.getItem('marcaciones');
    // console.log('LOCAL HORA EXTRA: ',local);
    this.chartDom = document.getElementById('charts_marcaciones_macro') as HTMLCanvasElement;
    this.thisChart = echarts.init(this.chartDom, 'light', {width: 1050, renderer: 'svg',devicePixelRatio: 5 });

    if (local === null) {
      this.restGraficas.MetricaMarcacionesMicro().subscribe(res => {
        // console.log('************* JornadaHoraExtra Micro **************');
        // console.log(res);
        sessionStorage.setItem('marcaciones', JSON.stringify(res))
        this.marcaciones = res.datos_grafica;
        this.datos_marcaciones = res.datos;
        this.thisChart.setOption(res.datos_grafica);
      });
    } else {
      // this.marcaciones = JSON.parse(local);
      let data_JSON = JSON.parse(local);
      this.marcaciones = data_JSON.datos_grafica;
      this.datos_marcaciones = data_JSON.datos;
      this.thisChart.setOption(data_JSON.datos_grafica);
    }
    this.llenarFecha();
  }

  llenarFecha() {
    var f_i = new Date()
    var f_f = new Date()
    f_i.setUTCDate(1); f_i.setUTCMonth(0);
    f_f.setUTCMonth(f_f.getMonth()); f_f.setUTCDate(f_f.getDate());
    this.f_inicio_req = f_i.toJSON().split('T')[0]
    this.f_final_req = f_f.toJSON().split('T')[0]
  }

  ValidarRangofechas(form) {
    var f_i = new Date(form.fec_inicio)
    var f_f = new Date(form.fec_final)

    if (f_i < f_f) {
      

      if (f_i.getFullYear() === f_f.getFullYear()) {
        this.toastr.success('Fechas validas','', {
          timeOut: 6000,
        });

        this.f_inicio_req = f_i.toJSON().split('T')[0];
        this.f_final_req = f_f.toJSON().split('T')[0];
        this.habilitar = true

        this.restGraficas.MetricaMarcacionesMacro(this.f_inicio_req, this.f_final_req).subscribe(res => {
          console.log('#################### Marcaciones Macro #######################');
          console.log(res);
          this.marcaciones = res.datos_grafica;
          this.datos_marcaciones = res.datos;
          this.thisChart.setOption(res.datos_grafica);;
        });
      } else {
        this.toastr.error('Años de consulta diferente','Solo puede consultar datos de un año en concreto', {
          timeOut: 6000,
        });
      }
      

    } else if (f_i > f_f) {
      this.toastr.info('Fecha final es menor a la fecha inicial','', {
        timeOut: 6000,
      });
      this.fechasConsultaForm.reset();
    } else if (f_i.toLocaleDateString() === f_f.toLocaleDateString()) {
      this.toastr.info('Fecha inicial es igual a la fecha final','', {
        timeOut: 6000,
      });
      this.fechasConsultaForm.reset();
    }
    console.log(f_i.toJSON());
    console.log(f_f.toJSON());
  }

  logo: any = String;
  ObtenerLogo() {
    this.restEmpre.LogoEmpresaImagenBase64(localStorage.getItem('empresa')).subscribe(res => {
      this.logo = 'data:image/jpeg;base64,' + res.imagen;
    });
  }

  p_color: any;
  s_color: any;
  ObtenerColores() {
    this.restEmpre.ConsultarDatosEmpresa(parseInt(localStorage.getItem('empresa'))).subscribe(res => {
      this.p_color = res[0].color_p;
      this.s_color = res[0].color_s;
    });
  }

  graficaBase64: any;
  metodosPDF(accion){  
    this.graficaBase64 = this.thisChart.getDataURL({type: 'jpg' , pixelRatio: 5 });
    this.generarPdf(accion) 
  }

  generarPdf(action) {
    const documentDefinition = this.getDocumentDefinicion();
    var f = new Date()
    let doc_name = "metrica_marcaciones" + f.toLocaleString() + ".pdf";
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(doc_name); break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    }

  }

  getDocumentDefinicion() {
    return {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [ 30, 60, 30, 40 ],
      watermark: { text: 'Confidencial', color: 'blue', opacity: 0.1, bold: true, italics: false },
      header: { text: 'Impreso por:  ' + localStorage.getItem('fullname_print'), margin: 10, fontSize: 9, opacity: 0.3, alignment: 'right' },

      footer: function (currentPage, pageCount, fecha) {
        var h = new Date();
        var f = moment();
        fecha = f.format('YYYY-MM-DD');
        h.setUTCHours(h.getHours());
        var time = h.toJSON().split("T")[1].split(".")[0];
        
        return {
          margin: 10,
          columns: [
            { text: 'Fecha: ' + fecha + ' Hora: ' + time, opacity: 0.3 },
            { text: [
                {
                  text: '© Pag ' + currentPage.toString() + ' of ' + pageCount,
                  alignment: 'right', opacity: 0.3
                }
              ],
            }
          ],
          fontSize: 10
        }
      },
      content: [
        { image: this.logo, width: 100, margin: [10, -25, 0, 5] },
        { text: 'Métrica Marcaciones', bold: true, fontSize: 20, alignment: 'center', margin: [0, -40, 0, 10] },
        { text: 'Desde: ' + this.f_inicio_req + " Hasta: " + this.f_final_req, bold: true, fontSize: 13, alignment: 'center' },
        { image: this.graficaBase64, width: 525, margin: [0, 10, 0, 10] },
        ...this.ImprimirDatos().map(obj => {
          return obj
        }),
        { text: this.texto_grafica, margin: [10, 10, 10, 10], alignment: 'justify' },
      ],
      styles: {
        tableHeader: { fontSize: 10, bold: true, alignment: 'center', fillColor: this.p_color },
        itemsTable: { fontSize: 8 },
        itemsTableD: { fontSize: 8, alignment: 'center' }
      }
    };
  }

  ImprimirDatos() {
    let datos = this.datos_marcaciones.filter(obj => {

      return this.marcaciones.xAxis.data.includes(obj.mes)
    })
    
    let n: any = [];
    let colums = { alignment: 'justify', columns: [] };
    let colums1 = { alignment: 'justify', columns: [] };
    let colums2 = { alignment: 'justify', columns: [] };
    let colums3 = { alignment: 'justify', columns: [] };

    for (let i = 0; i < datos.length; i++) {

      if (i >= 0 && i <= 2) {
        colums.columns.push({
          text: datos[i].mes + ': ' + datos[i].valor, margin: [11,0,0,5]
        });
      };
      if (i >= 3 && i <= 5) {
        colums1.columns.push({
          text: datos[i].mes + ': ' + datos[i].valor, margin: [11,0,0,5]
        });
      };
      if (i >= 6 && i <= 8) {
        colums2.columns.push({
          text: datos[i].mes + ': ' + datos[i].valor, margin: [11,0,0,5]
        });
      }; 
      if (i >= 9 && i <= 11) {
        colums3.columns.push({
          text: datos[i].mes + ': ' + datos[i].valor, margin: [11,0,0,5] 
        });
      }
    }
    
    if (colums.columns.length > 0) { n.push(colums); }
    if (colums1.columns.length > 0) { n.push(colums1); }
    if (colums2.columns.length > 0) { n.push(colums2); }
    if (colums3.columns.length > 0) { n.push(colums3); }    

    return n
  }

  limpiarCamposRango() {
    this.fechasConsultaForm.reset();
    this.habilitar = false;
    this.llamarGraficaOriginal();
  }

  texto_grafica: string = 
  "Este es uno de los indicadores de rendimiento más reconocidos, y sirve para ver el cumplimiento de todos " +
  "los trabajadores. A través del uso de este indicador puedes ver la cantidad de trabajadores que realizan " +
  "su registro al interior de tu compañía de manera mensual y anual. \n" +
  "Las marcaciones son en tiempo real, y tanto la empresa como el trabajador pueden ver sus registros y " +
  "realizar también reportes en base a estos.";

}
