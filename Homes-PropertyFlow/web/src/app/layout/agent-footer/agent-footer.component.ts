import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TermsComponent } from '../../../app/modal/terms/terms.component';
import { CommonModalService } from '../../../app/common-modal.service';
import { CommonService } from '../../../app/core/services/common.service';
import { PrivacyPolicyComponent } from '../../../app/modal/privacy-policy/privacy-policy.component';
import { WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-agent-footer',
  templateUrl: './agent-footer.component.html',
  styleUrls: ['./agent-footer.component.css']
})
export class AgentFooterComponent implements OnInit {

  // open modal variable
  public modalComponent: any;
  public modalProperty: any;
  public pageName: string;

  constructor(@Inject(WINDOW) private window: Window,
    private commonModalService: CommonModalService,
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
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, "agent/" + this.pageName + '/terms' + "/" + this.getRandom());
    }
    this.commonModalService.openTermsDialog("TermsComponent", true);
  }

  onPrivacyOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[2];
    this.modalComponent = PrivacyPolicyComponent;
    if (typeof this.window !== 'undefined' && this.window.history) {
    this.window.history.pushState(null, null, "agent/" + this.pageName + '/privacy' + "/" + this.getRandom());
    }
    this.commonModalService.openPrivacyDialog("PrivacyPolicyComponent", true);
  }

}
