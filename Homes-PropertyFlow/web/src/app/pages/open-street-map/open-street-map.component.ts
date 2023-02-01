import { Component, OnInit, NgZone, Input, ElementRef, ViewChild, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';


declare var ol: any;

@Component({
  selector: 'app-open-street-map',
  templateUrl: './open-street-map.component.html',
  styleUrls: ['./open-street-map.component.css']
})
export class OpenStreetMapComponent implements OnInit {
  latitude: number = -36.49;
  longitude: number = 174.47;

  map: any;
  constructor() {
  }

  ngOnInit() {
    //   this.map = new ol.Map({
    //   target: 'map',
    //   layers: [
    //     new ol.layer.Tile({
    //       source: new ol.source.OSM()
    //     })
    //   ],
    //   view: new ol.View({
    //     center: ol.proj.fromLonLat([this.longitude, this.latitude]),
    //     zoom: 8
    //   })
    // });
    var mousePositionControl = new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(4),
      projection: 'EPSG:4326',
      // comment the following two lines to have the mouse position
      // be placed within the map.
      className: 'custom-mouse-position',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;'
    });


    this.map = new ol.Map({
      target: 'map',
      controls: ol.control.defaults({
        attributionOptions: {
          collapsible: false
        }
      }).extend([mousePositionControl]),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.longitude, this.latitude]),
        zoom: 8
      })
    });
    this.map.on('click', function (args) {
      console.log(args);
      console.log(args.coordinate);
      var lonlat = ol.proj.transform(args.coordinate, 'EPSG:3857', 'EPSG:4326');
      console.log(lonlat);
    
      var lon = lonlat[0];
      var lat = lonlat[1];
      // alert(`lat: ${lat} long: ${lon}`);
    });
  }

}

