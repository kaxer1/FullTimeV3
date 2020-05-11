import { Component, ViewChild, HostBinding, Input, OnInit,  } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {FormControl} from '@angular/forms';
import { LoginService } from 'src/app/servicios/login/login.service';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']

})
export class MainNavComponent implements OnInit {

  UserEmail: string;
  UserName: string;
  iniciales: string;
  urlImagen: any;
  mostrarImagen: boolean = false;
  mostrarIniciales: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  pestania: string;

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public location: Location,
    public loginService: LoginService,
    private empleadoService: EmpleadoService,
    private roter: Router
  ) {
    var tituloPestania = this.location.prepareExternalUrl(this.location.path());
    tituloPestania = tituloPestania.slice(1);
    this.pestania = tituloPestania;
  }

  isExpanded = true;
  isShowing = false;

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  ngOnInit() {
    this.infoUser();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  
  infoUser(){
    const id_empleado = parseInt(localStorage.getItem('empleado'));
    if(id_empleado.toString() === 'NaN') return id_empleado;

    this.empleadoService.getOneEmpleadoRest(id_empleado).subscribe(res => {
      
      this.UserEmail = res[0].correo;
      this.UserName = res[0].nombre.split(" ")[0] + " " + res[0].apellido.split(" ")[0];
      if ( res[0]['imagen'] != null){
        this.urlImagen = 'http://localhost:3000/empleado/img/' + res[0]['imagen'];
        this.mostrarImagen = true;
        this.mostrarIniciales = false;
      } else {
        this.iniciales = res[0].nombre.split(" ")[0].slice(0,1) + res[0].apellido.split(" ")[0].slice(0,1);
        this.mostrarIniciales = true
        this.mostrarImagen = false;
      }
    });
  }


}
