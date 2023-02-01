import { Router } from '@angular/router';
import { DashboardService } from '../dashboard/dashboard.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private dashboardservice: DashboardService,
    private router: Router
  ) { }

  ngOnInit() {
    this.logout();
  }

  logout() {
    this.dashboardservice.logout();
  }
}
