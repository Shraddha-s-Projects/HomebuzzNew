import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { CommonModalService } from 'src/app/common-modal.service';
import { CommonService } from 'src/app/core/services/common.service';
import { TermsComponent } from 'src/app/modal/terms/terms.component';
import { PrivacyPolicyComponent } from 'src/app/modal/privacy-policy/privacy-policy.component';
import { WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-admin-footer',
  templateUrl: './admin-footer.component.html',
  styleUrls: ['./admin-footer.component.css']
})
export class AdminFooterComponent implements OnInit {

  // open modal variable
  public modalComponent: any;
  public modalProperty: any;
  public pageName: string;
  public currentYear = moment(new Date()).format('YYYY');

  constructor(
    @Inject(WINDOW) private window,
    private commonModalService: CommonModalService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  getRandom() {
    return Math.floor(Math.random() * 10) + 1;
  }
  
  onTermsOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[2];
    this.modalComponent = TermsComponent;
    this.window.history.pushState(null, null, "admin/" + this.pageName + '/terms' + "/" + this.getRandom());
    this.commonModalService.openTermsDialog("TermsComponent", false, true);
  }

  onPrivacyOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[2];
    this.modalComponent = PrivacyPolicyComponent;
    this.window.history.pushState(null, null, "admin/" + this.pageName + '/privacy' + "/" + this.getRandom());
    this.commonModalService.openPrivacyDialog("PrivacyPolicyComponent", false, true);
  }

}
