import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';

interface Nivel {
  valor: string;
  nombre: string
}

@Component({
  selector: 'app-registro-departamento',
  templateUrl: './registro-departamento.component.html',
  styleUrls: ['./registro-departamento.component.css'],
  //encapsulation: ViewEncapsulation.None
})

export class RegistroDepartamentoComponent implements OnInit {

  // Control de los campos del formulario
  nombre = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);
  nivel = new FormControl('', Validators.required);
  departamentoPadre = new FormControl('');
  idEmpresaF = new FormControl('', Validators.required);
  idSucursalF = new FormControl('', Validators.required);

  // Datos Departamento
  empresas: any = [];
  sucursales: any = [];
  departamentos: any = [];
  departamentoId: any = [];
  departamentoModificar: any = []
  editarDepartamento: boolean = false;
  selectPadre;
  idD = '';
  nombreD = '';

  // Asignar los campos en un formulario en grupo
  public nuevoDepartamentoForm = new FormGroup({
    departamentoNombreForm: this.nombre,
    departamentoNivelForm: this.nivel,
    departamentoDepartamentoPadreForm: this.departamentoPadre,
    idEmpresaForm: this.idEmpresaF,
    idSucursalForm: this.idSucursalF,
  });

  // Arreglo de niveles existentes
  niveles: Nivel[] = [
    { valor: '1', nombre: '1' },
    { valor: '2', nombre: '2' },
    { valor: '3', nombre: '3' },
    { valor: '4', nombre: '4' },
    { valor: '5', nombre: '5' }
  ];
  selectNivel: string = this.niveles[0].valor;

  constructor(
    private rest: DepartamentosService,
    private restE: EmpresaService,
    private restS: SucursalService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<RegistroDepartamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public descripcionD: any) { }

  ngOnInit(): void {
    this.BuscarEmpresas();
  }

  BuscarEmpresas() {
    this.empresas = [];
    this.restE.ConsultarEmpresas().subscribe(datos => {
      this.empresas = datos;
    })
  }

  FiltrarSucursales(form) {
    let idEmpre = form.idEmpresaForm
    this.sucursales = [];
    this.restS.BuscarSucEmpresa(idEmpre).subscribe(datos => {
      this.sucursales = datos;
    }, error => {
      this.toastr.info('La Empresa seleccionada no tiene Sucursales registradas')
    })
  }

  InsertarDepartamento(form) {
    var departamentoPadreId;
    var departamentoPadreNombre = form.departamentoDepartamentoPadreForm;
    var datosDepartamento = {
      nombre: form.departamentoNombreForm,
      nivel: form.departamentoNivelForm,
      depa_padre: departamentoPadreNombre,
      id_sucursal: form.idSucursalForm
    };
    if (departamentoPadreNombre === 0) {
      datosDepartamento.depa_padre = null;
      this.rest.postDepartamentoRest(datosDepartamento).subscribe(response => {
        this.toastr.success('Operación Exitosa', 'Departamento registrado');
        this.LimpiarCampos();
      });
    }
    else {
      this.rest.getIdDepartamentoPadre(departamentoPadreNombre).subscribe(datos => {
        departamentoPadreId = datos[0].id;
        datosDepartamento.depa_padre = departamentoPadreId;
        this.rest.postDepartamentoRest(datosDepartamento).subscribe(response => {
          this.toastr.success('Operación Exitosa', 'Departamento registrado');
          this.LimpiarCampos();
        });
      })
    }
  }

  ObtenerDepartamentos(form) {
    this.departamentos = [];
    let idSucursal = form.idSucursalForm;
    this.rest.BuscarDepartamentoSucursal(idSucursal).subscribe(datos => {
      this.departamentos = datos;
      this.selectPadre = this.departamentos[this.departamentos.length - 1].nombre;
    }, error => {
      this.toastr.info('Sucursal no cuenta con departamentos registrados')
    });
  }

  ObtenerNombre(id: number) {
    this.selectPadre
    this.rest.EncontrarUnDepartamento(id).subscribe(datos => {
      this.selectPadre = datos[0].nombre
    }, error => {
      this.toastr.info('Descripción ingresada no coincide con los registros')
    });
  }

  LimpiarCampos() {
    this.nuevoDepartamentoForm.reset();
  }

  CerrarVentanaRegistroDepartamento() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

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
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras')
      return false;
    }
  }

  ObtenerMensajeErrorNombre() {
    if (this.nombre.hasError('required')) {
      return 'Campo obligatorio';
    }
    return this.nombre.hasError('pattern') ? 'Ingresar un nombre válido' : '';
  }
  
}

