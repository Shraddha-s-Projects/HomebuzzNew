import {
  Component,
  OnInit,
  ViewChild,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  ApplicationRef,
  Inject,
  OnDestroy,
  ViewEncapsulation,
  OnChanges,
  AfterViewInit
} from "@angular/core";
import { ToasterConfig } from "angular2-toaster";
import { ClaimHomeComponent } from "../../../app/modal/claim-home/claim-home.component";
import { MakeOfferComponent } from "../../../app/modal/make-offer/make-offer.component";
import { SignInModalComponent } from "../../../app/modal/sign-in-modal/sign-in-modal.component";
import { AddEditHomePhotoDescriptionComponent } from "../../../app/modal/add-edit-home-photo-description/add-edit-home-photo-description.component";
import { ActivatedRoute } from "@angular/router";
import { SearchResultPageService } from "./search-result-page.service";
import { CookieService } from "ngx-cookie-service";
// import { } from "googlemaps";
import { MapsAPILoader } from "@agm/core";
import {
  IHomeViewerCookie,
  Property,
  TimePeriod,
  PropertyLike,
  PropertyView,
  PriceFilterVM,
  PropertyStatusVM,
  UserPropertyInfo,
  IPropertyViewerCookie,
  IHomeCoockie,
  SubHurbPropertyInfo,
  AgentOption
} from "./search-result-page";
import { Router } from "@angular/router";
import { PropertyImageGalleryComponent } from "../../../app/modal/property-image-gallery/property-image-gallery.component";
import { CommonService } from "../../../app/core/services/common.service";
import { EventEmitterService } from "../../event-emitter.service";
import { RouteConfig } from "../../../app/route.config";
import { environment } from "../../../environments/environment";
import { MyOffersComponent } from "../../../app/modal/my-offers/my-offers.component";
import { MyHomesComponent } from "../../../app/modal/my-homes/my-homes.component";
import { MyLikesComponent } from "../../../app/modal/my-likes/my-likes.component";
import { MySearchComponent } from "../../../app/modal/my-search/my-search.component";
import { TermsComponent } from "../../../app/modal/terms/terms.component";
import { PrivacyPolicyComponent } from "../../../app/modal/privacy-policy/privacy-policy.component";
import { MyLikesService } from "../../../app/modal/my-likes/my-likes.service";
import { HomebuzzEstimatesComponent } from "../../../app/modal/homebuzz-estimates/homebuzz-estimates.component";
import { Group, exportImage, drawDOM } from "@progress/kendo-drawing";
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { MainLayoutComponent } from "../../../app/layout/main-layout/main-layout.component";
import { RemovePropertyOfferComponent } from "../../../app/modal/remove-property-offer/remove-property-offer.component";
import { MyOffersService } from "../../../app/modal/my-offers/my-offers.service";
import { UnclaimHomeComponent } from "../../../app/modal/unclaim-home/unclaim-home.component";
import { MyHomeService } from "../../../app/modal/my-homes/my-homes.service";
import { NegotiatePropertyOfferComponent } from "../../../app/modal/negotiate-property-offer/negotiate-property-offer.component";
import { UploadPhotoDescriptionComponent } from "../../../app/modal/upload-photo-description/upload-photo-description.component";
import { GoogleMapComponent } from "../google-map/google-map.component";
import { SharePropertyComponent } from "../../../app/modal/share-property/share-property.component";
import { NotifyPropertyComponent } from "../../../app/modal/notify-property/notify-property.component";
import { SearchResultGridComponent } from "../search-result-grid/search-result-grid.component";
import { TransferOwnershipComponent } from "../../../app/modal/transfer-ownership/transfer-ownership.component";
import { Subscription } from "rxjs";
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { DOCUMENT } from '@angular/common';

