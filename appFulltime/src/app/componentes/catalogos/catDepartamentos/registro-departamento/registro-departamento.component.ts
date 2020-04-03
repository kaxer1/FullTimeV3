import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DepartamentosService } from 'src/app/servicios/catalogos/catDepartamentos/departamentos.service';

interface Nivel {
  valor: string;
  nombre: string
}

@Component({
  selector: 'app-registro-departamento',
  templateUrl: './registro-departamento.component.html',
  styleUrls: ['./registro-departamento.component.css']
})

export class RegistroDepartamentoComponent implements OnInit {

  // Control de los campos del formulario
  nombre = new FormControl('', [Validators.required, Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{4,48}")]);
  nivel = new FormControl('', Validators.required);
  departamentoPadre = new FormControl('');

  // Datos Departamento
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
    departamentoDepartamentoPadreForm: this.departamentoPadre
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
    private toastr: ToastrService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<RegistroDepartamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public descripcionD: any) { }

  ngOnInit(): void {
    this.departamentos = this.ObtenerDepartamentos();
    if (this.descripcionD) {
      this.ValidarCamposModificar();
    }
  }

  InsertarDepartamento(form) {
    var departamentoPadreId;
    var departamentoPadreNombre = form.departamentoDepartamentoPadreForm;
    if (departamentoPadreNombre === 'Seleccionar' || departamentoPadreNombre === 'Ninguno') {
      this.rest.ConsultarIdNombreDepartamentos('Ninguno').subscribe(datos => {
        this.departamentoId = datos;
        for (let i = this.departamentoId.length - 1; i >= 0; i--) {
          var id_dePadre = this.departamentoId[i]['id'];
          departamentoPadreNombre = id_dePadre;
        }
        let datosDepartamento = {
          nombre: form.departamentoNombreForm,
          nivel: form.departamentoNivelForm,
          depa_padre: departamentoPadreNombre,
        };
        this.rest.postDepartamentoRest(datosDepartamento).subscribe(response => {
          this.toastr.success('Operación Exitosa', 'Departamento registrado');
          this.LimpiarCampos();
        }, error => {
          this.toastr.error('Operación Fallida', 'Departamento no pudo ser registrado')
        });
      }, (error) => {
        this.toastr.info('Descripción ingresada no coincide con los registros')
      })
    }
    else {
      this.rest.getIdDepartamentoPadre(departamentoPadreNombre).subscribe(datos => {
        departamentoPadreId = datos[0].id;
        let datosDepartamento = {
          nombre: form.departamentoNombreForm,
          nivel: form.departamentoNivelForm,
          depa_padre: departamentoPadreId
        };
        this.rest.postDepartamentoRest(datosDepartamento).subscribe(response => {
          this.toastr.success('Operación Exitosa', 'Departamento registrado');
          this.LimpiarCampos();
        }, error => {
          this.toastr.error('Operación Fallida', 'Departamento no pudo ser registrado')
        });
      })
    }
  }

  ObtenerDepartamentos() {
    this.departamentos = [];
    this.rest.ConsultarNombreDepartamentos().subscribe(datos => {
      this.departamentos = datos;
      this.departamentos[this.departamentos.length] = { nombre: "Seleccionar" };
      this.selectPadre = this.departamentos[this.departamentos.length - 1].nombre;
    })
  }

  ObtenerNombre(id: number) {
    this.selectPadre
    this.rest.getOneDepartamentoRest(id).subscribe(datos => {
      this.selectPadre = datos[0].nombre
    }, error => {
      this.toastr.info('Descripción ingresada no coincide con los registros')
    });
  }

  LimpiarCampos() {
    this.nuevoDepartamentoForm.reset();
    this.ObtenerDepartamentos();
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

  ModificarDepartamento(form) {
    var departamentoPadreId
    var departamentoPadreNombre = form.departamentoDepartamentoPadreForm;
    console.log(form.departamentoDepartamentoPadreForm);
    if (departamentoPadreNombre == 'Ninguna' || departamentoPadreNombre == null) {
      let datadepartamento = {
        nombre: form.departamentoNombreForm,
        nivel: form.departamentoNivelForm,
        depa_padre: null
      };
      this.rest.updateDepartamento(this.activeRoute.snapshot.params.id, datadepartamento)
        .subscribe(response => {
          this.toastr.success('Operacion Exitosa', 'Departamento modificado');
          this.router.navigate(['/', 'departamento']);
        }, error => {
          console.log(error);
        });
    } else {
      this.rest.getIdDepartamentoPadre(departamentoPadreNombre).subscribe(data => {
        departamentoPadreId = data[0].id;
        let datadepartamento = {
          nombre: form.departamentoNombreForm,
          nivel: form.departamentoNivelForm,
          depa_padre: departamentoPadreId
        };
        this.rest.updateDepartamento(this.activeRoute.snapshot.params.id, datadepartamento)
          .subscribe(response => {
            this.toastr.success('Operacion Exitosa', 'Departamento modificado');

            this.router.navigate(['/', 'departamento']);
          }, error => {
            console.log(error);
          });
      })
    }
  }

  ValidarCamposModificar() {
    this.idD = this.descripcionD.id;
    this.rest.getOneDepartamentoRest(parseInt(this.idD)).subscribe(res => {
      this.departamentoModificar = res[0];
      this.editarDepartamento = true;
      this.nuevoDepartamentoForm.setValue({
        departamentoNombreForm: this.departamentoModificar.nombre,
        departamentoNivelForm: this.departamentoModificar.nivel,
        departamentoDepartamentoPadreForm: this.departamentoModificar.depa_padre
      })
      this.selectNivel = this.niveles[this.departamentoModificar.nivel].valor
      this.ObtenerNombre(this.departamentoModificar.depa_padre);
    }, err => { })
  }
}

