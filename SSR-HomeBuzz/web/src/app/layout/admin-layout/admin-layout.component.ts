import { Component, OnInit } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  constructor() { }

   //toaster config
   public config1: ToasterConfig = new ToasterConfig({
    positionClass: "toast-top-right"
  });

  ngOnInit() {
  }

}
