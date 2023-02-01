import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  ComponentFactoryResolver,
  ViewContainerRef,
  OnDestroy, Inject
} from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { MyHomeService } from "./my-homes.service";
import { Home } from "./my-homes";
import { Offer } from "./my-homes";
import { AddEditHomePhotoDescriptionComponent } from "../add-edit-home-photo-description/add-edit-home-photo-description.component";
import { MyOffersService } from "../my-offers/my-offers.service";
import { NegotiatePropertyOfferComponent } from "../negotiate-property-offer/negotiate-property-offer.component";
import { UnclaimHomeComponent } from "../unclaim-home/unclaim-home.component";
import { DeclinePropertyOfferComponent } from "../decline-property-offer/decline-property-offer.component";
import { ActivatedRoute, Router } from "@angular/router";
import { EventEmitterService } from "../../../app/event-emitter.service";
import { CommonService } from "../../../app/core/services/common.service";
import { MatDialogRef } from "@angular/material";
import { RemovePropertyOfferComponent } from "../remove-property-offer/remove-property-offer.component";
import { CommonModalService } from "../../../app/common-modal.service";
import { TransferOwnershipComponent } from "../transfer-ownership/transfer-ownership.component";
import { Subscription } from "rxjs";
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: "myHomesModal",
  templateUrl: "./my-homes.component.html",
  styleUrls: ["./my-homes.component.css"]
})
export class MyHomesComponent implements OnInit, OnDestroy {
  @ViewChild("container", { read: ViewContainerRef, static: false }) entry: ViewContainerRef;
  @ViewChild("unClaim", { read: ViewContainerRef, static: false }) unClaim: ViewContainerRef;
  @ViewChild("negotiate", { read: ViewContainerRef, static: false }) negotiate: ViewContainerRef;
  @ViewChild("decline", { read: ViewContainerRef, static: false }) decline: ViewContainerRef;
  @ViewChild("MyHomes", { static: false }) modal: ModalDirective;
  @Output() onDeclineSignIn = new EventEmitter<any>();
  @Output() myhomeoutput: EventEmitter<any> = new EventEmitter<any>();

