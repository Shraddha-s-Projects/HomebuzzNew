import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  public collapsed = false;
  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit() {
  }

  logOut(){
    this.commonService.onLogoutOptionClick();
  }

}
