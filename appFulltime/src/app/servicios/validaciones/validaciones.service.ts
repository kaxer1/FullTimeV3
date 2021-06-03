import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ValidacionesService {

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }


  /**
   * REDIRECCION POR ACCESO A MODULOS NO AUTORIZADOS
   */

  RedireccionarEstadisticas(error) {
    const { access, message, text } = error;
    console.log(error);
    console.log(access, message);
    if (access === false) {
      this.toastr.error(message);
      this.router.navigate(['/estadisticas']);
    }
    if (text) {
      this.toastr.error(text)
    }
    // this.router.navigate(['/estadisticas', { relativeTo: this.route, skipLocationChange: false }]);
  }

  RedireccionarHomeAdmin(error) {
    const { access, message, text, url } = error;
    console.log(error);
    console.log(access, message);

    if (access === false) {
      this.toastr.error(message)
        .onTap.subscribe(items => {
          if (url) {
            window.open(`https://${url}`, "_blank");
          }
        });
      this.router.navigate(['/home']);
      // this.router.navigate(['/home', { relativeTo: this.route, skipLocationChange: false }]);
    }
    if (text) {
      this.toastr.error(text)
    }
  }

  RedireccionarMixto(error) {
    const { access, message, text, url} = error;
    console.log(error);
    console.log(access, message);
    if (access === false) {
      this.toastr.error(message )
        .onTap.subscribe(items => {
          if (url) {
            window.open(`https://${url}`, "_blank");
          }
        });
      this.router.navigate(['/']);
      // this.router.navigate(['/', { relativeTo: this.route, skipLocationChange: false }]);
    }
    if (text) {
      this.toastr.error(text)
    }
  }

  /**
   * METODOS PARA CONTROLAR INGRESO DE LETRAS
   */

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
      this.toastr.info('No se admite datos numéricos', 'Usar solo letras', {
        timeOut: 6000,
      })
      return false;
    }
  }

  IngresarSoloNumeros(evt) {
    if (window.event) {
      var keynum = evt.keyCode;
    }
    else {
      keynum = evt.which;
    }
    // Comprobamos si se encuentra en el rango numérico y que teclas no recibirá.
    if ((keynum > 47 && keynum < 58) || keynum == 8 || keynum == 13 || keynum == 6) {
      return true;
    }
    else {
      this.toastr.info('No se admite el ingreso de letras', 'Usar solo números', {
        timeOut: 6000,
      })
      return false;
    }
  }

}
