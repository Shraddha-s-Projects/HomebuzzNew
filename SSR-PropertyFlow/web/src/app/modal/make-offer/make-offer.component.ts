import { Component, OnInit, ViewChild, EventEmitter, Output, Input, OnDestroy, Inject } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { PropertyOffer } from "./make-offer";
import { SearchResultPageService } from "../../../app/pages/search-result-page/search-result-page.service";
import { CommonService } from "../../../app/core/services/common.service";
import { PrivacyPolicyComponent } from "../privacy-policy/privacy-policy.component";
import { TermsComponent } from "../terms/terms.component";
import { ClaimHomeComponent } from "../claim-home/claim-home.component";
import { MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";
import { EventEmitterService } from "../../../app/event-emitter.service";
import { CommonModalService } from "../../../app/common-modal.service";
import { Subscription } from "rxjs";
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: "makeOfferModal",
  templateUrl: "./make-offer.component.html",
  styleUrls: ["./make-offer.component.css"]
})
export class MakeOfferComponent implements OnInit, OnDestroy {
  // @ViewChild("MakeOffer", {static: false}) modal: ModalDirective;
  @ViewChild("PrivacyPolicyModal", { static: false }) PrivacyPolicyModal: PrivacyPolicyComponent;
  @ViewChild("termHomeModal", { static: false }) termHomeModal: TermsComponent;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
  @Input() PropertyDetailId: number;
  @Input() PropertyAddress: string;

  public userId: string;
  public offeringAmount: number;
  public isClicked: boolean;
  public isChecked: boolean;
  public modalComponent: any;
  public pageName: string;
  public isSubmit: boolean;
  public _unsubscribeAll = new Subscription();

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, private searchResultPageService: SearchResultPageService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<ClaimHomeComponent>,
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private commonModalService: CommonModalService) {
    this.userId = this.localStorage.getItem("userId")
  }

  ngOnInit() { }

  show() {
    this.isClicked = false;
  }

  close() {
    this.offeringAmount = undefined;
    this.dialogRef.close(false);
  }

  confirmOffer() {
    this.isClicked = true;
    this.isSubmit = true;
    if (!this.isChecked) {
      this.isClicked = false;
      return false;
    }
    var modal = new PropertyOffer();
    modal.PropertyDetailId = this.PropertyDetailId;
    modal.UserId = parseInt(this.userId);
    modal.OfferingAmount = this.offeringAmount;
    modal.Address = this.PropertyAddress;
    this._unsubscribeAll.add(this.searchResultPageService.makeOffer(modal).subscribe(data => {
      if (data.Success) {
        let ToastMessage = `You have successfully submitted an offer on ${this.PropertyAddress}. A confirmation email has been sent to you.`;
        this.commonService.toaster(ToastMessage, true);
        this.offeringAmount = null;
        let makeOfferObject = {};
        makeOfferObject["PropertyDetailId"] = this.PropertyDetailId;
        makeOfferObject["Status"] = "make offer";
        this.dialogRef.close(false);
        this.eventEmitterService.onGetPropertyEventEmmit(this.PropertyDetailId, "OfferMade");
        // this.modalSave.emit(makeOfferObject);
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for property offer module. Please login.", false);
          this.close();
        }
        this.isSubmit = false;
      }));
  }

  onTermsLinkClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    this.modalComponent = TermsComponent;
    this.window.history.pushState(null, null, this.pageName + '/terms/' + this.getRandom());
    this.commonModalService.openTermsDialog("TermsComponent");
    // this.router.navigate(['/property/terms'+ "/" + this.getRandom()]);
  }

  onPrivacyPolicyLinkClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    this.modalComponent = PrivacyPolicyComponent;
    this.window.history.pushState(null, null, this.pageName + '/privacy/' + this.getRandom());
    this.commonModalService.openPrivacyDialog("PrivacyPolicyComponent");
    // this.router.navigate(['/property/privacy'+ "/" + this.getRandom()]);
  }

  getRandom() {
    return Math.floor(Math.random() * 10) + 1;
  }

  checkTerms(event) {
    this.isChecked = event.target.checked;
  }

  ngOnDestroy() {
    this._unsubscribeAll.unsubscribe();
  }
}
