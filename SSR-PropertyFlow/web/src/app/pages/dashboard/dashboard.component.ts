import { Component, OnInit, ViewChild, ElementRef, NgZone, Inject, AfterViewInit, PLATFORM_ID, OnDestroy } from "@angular/core";
import { ToasterService, ToasterConfig } from "angular2-toaster";
import { DashboardResult, Property, Payment } from "./dashboard";
import { CommonService } from "../../../app/core/services/common.service";
import { FormControl } from "@angular/forms";
import { ConfirmDeleteComponent } from "../../../app/modal/confirm-delete/confirm-delete.component";
import { Router, ActivatedRoute } from "@angular/router";
// import { } from "googlemaps";
import { CompleterService } from "ng2-completer";
import { MapsAPILoader } from "@agm/core";
import { RouteConfig } from "../../../app/route.config";
import { CookieService } from "ngx-cookie-service";
import { EventEmitterService } from "../../../app/event-emitter.service";
import { MainLayoutComponent } from "../../../app/layout/main-layout/main-layout.component";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { MyOffersService } from "../../../app/modal/my-offers/my-offers.service";
import { MyHomeService } from "../../../app/modal/my-homes/my-homes.service";
import { CommonModalService } from "../../../app/common-modal.service";
import { SignInModalComponent } from "../../../app/modal/sign-in-modal/sign-in-modal.component";
import { IPropertyViewerCookie, IHomeCoockie } from "../search-result-page/search-result-page";
import { loginUser } from "../login/loginUser";
import { DashboardService } from "./dashboard.service";
import * as moment from 'moment';
import { environment } from "../../../environments/environment";
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { SharePropertyComponent } from 'src/app/modal/share-property/share-property.component';

declare var google: any;
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})

