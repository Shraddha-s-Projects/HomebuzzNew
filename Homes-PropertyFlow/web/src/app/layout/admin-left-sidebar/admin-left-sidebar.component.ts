import { Component, OnInit, Inject } from '@angular/core';
import { WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-admin-left-sidebar',
  templateUrl: './admin-left-sidebar.component.html',
  styleUrls: ['./admin-left-sidebar.component.css']
})
export class AdminLeftSidebarComponent implements OnInit {
  public collapsed = false;
  
  constructor(
    @Inject(WINDOW) private window: Window
  ) { }

  ngOnInit() {
  }

  getActiveMenu(paths) {
    let _this = this;
    let retClass = '';
    paths.forEach(function(path) {
      if (_this.window.location.href.indexOf(path) >= 0) {
        retClass = 'active';
      }
    });
    return retClass;
  }

}
