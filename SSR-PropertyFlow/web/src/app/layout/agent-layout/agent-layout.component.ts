import { Component, OnInit } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-agent-layout',
  templateUrl: './agent-layout.component.html',
  styleUrls: ['./agent-layout.component.css']
})
export class AgentLayoutComponent implements OnInit {

  constructor() { }

  //toaster config
  public config1: ToasterConfig = new ToasterConfig({
    positionClass: "toast-top-right"
  });

  ngOnInit() {
  }

}
