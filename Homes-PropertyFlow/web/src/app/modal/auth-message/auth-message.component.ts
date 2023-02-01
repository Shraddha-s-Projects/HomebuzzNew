import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthMessageService } from './auth-message.service';
import { CommonService } from '../../../app/core/services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-message',
  templateUrl: './auth-message.component.html',
  styleUrls: ['./auth-message.component.css']
})
export class AuthMessageComponent implements OnInit, OnDestroy {

  public message: string;
  public title: string;
  public btnText1?: string;
  public btnText2?: string;
  public url1?: string;
  public url2?: string;
  public PropertyDetailId: number;
  public pageName: string;
  public agentOptionId: number;
  public role: string;
  public userId: number = +this.cookieService.get("user");
  public _unsubscribeAll = new Subscription();

  constructor(public dialogRef: MatDialogRef<AuthMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private cookieService: CookieService,
    private authMessageService: AuthMessageService,
    private commonService: CommonService) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close(false);
  }

  redirectPage(url) {
    if(this.role == "Admin" && url == "yes"){
      this.dialogRef.close(true);
      return false;
    }
    if (this.btnText1 == "Set password") {
      this.close();
      url ? this.router.navigate(["/" + url]) : '';
    }
    if (url == "yes" && this.PropertyDetailId && this.pageName == "AgentDashboard") {
      this.updateAgentOption();
    } else if (url == "yes" && this.PropertyDetailId && this.pageName == "SearchResultPage") {
      this.dialogRef.close(true);
    } else {
      this.close();
      url ? this.router.navigate(["/" + url]) : '';
    }
  }

  updateAgentOption() {
    let obj = {
      PropertyDetailId: this.PropertyDetailId,
      OwnerId: this.userId,
      AgentOptionId: this.agentOptionId
    }
    this._unsubscribeAll.add(this.authMessageService.updateProperyAgent(obj).subscribe((data: any) => {
      if (data.Success) {
        this.dialogRef.close(true);
      } else {
        this.close();
      }
    },
    error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for agent module. Please login.", false);
          this.close();
        }
    }));
  }

  ngOnDestroy() {
    this._unsubscribeAll.unsubscribe();
  }
}
