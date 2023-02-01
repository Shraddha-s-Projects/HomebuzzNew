import { Component, OnInit, Output, EventEmitter, ViewChild, Input, OnDestroy, ViewContainerRef, ComponentFactoryResolver, Inject } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { SearchResultPageService } from "../../pages/search-result-page/search-result-page.service";
import { PropertyClaim } from "./claim-home";
import { CommonService } from "../../../app/core/services/common.service";
import { EventEmitterService } from "../../../app/event-emitter.service";
import { TermsComponent } from "../terms/terms.component";
import { PrivacyPolicyComponent } from "../privacy-policy/privacy-policy.component";
import { MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";
import { CommonModalService } from "../../../app/common-modal.service";
import { Subscription } from "rxjs";
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: "claimHomeModal",
  templateUrl: "./claim-home.component.html",
  styleUrls: ["./claim-home.component.css"]
})
export class ClaimHomeComponent implements OnInit, OnDestroy {
  @ViewChild("ClaimHome", { static: false }) modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() PropertyDetailId: number;
  @Input() PropertyAddress: string;
  public isLoaded: boolean;
  public modalComponent: any;

  public userId: string;
  public pageName: string;
  public _unsubscribeAll = new Subscription();

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any,
    public dialogRef: MatDialogRef<ClaimHomeComponent>,
    private searchResultPageService: SearchResultPageService,
    private commonService: CommonService,
    private eventEmitterService: EventEmitterService,
    private commonModalService: CommonModalService,
    private router: Router) {
    this.userId = this.localStorage.getItem("userId")
  }

  ngOnInit() {
    this.isLoaded = true;
  }

  close() {
    this.dialogRef.close(false);
  }

  confirmClaim() {
    var modal = new PropertyClaim();
    modal.PropertyDetailId = this.PropertyDetailId;
    modal.OwnerId = parseInt(this.userId);
    modal.Address = this.PropertyAddress;
    this._unsubscribeAll.add(this.searchResultPageService.claimHome(modal).subscribe(data => {
      if (data.Success) {
        let climObject = {};
        if (data.ErrorMessage) {
          let ToastMessage = data.ErrorMessage;
          this.commonService.toaster(ToastMessage, false);
        } else {
          let ToastMessage = "You have successfully claimed " + this.PropertyAddress + " for the next 28 days. A confirmation email has been sent to you.";
          this.commonService.toaster(ToastMessage, true);
          this.eventEmitterService.onGetPropertyEventEmmit(this.PropertyDetailId, "ClaimProperty");
        }
        this.dialogRef.close(false);
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for claim property module. Please login.", false);
          this.close();
        }
      }));
  }

  onTermsLinkClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    let isAgent = false;
    if (this.pageName == "agent") {
      isAgent = true;
      this.pageName = url[2];
    }
    this.modalComponent = TermsComponent;
    if (isAgent) {
      if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, "agent/" + this.pageName + '/terms/' + this.getRandom());
      }
      this.commonModalService.openTermsDialog("TermsComponent", true);
    } else {
      if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, this.pageName + '/terms/' + this.getRandom());
      }
      this.commonModalService.openTermsDialog("TermsComponent");
    }
  }

  onPrivacyPolicyLinkClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    let isAgent = false;
    if (this.pageName == "agent") {
      isAgent = true;
      this.pageName = url[2];
    }
    this.modalComponent = PrivacyPolicyComponent;
    if (isAgent) {
      if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, "agent/" + this.pageName + '/privacy/' + this.getRandom());
      }
      this.commonModalService.openPrivacyDialog("PrivacyPolicyComponent", true);
    } else {
      if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, this.pageName + '/privacy/' + this.getRandom());
      }
      this.commonModalService.openPrivacyDialog("PrivacyPolicyComponent");
    }
  }

  getRandom() {
    return Math.floor(Math.random() * 10) + 1;
  }

  ngOnDestroy() {
    this._unsubscribeAll.unsubscribe();
  }
}
