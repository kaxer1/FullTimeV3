import { Component, ViewChild, HostBinding, Input, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Location } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
 
})
export class MainNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  pestania: string;
  constructor(
    private breakpointObserver: BreakpointObserver,
    public location: Location,
    
  ) {
    var tituloPestania = this.location.prepareExternalUrl(this.location.path());
    tituloPestania = tituloPestania.slice(1);
    this.pestania = tituloPestania;
    
  }

  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = true;
  EmpleadoSubmenu: boolean = false;
  AdminSubmenu: boolean = false
  AlmuerzoSubmenu: boolean = false
  DescargaSubmenu: boolean = false
  isShowing = false;
  showSubSubMenu: boolean = false;

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



}
