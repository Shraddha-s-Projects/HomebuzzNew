import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModalService } from 'src/app/common-modal.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  public collapsed = false;
  constructor(
    private route: ActivatedRoute,
    private commonModalService: CommonModalService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["pageName"]) {
        let pageName = params["pageName"];
        if (pageName == "terms") {
          this.commonModalService.openTermsDialog("TermsComponent", false, true);
        } else if (pageName == "privacy") {
          this.commonModalService.openPrivacyDialog("PrivacyPolicyComponent", false, true);
        }
      }
    });
  }

}
