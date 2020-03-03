import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { RolesService } from 'src/app/servicios/roles/roles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-rol',
  templateUrl: './registro-rol.component.html',
  styleUrls: ['./registro-rol.component.css']
})
export class RegistroRolComponent implements OnInit {

  url: string;
  public nuevoRolForm = new FormGroup({
    // idForm: new FormControl('', Validators.required),
    descripcionForm: new FormControl('', Validators.required),
  });
  constructor(
    public rest: RolesService,
    private router: Router
  ) { 
    this.nuevoRolForm.setValue({
      // idForm: '',
      descripcionForm: '',
    });
  }

  ngOnInit(): void {
    this.url = this.router.url;
    console.log(this.router.url);
    this.limpliarCampos();
  }
  limpliarCampos(){
    this.nuevoRolForm.setValue({
      descripcionForm: '',
    });
  }

  insertarRol(form){
    let dataRol= {
      // id: form.idForm,
      descripcion: form.descripcionForm,
    };
    this.rest.postRoles(dataRol).subscribe(response => {
      console.log(response);  
      alert("Rol guardado")
      this.limpliarCampos();
      this.router.navigate(['/','roles']);
    },
      error => {
        console.log(error);
      })
  }
}