declare var google: any;
@Component({
  selector: "app-search-result-page",
  templateUrl: "./search-result-page.component.html",
  styleUrls: ["./search-result-page.component.css"],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("googleMap", { static: false }) googleMap: GoogleMapComponent;
  @ViewChild("gridResult", { static: false }) gridResult: SearchResultGridComponent;

  // variables
  public isOpen: boolean = false;
  public isUserExist: boolean;
  public userCookieName: string = "user";
  public isUserCookieExist: boolean = this.cookieService.check(this.userCookieName);
  public rolename: string = this.cookieService.get("rolename");
  // public 
  public config: ToasterConfig = new ToasterConfig({
    positionClass: "toast-top-right"
  });
  public isLoading: boolean = true;
  public username: string;
  public totalView: number = 0;
  public totalHome: number = 0;
  public homeViewerCookieName: string = "home_viewer";
  public propertyViewerCookieName: string = "prop_viewer";
  public userId: number;

  public selectedBeds: string = '';
  public selectedBaths: string = '';
  public selectedStatus: string;
  public selectedMinPrice: number = null;
  public selectedMaxPrice: number = null;
  public minPz: string = '';
  public maxPz: string = '';

  public selectedValue: string = "0-28";
  public searchTerm: string = "";
  public searchTermViewPort: any = {};
  public period: number = 28;
  public timePeriods: TimePeriod[] = [
    { Name: "Buzz today + past 7 days", From: "0", To: "7", Rang: "0-7" },
    { Name: "Buzz past 8 to 14 days", From: "8", To: "14", Rang: "8-14" },
    { Name: "Buzz past 15 to 21 days", From: "15", To: "21", Rang: "15-21" },
    { Name: "Buzz past 22 to 28 days", From: "22", To: "28", Rang: "22-28" },
    { Name: "Buzz past 28 day", From: "0", To: "28", Rang: "0-28" }
  ];

  public minPriceList: PriceFilterVM[] = [
    { Name: "0", Value: 0 },
    { Name: "50,000", Value: 50000 },
    { Name: "100,000", Value: 100000 },
    { Name: "250,000", Value: 250000 },
    { Name: "500,000", Value: 500000 },
    { Name: "750,000", Value: 750000 },
    { Name: "1M", Value: 1000000 },
    { Name: "2M", Value: 2000000 },
    { Name: "3M", Value: 3000000 },
    { Name: "5M", Value: 5000000 }
  ];
  public maxPriceList: PriceFilterVM[] = [
    { Name: "50,000", Value: 50000 },
    { Name: "100,000", Value: 100000 },
    { Name: "250,000", Value: 250000 },
    { Name: "500,000", Value: 500000 },
    { Name: "750,000", Value: 750000 },
    { Name: "1M", Value: 1000000 },
    { Name: "2M", Value: 2000000 },
    { Name: "3M", Value: 3000000 },
    { Name: "5M", Value: 5000000 }
  ];
  public copyMaxPriceList: PriceFilterVM[] = [];
  public copyMinPriceList: PriceFilterVM[] = [];
  public homeViewerCookie: IHomeViewerCookie;
  public properties: Property[] = [];

  public mapProperty: Property;
  public show: boolean = false;
  public buttonName: any = 'Show';
  public propertyViewObj: PropertyView;
  public searchedTerm: string;
  public Image_Url = environment.APIURL.toString();
  public searchedAddressType: string;
  public fromDashboard: boolean = false;
  // public map: google.maps.Map;
  public isTileView: boolean = true;
  public PageNum: number = 1;
  public PageSize: number = 100;
  public totalProperties: number = 0;
  public scrollOffset: number = 0;
  public zoomCalled: boolean;
  public mapType: string = "roadmap";
  public heatMapArray = [];
  public heatmap: any;
  public marker: any;
  public SearchedAddress: string;
  public dublicateProperties: Property[] = [];
  public url: string;
  public globalzoom: number;
  public AllMarkers: any[] = [];
  public showAllMarkers: any[] = [];
  public isListView: boolean = false;
  public isExactMatchBed: boolean = false;
  public isExactMatchBath: boolean = false;
  public previousInfoWindow: any;
  public isLoaded: boolean = false;
  public isViewStatus: boolean = true;
  public isViewedOwnerActive: boolean = true;
  public isOpenHomeOwnerActive: boolean = true;
  public isForSaleOwnerActive: boolean = true;
  public isAllActiveStatus: boolean = true;
  public propertySearchHistoryId: number = 0;
  public isStatusValidationMsg: boolean = false;
  public propertyStatus: PropertyStatusVM[] = [];
  public userPropInfo: UserPropertyInfo;
  public subHurbPropertyInfo: SubHurbPropertyInfo;
  public isLoadSubHurbInfo: boolean = false;
  public UserKey: any;
  public updatedPropertyDetailId: number;
  public subHurbName: string;
  public modalProperty: Property;
  public modalComponent: any;
  public isLoadPage: boolean = false;
  public pageName: string;
  public agentOption: AgentOption[] = [];
  public subsVar = new Subscription();
  public _unsubscribeAll = new Subscription();

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(DOCUMENT) private document: Document,
    private _mainLayoutComponent: MainLayoutComponent,
    public dialog: MatDialog,
    private searchResultPageService: SearchResultPageService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZoneService: NgZone,
    private routeConfig: RouteConfig,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    // private _ref: ChangeDetectorRef,
    private ref: ApplicationRef,
    private resolver: ComponentFactoryResolver,
    private commonService: CommonService,
    private eventEmitterService: EventEmitterService,
    private myLikesService: MyLikesService,
    private myOffersService: MyOffersService,
    private myHomeService: MyHomeService
  ) {
    this.userId = this.isUserCookieExist ? parseInt(this.localStorage.getItem("userId")) : null;
    this.isUserExist = this.cookieService.check("user");
    this.username = this.localStorage.getItem("userame");
  }

  ngOnInit() {
    // show auto complete box
    this._mainLayoutComponent.toggleSearchBox();
    if (this.rolename == "Agent" || this.rolename == "Agent_Admin") {
      this.getAllAgentption();
    }

    this.subsVar.add(this.eventEmitterService.invokeSearchResultPageComponentFunction.subscribe(
      (Obj: any) => {
        if (Obj.PropertyDetailId != '' && Obj.Action == undefined) {
          this.updatedPropertyDetailId = +Obj.PropertyDetailId;
        }
        // console.log('event emitter called');
        this.PageNum = 1;
        if (this.localStorage.getItem("SearchData")) {
          this.searchTermViewPort = JSON.parse(this.localStorage.getItem("SearchData"));
        }
        if (this.isUserCookieExist && this.userId) {
          this.getUserInfo();
        }
        if (Obj.Action != undefined) {
          this.updateProperty(Obj);
        } else {
          console.log('2nd call');
          this.showLoader();
          // this.googleMap.searchProperties(this.searchTermViewPort, false, false, true);
        }
      }
    ));

    this.subsVar.add(this.eventEmitterService.invokeSearchResultPageAddressRefresh.subscribe(
      () => {
        console.log('event emmit searchdata');
        this.showLoader();
        if (this.localStorage.getItem("SearchData")) {
          let sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
          this.searchTerm = sessionData.SearchTerm;
        }
        this.gridResult.isSurroundingSuburb = true;
        this.localStorage.setItem("isSurroundingSuburb", "true");
        this.googleMap.fromDashboard = true;
        this.googleMap.searchData();
      }
    ));
    this.subsVar.add(this.eventEmitterService.propertyImageModal.subscribe(
      (element: any) => {
        this.openPropertyImageModal(element);
      }
    ));

    this.subsVar.add(this.eventEmitterService.zoomMapEvent.subscribe(
      () => {
        this.showLoader();
      }
    ));

    this.subsVar.add(this.eventEmitterService.likePropertyEvent.subscribe(
      (property: any) => {
        // console.log("like output emit");
        this.onTileLikeClickChildOutut(property);
      }
    ));

    this.subsVar.add(this.eventEmitterService.shareModalEvent.subscribe(
      (property: any) => {
        this.openShareDialog(SharePropertyComponent);
      }
    ));

    this.subsVar.add(this.eventEmitterService.notifyPropertyModalEvent.subscribe(
      (property: any) => {
        this.openNotifyPropertyDialog(NotifyPropertyComponent, property.PropertyDetailId, property);
      }
    ));

    this.subsVar.add(this.eventEmitterService.termsModalEmit.subscribe(
      (property: any) => {
        this.onTermsOptionClick();
      }
    ));

    this.subsVar.add(this.eventEmitterService.estimateModalEmit.subscribe(
      (property: any) => {
        this.onHomebuzzEstimatesOptionClick();
      }
    ));

    this.subsVar.add(this.eventEmitterService.privacyModalEmit.subscribe(
      (property: any) => {
        this.onPrivacyOptionClick();
      }
    ));
    if (this.isUserCookieExist && this.userId) {
      this.getUserInfo()
    }
    let isExistUserKey = this.cookieService.check("UserKey");

    if (!isExistUserKey) {
      let Id = uuidv4();
      this.addUpdateUserKey(Id);
      this.cookieService.set("UserKey", JSON.stringify(Id));
    }
    if (this.cookieService.get("UserKey")) {
      this.UserKey = JSON.parse(this.cookieService.get("UserKey"));
    }
    this.getAllPropertyStatus();
    let propViewerCoockie = this.cookieService.get("prop_viewer");
    this.route.params.subscribe((params) => {
      // if (this.isUserExist) {
      if (params["pageName"] && params["Id"] && params["address"]) {
        let isExistPageLoad = this.cookieService.check("IsLoad");
        // isExistPageLoad ? this.isLoadPage = JSON.parse(this.cookieService.get("IsLoad")) : this.isLoadPage = false;
        // this.isLoadPage = true;
        let pageName = params["pageName"];
        let address = params["address"];
        let propDetailId = params["Id"];
        if (pageName == "claimhome") {
          this.openClaimHomeDialog("ClaimHomeComponent", propDetailId, address);
        } else if (pageName == "makeoffer") {
          this.openMakeOfferDialog("MakeOfferComponent", propDetailId, address);
        } else if (pageName == "edit") {
          this.openAddEditPropertyDialog("AddEditHomePhotoDescriptionComponent", propDetailId, address);
        } else if (pageName == "removeoffer") {
          this.openRemoveOfferDialog("RemovePropertyOfferComponent", propDetailId, address);
        } else if (pageName == "unclaimhome") {
          this.openUnclaimDialog("UnclaimHomeComponent", propDetailId, address);
        } else if (pageName == "negotiateOffer") {
          this.openNegotiateOfferDialog("NegotiatePropertyOfferComponent", propDetailId, address);
        } else if (pageName == "uploadphoto") {
          this.openUploadPhotoDialog("UploadPhotoDescriptionComponent", propDetailId, address);
        } else if (pageName == "editdescription") {
          this.openUploadPhotoDialog("UploadPhotoDescriptionComponent", propDetailId, address, true);
        } else if (pageName == "notify") {
          this.openNotifyPropertyDialog("NotifyPropertyComponent", +address);
        } else if (pageName == "transferowner") {
          this.openTransferOwnershipDialog("TransferOwnershipComponent", propDetailId, address);
        }
        else {
          this.openDialog("PropertyImageGalleryComponent", propDetailId, address);
        }

      } else if (params["pageName"] && params["UserId"]) {
        let isExistPageLoad = this.cookieService.check("IsLoad");
        // isExistPageLoad ? this.isLoadPage = JSON.parse(this.cookieService.get("IsLoad")) : this.isLoadPage = false;
        // this.isLoadPage = true;
        this.openMyLikesDialog("MyLikesComponent");

      } else if (params["pageName"]) {
        let isExistPageLoad = this.cookieService.check("IsLoad");
        // isExistPageLoad ? this.isLoadPage = JSON.parse(this.cookieService.get("IsLoad")) : this.isLoadPage = false;
        // this.isLoadPage = true;
        let pageName = params["pageName"];
        if (pageName == "login") {
          this.openSignUpDialog("SignInModalComponent");
        } else if (pageName == "terms") {
          this.openTermsDialog("TermsComponent");
        } else if (pageName == "share") {
          this.openShareDialog("SharePropertyComponent");
        } else if (pageName == "privacy") {
          this.openPrivacyDialog("PrivacyPolicyComponent");
        } else if (pageName == "estimate") {
          this.openEstimateDialog("HomebuzzEstimatesComponent");
        } else if (pageName == "mylikes") {
          this.openMyLikesDialog("MyLikesComponent");
        } else if (pageName == "myhomes") {
          this.openMyHomesDialog("MyHomesComponent");
        } else if (pageName == "myoffers") {
          this.openMyOffersDialog("MyOffersComponent");
        } else if (pageName == "mysearches") {
          this.openMySearchesDialog("MySearchComponent");
        } else if (pageName == "terms") {
          this.openTermsDialog("TermsComponent");
        }
        // this.isLaoadPage = true;
      }
      // } else {
      //   this.openSignUpDialog("SignInModalComponent")
      // }
      // if (params["pageName"] && params["address"]) {
      //   let propDetailId = params["address"];
      //   this.openDialog(propDetailId);
      // }
    });


    this.route.queryParams.subscribe(map => {
      this.isLoadPage = map["IsLoad"];
      // this.isLoadPage == undefined ? this.isLoadPage = false : this.isLoadPage = true;
      this.propertySearchHistoryId = +map.SearchId;
      this.SearchedAddress = map.Address;
      // if (this.SearchedAddress) {
      //   this.getAddressLatLong(this.SearchedAddress);
      // }
      if (this.propertySearchHistoryId) {
        if (this.gridResult) {
          this.gridResult.isSurroundingSuburb = true;
        }
        this.getSerchHistoryData(this.propertySearchHistoryId);
      }
    });
    let isExistPageLoad = this.cookieService.check("IsLoad");
    // isExistPageLoad ? this.isLoadPage = JSON.parse(this.cookieService.get("IsLoad")) : this.isLoadPage = false;
    this.copyMaxPriceList = [...this.maxPriceList];
    this.copyMinPriceList = [...this.minPriceList];
    this.selectedMinPrice = null;
    this.selectedMaxPrice = null;

    let isMobile = /iPhone|iPod|Android/i.test(this.window.navigator.userAgent);

    if (this.SearchedAddress) {
      this.getAddressLatLong(this.SearchedAddress);
    }
    // else if (this.propertySearchHistoryId) {
    //   this.getSerchHistoryData(this.propertySearchHistoryId);
    // }
    else {
      // this.googleMap.ngOnInit();
      // if (this.isLoadPage) {
      // this.mapsAPILoader.load().then(() => {
      //   this.loadData();
      //   this.initializeAllClass();
      // });
      // }
    }
    // $('[data-toggle="popover"]').popover();
    this.isUserExist = this.cookieService.check("user");
    if (isMobile) {
      this.togglemaplist('map');
    }
    if (typeof this.window !== 'undefined' && this.window.addEventListener) {
      this.window.addEventListener('scroll', this.scrollEvent, true);
    }
  }

  addUpdateUserKey(Id) {
    let obj: any = {};
    obj["UserKey"] = Id;
    if (this.isUserCookieExist) {
      obj["UserId"] = +this.cookieService.get("user");
    }
    this.isUserCookieExist ? parseInt(this.localStorage.getItem("userId")) : null;
    this.searchResultPageService.addUpdateUserKey(obj).subscribe((data: any) => {

    });
  }

  scrollEvent(event: any) {
    // console.log(event);
    let scrolltop = 0;
    if (event.target.scrollingElement) {
      scrolltop = event.target.scrollingElement.scrollTop;
    }
    let el: HTMLCollectionOf<Element> = this.document.getElementsByClassName('sub-header');
    if (scrolltop >= 50) {
      if (el.length > 0) {
        el[0].classList.add("sub-header-mobile");
      }
    }
    else {
      if (el.length > 0) {
        el[0].classList.remove("sub-header-mobile");
      }
    }
  }
  getRandom() {
    return Math.floor(Math.random() * 10) + 1;
  }

  showLoader() {
    this.isLoaded = true;
    this.isLoading = true;
  }

  hideLoader() {
    this.isLoaded = false;
    this.isLoading = false;
  }

  getAllPropertyStatus() {
    this._unsubscribeAll.add(this.searchResultPageService.getAllPropertyStatus().subscribe(data => {
      if (data.Success) {
        this.propertyStatus = [];
        this.propertyStatus = data.Model;
        this.filterAllStatusSearch()
        // !this.propertySearchHistoryId ? this.filterAllStatusSearch() : false;
      } else {
        this.propertyStatus = [];
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      }));
  }

  getSerchHistoryData(searchId) {
    this._unsubscribeAll.add(this.searchResultPageService.getPropertySearchHistory(searchId).subscribe((data: any) => {
      if (data.Model) {
        data.Model.Bathrooms ? this.selectedBaths = data.Model.Bathrooms : this.selectedBaths = "";
        this.isExactMatchBath = data.Model.IsExactMatchBath;
        data.Model.Bedrooms ? this.selectedBeds = data.Model.Bedrooms : this.selectedBeds = "";
        this.isExactMatchBed = data.Model.IsExactMatchBed;
        if (data.Model.FromTo) {
          this.selectedValue = data.Model.FromTo;
        }
        if (data.Model.MaxPrice) {
          this.selectedMaxPrice = data.Model.MaxPrice;
          this.maxPriceFormat(this.selectedMaxPrice);
        } else {
          this.copyMaxPriceList = [...this.maxPriceList];
          this.selectedMaxPrice = null;
          this.maxPz = '';
        }
        if (data.Model.MinPrice) {
          this.selectedMinPrice = data.Model.MinPrice;
          this.minPriceFormat(this.selectedMinPrice);
        } else {
          this.copyMinPriceList = [...this.minPriceList];
          this.selectedMinPrice = null;
          this.minPz = '';
        }
        data.Model.MinPrice === 0 ? this.selectedMinPrice = 0 : false;
        data.Model.MinPrice === 0 ? this.minPriceFormat(this.selectedMinPrice) : false;
        if (data.Model.PropertyStatus) {
          if (data.Model.PropertyStatus === "5") {
            this.selectedStatus = "";
            this.isAllActiveStatus = true;
            this.isStatusValidationMsg = false;
            this.filterAllStatusSearch();
          } else {
            this.isStatusValidationMsg = false;
            this.selectedStatus = data.Model.PropertyStatus;
            this.selectedStatus.includes('1') ? this.isViewStatus = true : this.isViewStatus = false;
            this.selectedStatus.includes('2') ? this.isViewedOwnerActive = true : this.isViewedOwnerActive = false;
            this.selectedStatus.includes('4') ? this.isForSaleOwnerActive = true : this.isForSaleOwnerActive = false;
            this.selectedStatus.includes('3') ? this.isOpenHomeOwnerActive = true : this.isOpenHomeOwnerActive = false;
            this.isAllActiveStatus = false;
          }
        } else {
          this.isAllActiveStatus = false;
          this.isViewStatus = false;
          this.isViewedOwnerActive = false;
          this.isForSaleOwnerActive = false;
          this.isOpenHomeOwnerActive = false;
          this.selectedStatus = "";
          this.isStatusValidationMsg = true;
          this.properties = [];
          this.totalHome = 0;
        }
        this.getAddressLatLong(data.Model.Address, true);
      } else {
        if (this.localStorage.getItem("SearchData")) {
          let SearchData = JSON.parse(this.localStorage.getItem("SearchData"))
          this.getAddressLatLong(SearchData.SearchTerm, true);
        }
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for property search history module. Please login.", false);
        }
      }));
  }

  filterAllStatusSearch() {
    if (this.isAllActiveStatus) {
      this.selectedStatus = '';
      this.propertyStatus.forEach(element => {
        if (element.Name !== "All") {
          if (this.selectedStatus == '') {
            this.selectedStatus = this.selectedStatus + element.Id;
          } else {
            this.selectedStatus = this.selectedStatus + ',' + element.Id;
          }
        }
      });
      this.isViewStatus = true;
      this.isViewedOwnerActive = true;
      this.isOpenHomeOwnerActive = true;
      this.isForSaleOwnerActive = true;
      // console.log("selectedStatusload",this.selectedStatus);
      // console.log("propertyStatus", this.propertyStatus);
    }
  }

  getAddressLatLong(address, isEmit?: boolean) {
    let _this = this;
    this.mapsAPILoader.load().then(() => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          let place = results[0];
          if (isEmit) {
            _this.eventEmitterService.onHeaderSearchTextEmit(place.formatted_address);
          }
          _this.setPlaceObject(place);

        } else {
          console.log("Geocode was not successful for the following reason: " + status);
        }
      });
    });
  }

  setPlaceObject(place) {
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
    this.searchTermViewPort = viewport;
    this.properties = [];
    this.localStorage.setItem("SearchData", JSON.stringify(viewport));
    this.searchTerm = this.searchTermViewPort.SearchTerm;
    console.log("3rd call");
    let fromDashboard;
    if (this.localStorage.getItem('fromDashboard')) {
      fromDashboard = this.localStorage.getItem('fromDashboard');
    }
    this.googleMap.getSortAddress();
    if (!fromDashboard) {
      this.showLoader();
      this.searchTermViewPort.AddressType != "street_address"
        // ? this.googleMap.searchProperties(viewport)
        ? this.googleMap.bindGoogleMap(this.searchTermViewPort.Lat, this.searchTermViewPort.Lng, this.searchTermViewPort.AddressType)
        : this.googleMap.saveProperty(viewport);
    }
  }

  /** Init Object and Google Auto Complete End */

  /** Lazy Loading Start */
  onScroll(value: number): void {
    let ell: HTMLElement = this.document.getElementById('address-grid');
    let offsetHeight = ell.offsetHeight;
    let scrollOffset = offsetHeight * (this.totalHome / 5);
    this.scrollOffset = scrollOffset;
    let el: HTMLCollectionOf<Element> = this.document.getElementsByClassName('agent-option');
    if (el) {
      for (let index = 0; index < el.length; index++) {
        el[index].classList.remove("show");
        el[index].classList.add("hide");
      }
    }
    let scrollTop;
    if (ell) {
      scrollTop = ell.scrollTop;
    }
    if (scrollTop >= scrollOffset && scrollOffset) {
      this.onScrollEnd();
    }
  }
  onScrollEnd(isLoad?: boolean) {
    if (this.totalHome == this.PageSize * this.PageNum) {
      console.log("On scroll call");
      this.showLoader();
      this.googleMap.searchProperties(this.searchTermViewPort);
      this.PageNum += 1;
    }
  }
  /** Lazy Loading End */


  MinFocus(event) {
    let max = this.document.getElementById('MaxList');
    max.style.display = "none";
    let min = this.document.getElementById('MinList');
    min.style.display = "block";
    if (this.selectedMaxPrice) {
      this.minPriceList = this.copyMinPriceList.filter(t => t.Value < this.selectedMaxPrice);
    } else {
      this.minPriceList = [...this.copyMinPriceList];
    }
  }

  OnMaxChange(event) {
    this.selectedMaxPrice = +event.target.value;
    this.maxPriceFormat(this.selectedMaxPrice);
  }

  OnMinChange(event) {
    this.selectedMinPrice = +event.target.value;
    this.minPriceFormat(this.selectedMinPrice);
  }

  minPriceFormat(minPrice) {
    if (minPrice >= 1000) {
      this.minPz = (minPrice / 1000) + 'k';
    } else {
      minPrice ? this.minPz = minPrice.toString() : false;
    }
    if (minPrice >= 1000000) {
      minPrice ? this.minPz = (minPrice / 1000000) + 'm' : false;
    }
  }

  MaxFocus(event) {
    let min = this.document.getElementById('MinList');
    min.style.display = "none";
    let max = this.document.getElementById('MaxList');
    max.style.display = "block";
    if (this.selectedMinPrice === 0) {
      if (JSON.stringify(this.copyMaxPriceList)) {
        this.maxPriceList = JSON.parse(JSON.stringify(this.copyMaxPriceList));
      }
    } else {
      this.maxPriceList = this.copyMaxPriceList.filter(t => t.Value > this.selectedMinPrice);
    }
  }

  maxPriceFormat(maxPrice) {
    if (maxPrice >= 1000) {
      this.maxPz = (maxPrice / 1000) + 'k';
    }
    if (maxPrice >= 1000000) {
      this.maxPz = (maxPrice / 1000000) + 'm';
    }
    if (maxPrice === null) {
      this.maxPz = '';
    }
  }

  hidemarker() {
    let error = false;
    let promise = new Promise((resolve, reject) => {
      this.AllMarkers.forEach(element => {
        element.setVisible(false);
      });
      if (error) {
        reject('error');
      } else {
        resolve('done');
      }
    });
    return promise;
  }

  /** Time Period Filter Start  */
  onTimePeriodSelect(event) {
    this.googleMap.fromDashboard = false;
    this.selectedValue = event.target.value;
    if (this.isStatusValidationMsg) {
      if (this.localStorage.getItem('SearchData')) {
        let searchData = JSON.parse(this.localStorage.getItem('SearchData'));
        this.googleMap.bindGoogleMap(searchData.Lat, searchData.Lng, searchData.AddressType);
      }
      return false;
    } else {
      if (this.selectedValue != "0-28") {
        if (!this.isUserCookieExist) {
          // this.modalProperty = property;
          this.selectedValue = "0-28";
          this.modalComponent = SignInModalComponent;
          if (typeof this.window !== 'undefined' && this.window.history) {
            this.window.history.pushState(null, null, 'property/login/' + this.getRandom());
          }
          this.openSignUpDialog("SignInModalComponent");
          // this.router.navigate(['/property/login'+ "/" + this.getRandom()]);
          // this.signInModal.show();
          return false;
        } else {
          this.showLoader();
          // this.googleMap.searchProperties();
        }
        // !this.isUserCookieExist
        //   ? this.signInModal.show()
        //   : this.searchProperties();
      } else {
        this.PageNum = 1;
        this.showLoader();
        // !this.isUserCookieExist
        //   ? this.googleMap.searchProperties(this.searchTermViewPort)
        //   : this.googleMap.searchProperties();
      }
    }
  }

  setDropdownDefaultValue() {
    this.selectedValue = "0-28";
  }

  /** Filters Start */
  onBedSelect(event) {
    this.selectedBeds = event.target.value;
    this.googleMap.fromDashboard = false;
    if (this.isStatusValidationMsg) {
      this.properties = [];
      if (this.localStorage.getItem("SearchData")) {
        let searchData = JSON.parse(this.localStorage.getItem('SearchData'));
        this.googleMap.bindGoogleMap(searchData.Lat, searchData.Lng, searchData.AddressType);
      }
      return false;
    } else {
      this.showLoader();
      // this.googleMap.searchProperties();
    }
  }

  onBathSelect(event) {
    this.selectedBaths = event.target.value;
    this.googleMap.fromDashboard = false;
    if (this.isStatusValidationMsg) {
      if (this.localStorage.getItem("SearchData")) {
        let searchData = JSON.parse(this.localStorage.getItem('SearchData'));
        this.properties = [];
        this.googleMap.bindGoogleMap(searchData.Lat, searchData.Lng, searchData.AddressType);
      }
      return false;
    } else {
      this.showLoader();
      // this.googleMap.searchProperties();
    }
  }

  ResetFilter() {
    this.isExactMatchBed = false;
    this.isExactMatchBath = false;
    this.selectedValue = "0-28";
    this.selectedBaths = "";
    this.selectedBeds = "";
    this.isAllActiveStatus = true;
    this.filterAllStatusSearch();
    this.selectedMinPrice = null;
    this.selectedMaxPrice = null;
    if (JSON.stringify(this.copyMinPriceList)) {
      this.minPriceList = JSON.parse(JSON.stringify(this.copyMinPriceList));
    }
    if (JSON.stringify(this.copyMaxPriceList)) {
      this.maxPriceList = JSON.parse(JSON.stringify(this.copyMaxPriceList));
    }
  }

  onStatusSelect(event) {
    let searchData;
    this.googleMap.fromDashboard = false;
    if (this.localStorage.getItem('SearchData')) {
      searchData = JSON.parse(this.localStorage.getItem('SearchData'));
    }
    if (event.target.checked) {
      this.isStatusValidationMsg = false;
      this.selectedStatus == "" ? this.selectedStatus = event.target.value : this.selectedStatus = this.selectedStatus + "," + event.target.value;
      this.selectedStatus.includes('1') ? this.isViewStatus = true : this.isViewStatus = false;
      this.selectedStatus.includes('2') ? this.isViewedOwnerActive = true : this.isViewedOwnerActive = false;
      this.selectedStatus.includes('4') ? this.isForSaleOwnerActive = true : this.isForSaleOwnerActive = false;
      // this.selectedStatus.includes('3') ? this.isOpenHomeOwnerActive = true : this.isOpenHomeOwnerActive = false;
    } else {
      let arr = this.selectedStatus.split(',');
      let index = arr.findIndex(t => t === event.target.value);
      index > -1 ? arr.splice(index, 1) : false;
      this.selectedStatus = "";
      arr.forEach(element => {
        if (this.selectedStatus == "") {
          this.selectedStatus = element;
        } else {
          this.selectedStatus = this.selectedStatus + "," + element;
        }
      });
      this.selectedStatus.includes('1') ? this.isViewStatus = true : this.isViewStatus = false;
      this.selectedStatus.includes('2') ? this.isViewedOwnerActive = true : this.isViewedOwnerActive = false;
      this.selectedStatus.includes('4') ? this.isForSaleOwnerActive = true : this.isForSaleOwnerActive = false;
      // this.selectedStatus.includes('3') ? this.isOpenHomeOwnerActive = true : this.isOpenHomeOwnerActive = false;
      this.selectedStatus === 'All' ? this.isAllActiveStatus = true : this.isAllActiveStatus = false;
      this.isStatusValidationMsg = false;
    }
    if (this.selectedStatus == '' &&
      this.isAllActiveStatus == false &&
      this.isViewStatus == false &&
      this.isViewedOwnerActive == false &&
      this.isForSaleOwnerActive == false) {
      this.properties = [];
      this.totalHome = 0;
      this.isStatusValidationMsg = true;
      this.googleMap.bindGoogleMap(searchData.Lat, searchData.Lng, searchData.AddressType);
      return false;
    } else if (
      this.isViewStatus == true &&
      this.isViewedOwnerActive == true &&
      this.isForSaleOwnerActive == true
      // && this.isOpenHomeOwnerActive == true
    ) {
      this.isAllActiveStatus = true;
      this.showLoader();
      // this.googleMap.searchProperties();
    } else {
      this.showLoader();
      // setTimeout(() => {
      //   // this.googleMap.searchProperties();
      // }, 1000);

    }
  }

  OnMinPriceSelect(event) {
    this.googleMap.fromDashboard = false;
    this.selectedMinPrice = event.target.value;
    if (this.selectedMinPrice >= 1000) {
      this.minPz = (this.selectedMinPrice / 1000) + 'k';
    } else {
      if (this.selectedMinPrice) {
        this.selectedMinPrice ? this.minPz = this.selectedMinPrice.toString() : false;
      }

    }
    if (this.selectedMinPrice >= 1000000) {
      this.minPz = (this.selectedMinPrice / 1000000) + 'm';
    }
    this.MaxFocus('');
    if (this.isStatusValidationMsg) {
      if (this.localStorage.getItem('SearchData')) {
        let searchData = JSON.parse(this.localStorage.getItem('SearchData'));
        this.googleMap.bindGoogleMap(searchData.Lat, searchData.Lng, searchData.AddressType);
      }
      // this.bindGoogleMap(searchData.Lat, searchData.Lng, searchData.AddressType);
      return false;
    } else {
      this.showLoader();
      // this.googleMap.searchProperties();
    }
  }

  OnMaxPriceSelect(event) {
    this.googleMap.fromDashboard = false;
    let value = event.target.value;
    value === 0 ? this.selectedMaxPrice = null : this.selectedMaxPrice = value;
    if (this.selectedMaxPrice > 1000) {
      this.maxPz = (this.selectedMaxPrice / 1000) + 'k';
    }
    if (this.selectedMaxPrice >= 1000000) {
      this.maxPz = (this.selectedMaxPrice / 1000000) + 'm';
    }
    if (this.selectedMaxPrice === null) {
      this.maxPz = '';
    }
    this.MinFocus('');
    if (this.isStatusValidationMsg) {
      if (this.localStorage.getItem('SearchData')) {
        let searchData = JSON.parse(this.localStorage.getItem('SearchData'));
        this.googleMap.bindGoogleMap(searchData.Lat, searchData.Lng, searchData.AddressType);
      }
      // this.bindGoogleMap(searchData.Lat, searchData.Lng, searchData.AddressType);
      return false;
    } else {
      this.showLoader();
      // this.googleMap.searchProperties();
    }
  }

  addDays(dateObj, numDays) {
    dateObj.setDate(dateObj.getDate() + numDays);
    return dateObj;
  }
  /** Filterts End */


  /** Add View Count & Cookie Logic Start  */
  onPropertyTileClick(property: Property) {
    if (property) {
      // Start old code for only propertydetailId store in to coockie 
      // let isCookieExist = this.cookieService.check(this.homeViewerCookieName);
      // /**
      //  * count home as viewed cases
      //  * case 1: check home_viewer cookie, if its not exist save browser cookie, addView count for       that home and save the cookie if user loged in.
      //  * case 2: check home_viewer cookie, if its exist then update browser coockie, addView count for   that home and save the cookie if user loged in.
      //  */
      // if (!isCookieExist) {
      //   let homeViewCookie: IHomeViewerCookie = new IHomeViewerCookie();
      //   homeViewCookie.Ids = property.PropertyDetailId.toString();
      //   this.cookieService.set(this.homeViewerCookieName, JSON.stringify(homeViewCookie));
      //   if (this.isUserCookieExist) {
      //     this.savePropertyViewCount(property.PropertyDetailId);
      //   }
      //   this.AddViewCount(property);
      // } else {
      //   let propertiesInCookie: IHomeViewerCookie = JSON.parse(this.cookieService.get(this.homeViewerCookieName));
      //   if (propertiesInCookie) {
      //     let ids = propertiesInCookie.Ids.split(",");
      //     if (!ids.filter(x => parseInt(x) == property.PropertyDetailId)[0]) {
      //       ids.push(property.PropertyDetailId.toString());
      //       let idStr = ids.join(",");
      //       propertiesInCookie.Ids = idStr;
      //       this.cookieService.set(this.homeViewerCookieName, JSON.stringify(propertiesInCookie));
      //       if (this.isUserCookieExist) {
      //         this.savePropertyViewCount(property.PropertyDetailId);
      //       }
      //       this.AddViewCount(property);
      //     }
      //   }
      // }
      //----- End code
      // Start Local storage logic
      // let currentdate = moment(new Date()).format('MM/DD/YYYY');
      // let today = new Date(currentdate);
      // let proparr = JSON.parse(localStorage.getItem("prop_viewer"));
      // let isExistUserKey = this.cookieService.check("UserKey");
      // var UserKey;
      // let propertylen;
      // if (!isExistUserKey) {
      //   var Id = uuidv4();
      //   this.cookieService.set("UserKey", JSON.stringify(Id));
      // }
      // UserKey = this.cookieService.get("UserKey");

      // if (proparr) {
      //   if (proparr.Homes.length > 0) {

      //     let aDate = moment(property.ActivatedDate).format('MM/DD/YYYY');
      //     var ActivatedDate = new Date(aDate);
      //     // console.log("ActivatedDate", ActivatedDate);

      //     var a7Days = moment(ActivatedDate).add(7, 'days').format("MM/DD/YYYY");
      //     var Activate7Days = new Date(a7Days);
      //     // console.log("Activate7Days", Activate7Days);

      //     var a8Days = moment(ActivatedDate).add(8, 'days').format("MM/DD/YYYY");
      //     var Activate8Days = new Date(a8Days);
      //     // console.log("Activate8Days", Activate8Days);

      //     var a14Days = moment(ActivatedDate).add(14, 'days').format("MM/DD/YYYY");
      //     var Activate14Days = new Date(a14Days);
      //     // console.log("Activate14Days", Activate14Days);

      //     var a15Days = moment(ActivatedDate).add(15, 'days').format("MM/DD/YYYY");
      //     var Activate15Days = new Date(a15Days);
      //     // console.log("Activate15Days", Activate15Days);

      //     var a21Days = moment(ActivatedDate).add(21, 'days').format("MM/DD/YYYY");
      //     var Activate21Days = new Date(a21Days);
      //     // console.log("Activate21Days", Activate21Days);

      //     var a22Days = moment(ActivatedDate).add(22, 'days').format("MM/DD/YYYY");
      //     var Activate22Days = new Date(a22Days);
      //     // console.log("Activate22Days", Activate22Days);

      //     var a28Days = moment(ActivatedDate).add(28, 'days').format("MM/DD/YYYY");
      //     var Activate28Days = new Date(a28Days);
      //     // console.log("Activate28Days", Activate28Days);

      //     if (today >= ActivatedDate && today <= Activate7Days) {
      //       let isdiplicatelen = proparr.Homes.filter(t => Number(t.Id) === property.PropertyDetailId && new Date(moment(t.ViewDate).format('MM/DD/YYYY')) >= ActivatedDate &&
      //         new Date(new Date(moment(t.ViewDate).format('MM/DD/YYYY'))) <= Activate7Days).length;
      //       if (isdiplicatelen > 0) {
      //         return false;
      //       } else {
      //         let home = {};
      //         home["Id"] = property.PropertyDetailId.toString();
      //         home["ViewDate"] = moment(new Date()).format('MM/DD/YYYY');
      //         home["UserKey"] = UserKey;
      //         proparr.Homes.push(home);
      //       }
      //     } else if (today >= Activate8Days && today <= Activate14Days) {
      //       let isdiplicatelen = proparr.Homes.filter(t => Number(t.Id) === property.PropertyDetailId && new Date(moment(t.ViewDate).format('MM/DD/YYYY')) >= Activate8Days &&
      //         new Date(moment(t.ViewDate).format('MM/DD/YYYY')) <= Activate14Days).length;
      //       if (isdiplicatelen > 0) {
      //         return false;
      //       } else {
      //         let home = {};
      //         home["Id"] = property.PropertyDetailId.toString();
      //         home["ViewDate"] = moment(new Date()).format('MM/DD/YYYY');
      //         home["UserKey"] = UserKey;
      //         proparr.Homes.push(home);
      //       }
      //     } else if (today >= Activate15Days && today <= Activate21Days) {
      //       let isdiplicatelen = proparr.Homes.filter(t => Number(t.Id) === property.PropertyDetailId && new Date(moment(t.ViewDate).format('MM/DD/YYYY')) >= Activate15Days &&
      //         new Date(moment(t.ViewDate).format('MM/DD/YYYY')) <= Activate21Days).length;
      //       if (isdiplicatelen > 0) {
      //         return false;
      //       } else {
      //         let home = {};
      //         home["Id"] = property.PropertyDetailId.toString();
      //         home["ViewDate"] = moment(new Date()).format('MM/DD/YYYY');
      //         home["UserKey"] = UserKey;
      //         proparr.Homes.push(home);
      //       }
      //     } else if (today >= Activate22Days && today <= Activate28Days) {
      //       let isdiplicatelen = proparr.Homes.filter(t => Number(t.Id) === property.PropertyDetailId && new Date(moment(t.ViewDate).format('MM/DD/YYYY')) >= Activate22Days &&
      //         new Date(moment(t.ViewDate).format('MM/DD/YYYY')) <= Activate28Days).length;
      //       if (isdiplicatelen > 0) {
      //         return false;
      //       } else {
      //         let home = {};
      //         home["Id"] = property.PropertyDetailId.toString();
      //         home["ViewDate"] = moment(new Date()).format('MM/DD/YYYY');
      //         home["UserKey"] = UserKey;
      //         proparr.Homes.push(home);
      //       }
      //     } else {
      //       let home = {};
      //       home["Id"] = property.PropertyDetailId.toString();
      //       home["ViewDate"] = moment(new Date()).format('MM/DD/YYYY');
      //       home["UserKey"] = UserKey;
      //       proparr.Homes.push(home);
      //     }
      //   } else {
      //     proparr = new IPropertyViewerCookie();
      //     proparr.Homes = [];
      //     let home = new IHomeCoockie();
      //     home.Id = property.PropertyDetailId.toString();
      //     home.ViewDate = moment(new Date()).format('MM/DD/YYYY');
      //     home.UserKey = UserKey;
      //     proparr.Homes.push(home);
      //   }
      // }
      // else {
      //   proparr = new IPropertyViewerCookie();
      //   proparr.Homes = [];
      //   let home = new IHomeCoockie();
      //   home.Id = property.PropertyDetailId.toString();
      //   home.ViewDate = moment(new Date()).format('MM/DD/YYYY');
      //   home.UserKey = UserKey;
      //   proparr.Homes.push(home);
      // }

      // if (!this.isUserCookieExist) {
      //   this.AddViewCount(property);
      //   this.savePropertyViewCount(property);
      // } else {
      // if (proparr) {
      //   if (proparr.Homes.length > 0) {
      //     propertylen = proparr.Homes.filter(t => Number(t.Id) === property.PropertyDetailId).length;
      //   }
      //   if (propertylen <= 1) {
      //     this.AddViewCount(property);
      //   }
      // }
      // this.savePropertyViewCount(property);
      // }
      // localStorage.setItem("prop_viewer", JSON.stringify(proparr));
      // End Local storage logic

      if (!property.IsViewedInWeek) {
        let isExist = this.localStorage.getItem("AddedViewCountId");
        if (!isExist) {
          property.PropertyDetailId ? this.localStorage.setItem("AddedViewCountId", property.PropertyDetailId.toString()) : false;
          this.AddViewCount(property)
          this.savePropertyViewCount(property);
        }
      }
    }
  }

  savePropertyViewCount(property) {
    // update cookie in user table
    let propertyViewObj = new PropertyView();
    let arr = [];
    arr.push(property.PropertyDetailId);
    propertyViewObj["PropertyDetailId"] = arr;
    propertyViewObj["UserId"] = this.userId;
    propertyViewObj["ViewDate"] = new Date();
    if (this.cookieService.get("UserKey")) {
      propertyViewObj["UserKey"] = JSON.parse(this.cookieService.get("UserKey"));
    }
    this._unsubscribeAll.add(this.searchResultPageService.savePropertyViewCount(propertyViewObj).subscribe(data => {
      if (data.Success) {
        let propIndex = this.properties.findIndex(p => p.PropertyDetailId == property.PropertyDetailId);
        let markerIndex = this.AllMarkers.findIndex(p => p.title === property.Address);
        this.ngZoneService.run(() => {
          // if (!this.isUserCookieExist) {
          //   propIndex > -1 ? this.properties[propIndex].ViewCount = this.properties[propIndex].ViewCount + 1 : false;
          // } else {
          //   propIndex > -1 ? this.properties[propIndex].ViewCount = this.properties[propIndex].ViewCount + 1 : false;
          // }
          // // this.properties[propIndex].PropertyDetailId = data.Model.PropertyDetailId;
          // propIndex > -1 ? this.properties[propIndex].ViewCount = this.properties[propIndex].ViewCount + 1 : false;
          propIndex > -1 && data.Model.Status ? this.properties[propIndex].Status = data.Model.Status : false;
          propIndex > -1 ? this.properties[propIndex].IsViewedInWeek = true : this.properties[propIndex].IsViewedInWeek = false;
          this.localStorage.removeItem("AddedViewCountId");
          //  this.AllMarkers[markerIndex].label.text = data.Model.ViewCount;
          this.updateTotalViews();
        });
        // Start code for display ViewerStrength on property tile
        // if(this.googleMap){
        //   this.googleMap.changePerformance();
        // }
        // End
        // this.searchProperties();
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      }));
  }

  AddViewCount(property: any) {
    this._unsubscribeAll.add(this.searchResultPageService.savePropertyDetailAndPropertyCRUD(property.PropertyDetailId).subscribe(data => {
      if (data.Success) {
        let propIndex = this.properties.findIndex(p => p.PropertyDetailId == property.PropertyDetailId);
        let markerIndex = this.AllMarkers.findIndex(p => p.title === property.Address);
        this.ngZoneService.run(() => {
          if (!this.isUserCookieExist) {
            propIndex > -1 ? this.properties[propIndex].ViewCount = data.Model.ViewCount : false;
          }
          // this.properties[propIndex].PropertyDetailId = data.Model.PropertyDetailId;
          propIndex > -1 ? this.properties[propIndex].ViewCount = data.Model.ViewCount : false;
          propIndex > -1 ? this.properties[propIndex].Status = data.Model.Status : false;
          propIndex > -1 ? this.properties[propIndex].IsViewedInWeek = true : this.properties[propIndex].IsViewedInWeek = false;
          //  this.AllMarkers[markerIndex].label.text = data.Model.ViewCount;
          this.updateTotalViews();
          // this.setMarkerOnGoogleMap(this.map);
        });
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      }));
  }

  /** Add View Count & Cookie Logic End  */

  /** Like Property Start */
  onTileLikeClick(event: any, property: any) {
    this.onPropertyTileClick(property);
    this.likeProperty(event, property);
  }

  onTileLikeClickChildOutut(property: any) {
    let index = this.properties.findIndex(t => t.PropertyDetailId == property.PropertyDetailId);
    if (index > -1) {
      property = this.properties[index];
    }
    this.onPropertyTileClick(property);
    this.likePropertyChild(property);
  }

  likePropertyChild(property: any) {
    this.isUserCookieExist = this.cookieService.check(this.userCookieName);
    if (!this.isUserCookieExist) {
      this.modalProperty = property;
      this.modalComponent = SignInModalComponent;
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(null, null, 'property/login/' + this.getRandom());
      }
      this.openSignUpDialog("SignInModalComponent");
      // this.router.navigate(['/property/login'+ "/" + this.getRandom()]);
    } else {
      let status = "Like";
      property.UserLiked ? status = "Like" : status = "Dislike";
      // event.srcElement.classList.contains("far") ? (status = "Dislike") : (status = "Like");
      let obj = new PropertyLike();
      obj.PropertyDetailId = property.PropertyDetailId;
      obj.UserId = this.userId;
      this._unsubscribeAll.add(this.searchResultPageService.likeProperty(obj).subscribe(data => {
        if (data.Success) {
          let likeStatus = status == "Dislike" ? "liked" : "unliked";
          let index = this.properties.findIndex(p => p.PropertyDetailId == property.PropertyDetailId);
          // this.properties[index]["UserLiked"] = event.srcElement.classList.contains("far") ? true : false;
          this.mapProperty = this.properties[index];
          this.mapProperty.UserLiked = this.properties[index]["UserLiked"];
          let ToastMessage = "You have successfully " + likeStatus + " " + property.Address + ".";
          // this.getUserInfo();
          this.eventEmitterService.onGetPropertyEventEmmit(property.PropertyDetailId, data.Model.Status);
          this.commonService.toaster(ToastMessage, true);
        }
      },
        error => {
          // this.commonService.toaster(error.statusText, false);
          console.log(error);
          if (error.status == 401) {
            this.commonService.toaster("You have not access for like property module. Please login.", false);
          }
        }));
    }
  }

  likeProperty(event: any, property: any) {
    if (!this.isUserCookieExist) {
      this.modalProperty = property;
      this.modalComponent = SignInModalComponent;
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(null, null, 'property/login/' + this.getRandom());
      }
      this.openSignUpDialog("SignInModalComponent");
      // this.router.navigate(['/property/login'+ "/" + this.getRandom()]);
    } else {
      let status = "Like";
      event.srcElement.classList.contains("far") ? (status = "Dislike") : (status = "Like");
      let obj = new PropertyLike();
      obj.PropertyDetailId = property.PropertyDetailId;
      obj.UserId = this.userId;
      this._unsubscribeAll.add(this.searchResultPageService.likeProperty(obj).subscribe(data => {
        if (data.Success) {
          let likeStatus = status == "Dislike" ? "liked" : "unliked";
          let index = this.properties.findIndex(p => p.PropertyDetailId == property.PropertyDetailId);
          this.properties[index]["UserLiked"] = event.srcElement.classList.contains("far") ? true : false;
          this.mapProperty = this.properties[index];
          this.mapProperty.UserLiked = this.properties[index]["UserLiked"];
          let ToastMessage = "You have successfully " + likeStatus + " " + property.Address + ".";
          // this.getUserInfo();
          // this.eventEmitterService.onGetPropertyEventEmmit('');
          this.commonService.toaster(ToastMessage, true);
        }
      },
        error => {
          // this.commonService.toaster(error.statusText, false);
          console.log(error);
          if (error.status == 401) {
            this.commonService.toaster("You have not access for like property module. Please login.", false);
          }
        }));
    }
  }
  /** Like Property End  */

  /** Claim Property & Make Offer Start  */
  onOwnerBuzzHomeButtonClick(property: any) {
    this.onPropertyTileClick(property);
    this.claimProperty(property);
  }
  claimProperty(prop: any) {
    if (!this.isUserCookieExist) {
      this.modalProperty = prop;
      this.modalComponent = SignInModalComponent;
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(null, null, 'property/login/' + this.getRandom());
      }
      this.openSignUpDialog("SignInModalComponent");
      // this.router.navigate(['/property/login'+ "/" + this.getRandom()]);
    } else {
      // this.claimHomeModal.PropertyDetailId = prop.PropertyDetailId;
      // this.claimHomeModal.PropertyAddress = prop.Address;
      // this.claimHomeModal.show();
      this.modalProperty = prop;
      this.modalComponent = ClaimHomeComponent;
      let address = prop.Address + ", " + prop.Suburb + ", " + prop.City;
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(null, null, 'property/claimhome/' + address.replace(/[\W_]/g, "-") + "/" + prop.PropertyDetailId + "/" + this.getRandom());
      }
      this.openClaimHomeDialog("ClaimHomeComponent", prop.PropertyDetailId, address);
    }
  }
  onMakeOfferButtonClick(property: any) {
    property.PropertyDetailId ? this.onPropertyTileClick(property) : false;
    this.makeOffer(property);
  }
  makeOffer(property: any) {
    if (!this.isUserCookieExist) {
      this.modalProperty = property;
      this.modalComponent = SignInModalComponent;
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(null, null, 'property/login/' + this.getRandom());
      }
      this.openSignUpDialog("SignInModalComponent");
      // this.router.navigate(['/property/login'+ "/" + this.getRandom()]);
    } else {
      this.modalProperty = property;
      this.modalComponent = MakeOfferComponent;
      let address = property.Address + ", " + property.Suburb + ", " + property.City;
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(null, null, 'property/makeoffer/' + address.replace(/[\W_]/g, "-") + "/" + property.PropertyDetailId + "/" + this.getRandom());
      }
      this.openMakeOfferDialog('MakeOfferComponent', property.PropertyDetailId, address);
    }
  }
  reloadViewOnModalSave(event) {
    let index = this.properties.findIndex(p => p.PropertyDetailId == event.PropertyDetailId);
    event.Status == "claim" ? (this.properties[index].IsClaimed = true) : (this.properties[index].UserOffered = true);
    event.Status == "claim" ? (this.properties[index].OwnerId = this.userId) : false;
    event.Status == "claim" ? (this.properties[index].Status = "Viewed / Owner active") : false;

    // if (this.properties[index].Id === this.mapProperty.Id && event.Status == "claim") {
    this.mapProperty.UserOffered = true;
    // }
  }
  /** Claim Property & Make Offer End  */

  /** Edit Property Details Start  */
  onAddEditPhotoDescriptionButtonClick(property: Property) {
    this.onPropertyTileClick(property);
    this.modalProperty = property;
    this.modalComponent = AddEditHomePhotoDescriptionComponent;
    let address = property.Address + ", " + property.Suburb + ", " + property.City;
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, 'property/edit/' + address.replace(/[\W_]/g, "-") + "/" + property.PropertyDetailId + "/" + this.getRandom());
    }
    this.openAddEditPropertyDialog("AddEditHomePhotoDescriptionComponent", property.PropertyDetailId, address);
  }
  /** Edit Property Details End  */

  /** Add, Edit, Delete Property Image Start  */
  onPropertyImageTileClick(event: any, prop: Property) {
    if (event.target.classList.contains('fa-heart') || event.target.classList.contains('claim_' + prop.PropertyDetailId)
      || event.target.classList.contains('edit-property')) {
      return false;
    }
    this.modalProperty = prop;
    this.modalComponent = PropertyImageGalleryComponent;
    this.onPropertyTileClick(prop);
    let address = prop.Address + ", " + prop.Suburb + ", " + prop.City;
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, 'property/detail/' + address.replace(/[\W_]/g, "-") + "/" + prop.PropertyDetailId + "/" + this.getRandom());
    }
    this.openDialog("PropertyImageGalleryComponent", prop.PropertyDetailId, address);
  }

  onPropertyImageTileClick1(prop: Property) {
    // if (event.target.classList.contains('fa-heart') || event.target.classList.contains('claim_' + prop.PropertyDetailId)
    //   || event.target.classList.contains('edit-property')) {
    //   return false;
    // }
    this.modalProperty = prop;
    this.modalComponent = PropertyImageGalleryComponent;
    this.onPropertyTileClick(prop);
    let address = prop.Address + ", " + prop.Suburb + ", " + prop.City;
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, 'property/detail/' + address.replace(/[\W_]/g, "-") + "/" + prop.PropertyDetailId + "/" + this.getRandom());
    }
    this.openDialog("PropertyImageGalleryComponent", prop.PropertyDetailId, address);
  }

  /** Add, Edit, Delete Property Image End  */

  /** Common Function Start  */
  getRouteUrl(term: any) {
    return this.routeConfig.Url("/PropertyData/GetFilteredPropertyData?searchTerm=" + term);
  }
  pressEnterKeyOnSearchTile(event: any) {
    if (event.keyCode == 13) {
      this.PageNum = 1;
      this.totalHome = 0;
      this.properties = [];
      this.searchTerm
        ? this.router.navigate(["/search-result-page", this.searchTerm + "&AT=" + this.searchedAddressType])
        : false;
    }
  }
  updateTotalViews() {
    let total = 0;
    this.properties.forEach(item => (total += item.ViewCount));
    this.ngZoneService.run(() => {
      this.totalView = total;
    });
  }

  /** Common Function End */

  /** Common header methods  starts*/

  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  togglemaplist(toggle: string) {
    if (toggle.toLowerCase() === 'list') {
      this.isListView = true;
      let el: HTMLCollectionOf<Element> = this.document.getElementsByClassName('map-width');
      if (el.length > 0) {
        el[0].classList.remove('show');
        el[0].classList.add('hide');
      }
      let el1: HTMLCollectionOf<Element> = this.document.getElementsByClassName('map-btn');
      if (el1.length > 0) {
        el1[0].classList.add('show');
        el1[0].classList.remove('hide');
      }
      let el2: HTMLCollectionOf<Element> = this.document.getElementsByClassName('list-btn');
      if (el2.length > 0) {
        el2[0].classList.add('hide');
        el2[0].classList.remove('show');
      }
      let cardwidth: HTMLCollectionOf<Element> = this.document.getElementsByClassName('card-width');
      if (cardwidth.length > 0) {
        cardwidth[0].classList.remove("hide");
        cardwidth[0].classList.add("show");
      }
      let addressGrid: HTMLElement = this.document.getElementById('address-grid');
      if (addressGrid) {
        addressGrid.scrollTop = 0;
      }

    }
    else {
      let el: HTMLCollectionOf<Element> = this.document.getElementsByClassName('map-width');
      if (el.length > 0) {
        this.isListView = false;
        el[0].classList.add("show");
        el[0].classList.remove("hide");
      }
      let cardwidth: HTMLCollectionOf<Element> = this.document.getElementsByClassName('card-width');
      if (cardwidth.length > 0) {
        cardwidth[0].classList.add("hide");
        cardwidth[0].classList.remove("show");
      }
      let mapbtn: HTMLCollectionOf<Element> = this.document.getElementsByClassName('map-btn');
      if (mapbtn.length > 0) {
        mapbtn[0].classList.add("hide");
        mapbtn[0].classList.remove("show");
      }
      let listbtn: HTMLCollectionOf<Element> = this.document.getElementsByClassName('list-btn');
      if (listbtn.length > 0) {
        listbtn[0].classList.add("show");
        listbtn[0].classList.remove("hide");
      }
    }
  }

  openNav() {
    this.document.getElementById("mySidenav").style.width = "250px";
  }

  closeNav() {
    this.document.getElementById("mySidenav").style.width = "0";
  }

  SavePropertySearch() {
    if (!this.isUserCookieExist) {
      // this.modalProperty = property;
      this.modalComponent = SignInModalComponent;
      // this.router.navigate(['/property/login'+ "/" + this.getRandom()]);
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(null, null, 'property/login/' + this.getRandom());
      }
      this.openSignUpDialog("SignInModalComponent");
      // this.signInModal.show();
      return false;
    }
    let viewport = {};
    let search;
    if (this.localStorage.getItem('SearchData')) {
      search = JSON.parse(this.localStorage.getItem('SearchData'));
    }

    viewport["SearchTerm"] = this.searchTerm ? this.searchTerm : search.SearchTerm;

    // this.selectedBeds === "" ? this.selectedBeds = null : false;
    viewport["Bedrooms"] = this.selectedBeds;


    // this.selectedBaths === "" ? this.selectedBaths = null : false;
    viewport["Bathrooms"] = this.selectedBaths;

    // this.selectedStatus === "" ? this.selectedStatus = null : false;
    (this.selectedMinPrice === null) ? viewport["MinPrice"] = null : viewport["MinPrice"] = this.selectedMinPrice;
    (this.selectedMaxPrice === null || this.selectedMaxPrice === 0) ? viewport["MaxPrice"] = null : viewport["MaxPrice"] = this.selectedMaxPrice;
    if (this.isAllActiveStatus) {
      let status = this.propertyStatus.find(t => t.Name === "All");
      let Id;
      status ? Id = status.Id : false;
      Id ? viewport["PropertyStatus"] = Id.toString() : false;
    } else {
      viewport["PropertyStatus"] = this.selectedStatus;
    }

    //  get timeperiod
    let timePeriod = this.selectedValue.split("-");
    let from = timePeriod[0];
    let to = timePeriod[1];
    viewport["From"] = from;
    viewport["To"] = to;

    let searchData;
    if (this.localStorage.getItem('SearchData')) {
      searchData = JSON.parse(this.localStorage.getItem('SearchData'));
    }
    let type = searchData.AddressType;
    if (type === "street_address") {
      viewport["AddressComponent"] = searchData.AddressComponent;
      viewport["AddressType"] = type;
    }
    if (this.localStorage.getItem('userId')) {
      let userId = JSON.parse(this.localStorage.getItem('userId'));
      viewport["UserId"] = userId;
    }
    viewport["IsExactMatchBed"] = this.isExactMatchBed;
    viewport["IsExactMatchBath"] = this.isExactMatchBath;
    this._unsubscribeAll.add(this.searchResultPageService.savePropertySearchHistory(viewport).subscribe(data => {
      if (data.Success) {
        let ToastMessage = "You have successfully saved search filter.";
        this.commonService.toaster(ToastMessage, true);
        this.eventEmitterService.onSideBarMenuRefresh();
      } else {
        let ToastMessage = data.ErrorMessage;
        this.commonService.toaster(ToastMessage, false);
      }
      this.selectedStatus === null ? this.selectedStatus = "" : false;
      this.selectedValue === null ? this.selectedValue = "" : false;
      // this.selectedBeds === null ? this.selectedBeds = "" : false;
      // this.selectedBaths === null ? this.selectedBaths = "" : false;
    }));
  }

  RefreshProperty() {
    if (this.isUserCookieExist && this.userId) {
      this.getUserInfo()
    }

    let viewport = {};
    if (this.localStorage.getItem("SearchData")) {
      let sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
      viewport["SwLat"] = sessionData.SwLat;
      viewport["SwLng"] = sessionData.SwLng;
      viewport["NeLat"] = sessionData.NeLat;
      viewport["NeLng"] = sessionData.NeLng;
      viewport["Lat"] = sessionData.Lat;
      viewport["Lng"] = sessionData.Lng;
      viewport["SearchTerm"] = sessionData.SearchTerm;
      viewport["AddressType"] = sessionData.AddressType;
      viewport["AddressComponent"] = sessionData.AddressComponent;
      this.searchTerm = sessionData.SearchTerm;
    }
    console.log("Refresh property call");
    this.showLoader();
    this.googleMap.PageNum = this.PageNum;
    this.googleMap.searchProperties(viewport, false, false, true);
  }

  ClosePopover(pop: any) {
    pop.hide();
  }

  OnBedCbChange(event) {
    this.googleMap.fromDashboard = false;
    this.isExactMatchBed = event.target.checked;
    if (this.isStatusValidationMsg) {
      if (this.localStorage.getItem('SearchData')) {
        let searchData = JSON.parse(this.localStorage.getItem('SearchData'));
        this.googleMap.bindGoogleMap(searchData.Lat, searchData.Lng, searchData.AddressType);
      }
      return false;
    } else {
      this.showLoader();
      // this.googleMap.searchProperties();
    }
  }

  OnBathCbChange(event) {
    this.googleMap.fromDashboard = false;
    this.isExactMatchBath = event.target.checked;
    if (this.isStatusValidationMsg) {
      if (this.localStorage.getItem('SearchData')) {
        let searchData = JSON.parse(this.localStorage.getItem('SearchData'));
        this.googleMap.bindGoogleMap(searchData.Lat, searchData.Lng, searchData.AddressType);
      }
      return false;
    } else {
      this.showLoader();
      // this.googleMap.searchProperties();
    }
  }

  onTermsOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    this.modalComponent = TermsComponent;
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, this.pageName + '/terms' + "/" + this.getRandom());
    }
    this.openTermsDialog("TermsComponent");
    // this.router.navigate(['/property/terms'+ "/" + this.getRandom()]);
  }
  onPrivacyOptionClick() {
    this.modalComponent = TermsComponent;
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, 'property/privacy/' + this.getRandom());
    }
    this.openPrivacyDialog("PrivacyPolicyComponent");
    // this.router.navigate(['/property/privacy'+ "/" + this.getRandom()]);
  }

  onHomebuzzEstimatesOptionClick() {
    this.modalComponent = TermsComponent;
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, 'property/estimate/' + this.getRandom());
    }
    this.openEstimateDialog("HomebuzzEstimatesComponent");
    // this.router.navigate(['/property/estimate'+ "/" + this.getRandom()]);
  }

  getUserInfo() {
    this._unsubscribeAll.add(this.myLikesService.getUserInfo(this.userId).subscribe(data => {
      if (data.Model) {
        this.userPropInfo = data.Model[0];
      }
    }
      // ,
      //   error => {
      //     // this.commonService.toaster(error.statusText, false);
      //   }
    ));
  }

  createMapImageAt45(divId: string, property) {
    let _this = this;
    const lat = parseFloat(property.LatitudeLongitude.split(',')[0]);
    const long = parseFloat(property.LatitudeLongitude.split(',')[1]);
    let latlng = new google.maps.LatLng(lat, long);
    // this.mapsAPILoader.load().then(() => {
    let imagemap = new google.maps.Map(this.document.getElementById(divId), {
      center: latlng,
      fullscreenControl: false,
      zoom: 21,
      streetViewControl: false,
      rotateControl: false,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      scrollwheel: false,
      panControl: false,
      zoomControl: false,
      draggable: false,
      mapTypeControl: false
    });
    imagemap.setTilt(45);

    google.maps.event.addListenerOnce(imagemap, "tilesloaded", function () {
      let el: HTMLCollectionOf<Element> = _this.document.getElementsByClassName('gm-style');
      if (el.length > 0) {
        let id = "#" + divId;
        console.log("query", _this.document.querySelector(id));
        drawDOM(_this.document.querySelector(id))
          .then((group: Group) => {
            // console.log(group);
            return exportImage(group);
          })
          .then((dataUri) => {
            // console.log(dataUri);
            dataUri = dataUri.replace('data:image/png;base64,', '');
            _this.saveImageToserver(dataUri, property);
            // saveAs(dataUri, fileName + '.jpg');
          });
      }
    });
  }

  saveImageToserver(imageBase64: any, property) {
    const obj = {
      "propertyId": property.PropertyId,
      "imageData": imageBase64
    };
    this._unsubscribeAll.add(this.searchResultPageService.saveGoogleMapAsImage(obj).subscribe((res: any) => {
      if (res.Success) {
        property.GoogleImage = res.Model.GoogleImage;
        let index = this.properties.findIndex(t => t.PropertyId === property.PropertyId);
        index > -1 ? this.properties[index].GoogleImage = res.Model.GoogleImage : null;
        index > -1 ? this.properties[index].isLoadGoogleImageDiv = false : false;
        // this.noImages = false;
      }
    },
      (error: any) => {
        console.log(error);
      }));
  }

  openDialog(ComponentName, PropertyDetailId, address): void {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = ComponentName + "_" + PropertyDetailId + "_" + this.getRandom();
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "970px";
    address = this.getAddressFormated(address);
    const dialogRef = this.dialog.open(PropertyImageGalleryComponent, dialogConfig);
    dialogRef.componentInstance.PropertyDetailId = PropertyDetailId;
    dialogRef.componentInstance.PropertyAddress = address;
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        if (typeof this.window !== 'undefined' && this.window.history) {
          this.window.history.pushState(this.properties, null, environment.StaticUrl.toString());
        }
      }
    });
  }

  openClaimHomeDialog(ComponentName, PropertyDetailId, address): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = ComponentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(ClaimHomeComponent, dialogConfig);
    address = this.getAddressFormated(address);
    dialogRef.componentInstance.PropertyDetailId = PropertyDetailId;
    dialogRef.componentInstance.PropertyAddress = address;
    dialogRef.afterClosed().subscribe(res => {
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(this.properties, null, environment.StaticUrl.toString());
      }
    });
  }

  openMakeOfferDialog(ComponentName, PropertyDetailId, address): void {
    address = this.getAddressFormated(address);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = ComponentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    dialogConfig.closeOnNavigation = true;
    const dialogRef = this.dialog.open(MakeOfferComponent, dialogConfig);
    dialogRef.componentInstance.PropertyDetailId = PropertyDetailId;
    dialogRef.componentInstance.PropertyAddress = address;
    dialogRef.afterClosed().subscribe(res => {
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(this.properties, null, environment.StaticUrl.toString());
      }
      return false;
    });
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
        this.dialog.openDialogs.length > 0 ? this.dialog.openDialogs[0].close(true) : false;
        // this.dialog.closeAll();
        this.router.navigate(["/login"]);
      } else {
        if (typeof this.window !== 'undefined' && this.window.history) {
          this.window.history.pushState(this.properties, null, environment.StaticUrl.toString());
        }
      }
    });
  }

  openAddEditPropertyDialog(componentName, PropertyDetailId, address) {
    address = this.getAddressFormated(address);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = componentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "465px";
    const dialogRef = this.dialog.open(AddEditHomePhotoDescriptionComponent, dialogConfig);
    dialogRef.componentInstance.PropertyDetailId = PropertyDetailId;
    dialogRef.componentInstance.PropertyAddress = address;
    dialogRef.afterClosed().subscribe(res => {
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(this.properties, null, environment.StaticUrl.toString());
      }
    });
  }

  openTermsDialog(componentName) {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = componentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(TermsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(null, null, this.pageName);
      }
    });
  }

  openPrivacyDialog(componentName) {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = componentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(PrivacyPolicyComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(null, null, this.pageName);
      }
    });
  }

  openEstimateDialog(componentName) {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = componentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(HomebuzzEstimatesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(null, null, this.pageName);
      }
    });
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
        if (typeof this.window !== 'undefined' && this.window.history) {
          this.window.history.pushState(this.properties, null, environment.StaticUrl.toString());
        }
      }
    });
  }

  openNotifyPropertyDialog(componentName, PropertyDetailId: number, property?: Property) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = componentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(NotifyPropertyComponent, dialogConfig);
    dialogRef.componentInstance.PropertyDetailId = PropertyDetailId;
    if (property) {
      dialogRef.componentInstance.property = property;
    }
    dialogRef.afterClosed().subscribe(res => {
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(this.properties, null, environment.StaticUrl.toString());
      }
    });
  }

  openMyLikesDialog(componentName) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = componentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(MyLikesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(this.properties, null, environment.StaticUrl.toString());
      }
    });
  }

  openMyHomesDialog(componentName) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = componentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(MyHomesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(this.properties, null, environment.StaticUrl.toString());
      }
    });
  }

  openMyOffersDialog(componentName) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = componentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(MyOffersComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(this.properties, null, environment.StaticUrl.toString());
      }
    });
  }

  openMySearchesDialog(componentName) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = componentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(MySearchComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(this.properties, null, environment.StaticUrl.toString());
      }
    });
  }

  openRemoveOfferDialog(componentName, Id, address) {
    address = this.getAddressFormated(address);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = componentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(RemovePropertyOfferComponent, dialogConfig);
    dialogRef.componentInstance.offerId = +Id;
    dialogRef.componentInstance.address = address;
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.myOffersService.removeMyOffer(res.Id).subscribe(data => {
          let ToastMessage = "You have successfully removed your offer of " + res.Address + ". A confirmation email has been sent to you.";
          this.commonService.toaster(ToastMessage, true);
          this.eventEmitterService.onNegotiatePropertyEventEmmit(res.PropertyDetailId);
        },
          error => {
            // this.commonService.toaster(error.statusText, false);
            console.log(error);
            if (error.status == 401) {
              this.commonService.toaster("You have not access for property offer module. Please login.", false);
            }
          });
      }
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(this.properties, null, environment.StaticUrl.toString());
      }
    });
  }

  openUnclaimDialog(componentName, PropertyDetailId, address) {
    address = this.getAddressFormated(address);
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = componentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    // dialogConfig.data = this.modalProperty;
    const dialogRef = this.dialog.open(UnclaimHomeComponent, dialogConfig);
    dialogRef.componentInstance.propertyDetailId = +PropertyDetailId;
    dialogRef.componentInstance.address = address;
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._unsubscribeAll.add(this.myHomeService.unClaim(res).subscribe(data => {
          if (data.Success) {
            let ToastMessage = "You have successfully unclaimed " + res.Address + ". A confirmation email has been sent to you.";
            this.commonService.toaster(ToastMessage, true);
            // this.myClaimedHomes = this.myClaimedHomes.filter(home => home.PropertyDetailId !== data.Model.PropertyDetailId);
            this.eventEmitterService.onGetPropertyEventEmmit(res.PropertyDetailId, "UnClaimProperty");
            //   this.myhomeoutput.emit();
          }
        },
          error => {
            // this.commonService.toaster(error.statusText, false);
            if (error.status == 401) {
              this.commonService.toaster("You have not access for claim property module. Please login.", false);
            }
            console.log(error);
          }));
      }
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(this.properties, null, environment.StaticUrl.toString());
      }
    });
  }

  openNegotiateOfferDialog(componentName, Id, address) {
    address = this.getAddressFormated(address);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = componentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(NegotiatePropertyOfferComponent, dialogConfig);
    dialogRef.componentInstance.offerId = +Id;
    dialogRef.componentInstance.address = address;
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.eventEmitterService.onNegotiatePropertyEventEmmit(res.PropertyDetailId);
      }
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(this.properties, null, environment.StaticUrl.toString());
      }
    });
  }

  openUploadPhotoDialog(componentName, PropertyDetailId, address, isHidePhotoUploadDiv?: boolean) {
    address = this.getAddressFormated(address);
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = componentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(UploadPhotoDescriptionComponent, dialogConfig);
    dialogRef.componentInstance.propertyDetailId = +PropertyDetailId;
    dialogRef.componentInstance.address = address;
    if (isHidePhotoUploadDiv) {
      dialogRef.componentInstance.isHidePhotoUploadDiv = isHidePhotoUploadDiv;
    }
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.eventEmitterService.onGetPropertyEventEmmit(res.PropertyDetailId);
      }
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(this.properties, null, environment.StaticUrl.toString());
      }
    });
  }

  openPropertyImageModal(prop: Property) {
    this.modalProperty = prop;
    this.modalComponent = PropertyImageGalleryComponent;
    let address = prop.Address + ", " + prop.Suburb + ", " + prop.City;
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, 'property/detail/' + address.replace(/[\W_]/g, "-") + "/" + prop.PropertyDetailId + "/" + this.getRandom());
    }
    this.openDialog("PropertyImageGalleryComponent", prop.PropertyDetailId, address);
  }

  openTransferOwnershipDialog(ComponentName, PropertyDetailId, address, isAgent?: boolean): void {
    let url = this.router.url.split("/");
    if (isAgent) {
      this.pageName = url[2];
    } else {
      this.pageName = url[1];
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = ComponentName;
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(TransferOwnershipComponent, dialogConfig);
    address = this.getAddressFormated(address);
    dialogRef.componentInstance.PropertyDetailId = PropertyDetailId;
    dialogRef.componentInstance.PropertyAddress = address;
    dialogRef.afterClosed().subscribe(res => {
      if (typeof this.window !== 'undefined' && this.window.history) {
        if (isAgent) {
          this.window.history.pushState(null, null, "agent/" + this.pageName);
        } else {
          this.window.history.pushState(null, null, this.pageName);
        }
      }
    });
  }

  getAddressFormated(address: string) {
    address = address.split("--").join(", ");
    address = address.split("-").join(" ");
    return address;
  }

  refreshPage() {
    this.properties = this.googleMap.properties;
    this.isLoaded = this.googleMap.isLoaded;
    this.isLoading = this.googleMap.isLoading;
    this.searchedTerm = this.googleMap.searchedTerm;
    this.totalHome = this.googleMap.totalHome;
    this.subHurbPropertyInfo = this.googleMap.subHurbPropertyInfo;
    this.isLoadSubHurbInfo = this.googleMap.isLoadSubHurbInfo;
    this.subHurbName = this.googleMap.subHurbName;
    this.totalView = this.googleMap.totalView;
    this.hideLoader();
  }

  updateProperty(Obj: any) {
    let index = this.properties.findIndex(t => t.PropertyDetailId === Obj.PropertyDetailId);
    if (Obj.Action == "Dislike") {
      index > -1 ? this.properties[index].UserLiked = false : false;
    } else if (Obj.Action == "Like") {
      index > -1 ? this.properties[index].UserLiked = true : false;
    } else if (Obj.Action == "OfferMade") {
      index > -1 ? this.properties[index].UserOffered = true : false;
    } else if (Obj.Action == "RemoveOffer") {
      index > -1 ? this.properties[index].UserOffered = false : false;
    } else if (Obj.Action == "ClaimProperty") {
      index > -1 ? this.properties[index].IsClaimed = true : false
      index > -1 ? this.properties[index].OwnerId = this.userId : false;
      if (this.rolename == "Agent" || this.rolename == "Agent_Admin") {
        this.properties[index].AgentOption = this.agentOption.find(t => t.Id == 1).Option;
        this.properties[index].AgentOptionArr = this.agentOption.filter(t => t.Id != 1);
        this.properties[index].AgentId = this.userId;
        this.properties[index].AgentOptionId = 1;
        if (this.properties[index].IsClaimed) {
          this.properties[index].AgentOptionArr = this.properties[index].AgentOptionArr.filter(t => t.Id != 1);
        }
      }
    } else if (Obj.Action == "UnClaimProperty") {
      index > -1 ? this.properties[index].IsClaimed = false : false;
      index > -1 ? this.properties[index].OwnerId = null : false;
      index > -1 ? this.properties[index].Status = "Not listed" : null;
      index > -1 ? this.properties[index].IsShowAskingPrice = false : false;
      index > -1 ? this.properties[index].AskingPrice = null : false;
    } else if (Obj.Action == "UpdateProperty") {
      if (index > -1) {
        this.properties[index].AskingPrice = Obj.Model.AskingPrice;
        this.properties[index].Bedrooms = Obj.Model.Bedrooms;
        this.properties[index].Bathrooms = Obj.Model.Bathrooms;
        this.properties[index].Landarea = Obj.Model.Landarea;
        this.properties[index].Carparks = Obj.Model.Carparks;
        let Status = Obj.Model.HomeType;
        Status == "for sale" ? this.properties[index].Status = "For sale" : this.properties[index].Status = "Pre-market";
        this.properties[index].Day = Obj.Model.Day;
        this.properties[index].Time = Obj.Model.Time;
        this.properties[index].IsShowAskingPrice = Obj.Model.IsShowAskingPrice;
        // Start code for display ViewerStrength on property tile
        // if(this.googleMap){
        //   this.googleMap.changePerformance();
        // }
        // End
      }
    } else if (Obj.Action == "UploadImage") {
      this.properties[index].ImageIdList = Obj.Model;
    } else if (Obj.Action == "UpdateDesc") {
      this.properties[index].Description = Obj.Model.Description;
    } else if (Obj.Action == "RemoveImage") {
      let imageIndex = this.properties[index].ImageIdList.findIndex(t => t == Obj.Model.Id);
      imageIndex > -1 ? this.properties[index].ImageIdList.splice(imageIndex, 1) : false;
    }
  }

  getAllAgentption() {
    this._unsubscribeAll.add(this.searchResultPageService.getAllAgentOptions().subscribe((data: any) => {
      if (data.Success) {
        this.agentOption = data.Model;
        this.gridResult.agentOption = this.agentOption;
        this.googleMap.agentOption = this.agentOption;
      } else {
        this.agentOption = [];
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for agent module. Please login.", false);
        }
        console.log(error);
      }));
  }

  searchProperties(event?: any) {
    if (event) {
      this.PageNum = event;
      this.googleMap.PageNum = event;
    }
    let searchData = JSON.parse(this.localStorage.getItem('SearchData'));
    this.googleMap.bindGoogleMap(searchData.Lat, searchData.Lng, searchData.AddressType);
    // this.googleMap.searchProperties();
  }

  ngOnDestroy(): any {
    // this.eventEmitterService.subsVar.unsubscribe();
    this.subsVar.unsubscribe();
    this._unsubscribeAll.unsubscribe();
  }
  ngOnChanges() {
    let isMobile = /iPhone|iPod|Android/i.test(this.window.navigator.userAgent);
    if (isMobile) {
      this.togglemaplist('map');
    }
  }

  ngAfterViewInit() {
    // this.window.addEventListener('scroll', this.scrollEvent, true);
  }
}