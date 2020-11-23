import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-empl-leaflet',
  templateUrl: './empl-leaflet.component.html',
  styleUrls: ['./empl-leaflet.component.css']
})
export class EmplLeafletComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    const map = L.map('map-template', {
      center: [51.505, -0.09],
      zoom: 13
    });

    map.locate({enableHighAccuracy: true})

    map.on('locationfound', e => {
      console.log(e);
      
      const coords: any = [e.latlng.lat, e.latlng.lng];
      console.log(coords);
      
      const marker = L.marker(coords);
      marker.bindPopup('Estas aqui');
      map.addLayer(marker)
    })
    //LatLngExpression

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}).addTo(map);
    const marker = L.marker([-0.9286188999999999, -78.6059801])
    marker.bindPopup('Estas aqui');
    map.addLayer(marker)

  }

}
