import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DepartamentoService } from 'src/app/servicios/catalogos/departamento.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { empty } from 'rxjs';

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
  nombre = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]);
  nivel = new FormControl('', Validators.required);
  departamentoPadre = new FormControl('');
  departamentos: any = [];
  departamentoModificar: any = []

  edit: boolean = false;
  selectPadre;

  //departamentoPadreId;

  // asignar los campos en un formulario en grupo
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
    private rest: DepartamentoService,
    private toastr: ToastrService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.departamentos = this.getDepartamentos();

    const params = this.activeRoute.snapshot.params;
    if (params.id) {
      this.rest.getOneDepartamentoRest(params.id).subscribe(
        res => {
          this.departamentoModificar = res[0];
          this.edit = true;
          console.log(this.departamentoModificar)
          this.nuevoDepartamentoForm.setValue({
            departamentoNombreForm: this.departamentoModificar.nombre,
            departamentoNivelForm: this.departamentoModificar.nivel,
            departamentoDepartamentoPadreForm: this.departamentoModificar.depa_padre
          })



          this.selectNivel = this.niveles[this.departamentoModificar.nivel].valor

          this.obtenerNombre(this.departamentoModificar.depa_padre);


        }, err => {
          console.log(err);
        }
      )
    }

  }

  obtenerMensajeErrorNombre() {
    if (this.nombre.hasError('required')) {
      return 'Campo obligatorio';
    }
    return this.nombre.hasError('pattern') ? 'No ingresar números' : '';
  }

  insertarDepartamento(form) {

    var departamentoPadreId

    var departamentoPadreNombre = form.departamentoDepartamentoPadreForm;

    if (departamentoPadreNombre == ' ' || departamentoPadreNombre == "Ninguna") {
      let datadepartamento = {
        nombre: form.departamentoNombreForm,
        nivel: form.departamentoNivelForm,
        depa_padre: null
      };



      this.rest.postDepartamentoRest(datadepartamento)
        .subscribe(response => {
          this.toastr.success('Operacion Exitosa', 'departamento guardado');

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



        this.rest.postDepartamentoRest(datadepartamento)
          .subscribe(response => {
            this.toastr.success('Operacion Exitosa', 'departamento guardado');

            this.router.navigate(['/', 'departamento']);
          }, error => {
            console.log(error);
          });;

      })

    }




  }


  getDepartamentos() {
    this.departamentos = [];
    this.rest.getDepartamentosRest().subscribe(data => {
      this.departamentos = data;
      this.departamentos[this.departamentos.length] = { nombre: "Ninguna" };
      this.selectPadre = this.departamentos[this.departamentos.length - 1].nombre;


    })
  }



  cancelarRegistroDepartamento() {
    this.router.navigate(['/', 'departamento']);
  }


  modificarDepartamento(form) {
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


  obtenerNombre(id: number){
    this.selectPadre
    this.rest.getOneDepartamentoRest(id).subscribe(data=>{
      console.log(data[0].nombre);
      this.selectPadre=data[0].nombre
    },error=>{

    });
  }




}

