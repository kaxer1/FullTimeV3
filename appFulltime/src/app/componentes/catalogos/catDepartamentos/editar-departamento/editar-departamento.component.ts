import { Component, OnInit, Inject } from '@angular/core';
import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';
import { EmpresaService } from 'src/app/servicios/catalogos/catEmpresa/empresa.service';
import { SucursalService } from 'src/app/servicios/sucursales/sucursal.service';
import { ToastrService } from 'ngx-toastr';
import { Router} from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';

interface Nivel {
  valor: string;
  nombre: string
}

@Component({
  selector: 'app-editar-departamento',
  templateUrl: './editar-departamento.component.html',
  styleUrls: ['./editar-departamento.component.css']
})
export class EditarDepartamentoComponent implements OnInit {

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
  departamentoModificar: any = []
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
    { valor: '0', nombre: '0' },
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
    private router: Router,
    public dialogRef: MatDialogRef<EditarDepartamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public descripcionD: any
  ) { }

  ngOnInit(): void {
    this.BuscarEmpresas();
    this.ValidarCamposModificar();
  }

  ModificarDepartamento(form) {
    var departamentoPadreId
    var departamentoPadreNombre = form.departamentoDepartamentoPadreForm;
    console.log(form.departamentoDepartamentoPadreForm);
    if (departamentoPadreNombre == 'Ninguna' || departamentoPadreNombre == null) {
      let datadepartamento = {
        nombre: form.departamentoNombreForm,
        nivel: form.departamentoNivelForm,
        depa_padre: null,
        id_sucursal: form.idSucursalForm
      };
      this.rest.updateDepartamento(this.descripcionD.id, datadepartamento)
        .subscribe(response => {
          this.toastr.success('Operacion Exitosa', 'Departamento modificado');
          this.router.navigate(['/', 'departamento']);
          this.dialogRef.close();
        }, error => {
          console.log(error);
        });
    } else {
      this.rest.getIdDepartamentoPadre(departamentoPadreNombre).subscribe(data => {
        departamentoPadreId = data[0].id;
        let datadepartamento = {
          nombre: form.departamentoNombreForm,
          nivel: form.departamentoNivelForm,
          depa_padre: departamentoPadreId,
          id_sucursal: form.idSucursalForm
        };
        this.rest.updateDepartamento(this.descripcionD.id, datadepartamento)
          .subscribe(response => {
            this.toastr.success('Operacion Exitosa', 'Departamento modificado');
            this.router.navigate(['/', 'departamento']);
            this.dialogRef.close();
          }, error => {
            console.log(error);
          });
      })
    }
  }

  CerrarVentanaRegistroDepartamento() {
    this.LimpiarCampos();
    this.dialogRef.close();
    window.location.reload();
  }

  LimpiarCampos() {
    this.nuevoDepartamentoForm.reset();
  }

  ValidarCamposModificar() {
    this.idD = this.descripcionD.id;
    this.rest.EncontrarUnDepartamento(parseInt(this.idD)).subscribe(res => {
      this.departamentoModificar = res;
      this.FiltrarSucursalesEditar(this.descripcionD.id_empresa);
      this.ObtenerDepartamentosEditar(this.descripcionD.id_sucursal);
      this.nuevoDepartamentoForm.setValue({
        idEmpresaForm: this.descripcionD.id_empresa,
        idSucursalForm: this.descripcionD.id_sucursal,
        departamentoNombreForm: this.departamentoModificar.nombre,
        departamentoNivelForm: this.departamentoModificar.nivel,
        departamentoDepartamentoPadreForm: this.departamentoModificar.depa_padre
      })
      this.selectNivel = this.niveles[this.departamentoModificar.nivel].valor
      this.ObtenerNombre(this.departamentoModificar.depa_padre);
    }, err => { })
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

  FiltrarSucursalesEditar(idEmpre: number) {
    this.sucursales = [];
    this.restS.BuscarSucEmpresa(idEmpre).subscribe(datos => {
      this.sucursales = datos;
    }, error => {
      this.toastr.info('La Empresa seleccionada no tiene Sucursales registradas')
    })
  }

  ObtenerDepartamentosEditar(idSucursal: number) {
    this.departamentos = [];
    this.rest.BuscarDepartamentoSucursal(idSucursal).subscribe(datos => {
      this.departamentos = datos;
      this.selectPadre = this.departamentos[this.departamentos.length - 1].nombre;
    }, error => {
      this.toastr.info('Sucursal no cuenta con departamentos registrados')
    });
  }

  nombreDepa: any = [];
  ObtenerNombre(id: number) {
    this.nombreDepa = [];
    this.rest.EncontrarUnDepartamento(id).subscribe(datos => {
      this.nombreDepa = datos;
      this.selectPadre = this.nombreDepa.nombre;
    }, error => {
      this.toastr.info('Descripción ingresada no coincide con los registros')
    });
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