  public myClaimedHomes: Home[] = [];
  public userId: string;
  public modalComponent: any;
  public modalProperty: any;
  public pageName: string;
  public isLoaded: boolean = false;
  public subsVar = new Subscription();
  public _unsubscribeAll = new Subscription();

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any,
    public dialogRef: MatDialogRef<MyHomesComponent>,
    private myHomeService: MyHomeService,
    private eventEmitterService: EventEmitterService,
    private commonModalService: CommonModalService,
    private commonService: CommonService,
    private router: Router
  ) {
    // this.subsVar.add(this.eventEmitterService.negotiateAndRemovePropRefresh.subscribe(
    //   (name: string) => {
    //     this.open();
    //   }
    // ));
    this.userId = this.localStorage.getItem("userId");
  }

  ngOnInit() {
    this.subsVar.add(this.eventEmitterService.negotiateAndRemovePropRefresh.subscribe(
      (name: string) => {
        this.open();
      }
    ));
    this.subsVar.add(this.eventEmitterService.invokeSearchResultPageComponentFunction.subscribe(
      (Obj: any) => {
        if (Obj.Action == "TransferPropertyOwnership") {
          this.open();
        }
      }));

    if (this.userId) {
      this.open();
    } else {
      this.isLoaded = true;
    }
  }

  open() {
    this._unsubscribeAll.add(this.myHomeService.getMyClaimedHomes(this.userId).subscribe(data => {
      if (data.Success) {
        // this.modal.show();
        this.myClaimedHomes = data.Model;
        this.isLoaded = true;
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for my properties module. Please login.", false);
          this.close();
        }
        this.isLoaded = true;
      }));
  }

  close() {
    this.dialogRef.close(false);
    // this.onDeclineSignIn.emit("close model");
    // this.modal.hide();
  }

  onEditAddPhotoDescriptionLinkClick(home: Home) {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    this.modalProperty = home;
    this.modalComponent = AddEditHomePhotoDescriptionComponent;
    let address = home.Address + ", " + home.Suburb + ", " + home.City;
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, this.pageName + '/edit/' + address.replace(/[\W_]/g, "-") + "/" + home.PropertyDetailId + "/" + this.getRandom());
    }
    this.commonModalService.openAddEditPropertyDialog("AddEditHomePhotoDescriptionComponent", home.PropertyDetailId, address);
  }

  onDeclinOfferLinkClick(id: number, offer: Offer, Address: string, propId: number) {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    this.modalComponent = RemovePropertyOfferComponent;
    let address = offer.Address + ", " + offer.Suburb + ", " + offer.City;
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, this.pageName + '/removeoffer/' + address.replace(/[\W_]/g, "-") + "/" + id + "/" + this.getRandom());
    }
    this.commonModalService.openRemoveOfferDialog("RemovePropertyOfferComponent", id, address);
  }

  onNegotiateOfferLinkClick(offer: Offer) {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    this.modalComponent = NegotiatePropertyOfferComponent;
    let address = offer.Address + ", " + offer.Suburb + ", " + offer.City;
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, this.pageName + '/negotiateOffer/' + address.replace(/[\W_]/g, "-") + "/" + offer.Id + "/" + this.getRandom());
    }
    this.commonModalService.openNegotiateOfferDialog("NegotiatePropertyOfferComponent", offer.Id, address);
  }

  OnRenewClaimLinkClick(home: Home) {
    let queryObject = {};
    queryObject["Id"] = home.Id;
    queryObject["PropertyDetailId"] = home.PropertyDetailId;
    queryObject["OwnerId"] = this.userId;
    queryObject["Address"] = home.Address;
    this._unsubscribeAll.add(this.myHomeService.renewClaim(queryObject).subscribe(data => {
      if (data.Success) {
        this.open();
        // this.myClaimedHomes = this.myClaimedHomes.map(home => {
        //   if (home.Id == data.Model.Id)
        //     home.PropertyClaimedDate = data.Model.ClaimedOn;
        //   return home;
        // })
        let ToastMessage = `You have successfully renewed your claim of ${home.Address} for the next 28 days. A confirmation email has been sent to you.`;

        this.commonService.toaster(ToastMessage, true);
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for my properties module. Please login.", false);
          this.close();
        }
      }));
  }

  onTransferOwnerShipOptionLinkClick(home) {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    this.modalComponent = TransferOwnershipComponent;
    let address = home.Address + ", " + home.Suburb + ", " + home.City;
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, this.pageName + '/transferowner/' + address.replace(/[\W_]/g, "-") + "/" + home.PropertyDetailId + "/" + this.getRandom());
    }
    this.commonModalService.openTransferOwnershipDialog("TransferOwnershipComponent", home.PropertyDetailId, address);
  }

  onUnclaimLinkClick(home: Home) {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    this.modalComponent = UnclaimHomeComponent;
    let address = home.Address + ", " + home.Suburb + ", " + home.City;
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, this.pageName + '/unclaimhome/' + address.replace(/[\W_]/g, "-") + "/" + home.PropertyDetailId + "/" + this.getRandom());
    }
    this.commonModalService.openUnclaimDialog("UnclaimHomeComponent", home.PropertyDetailId, address);
  }

  unClaimHome(home: Home) {
    let queryObject = {};
    queryObject["Id"] = home.Id;
    queryObject["PropertyDetailId"] = home.PropertyDetailId;
    queryObject["OwnerId"] = this.userId;
    queryObject["Address"] = home.Address;
    this._unsubscribeAll.add(this.myHomeService.unClaim(queryObject).subscribe(data => {
      if (data.Success) {
        let ToastMessage = `You have successfully unclaimed ${home.Address}. A confirmation email has been sent to you.`;
        this.commonService.toaster(ToastMessage, true);
        this.myClaimedHomes = this.myClaimedHomes.filter(home => home.PropertyDetailId !== data.Model.PropertyDetailId);
        this.eventEmitterService.onGetPropertyEventEmmit(home.PropertyDetailId, "UnClaimProperty");
        //   this.myhomeoutput.emit();
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for my properties module. Please login.", false);
          this.close();
        }
      }));
  }

  getRandom() {
    return Math.floor(Math.random() * 10) + 1;
  }

  ngOnDestroy(): any {
    this.subsVar.unsubscribe();
    this._unsubscribeAll.unsubscribe();
  }
}