export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("confirmDeleteModal", { static: false }) confirmDeleteModal: ConfirmDeleteComponent;
  @ViewChild("search", { static: false }) searchElementRef: ElementRef;
  // public searchElementRef: ElementRef;
  public userCookieName: string = "user";
  public isUserCookieExist: boolean = this.cookieService.check(this.userCookieName);
  public dashboard: DashboardResult;
  public isSeller: boolean = false;
  public isPropertyLoaded: boolean;
  public isBuyer: boolean = true;
  public username: string;
  public headerText: string = "The home of property deals";
  public buyerButtonClass: string = "col-md-2 col-sm-3 col-5 btn btn-lg btn-primary";
  public sellerButtonClass: string = "col-md-2 col-sm-3 col-5 btn btn-lg btn-secondary";
  public bgImageVariable: string = "'./assets/images/Find_homes,_buy_homes,_view_interest,_make_offer.png'";
  public tile1LikeIcon: string = "far fa-heart text-white font-size-30";
  public searchPlaceHolder: string = "Enter an address, street or suburb";
  public searchTerm: string = "";
  public properties: any;
  public searchControl: FormControl;
  public finalSearch: string = "";
  public addressType: string;
  public pageName: string;
  public isUserExist: boolean;
  public currentYear = moment(new Date()).format('YYYY');
  public isBrowser: boolean;
  public timeOutVar: any;
  public timeIntervalVar: any;
  public subsVar = new Subscription();
  public _unsubscribeAll = new Subscription();

  //toaster config
  public config1: ToasterConfig = new ToasterConfig({
    positionClass: "toast-top-right"
  });

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private _mainLayoutComponent: MainLayoutComponent,
    private commonService: CommonService,
    private toasterService: ToasterService,
    private routeConfig: RouteConfig,
    private completerService: CompleterService,
    private cookieService: CookieService,
    public mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private commonModalService: CommonModalService,
    private dashboardService: DashboardService,
    private eventEmitterService: EventEmitterService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isUserExist = this.cookieService.check("user");
    this.username = this.localStorage.getItem("userame");
    this.toasterService = toasterService;
  }

  ngOnInit() {
    let ischeckLocalStrorageCoockie = this.cookieService.check("isCallLocalStorageApi");
    if (ischeckLocalStrorageCoockie) {
      // this.setpropertiesInLocalStorage();
      this.updateUserIdbasedOnUserKey();
    }
    let url = this.router.url.split("/");
    this.pageName = url[1];
    this._mainLayoutComponent.toggleSearchBox();
    this.dashboard = new DashboardResult();
    this.searchControl = new FormControl();
    // this.route.params.subscribe((params) => {
    //   if (params["pageName"] && params["UserId"]) {
    //     let userId = params["UserId"];
    //     this.openDialog(userId);
    //   }
    // });
    this.route.params.subscribe((params) => {
      // if (this.isUserExist) {
      if (params["pageName"] && params["Id"] && params["address"]) {
        let pageName = params["pageName"];
        let address = params["address"];
        let propDetailId = params["Id"];
        if (pageName == "removeoffer") {
          this.commonModalService.openRemoveOfferDialog("RemovePropertyOfferComponent", propDetailId, address);
        } else if (pageName == "unclaimhome") {
          this.commonModalService.openUnclaimDialog("UnclaimHomeComponent", propDetailId, address);
        } else if (pageName == "negotiateOffer") {
          this.commonModalService.openNegotiateOfferDialog("NegotiatePropertyOfferComponent", propDetailId, address);
        } else if (pageName == "edit") {
          this.commonModalService.openAddEditPropertyDialog("AddEditHomePhotoDescriptionComponent", propDetailId, address);
        } else if (pageName == "uploadphoto") {
          this.commonModalService.openUploadPhotoDialog("UploadPhotoDescriptionComponent", propDetailId, address);
        } else if (pageName == "editdescription") {
          this.commonModalService.openUploadPhotoDialog("UploadPhotoDescriptionComponent", propDetailId, address, false, true);
        } else if (pageName == "transferowner") {
          this.commonModalService.openTransferOwnershipDialog("TransferOwnershipComponent", propDetailId, address);
        }
      }
      else if (params["pageName"]) {
        let pageName = params["pageName"];
        if (pageName == "mylikes") {
          this.commonModalService.openMyLikesDialog("MyLikesComponent");
        } else if (pageName == "myhomes") {
          this.commonModalService.openMyHomesDialog("MyHomesComponent");
        } else if (pageName == "myoffers") {
          this.commonModalService.openMyOffersDialog("MyOffersComponent")
        } else if (pageName == "mysearches") {
          this.commonModalService.openMySearchesDialog("MySearchComponent");
        } else if (pageName == "terms") {
          this.commonModalService.openTermsDialog("TermsComponent");
        } else if (pageName == "privacy") {
          this.commonModalService.openPrivacyDialog("PrivacyPolicyComponent");
        }
      }
      // } 
      // else {
      //   this.openSignUpDialog("SignInModalComponent");
      // }
      // if (params["pageName"] && params["address"]) {
      //   let propDetailId = params["address"];
      //   this.openDialog(propDetailId);
      // }
    });
    this.timeOutVar = setTimeout(() => {
      this.welcomeToastMessage();
    }, 1000);

    // this.timeIntervalVar =setInterval(() => {
    //   this.checkDdl();
    // }, 100);
    // this.initGoogleAutoComplete();
    this.subsVar.add(this.eventEmitterService.shareModalEvent.subscribe(
      (property: any) => {
        this.openShareDialog(SharePropertyComponent);
      }
    ));
  }

  initGoogleAutoComplete() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete;
      if (!this.isBuyer) {
        autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ["address"],
          strictBounds: true,
          componentRestrictions: { country: ["nz"] }
        });
      } else {
        autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ["geocode"],
          strictBounds: true,
          componentRestrictions: { country: ["nz"] }
        });
      }
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          this.checkDdl();
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry) {
            let viewport = {};
            viewport["SwLat"] = place.geometry.viewport.getSouthWest().lat();
            viewport["SwLng"] = place.geometry.viewport.getSouthWest().lng();
            viewport["NeLat"] = place.geometry.viewport.getNorthEast().lat();
            viewport["NeLng"] = place.geometry.viewport.getNorthEast().lng();
            viewport["Lat"] = place.geometry.location.lat();
            viewport["Lng"] = place.geometry.location.lng();
            viewport["SearchTerm"] = place.formatted_address;
            viewport["AddressType"] = place.types[0];
            viewport["AddressComponent"] = place.address_components;
            viewport["Vicinity"] = place.vicinity;
            let zoomLevel = 15;
            let type = place.types[0];
            if (type == "street_address") zoomLevel = 20;
            if (type == "sublocality_level_1") zoomLevel = 15;
            if (type == "sublocality_level_2") zoomLevel = 16;
            if (type == "route") zoomLevel = 19;
            if (type == "administrative_area_level_1") zoomLevel = 16;
            if (type == "administrative_area_level_2") zoomLevel = 17;
            if (type == "subpremise") zoomLevel = 20;
            viewport["Zoom"] = zoomLevel;
            this.localStorage.setItem("SearchData", JSON.stringify(viewport));
            this.searchTerm ? this.router.navigate(["/property"]) : false;
          }
        });
      });
    });
  }

  getRouteUrl(term: any) {
    return this.routeConfig.Url("/PropertyData/GetFilteredPropertyData?searchTerm=" + term);
  }

  welcomeToastMessage() {
    if (this.router.url == '/dashboard') {
      this.isUserCookieExist ? this.commonService.toasterWelcome("Welcome " + (this.username ? this.username : "User" + "!"), true) : false;
    }
  }

  handleClick(type: string) {
    //click event for seller and buyer
    switch (type) {
      case "buyer": {
        if (!this.isBuyer) {
          this.isBuyer = true;
          this.isSeller = false;
          this.headerText = "The home of property deals";
          this.buyerButtonClass = "col-md-2 col-sm-3 col-5 btn btn-lg btn-primary";
          this.sellerButtonClass = "col-md-2 col-sm-3 col-5 btn btn-lg btn-secondary";
          this.bgImageVariable = "'./assets/images/Find_homes,_buy_homes,_view_interest,_make_offer.png'";
          this.searchPlaceHolder = "Enter an address, street or suburb";
          this.initGoogleAutoComplete();
        }
        break;
      }
      case "seller": {
        if (!this.isSeller) {
          this.isBuyer = false;
          this.isSeller = true;
          this.headerText = "View offers on your property";
          this.buyerButtonClass = "col-md-2 col-sm-3 col-5 btn btn-lg btn-secondary";
          this.sellerButtonClass = "col-md-2 col-sm-3 col-5 btn btn-lg btn-primary";
          this.bgImageVariable = "'./assets/images/dashboard_sub_bg.jpg'";
          this.searchPlaceHolder = "Enter your property address";
          this.initGoogleAutoComplete();
        }
        break;
      }
    }
  }

  confirmDelete() {
    this.confirmDeleteModal.show();
  }

  onSearchInputKeyDown(event) {
    if (event.keyCode == 13) {
      this.searchTerm ? this.router.navigate(["/search-result-page", this.searchTerm]) : false;
    }
  }

  searchThisProperty() { }

  onTermsOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, this.pageName + '/terms' + "/" + this.getRandom());
    }
    this.commonModalService.openTermsDialog("TermsComponent");
  }

  onPrivacyOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, this.pageName + '/privacy' + "/" + this.getRandom());
    }
    this.commonModalService.openPrivacyDialog("PrivacyPolicyComponent");
  }

  onHomebuzzEstimatesOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, this.pageName + '/estimate' + "/" + this.getRandom());
    }
    this.commonModalService.openEstimateDialog("HomebuzzEstimatesComponent");
  }

  getRandom() {
    return Math.floor(Math.random() * 10) + 1;
  }

  toggleIcon() {
    if (this.tile1LikeIcon == "far fa-heart text-white font-size-30") {
      this.tile1LikeIcon = "fa fa-heart text-white font-size-30";
    } else {
      this.tile1LikeIcon = "far fa-heart text-white font-size-30";
    }
  }

  getAddressFormated(address: string) {
    address = address.split("--").join(", ");
    address = address.split("-").join(" ");
    return address;
  }

  openSignUpDialog(componentName) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = componentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(SignInModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.router.navigate(["/login"]);
      } else {
        if (typeof this.window !== 'undefined' && this.window.history) {
          this.window.history.pushState(null, null, this.pageName);
        }
      }
    });
  }

  setpropertiesInLocalStorage() {
    // if (Model.PropertyDetailIds.length > 0) {
    //   let PropertyIdString = Model.PropertyDetailIds.toString();
    //   let homeViewerCoockie = new IHomeViewerCookie();
    //   homeViewerCoockie["Ids"] = PropertyIdString;
    //   this.cookieService.set("home_viewer", JSON.stringify(homeViewerCoockie));
    // }
    let homeArr;
    let UserKey;
    if (JSON.parse(this.localStorage.getItem("prop_viewer"))) {
      homeArr = JSON.parse(this.localStorage.getItem("prop_viewer"));
    }
    if (JSON.parse(this.cookieService.get("UserKey"))) {
      UserKey = JSON.parse(this.cookieService.get("UserKey"));
    }

    let loginuser = new loginUser();
    loginuser.Homes = [];
    if (homeArr) {
      homeArr.Homes.forEach(home => {
        home.ViewDate = moment(home.ViewDate).format('MM/DD/YYYY');
        home.UserKey = UserKey;
      });
      loginuser.Homes = homeArr.Homes;
    }
    loginuser.UserId = +this.localStorage.getItem("userId");
    this._unsubscribeAll.add(this.dashboardService.addUpdateLocalStorage(loginuser).subscribe((data: any) => {
      if (data.Success) {
        if (data.Model.length > 0) {
          let propertyViewerCookie: IPropertyViewerCookie = new IPropertyViewerCookie();
          propertyViewerCookie.Homes = [];
          data.Model.forEach(element => {
            let home = new IHomeCoockie();
            element.PropertyDetailId ? home.Id = element.PropertyDetailId.toString() : false;
            home.ViewDate = moment(element.ViewDate).format('MM/DD/YYYY');
            home.UserKey = UserKey;
            propertyViewerCookie.Homes.push(home);
          });
          this.localStorage.setItem("prop_viewer", JSON.stringify(propertyViewerCookie));
          this.cookieService.delete("isCallLocalStorageApi");
        }
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for dashboard module. Please login.", false);
        }
      }));

    // console.log("propCoockie", JSON.stringify(propertyViewerCookie));
    // this.cookieService.set("prop_viewer", JSON.stringify(propertyViewerCookie));
    // localStorage.setItem("prop_viewer",JSON.stringify(propertyViewerCookie));

  }

  checkDdl() {
    let elements: HTMLCollectionOf<Element> = this.document.getElementsByClassName("pac-container");
    let search = this.document.getElementById("search");
    for (let index = 0; index < elements.length; index++) {
      const element: HTMLElement = elements[index] as HTMLElement;
      let searchinputs: HTMLCollectionOf<Element> = this.document.getElementsByClassName("search-input");
      if (element.style.display == "none") {
        for (let index = 0; index < searchinputs.length; index++) {
          const elem = searchinputs[index];
          if (elem.classList.contains("search-input-ddl-open")) {
            elem.classList.remove("search-input-ddl-open");
          }
        }
      } else {
        for (let index = 0; index < searchinputs.length; index++) {
          const elem = searchinputs[index];
          elem.classList.add("search-input-ddl-open");
        }
      }
    }
  }


  updateUserIdbasedOnUserKey() {
    let modal: any = {};
    modal["UserId"] = +this.localStorage.getItem("userId");
    if (this.cookieService.get("UserKey")) {
      modal["UserKey"] = JSON.parse(this.cookieService.get("UserKey"));
    }
    this._unsubscribeAll.add(this.dashboardService.updateUserIdBasedOnUserKey(modal).subscribe((data: any) => {
      if (data.Success) {
        this.cookieService.delete("isCallLocalStorageApi");
      }
    }))
  }

  onShareOptionClick() {
    this.eventEmitterService.onSharePropertyEventEmmit();
  }

  openShareDialog(componentName) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = componentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(SharePropertyComponent, dialogConfig);
    dialogRef.componentInstance.shareUrl = this.router.url;
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        window.history.pushState(this.properties, null, environment.StaticUrl.toString());
      }
    });
  }

  createPayment() {
    let userId = 0;
    let modal = new Payment();
    this.isUserExist ? userId = parseInt(this.localStorage.getItem("userId")) : 0
    modal.UserId = userId;
    modal.Intent = "sale";
    modal.Description = "Test Description";
    modal.Currency = "NZD";
    modal.Amount = 50;
    modal.ReturnUrl = environment.WEBURL + "/dashboard";
    modal.CancelUrl = environment.WEBURL + "/dashboard";
    this._unsubscribeAll.add(this.dashboardService.CreatePayment(modal).subscribe((data: any) => {
      if (data) {
        this.window.location.href = data;
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      }));
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initGoogleAutoComplete();
    }
  }

  ngOnDestroy() {
    this.subsVar.unsubscribe();
    this._unsubscribeAll.unsubscribe();
    clearTimeout(this.timeOutVar);
    // clearInterval(this.timeIntervalVar);
  }

}
