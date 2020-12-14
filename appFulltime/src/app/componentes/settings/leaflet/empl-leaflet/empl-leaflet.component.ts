import { Component, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as L from 'leaflet';
import { EmpleadoService } from 'src/app/servicios/empleado/empleadoRegistro/empleado.service';

@Component({
  selector: 'app-empl-leaflet',
  templateUrl: './empl-leaflet.component.html',
  styleUrls: ['./empl-leaflet.component.css']
})
export class EmplLeafletComponent implements AfterViewInit {

  COORDS: any;
  MARKER: any;

  constructor(
    private view: MatDialogRef<EmplLeafletComponent>
  ) { }

  ngAfterViewInit(): void {
    const map = L.map('map-template', {
      center: [-0.9286188999999999, -78.6059801],
      zoom: 13
    });

    map.locate({enableHighAccuracy: true})
    
    map.on('click', (e: any) => {
      console.log(e.latlng);
      console.log(this.COORDS, '===', this.MARKER);
      
      const coords: any = [e.latlng.lat, e.latlng.lng];
      const marker = L.marker(coords);
      if (this.COORDS !== undefined) {
        map.removeLayer(this.MARKER);
      } else {
        marker.setLatLng(coords);
      }
      marker.bindPopup('Ubicación vivienda');
      map.addLayer(marker)
      this.COORDS = e.latlng;
      this.MARKER = marker
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}).addTo(map);

  }

  GuardarLocalizacion() {
    this.view.close({message: true, latlng: this.COORDS})
  }

  Salir() {
    this.view.close({message: false})
  }

}
