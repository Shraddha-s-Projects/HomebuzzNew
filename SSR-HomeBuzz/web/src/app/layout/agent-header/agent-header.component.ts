import { Component, OnInit, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Component({
  selector: 'app-agent-header',
  templateUrl: './agent-header.component.html',
  styleUrls: ['./agent-header.component.css']
})
export class AgentHeaderComponent implements OnInit {
  public url: string;
  public rolename: string = this.cookieService.get("rolename");
  public username: string;
  public isUserCookieExist: boolean = this.cookieService.check("user");
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private cookieService: CookieService,
    private router: Router) {
    this.username = this.localStorage.getItem("userame");
  }

  ngOnInit() {
    this.url = this.router.url;
  }

  onLogoutOptionClick() {
    this.cookieService.deleteAll();
    this.localStorage.removeItem("roleId");
    this.localStorage.removeItem("userId");
    this.localStorage.removeItem("rolename");
    this.localStorage.removeItem("userame");
    // localStorage.removeItem("userame");
    this.router.navigate(['/login']);
  }
}
