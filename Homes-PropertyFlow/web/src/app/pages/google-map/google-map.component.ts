import { Component, OnInit, NgZone, Input, ElementRef, ViewChild, Output, EventEmitter, OnChanges, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
// import { } from "googlemaps";
import { MapsAPILoader, Polyline } from '@agm/core';
import { Property, SubHurbPropertyInfo, IHomeViewerCookie, PropertyView, PropertyStatusVM, IPropertyViewerCookie, IHomeCoockie, PropertyLike, AgentOption, PropertyDetail, RankedPropertyVM } from '../search-result-page/search-result-page';
import { CookieService } from 'ngx-cookie-service';
import { SearchResultPageService } from '../search-result-page/search-result-page.service';
import { environment } from '../../../environments/environment';
import { FormControl } from '@angular/forms';
import { drawDOM, Group, exportImage } from '@progress/kendo-drawing';
import * as moment from 'moment';
import { EventEmitterService } from '../../../app/event-emitter.service';
import { CommonService } from '../../../app/core/services/common.service';
import { CommonModalService } from "../../../app/common-modal.service";
import { MatDialog } from '@angular/material';
import { AuthMessageComponent } from '../../../app/modal/auth-message/auth-message.component';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { CurrencyPipe } from '@angular/common';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

declare var google: any;
declare var Tooltip: any;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild("popListTemplate", { static: false }) popListTemplate: ElementRef;
  @ViewChild("popTemplate", { static: false }) popTemplate: ElementRef;
  @Input() pageName: string = '';
  public fromDashboard: boolean;
  public properties: Property[] = [];
  public isLoaded: boolean;
  public isLoading: boolean;
  @Input() selectedValue: string = "0-28";
  @Input() selectedBeds: string = '';
  @Input() selectedBaths: string = '';
  @Input() selectedStatus: string;
  @Input() selectedMinPrice: number = null;
  @Input() selectedMaxPrice: number = null;
  @Input() minPz: string = '';
  @Input() maxPz: string = '';
  @Input() searchTerm: string = "";
  @Input() PageNum: number = 1;
  @Input() SearchedAddress: string;
  @Input() isExactMatchBed: boolean = false;
  @Input() isExactMatchBath: boolean = false;
  @Input() isAllActiveStatus: boolean = true;
  @Input() updatedPropertyDetailId: number;
  @Input() subHurbName: string;
  @Input() propertyId: number;
  @Input() rolename: string;
  @Output() refreshMap: EventEmitter<any> = new EventEmitter<any>();
  @Output() makeOfferBtn: EventEmitter<any> = new EventEmitter<any>();
  @Output() ownerProp: EventEmitter<any> = new EventEmitter<any>();
  @Output() editProp: EventEmitter<any> = new EventEmitter<any>();
  @Output() propImageTile: EventEmitter<any> = new EventEmitter<any>();
  @Output() termsModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() privacyModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() estimateModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() showMarker: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeMarker: EventEmitter<any> = new EventEmitter<any>();
  @Output() likeProp: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("canvas", { static: false }) canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  public agentOption: AgentOption[] = [];
  public username: string;
  public isSigleAddresssearche: boolean;
  public isGoogleMapMarkerClicked: boolean = false;
  public isGoogleMapMarkerListClicked: boolean;
  public totalView: number = 0;
  public totalHome: number = 0;
  public homeViewerCookieName: string = "home_viewer";
  public propertyViewerCookieName: string = "prop_viewer";
  public searchPlaceHolder: string = "Enter an address, street or suburb";
  public searchTermViewPort: any = {};
  public period: number = 28;
  public homeViewerCookie: IHomeViewerCookie;
  public mapProperty: Property;
  public show: boolean = false;
  public buttonName: any = 'Show';
  public propertyViewObj: PropertyView;
  public searchedTerm: string;
  public addressList: any;
  public Image_Url = environment.APIURL.toString();
  public searchControl: FormControl;
  public searchedAddressType: string;
  public map: google.maps.Map;
  public isTileView: boolean = true;
  public PageSize: number = 100;
  public totalProperties: number = 0;
  public scrollOffset: number = 0;
  public zoomCalled: boolean;
  public mapType: string = "roadmap";
  public marker: any;
  public dublicateProperties: Property[] = [];
  public url: string;
  public globalzoom: number;
  public AllMarkers: any[] = [];
  public showAllMarkers: any[] = [];
  public isListView: boolean = false;
  public previousInfoWindow: any;
  public markerInfoWindow: any;
  public markerPreviousInfoWindow: any;
  public markerText: string;
  public isViewStatus: boolean = true;
  public isViewedOwnerActive: boolean = true;
  public isOpenHomeOwnerActive: boolean = true;
  public isForSaleOwnerActive: boolean = true;
  public propertySearchHistoryId: number = 0;
  public isStatusValidationMsg: boolean = false;
  public propertyStatus: PropertyStatusVM[] = [];
  public subHurbPropertyInfo: SubHurbPropertyInfo;
  public isLoadSubHurbInfo: boolean = false;
  public UserKey: any;
  public subHurbObj: any;
  public randomNo: number;
  public modalProperty: Property;
  public modalComponent: any;
  public isLoadPage: boolean = false;
  public isUserExist: boolean;
  public userCookieName: string = "user";
  public isUserCookieExist: boolean = this.cookieService.check(this.userCookieName);
  public userId: number;
  public copyPreviousSubHurbName: string;
  public maxViewCount: number;
  public subsVar = new Subscription();
  public _unsubscribeAll = new Subscription();
  public rankedVM: RankedPropertyVM[] = [];
  public maxRankedVM: RankedPropertyVM[] = [];
  public minRankedVM: RankedPropertyVM[] = [];
  public stableRankedVM: RankedPropertyVM[] = [];
  public maxRankedArr: RankedPropertyVM[] = [];
  public minRankedArr: RankedPropertyVM[] = [];
  public centerPolyLinePropertyId: number;
  public isBrowser: boolean;
  public userPath: any;
  public polylines: Polyline[] = [];
  public userMarker: any;
  public userLowRankPropertyId: number;
  public userHighRankPropertyId: number;
  public AllCenteredMarkers: any[] = [];
  public htmlMarkers: any[] = [];
  public htmlMarker: any;
  public markerOverlay: any;
  public lat: any;
  public lng: any;
  public pos: any;
  public isDblClicked: boolean;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private mapsAPILoader: MapsAPILoader,
    private cookieService: CookieService,
    private searchResultPageService: SearchResultPageService,
    private ngZoneService: NgZone,
    private eventEmitterService: EventEmitterService,
    private commonService: CommonService,
    private currencyPipe: CurrencyPipe,
    public dialog: MatDialog
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.randomNo = this.getRandom();
    this.isUserExist = this.cookieService.check("user");
    this.userId = this.isUserCookieExist ? parseInt(this.localStorage.getItem("userId")) : null;
  }

  ngOnInit() {

    this.subsVar.add(this.eventEmitterService.mouseHoverOnMarker.subscribe(
      (element: any) => {
        this.showMarkerPin(element);
      }
    ));

    this.subsVar.add(this.eventEmitterService.mouseOutOnMarker.subscribe(
      (element: any) => {
        this.removeMarkerPin(element);
      }
    ));

    this.subsVar.add(this.eventEmitterService.agentOptionEmit.subscribe(
      (element: any) => {
        this.updateAgentOptionEvent(element);
      }
    ));
    this.subsVar.add(this.eventEmitterService.invokeSearchResultPageComponentFunction.subscribe(
      (Obj: any) => {
        if (Obj.Action != undefined) {
          let index = this.properties.findIndex(t => t.PropertyDetailId === Obj.PropertyDetailId);
          if (this.mapProperty && this.mapProperty.PropertyDetailId == Obj.PropertyDetailId) {
            if (Obj.Action == "Dislike") {
              index > -1 ? this.properties[index].UserLiked = false : false;
            } else if (Obj.Action == "Like") {
              index > -1 ? this.properties[index].UserLiked = true : false;
            }
            else if (Obj.Action == "ClaimProperty") {
              let agentOption = this.agentOption.find(t => t.Id == 1);
              index > -1 ? this.properties[index].IsClaimed = true : false;
              index > -1 ? this.properties[index].OwnerId = this.userId : null;
              index > -1 ? this.properties[index].Status = "Pre-market" : null;
              // if (this.rolename == "Agent") {
              //   index > -1 ? this.properties[index].AgentOptionId = agentOption.Id : null;
              //   index > -1 ? this.properties[index].AgentOption = agentOption.Option : null;
              //   index > -1 ? this.properties[index].IsAgentListProperty = true : false;
              //   index > -1 ? this.properties[index].AgentId = this.userId : false;
              // }
              if (this.rolename == "Agent" || this.rolename == "Agent_Admin") {
                let agentOption = this.agentOption.find(t => t.Id == 1);
                index > -1 ? this.properties[index].AgentOption = agentOption.Option : null;
                index > -1 ? this.properties[index].IsAgentListProperty = true : false;
                index > -1 ? this.properties[index].AgentId = this.userId : false;
                this.changeAgentOption(agentOption, this.properties[index]);
              }
            } else if (Obj.Action == "UnClaimProperty") {
              index > -1 ? this.properties[index].IsClaimed = false : false;
              index > -1 ? this.properties[index].OwnerId = null : this.userId;
              index > -1 ? this.properties[index].Status = "Not listed" : null;
              index > -1 ? this.properties[index].IsShowAskingPrice = false : false;
              index > -1 ? this.properties[index].AskingPrice = null : false;
            }
            else if (Obj.Action == "OfferMade") {
              index > -1 ? this.properties[index].UserOffered = true : false;
            } else if (Obj.Action == "RemoveOffer") {
              index > -1 ? this.properties[index].UserOffered = false : false;
            }
            this.mapProperty = this.properties[index];
          }
        }
      }
    ));

    // if (isPlatformBrowser(this.platformId)) {
    this.mapsAPILoader.load().then(() => {
      if (this.pageName === "SearchResultPage") {
        this.loadData();
      } else if (this.pageName === "PropertyImageGalleryPage") {
        // this.searchSubHurbProperties();
        this.getSubHurbLatLong(this.subHurbName);
      }

      this.initializeAllClass();
    });
    // }
  }

  initializeAllClass() {
    this.mapProperty = new Property();
    this.searchControl = new FormControl();
  }

  loadData() {
    if (!this.SearchedAddress) {
      this.fromDashboard = true;
      if (this.localStorage.getItem("SearchData")) {
        this.searchTermViewPort = JSON.parse(this.localStorage.getItem("SearchData"));
      } else {
        this.searchTermViewPort = null;
      }
      if (this.searchTermViewPort) {
        this.searchTerm = this.searchTermViewPort.SearchTerm;
        this.properties = [];
        console.log('load data method');
        console.log('1st call');
        this.getSortAddress();
        if (this.copyPreviousSubHurbName !== this.subHurbName || this.copyPreviousSubHurbName == "" || this.subHurbName == "") {
          this.isLoadSubHurbInfo = false;
          this.subHurbPropertyInfo = undefined;
          if (this.searchTermViewPort.AddressType != "street_address") {
            if (this.fromDashboard == true) {
              this.copyPreviousSubHurbName = this.subHurbName;
            }
            this.getSubHurbInfo(this.searchTermViewPort);
          } else {
            this.getSubHurbLatLong(this.subHurbName);
          }
        }
        this.searchTermViewPort.AddressType != "street_address"
          // ? this.searchProperties(this.searchTermViewPort)
          ? this.bindGoogleMap(this.searchTermViewPort.Lat, this.searchTermViewPort.Lng, this.searchTermViewPort.AddressType)
          : this.saveProperty(this.searchTermViewPort);
      } else {
        let viewPort = {};
        viewPort["SwLat"] = -36.81729277023262;
        viewPort["SwLng"] = 174.69256184283904;
        viewPort["NeLat"] = -36.80540416822095;
        viewPort["NeLng"] = 174.73252675716094;
        viewPort["Lat"] = -36.8113487;
        viewPort["Lng"] = 174.7125443;
        viewPort["SearchTerm"] = "Auckland, New zealand";
        viewPort["Zoom"] = 15;
        this.searchTermViewPort = viewPort;
        console.log('1st call');
        this.getAddressLatLong("Auckland, New zealand", true);
      }
    }
  }

  loadSubHurbData() {
    if (this.localStorage.getItem("SearchData")) {
      this.searchTermViewPort = JSON.parse(this.localStorage.getItem("SearchData"));
    }
    if (this.searchTermViewPort) {
      this.searchTerm = this.subHurbName;
      this.properties = [];
      console.log('1st call');
      console.log('load subhurb data method');
      this.searchTermViewPort.AddressType != "street_address"
        ? this.searchProperties(this.searchTermViewPort)
        : this.saveProperty(this.searchTermViewPort);
    } else {
      let viewPort = {};
      viewPort["SwLat"] = -36.81729277023262;
      viewPort["SwLng"] = 174.69256184283904;
      viewPort["NeLat"] = -36.80540416822095;
      viewPort["NeLng"] = 174.73252675716094;
      viewPort["Lat"] = -36.8113487;
      viewPort["Lng"] = 174.7125443;
      viewPort["SearchTerm"] = "Auckland, New zealand";
      viewPort["Zoom"] = 15;
      this.searchTermViewPort = viewPort;
      console.log('1st call');
      this.searchProperties(this.searchTermViewPort);
      this.localStorage.setItem("SearchData", JSON.stringify(viewPort));
    }
  }

  searchProperties(searchTermViewPort?: any, isSkipMapLoad?: boolean, isMarkerSet?: boolean, isScroll?: boolean) {
    this.isLoaded = true;
    if (this.isStatusValidationMsg) {
      if (this.localStorage.getItem('SearchData')) {
        let searchData = JSON.parse(this.localStorage.getItem('SearchData'));
        this.bindGoogleMap(searchData.Lat, searchData.Lng, searchData.AddressType);
      }
      this.getSortAddress();
      this.isLoaded = false;
      this.isLoading = false;
      return false;
    }
    let viewport = {};
    if (searchTermViewPort) {
      let timePeriod = this.selectedValue.split("-");
      let from = timePeriod[0];
      let to = timePeriod[1];
      viewport["From"] = from;
      viewport["To"] = to;
      viewport["SwLat"] = searchTermViewPort.SwLat;
      viewport["SwLng"] = searchTermViewPort.SwLng;
      viewport["NeLat"] = searchTermViewPort.NeLat;
      viewport["NeLng"] = searchTermViewPort.NeLng;
      viewport["UserId"] = this.userId;
      viewport["PageNum"] = this.PageNum;
      viewport["AddressComponent"] = searchTermViewPort.AddressComponent;
      viewport["AddressType"] = searchTermViewPort.AddressType;
      viewport["SearchTerm"] = searchTermViewPort.SearchTerm;
      this.searchTerm = searchTermViewPort.SearchTerm;
      viewport["isSurroundingSuburb"] = this.localStorage.getItem("isSurroundingSuburb");
      if (this.fromDashboard) {
        viewport["AddressComponent"] = null;
        viewport["AddressType"] = null;
      }
    } else {
      viewport["SwLat"] = this.map
        .getBounds()
        .getSouthWest()
        .lat();
      viewport["SwLng"] = this.map
        .getBounds()
        .getSouthWest()
        .lng();
      viewport["NeLat"] = this.map
        .getBounds()
        .getNorthEast()
        .lat();
      viewport["NeLng"] = this.map
        .getBounds()
        .getNorthEast()
        .lng();

      viewport["SearchTerm"] = this.searchTerm;

      //  get timeperiod
      let timePeriod = this.selectedValue.split("-");
      let from = timePeriod[0];
      let to = timePeriod[1];
      viewport["From"] = from;
      viewport["To"] = to;
    }

    this.selectedBeds === "" ? viewport["Bedrooms"] = null : viewport["Bedrooms"] = this.selectedBeds;
    this.selectedBaths === "" ? viewport["Bathrooms"] = null : viewport["Bathrooms"] = this.selectedBaths;
    (this.isAllActiveStatus) ? viewport["Status"] = null : viewport["Status"] = this.selectedStatus;
    (this.selectedMaxPrice === null || this.selectedMaxPrice === 0) ? viewport["MaxPrice"] = null : viewport["MaxPrice"] = this.selectedMaxPrice;
    (this.selectedMinPrice === null || this.selectedMinPrice === 0) ? viewport["MinPrice"] = null : viewport["MinPrice"] = this.selectedMinPrice;
    this.isExactMatchBath ? viewport["IsExactMatchBath"] = true : false;
    this.isExactMatchBed ? viewport["IsExactMatchBed"] = true : false;
    // set latest map latlong in localstorage
    let sessionData;
    if (this.localStorage.getItem('SearchData')) {
      sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
      sessionData.SwLat = viewport["SwLat"];
      sessionData.NeLat = viewport["NeLat"];
      sessionData.SwLng = viewport["SwLng"];
      sessionData.NeLng = viewport["NeLng"];
    }

    viewport["AddressComponent"] = null;
    viewport["AddressType"] = null;
    viewport["PageNum"] = this.PageNum;
    this.isUserExist ? (viewport["UserId"] = this.userId ? this.userId : "") : viewport["UserId"] = "";

    if (!isSkipMapLoad) {
      this.getSortAddress();
    }
    if (this.copyPreviousSubHurbName !== this.subHurbName || this.copyPreviousSubHurbName == "" || this.subHurbName == "") {
      this.isLoadSubHurbInfo = false;
      this.subHurbPropertyInfo = undefined;
      if (sessionData && sessionData.AddressType != "street_address") {
        if (this.fromDashboard == true) {
          this.copyPreviousSubHurbName = this.subHurbName;
        }
        this.getSubHurbInfo(viewport);
      } else {
        this.getSubHurbLatLong(this.subHurbName);
      }
    }
    viewport["isSurroundingSuburb"] = this.localStorage.getItem("isSurroundingSuburb");
    this._unsubscribeAll.add(this.searchResultPageService.getProperties(viewport).subscribe(data => {
      if (data.Success) {
        let searchdata;
        if (this.localStorage.getItem('SearchData')) {
          searchdata = JSON.parse(this.localStorage.getItem('SearchData'));
        }
        if (!isScroll) {
          setTimeout(() => {
            let addressGrid: HTMLElement = this.document.getElementById('address-grid');
            addressGrid.scrollTop = 0;
          }, 500);
        } else {
          let addressGrid: HTMLElement = this.document.getElementById('address-grid');
          addressGrid.scrollTop = 0;
          this.PageNum == 1 ? false : addressGrid.scrollTop = this.scrollOffset;
        }
        if (this.PageNum == 1) {
          this.properties = [];
          this.properties = data.Model;
        }
        this.isLoading = false;
        if (this.totalHome != (this.PageNum * 100) && this.PageNum > 1) {
          this.properties = this.PageNum == 1 ? data.Model : this.properties.concat(data.Model);
        }
        // Start code for display ViewerStrength on property tile
        this.changePerformance(true);
        // this.getLast90Views(true);
        // End
        this.polylines.forEach(element => {
          element.setMap(null);
        });
        this.polylines = [];
        this.userLowRankPropertyId = undefined;
        this.userHighRankPropertyId = undefined;
        this.totalHome = this.properties.length;

        this.properties.forEach(element => {
          if (element.AgentOptionId != null && element.AgentOption !== null) {
            element.AgentOptionArr = this.agentOption.filter(t => t.Id != element.AgentOptionId);
            if (element.IsClaimed) {
              element.AgentOptionArr = element.AgentOptionArr.filter(t => t.Id != 1);
            }
          } else {
            if (JSON.stringify(this.agentOption)) {
              element.AgentOptionArr = JSON.parse(JSON.stringify(this.agentOption));
            }
            if (element.IsClaimed) {
              element.AgentOptionArr = element.AgentOptionArr.filter(t => t.Id != 1);
            }
          }
        });

        if (this.totalHome > 0 && this.pageName == "SearchResultPage") {
          this.maxViewCount = this.properties[0].MaxViewCount;
        }

        // For update mapproperty when unlike, unclaime and remove offer
        if (this.updatedPropertyDetailId) {
          let index = this.properties.findIndex(t => t.PropertyDetailId == this.updatedPropertyDetailId);
          index > -1 ? this.mapProperty = this.properties[index] : false;
        }

        if (isSkipMapLoad) {
        } else {
          if (!isScroll) {
            if (searchTermViewPort) {
              this.bindGoogleMap(searchTermViewPort.Lat, searchTermViewPort.Lng, searchTermViewPort.AddressType);
            } else {
              this.bindGoogleMap(searchdata.Lat, searchdata.Lng, searchdata.AddressType);
            }
          }
        }
        if (data.Model.length > 0) {
          this.totalProperties = data.Model[0].TotalCount;
        } else {
          this.totalProperties = 0;
        }
        if (data.Model.length == 1 && searchdata.AddressType == "street_address") {
          let searchedProperty: any = [];
          if (JSON.stringify(this.properties)) {
            searchedProperty = JSON.parse(JSON.stringify(this.properties));
          }
          let property = this.properties[0];
          if (property) {
            if (!property.GoogleImage) {
              property.isLoadGoogleImageDiv = true;
              this.streetAddressCreateGoogleMapImage(property);
            } else {
              this.checkGoogleImageExist(property);
            }
          }
          searchedProperty && searchedProperty.length > 0 ? this.onPropertyTileClick(searchedProperty[0]) : false;
        }
        else if (data.Model.length > 1 && searchdata.AddressType == "street_address") {
          let property = this.properties.find(t => (t.Address + ", " + t.Suburb + ", " + t.City).includes(this.searchedTerm));
          if (property) {
            if (!property.GoogleImage) {
              property.isLoadGoogleImageDiv = true;
              this.streetAddressCreateGoogleMapImage(property);
            } else {
              if (property) {
                this.checkGoogleImageExist(property);
              }
            }
            this.onPropertyTileClick(property);
          }
        }
        this.updateTotalViews();
        this.isLoaded = false;
        if (this.pageName == "SearchResultPage") {
          this.refreshMap.emit();
        }
      }
    },
      error => {
        console.log(error);
      }));
  }

  saveProperty(searchTermViewPort: any) {
    this.isLoaded = true;
    let queryObject = {};
    queryObject["Lat"] = searchTermViewPort.Lat;
    queryObject["Lng"] = searchTermViewPort.Lng;
    queryObject["SearchTerm"] = searchTermViewPort.SearchTerm;
    queryObject["UserId"] = this.userId;
    queryObject["AddressComponent"] = searchTermViewPort.AddressComponent;
    this._unsubscribeAll.add(this.searchResultPageService.saveProperties(queryObject).subscribe(data => {
      if (data.Success) {
        if (data.Model.length > 1) {
          console.log("saved call search term");
          this.searchedTerm = this.searchTerm;
          this.isLoading = false;
          this.totalHome = 0;
          this.properties = [];
          data.Model.forEach(element => {
            element.ImageURL = this.url;
            if (element.IsActive && element.IsActive == true) {
              console.log("1st set");
              this.properties.push(element);
            }
          });
          this.dublicateProperties = data.Model;
          this.bindGoogleMap(searchTermViewPort.Lat, searchTermViewPort.Lng, searchTermViewPort.AddressType);
          this.isLoaded = false;
        } else {
          console.log('save called');
          this.isLoaded = false;
          this.searchProperties(searchTermViewPort, false, false, false);
        }
      }
    },
      error => {
        console.log(error);
        this.isLoaded = false;
      }));
  }

  getSortAddress() {
    this.copyPreviousSubHurbName = this.subHurbName;
    // logic for address show without country and postal_code
    let sessionData;
    if (this.localStorage.getItem("SearchData")) {
      sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
    }
    let splitStr = "";
    let subHurbStr = "";
    if (sessionData) {
      this.searchTerm = sessionData.SearchTerm;
      if (sessionData.AddressComponent) {
        sessionData.AddressComponent.forEach(element => {
          element.types.forEach(type => {
            if (sessionData.AddressType == "street_address" || sessionData.AddressType == "route" || sessionData.AddressType == "postal_code") {
              if (type === "sublocality_level_1" || type === "sublocality") {
                subHurbStr = element.long_name;
              }
              if (subHurbStr === "") {
                if (type === "locality") {
                  subHurbStr = element.long_name;
                }
              }
            }
            if (sessionData.AddressType !== "street_address" && sessionData.AddressType !== "route" && sessionData.AddressType !== "postal_code") {
              if (type === "locality" || type === "administrative_area_level_1") {
                subHurbStr = this.searchTerm.split(", " + element.long_name)[0];
              }
            }
            if (type === "country") {
              splitStr = this.searchTerm.split(", " + element.long_name)[0];
              if (sessionData.AddressType !== "street_address" && sessionData.AddressType !== "route" && sessionData.AddressType !== "postal_code") {
                subHurbStr = subHurbStr.split(", " + element.long_name)[0];
              }
            }
            if (type === "postal_code" && sessionData.AddressType !== "route") {
              splitStr = splitStr.split(" " + element.long_name)[0];
              if (sessionData.AddressType !== "street_address" && sessionData.AddressType !== "route" && sessionData.AddressType !== "postal_code") {
                subHurbStr = subHurbStr.split(" " + element.long_name)[0];
              }
            }
          });
        });
      }
    }
    this.searchedTerm = splitStr;
    this.subHurbName = subHurbStr;
    // End logic
  }

  getSubHurbInfo(Model: any) {
    Model["SearchTerm"] = this.subHurbName;
    this._unsubscribeAll.add(this.searchResultPageService.getSubHurbPropertiesInfo(Model).subscribe((data: any) => {
      if (data.Success) {
        this.isLoadSubHurbInfo = true;
        this.subHurbPropertyInfo = data.Model;
        this.refreshMap.emit();
      } else {
        this.isLoadSubHurbInfo = false;
      }
    },
      error => {
        console.log(error);
        this.isLoadSubHurbInfo = false;
      }));
  }

  streetAddressCreateGoogleMapImage(property) {
    setTimeout(() => {
      this.createMapImageAt45('divId_' + property.PropertyId, property);
    }, 2000);
  }

  createMapImageAt45(divId: string, property) {
    let _this = this;
    const lat = parseFloat(property.LatitudeLongitude.split(',')[0]);
    const long = parseFloat(property.LatitudeLongitude.split(',')[1]);
    var latlng = new google.maps.LatLng(lat, long);
    if (isPlatformBrowser(this.platformId)) {
      this.mapsAPILoader.load().then(() => {
        var imagemap = new google.maps.Map(this.document.getElementById(divId), {
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

        // google.maps.event.addListenerOnce(imagemap, "google-map-ready", function () {
        google.maps.event.addListenerOnce(imagemap, "tilesloaded", function () {

          let el: HTMLCollectionOf<Element> = _this.document.getElementsByClassName('gm-style') as HTMLCollectionOf<Element>;
          if (el.length > 0) {
            var id = "#" + divId;
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
      });
    }
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

  checkGoogleImageExist(property) {
    this._unsubscribeAll.add(this.searchResultPageService.isGoogleImageExist(property.PropertyId).subscribe((res: any) => {
      if (res) {
      } else {
        property.isLoadGoogleImageDiv = true;
        this.streetAddressCreateGoogleMapImage(property);
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      }));
  }

  onPropertyTileClick(property: any) {
    if (property) {
      if (!property.IsViewedInWeek) {
        let isExist = this.localStorage.getItem("AddedViewCountId");
        if (isExist) {
          let propertydetailId = +isExist;
          if (property.PropertyDetailId != propertydetailId) {
            this.localStorage.removeItem("AddedViewCountId");
            isExist = null;
          }
        }
        if (!isExist) {
          property.PropertyDetailId ? this.localStorage.setItem("AddedViewCountId", property.PropertyDetailId.toString()) : false;
          this.AddViewCount(property)
          this.savePropertyViewCount(property);
        }
      }
    }
  }

  bindGoogleMap(Latitude: number, Longitude: number, type: string) {
    let zoomLevel = 15;
    let sessionData;
    if (this.localStorage.getItem("SearchData")) {
      sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
    }
    this.globalzoom = sessionData.Zoom;
    if (this.globalzoom >= zoomLevel) {
      zoomLevel = this.globalzoom;
    }
    else {
      if (type == "street_address") zoomLevel = 20;
      if (type == "sublocality_level_1") zoomLevel = 15;
      if (type == "sublocality_level_2") zoomLevel = 16;
      if (type == "route") zoomLevel = 19;
      if (type == "administrative_area_level_1") zoomLevel = 16;
      if (type == "administrative_area_level_2") zoomLevel = 17;
      if (type == "subpremise") zoomLevel = 20;
    }
    if (this.pageName === "PropertyImageGalleryPage") {
      zoomLevel = 14;
    }

    // Set CSS for the control interior.
    var center = new google.maps.LatLng(Latitude, Longitude);
    if (this.pageName === "SearchResultPage") {
      let map = new google.maps.Map(this.document.getElementById(this.pageName + this.randomNo), {
        zoom: zoomLevel,
        minZoom: 15,
        maxZoom: 21,
        center: center,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
        },
        mapTypeId: this.mapType,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        gestureHandling: "greedy",
        fullscreenControl: false,
        streetViewControl: false,
        scrollwheel: false,
        scaleControlOptions: false,
        disableDoubleClickZoom: true,
        panControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{
              visibility: "off"
            }]
          }]
      });
      this.map = map;
    } else {
      let map = new google.maps.Map(this.document.getElementById(this.pageName + this.randomNo), {
        zoom: zoomLevel,
        minZoom: 14,
        maxZoom: 21,
        center: center,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
        },
        mapTypeId: this.mapType,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        gestureHandling: "none",
        fullscreenControl: false,
        streetViewControl: false,
        scrollwheel: false,
        zoomControl: false,
        scaleControlOptions: false,
        panControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{
              visibility: "off"
            }]
          }]
      });
      this.map = map;
    }
    // });
    let _this = this;
    let propArray =
      this.dublicateProperties && this.dublicateProperties.length > 0 ? this.dublicateProperties : this.properties;
    if (this.map && propArray.length > 0) {
      this.setMarkerOnGoogleMap(this.map);
    } else {
      this.searchedAddressType == "street_address" ? this.map.setZoom(21) : false;
    }

    let serchedData = JSON.parse(this.localStorage.getItem('SearchData'));
    let centerControlDiv = this.document.createElement('div');
    centerControlDiv.id = "centerControlDiv";
    centerControlDiv.setAttribute("style", "display: flex;z-index: 5;left:130px !important;");

    let leftControlDiv = this.document.createElement('div');
    leftControlDiv.style.marginLeft = "20px";
    if (_this.pageName == "SearchResultPage") {
      _this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);
    }

    if (_this.AllMarkers.length > 0) {
      _this.map.addListener("maptypeid_changed", function () {
        _this.mapType = _this.map.getMapTypeId();
      });
    }

    _this.map.addListener("idle", function () {
      if (_this.pageName === "SearchResultPage") {
        _this.onDragOrZoomEventFire("drag", zoomLevel);
      } else if (_this.pageName === "PropertyImageGalleryPage") {
        _this.onDragOrZoomEventFireForPropertyDetailPage("drag", zoomLevel);
      }
    });

    if (_this.AllMarkers.length > 0) {
      _this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);
      if (_this.pageName == "SearchResultPage") {
        _this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(leftControlDiv);
      }
    }
  }

  HTMLMarkerFunction(lat, lng) {
    this.lat = lat;
    this.lng = lng;
    this.pos = new google.maps.LatLng(lat, lng);
  }

  showmarkerOnMap(map) {
    var btnShow = this.document.getElementById("showMarkerbtn" + this.pageName);
    btnShow.style.display = "none";
    var btnHide = this.document.getElementById("hideMarkerbtn" + this.pageName);
    btnHide.style.display = "block";
    this.setMarkerOnGoogleMap(this.map);
  }

  hidemarkerOnMap() {
    var btnHide = this.document.getElementById("hideMarkerbtn" + this.pageName);
    btnHide.style.display = "none";
    var btnShow = this.document.getElementById("showMarkerbtn" + this.pageName);
    btnShow.style.display = "block";
    if (this.localStorage.getItem("SearchData")) {
      let sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
    }
    this.AllMarkers.forEach(element => {
      element.setVisible(false);
    });
  }

  onDragOrZoomEventFire(event: string, zoomLevel?: number) {
    let viewport = {};
    let _this = this;
    let map = _this.map;
    if (_this.isListView) {
      if (this.localStorage.getItem("SearchData")) {
        let sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
        viewport = sessionData;
      }
    } else {
      viewport["SwLat"] = map
        .getBounds()
        .getSouthWest()
        .lat();
      viewport["SwLng"] = map
        .getBounds()
        .getSouthWest()
        .lng();
      viewport["NeLat"] = map
        .getBounds()
        .getNorthEast()
        .lat();
      viewport["NeLng"] = map
        .getBounds()
        .getNorthEast()
        .lng();

      viewport["SearchTerm"] = _this.searchTerm;
      viewport["AddressComponent"] = _this.searchTermViewPort.AddressComponent;
      viewport["AddressType"] = _this.searchTermViewPort.AddressType;

      // set latest map latlong in localstorage
      if (this.localStorage.getItem("SearchData")) {
        let sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
        sessionData.SwLat = viewport["SwLat"];
        sessionData.NeLat = viewport["NeLat"];
        sessionData.SwLng = viewport["SwLng"];
        sessionData.NeLng = viewport["NeLng"];
        sessionData.Zoom = map.getZoom();

        sessionData.Lat = map
          .getCenter().lat();
        sessionData.Lng = map
          .getCenter().lng();

        this.localStorage.setItem("SearchData", JSON.stringify(sessionData));
      }

    }

    if (event == "drag") {
      this.eventEmitterService.onzoomMapEvent();
      viewport["AddressComponent"] = null;
      viewport["AddressType"] = null;
      console.log("drag call");
      viewport["SearchTerm"] = this.subHurbName;
      if (!this.isStatusValidationMsg) {
        _this.searchProperties(viewport, true, true);
      }
    }
    if (event == "zoom") {
      this.eventEmitterService.onzoomMapEvent();
      viewport["AddressComponent"] = null;
      viewport["AddressType"] = null;
      this.globalzoom = map.getZoom();
      console.log("zoom call");
      _this.searchProperties(viewport, true);
    }
  }

  onDragOrZoomEventFireForPropertyDetailPage(event: string, zoomLevel?: number) {
    let viewport = {};
    let _this = this;
    let map = _this.map;
    viewport["SwLat"] = map
      .getBounds()
      .getSouthWest()
      .lat();
    viewport["SwLng"] = map
      .getBounds()
      .getSouthWest()
      .lng();
    viewport["NeLat"] = map
      .getBounds()
      .getNorthEast()
      .lat();
    viewport["NeLng"] = map
      .getBounds()
      .getNorthEast()
      .lng();

    viewport["Lat"] = map
      .getCenter().lat();
    viewport["Lng"] = map
      .getCenter().lng();

    viewport["SearchTerm"] = _this.searchTerm;
    viewport["AddressComponent"] = _this.searchTermViewPort.AddressComponent;
    viewport["AddressType"] = _this.searchTermViewPort.AddressType;


    if (event == "drag") {
      this.isLoaded = true;
      viewport["AddressComponent"] = null;
      viewport["AddressType"] = null;
      console.log("drag call property detail page");
      _this.searchSubHurbProperties(viewport, true, true);
      var btnShow = this.document.getElementById("showMarkerbtn" + this.pageName);
      btnShow != null ? btnShow.style.display = "none" : false;
      var btnHide = this.document.getElementById("hideMarkerbtn" + this.pageName);
      btnHide != null ? btnHide.style.display = "block" : false;
    }
    if (event == "zoom") {
      this.eventEmitterService.onzoomMapEvent();
      viewport["AddressComponent"] = null;
      viewport["AddressType"] = null;
      this.globalzoom = map.getZoom();
      console.log("zoom call");
      _this.searchSubHurbProperties(viewport, true, true);
    }
  }

  setMarkerOnGoogleMap(map: google.maps.Map, isZoomAction?: boolean, isHide?: boolean) {
    let _this = this;
    let markers = [];
    let htmlMarkers = [];
    let propArray =
      _this.dublicateProperties && _this.dublicateProperties.length > 0 ? _this.dublicateProperties : _this.properties;
    propArray.forEach(element => {
      if (element.LatitudeLongitude != "null"
      ) {
        let lat = 0;
        let lng = 0;
        lat = parseFloat(element.LatitudeLongitude.split(",")[0]);
        lng = parseFloat(element.LatitudeLongitude.split(",")[1]);
        let address = element.Address + ", " + element.Suburb + ", " + element.City;
        if (element.PropertyId != this.userLowRankPropertyId && element.PropertyId != this.userHighRankPropertyId) {
          if (_this.pageName == "PropertyImageGalleryPage") {
            _this.marker = new google.maps.Marker({
              position: new google.maps.LatLng(lat, lng),
              icon: './assets/images/icons/dark_yellow_dot_24x24.png',
              title: address.toString()
            });
            let image;
            if (element.Status === PropertyStatus.ForSale) {
              image = './assets/images/icons/red_location_24x24.png';
            }
            else if (element.Status === PropertyStatus.Premarket) {
              image = './assets/images/icons/green_location_24x24.png';
            }
            else if (element.Status === PropertyStatus.Notlisted) {
              image = './assets/images/icons/black_location_24x24.png';
            }
            _this.marker.setIcon(image);
          }
        }
        if (_this.marker) {
          if (_this.pageName === "SearchResultPage" || _this.pageName === "PropertyImageGalleryPage") {
            _this.AllMarkers.forEach(element => {
              element.setMap(null);
            });
            _this.AllMarkers = [];
            markers = [];
          }
          let markerindex = markers.findIndex(t => t.title == address);
          markerindex > -1 ? markers.splice(markerindex, 1) : false;
          markers.push(_this.marker);
          markers.forEach(item => {
            if (!isHide) {
              item.setMap(_this.map);
            } else {
              item.setMap(null);
            }
          });
          _this.AllMarkers = [];
          _this.AllMarkers = [...markers];
        }

        if (_this.pageName === "SearchResultPage" || _this.pageName === "PropertyImageGalleryPage") {
          _this.AllMarkers.forEach(element => {
            element.setMap(null);
          });
          _this.AllMarkers = [];
          HTMLMarkerFunction.prototype = new google.maps.OverlayView();
          let bothElements: HTMLCollectionOf<HTMLElement> = _this.document.getElementsByClassName("htmlMarker_" + _this.pageName) as HTMLCollectionOf<HTMLElement>;
          while (bothElements.length > 0) {
            bothElements[0].parentNode.removeChild(bothElements[0]);
          }
          // console.log("elementttttt", element);
          let RankingStatus = element.RankingStatus;
          if (RankingStatus) {
            if (RankingStatus == "hot") {
              RankingStatus = "Hot";
            } else if (RankingStatus == "cooling") {
              RankingStatus = "Cool";
            } else {
              RankingStatus = "Stable";
            }
            let innerHTML = '<div style="position: absolute; display: block;z-index: 1;"><div style="transform: translate(calc(-50% + 0px), calc(50% + 0px)); left: 50%; position: absolute; bottom: 0px;pointer-events: auto;"><button tabindex="0" style="color: inherit; outline: none; display: flex; text-decoration: none;border: none; margin: 0px; padding: 0px; background: transparent; width: auto; font: inherit;"><div class="scaleDiv" id="scaleDiv_' + this.pageName + "_" + element.PropertyId + '" ><div id="span_' + this.pageName + "_" + element.PropertyId + '" style="align-items: center; background-color: rgb(255, 255, 255); border-radius: 28px; box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.18) 0px 1px 2px; color: rgb(34, 34, 34); display: flex; height: 28px; justify-content: center; padding: 0px 8px; position: relative; white-space: nowrap;z-index:1;"><span class="_1nq36y92">' + RankingStatus + '</span></div></div></button></div></div>';
            HTMLMarkerFunction.prototype.onAdd = function () {
              _this.markerOverlay = _this.document.createElement('DIV');
              _this.markerOverlay.className = "htmlMarker_" + _this.pageName;
              _this.markerOverlay.id = "marker_" + _this.pageName + "_" + element.PropertyId;
              _this.markerOverlay.style.position = 'absolute';
              _this.markerOverlay.setAttribute("title", address);
              _this.markerOverlay.innerHTML = innerHTML;
              var panes = this.getPanes();
              panes.overlayImage.appendChild(_this.markerOverlay);

              if (_this.pageName === "SearchResultPage") {
                google.maps.event.addDomListener(_this.markerOverlay, "click", function (e) {
                  google.maps.event.trigger(_this, "click", e);
                  console.log('click');
                  _this.drawHigherAndLowerPolylines(element);
                });
              } else {
                google.maps.event.addDomListener(_this.markerOverlay, 'click', setPositionAsContent);
              }

              google.maps.event.addDomListener(_this.markerOverlay, 'mouseover', mouseOverHandler);
              google.maps.event.addDomListener(_this.markerOverlay, 'mouseout', mouseOutHandler);
              let markers = _this.document.querySelectorAll("#marker_" + _this.pageName + "_" + element.PropertyId);
              for (let index = 0; index < markers.length - 1; index++) {
                markers[index].parentNode.removeChild(markers[index]);
              }
            }
            HTMLMarkerFunction.prototype.draw = function () {
              var overlayProjection = this.getProjection();
              var position = overlayProjection.fromLatLngToDivPixel(this.pos);
              var panes = this.getPanes();
              _this.markerOverlay.style.left = position.x + 'px';
              _this.markerOverlay.style.top = position.y + 'px';
              _this.markerOverlay.style.webkitTransform = 'translateZ(0px)';
            }
            let htmlMarker = new HTMLMarkerFunction(lat, lng);
            _this.htmlMarker = htmlMarker;
            let id = "marker_" + _this.pageName + "_" + element.PropertyId;
            var elem = _this.document.querySelectorAll('#' + id);
            while (elem.length > 0) {
              elem[0].parentNode.removeChild(elem[0]);
            }
            htmlMarker.setMap(_this.map);
            htmlMarkers.push(htmlMarker);
            this.htmlMarkers = htmlMarkers;
          }
        }

        setTimeout(() => {
          if (this.centerPolyLinePropertyId == element.PropertyId) {
            let spanElem = this.document.getElementById("span_" + this.pageName + "_" + element.PropertyId);
            if ((_this.pageName === "SearchResultPage")) {
              if (spanElem) {
                spanElem.style.backgroundColor = "rgb(34, 34, 34)";
                spanElem.style.color = "#fff";
              }
            }
            let divElem = this.document.getElementById("scaleDiv_" + this.pageName + "_" + element.PropertyId)
            if (divElem)
              divElem.style.transform = "scale(1)";
            let markerElem = this.document.getElementById("marker_" + _this.pageName + "_" + element.PropertyId);
            if (markerElem)
              markerElem.style.zIndex = "2";
          }
        }, 300);
      }

      function openPropertyImageComponent() {
        _this.dialog.openDialogs.length > 0 ? _this.dialog.openDialogs[0].close(true) : false;
        _this.eventEmitterService.openPropertyImageModal(element);
      }

      function setPositionAsContent() {
        let infoWindowType = "single";
        infoWindowType = _this.dublicateProperties && _this.dublicateProperties.length > 0 ? "list" : "single";
        _this.openInfoWindowOnGoogleMapMarkerClick(element, map, this, infoWindowType);
      }

      function mouseOverHandler() {
        if (element)
          _this.showMarkerPin(element);
      }
      function mouseOutHandler() {
        _this.removeMarkerPin(element);
      }

      function HTMLMarkerFunction(lat, lng) {
        this.lat = lat;
        this.lng = lng;
        this.pos = new google.maps.LatLng(lat, lng);
      }

      function drawPolyline() {
        _this.drawHigherAndLowerPolylines(element);
      }
    });
    var bounds = new google.maps.LatLngBounds();
    if (markers.length > 0) {
      for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
      }
    } else {
      _this.AllMarkers = [];
    }
  }

  openPropertyImageComponent(element) {
    this.dialog.openDialogs.length > 0 ? this.dialog.openDialogs[0].close(true) : false;
    this.eventEmitterService.openPropertyImageModal(element);
  }

  AddViewCount(property: any) {
    this._unsubscribeAll.add(this.searchResultPageService.savePropertyDetailAndPropertyCRUD(property.PropertyDetailId).subscribe(data => {
      if (data.Success) {
        var propIndex = this.properties.findIndex(p => p.PropertyDetailId == property.PropertyDetailId);
        var markerIndex = this.AllMarkers.findIndex(p => p.title === property.Address);
        this.ngZoneService.run(() => {
          if (!this.isUserCookieExist) {
            propIndex > -1 ? this.properties[propIndex].ViewCount = data.Model.ViewCount : false;
          }
          // this.properties[propIndex].PropertyDetailId = data.Model.PropertyDetailId;
          propIndex > -1 ? this.properties[propIndex].ViewCount = data.Model.ViewCount : false;
          propIndex > -1 ? this.properties[propIndex].Status = data.Model.Status : false;
          //  this.AllMarkers[markerIndex].label.text = data.Model.ViewCount;
          this.updateTotalViews();
        });
        // Start code for display ViewerStrength on property tile
        this.changePerformance();
        // End
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      }));
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
        var propIndex = this.properties.findIndex(p => p.PropertyDetailId == property.PropertyDetailId);
        var markerIndex = this.AllMarkers.findIndex(p => p.title === property.Address);
        this.ngZoneService.run(() => {
          propIndex > -1 && data.Model.Status ? this.properties[propIndex].Status = data.Model.Status : false;
          propIndex > -1 ? this.properties[propIndex].IsViewedInWeek = true : this.properties[propIndex].IsViewedInWeek = false;
          this.localStorage.removeItem("AddedViewCountId");
          //  this.AllMarkers[markerIndex].label.text = data.Model.ViewCount;
          this.updateTotalViews();
        });
        // Start code for display ViewerStrength on property tile
        this.changePerformance();
        // End
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      }));
  }

  openInfoWindowOnGoogleMapMarkerClick(
    element: Property,
    map: google.maps.Map,
    self: google.maps.MVCObject,
    infoWindowType: string
  ) {
    console.log("map property click");
    this.isDblClicked = true;
    let _this = this;
    if (_this.markerPreviousInfoWindow) {
      _this.markerPreviousInfoWindow.close();
    }
    if (_this.markerInfoWindow) {
      _this.markerInfoWindow.close();
    }
    if (_this.previousInfoWindow) {
      _this.previousInfoWindow.close();
    }
    this.ngZoneService.run(() => {
      this.isGoogleMapMarkerClicked = infoWindowType == "single" ? true : false;
      this.isGoogleMapMarkerListClicked = infoWindowType == "list" ? true : false;
      this.mapProperty = this.properties.find(t => t.PropertyDetailId == element.PropertyDetailId);
      this.dublicateProperties = this.dublicateProperties;
    });
    setTimeout(() => {
      let content = infoWindowType == "list" ? _this.popListTemplate.nativeElement : _this.popTemplate.nativeElement;
      let lat = parseFloat(element.LatitudeLongitude.split(",")[0]);
      let lng = parseFloat(element.LatitudeLongitude.split(",")[1]);
      let markerlatlong = {
        lat: lat,
        lng: lng
      };
      let infowindow = new google.maps.InfoWindow({
        content: content,
        maxWidth: 340,
        position: markerlatlong
      });
      infowindow.open(this.map);
      // infowindow.open(map, self);
      if (this.isDblClicked) {
        google.maps.event.addListener(infowindow, "domready", function () {
          let el: HTMLCollectionOf<HTMLElement> = _this.document.getElementsByClassName('gm-style-iw') as HTMLCollectionOf<HTMLElement>;
          if (el) {
            el[0].style.padding = "0px";
            el[0].style.background = "transparent";
            el[0].style.boxShadow = "none";
            el[0].style.borderRadius = "0px";
          }
          let el1: HTMLCollectionOf<HTMLElement> = _this.document.getElementsByClassName('gm-style-iw-d') as HTMLCollectionOf<HTMLElement>;
          if (el1) {
            el1[0].style.overflow = "hidden";
            el1[0].style.paddingTop = "23px";
          }
          let el2: HTMLCollectionOf<HTMLElement> = _this.document.getElementsByClassName('gm-ui-hover-effect') as HTMLCollectionOf<HTMLElement>;
          if (el2) {
            el2[0].style.right = "0px";
            el2[0].style.background = "#fff";
            el2[0].style.opacity = "unset";
            el2[0].style.paddingTop = "5px";
            el2[0].style.top = "-7px";
          }

          let el3: HTMLCollectionOf<HTMLElement> = _this.document.getElementsByClassName('gm-style-iw-a') as HTMLCollectionOf<HTMLElement>;
          if (el3) {
            el3[0].parentElement.setAttribute("style", "visibility: initial !important;");
          }
          let rightList: HTMLCollectionOf<HTMLElement> = _this.document.getElementsByClassName('gm-style-iw gm-style-iw-c') as HTMLCollectionOf<HTMLElement>;
          for (let index = 0; index < rightList.length; index++) {
            const element = rightList[index];
            element.style.display = "block";
          }
          let googleInfoWindow = _this.document.getElementById('googleInfoWindow');
          if (googleInfoWindow) {
            googleInfoWindow.style.display = "block";
          }
        });
      }
      _this.previousInfoWindow = infowindow;
    }, 1000);
  }

  updateTotalViews() {
    var total = 0;
    this.properties.forEach(item => (total += item.ViewCount));
    this.ngZoneService.run(() => {
      this.totalView = total;
    });
  }

  showMarkerPin(element) {
    if (element) {
      if (this.properties.length > 0) {
        element = this.properties.find(t => t.PropertyDetailId == element.PropertyDetailId && t.Status !== null && t.Status !== '');
      }
      if (!element) {
        console.log("element", element);
      }
      if (!element.Address) {
        console.log("Address..", element.Address);
      }
      let address = element.Address + ", " + element.Suburb + ", " + element.City;
      let index = this.AllMarkers.findIndex(t => t.title == address);
      let image;
      if (this.centerPolyLinePropertyId && element.PropertyId === this.centerPolyLinePropertyId) {
        // image = {
        //   url: "./assets/images/icons/homebuzz-yellow-logo.svg", // url
        //   scaledSize: new google.maps.Size(40, 40), // size
        //   origin: new google.maps.Point(0, 0)
        // };
        // image = './assets/images/icons/yellow-logo-35x35.png';
        // image = './assets/images/icons/centericon_32x32.png';
      } else if (element.PropertyId != this.userLowRankPropertyId && element.PropertyId != this.userHighRankPropertyId && element.PropertyId != this.centerPolyLinePropertyId) {
        if (element.Status === PropertyStatus.ForSale) {
          image = './assets/images/icons/red_location_32x32.png';
        }
        else if (element.Status === PropertyStatus.Premarket) {
          image = './assets/images/icons/green_location_32x32.png';
        }
        else if (element.Status === PropertyStatus.Notlisted) {
          image = './assets/images/icons/black_location_32x32.png';
        }
      }
      index > -1 ? this.AllMarkers[index].setIcon(image) : false;
      if (this.centerPolyLinePropertyId && element.PropertyId === this.centerPolyLinePropertyId) {
        if (this.pageName === "SearchResultPage") {
          let spanElem = this.document.getElementById("span_" + this.pageName + "_" + element.PropertyId);
          if (spanElem) {
            spanElem.style.backgroundColor = "rgb(34, 34, 34)";
            spanElem.style.color = "#fff";
          }
        }
        let lat = parseFloat(element.LatitudeLongitude.split(",")[0]);
        let lng = parseFloat(element.LatitudeLongitude.split(",")[1]);
        let indexMarker = this.htmlMarkers.findIndex(t => t.lat == lat && t.lng == lng);
        if (indexMarker > -1) {
          let markerElem = this.document.getElementById("marker_" + this.pageName + "_" + element.PropertyId);
          if (markerElem)
            markerElem.style.zIndex = "3";
          let divElem = this.document.getElementById("scaleDiv_" + this.pageName + "_" + element.PropertyId)
          if (divElem)
            divElem.style.transform = "scale(1.111)";
        }
      } else {
        let lat = parseFloat(element.LatitudeLongitude.split(",")[0]);
        let lng = parseFloat(element.LatitudeLongitude.split(",")[1]);
        let markers = this.document.querySelectorAll("#marker_" + this.pageName + "_" + element.PropertyId);
        for (let index = 0; index < markers.length - 1; index++) {
          markers[index].parentNode.removeChild(markers[index]);
        }
        let indexMarker = this.htmlMarkers.findIndex(t => t.lat == lat && t.lng == lng);
        if (indexMarker > -1) {
          let markerElem = this.document.getElementById("marker_" + this.pageName + "_" + element.PropertyId);
          if (markerElem)
            markerElem.style.zIndex = "3";
          let divElem = this.document.getElementById("scaleDiv_" + this.pageName + "_" + element.PropertyId)
          if (divElem)
            divElem.style.transform = "scale(1.111)";
        }
      }
    }
  }

  removeMarkerPin(element) {
    if (element) {
      if (this.properties.length > 0) {
        element = this.properties.length > 0 ? this.properties.find(t => t.PropertyDetailId == element.PropertyDetailId && t.Status !== null && t.Status !== '') : element;
      }
      if (!element) {
        console.log("element", element);
      }
      if (!element.Address) {
        console.log("Address..", element.Address);
      }
      let address = element.Address + ", " + element.Suburb + ", " + element.City;
      let index = this.AllMarkers.findIndex(t => t.title == address);
      let image;
      if (this.centerPolyLinePropertyId && element.PropertyId === this.centerPolyLinePropertyId) {
      } else if (element.PropertyId != this.userLowRankPropertyId && element.PropertyId != this.userHighRankPropertyId && element.PropertyId != this.centerPolyLinePropertyId) {
        if (element.Status === PropertyStatus.ForSale) {
          image = './assets/images/icons/red_location_24x24.png';
        }
        else if (element.Status === PropertyStatus.Premarket) {
          image = './assets/images/icons/green_location_24x24.png';
        }
        else if (element.Status === PropertyStatus.Notlisted) {
          image = './assets/images/icons/black_location_24x24.png';
        }
      }
      index > -1 ? this.AllMarkers[index].setIcon(image) : false;
      if (element.PropertyId != this.centerPolyLinePropertyId) {
        let lat = parseFloat(element.LatitudeLongitude.split(",")[0]);
        let lng = parseFloat(element.LatitudeLongitude.split(",")[1]);
        let indexMarker = this.htmlMarkers.findIndex(t => t.lat == lat && t.lng == lng);
        if (indexMarker > -1) {
          let markerElem = this.document.getElementById("marker_" + this.pageName + "_" + element.PropertyId);
          if (markerElem)
            markerElem.style.zIndex = "1";
          let divElem = this.document.getElementById("scaleDiv_" + this.pageName + "_" + element.PropertyId)
          if (divElem)
            divElem.style.transform = "scale(1)";
        }
      }

      if (this.centerPolyLinePropertyId) {
        let markerElem1 = this.document.getElementById("marker_" + this.pageName + "_" + this.centerPolyLinePropertyId);
        if (markerElem1)
          markerElem1.style.zIndex = "2";
        let divElem1 = this.document.getElementById("scaleDiv_" + this.pageName + "_" + this.centerPolyLinePropertyId)
        if (divElem1)
          divElem1.style.transform = "scale(1)";
      }
    }
  }

  searchData() {
    let viewport;
    if (this.localStorage.getItem("SearchData")) {
      let sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
      viewport = sessionData;
    }
    console.log('searchdata saveProperty');
    this.getSortAddress();
    if (this.copyPreviousSubHurbName !== this.subHurbName || this.copyPreviousSubHurbName == "" || this.subHurbName == "") {
      this.isLoadSubHurbInfo = false;
      this.subHurbPropertyInfo = undefined;
      if (viewport.AddressType != "street_address") {
        if (this.fromDashboard == true) {
          this.copyPreviousSubHurbName = this.subHurbName;
        }
        this.getSubHurbInfo(viewport);
      } else {
        this.getSubHurbLatLong(this.subHurbName);
        // this.isLoadSubHurbInfo = false;
        // this.subHurbPropertyInfo = undefined;
      }
    }
    viewport.AddressType != "street_address"
      // ? this.searchProperties(viewport, false, false, false)
      ? this.bindGoogleMap(viewport.Lat, viewport.Lng, viewport.AddressType)
      : this.saveProperty(viewport);
  }

  onMakeOfferButtonClick(prop) {
    this.makeOfferBtn.emit(prop);
  }

  onOwnerBuzzHomeButtonClick(prop) {
    this.ownerProp.emit(prop);
  }

  onPropertyImageTileClick(event: any, prop: Property) {
    if (event) {
      if (event.target.classList.contains('fa-heart') || event.target.classList.contains('claim_' + prop.PropertyDetailId)
        || event.target.classList.contains('agentOpion_' + prop.PropertyDetailId) || event.target.classList.contains('edit-property')) {
        return false;
      }
    }
    this.propImageTile.emit(prop);
  }

  onAddEditPhotoDescriptionButtonClick(prop: Property) {
    this.editProp.emit(prop);
  }

  onTermsOptionClick() {
    this.termsModal.emit();
  }

  onPrivacyOptionClick() {
    this.privacyModal.emit();
  }

  onHomebuzzEstimatesOptionClick() {
    this.estimateModal.emit();
  }

  /** Like Property Start */
  onTileLikeClick(event: any, property: any) {
    this.likeProperty(event, property);
  }

  likeProperty(event: any, property: any) {
    if (!this.isUserCookieExist) {
      this.likeProp.emit(property);
    } else {
      let status = "Like";
      event.srcElement.classList.contains("far") ? (status = "Dislike") : (status = "Like");
      let obj = new PropertyLike();
      obj.PropertyDetailId = property.PropertyDetailId;
      obj.UserId = this.userId;
      this._unsubscribeAll.add(this.searchResultPageService.likeProperty(obj).subscribe(data => {
        if (data.Success) {
          let likeStatus = data.Model.Status == "Dislike" ? "unliked" : "liked";
          let index = this.properties.findIndex(p => p.PropertyDetailId == property.PropertyDetailId);
          this.properties[index]["UserLiked"] = event.srcElement.classList.contains("far") ? true : false;
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
  /** Like Property End  */

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
        }
        if (data.Model.MinPrice) {
          this.selectedMinPrice = data.Model.MinPrice;
          this.minPriceFormat(this.selectedMinPrice);
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
        this.getAddressLatLong(data.Model.Address);
      } else {
        if (this.localStorage.getItem("SearchData")) {
          let SearchData = JSON.parse(this.localStorage.getItem("SearchData"))
          this.getAddressLatLong(SearchData.SearchTerm);
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

  getAddressLatLong(address, isEmit?: boolean) {
    let _this = this;
    // if (isPlatformBrowser(_this.platformId)) {
    this.mapsAPILoader.load().then(() => {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          let place = results[0];
          if (isEmit) {
            _this.eventEmitterService.onHeaderSearchTextEmit(place.formatted_address);
          }
          _this.subHurbObj = place;
          _this.setPlaceObject(place);
        } else {
          console.log("Geocode was not successful for the following reason: " + status);
        }
      });
    });
    // }
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
    this.isLoading = true;
    this.isLoaded = true;
    console.log('setPlaceObject method');
    this.searchTermViewPort.AddressType != "street_address"
      ? this.searchProperties(viewport)
      : this.saveProperty(viewport);
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

  minPriceFormat(minPrice) {
    if (minPrice >= 1000) {
      this.minPz = (minPrice / 1000) + 'k';
    } else {
      minPrice ? this.minPz = minPrice.toString() : false;
    }
    if (minPrice >= 1000000) {
      this.minPz = (minPrice / 1000000) + 'm';
    }
  }

  searchSubHurbProperties(searchTermViewPort?: any, isSkipMapLoad?: boolean, isMarkerSet?: boolean, isScroll?: boolean) {
    this.isLoaded = true;
    let viewport = {};
    if (!searchTermViewPort) {
      searchTermViewPort = JSON.parse(this.localStorage.getItem('SearchData'));
    }

    if (searchTermViewPort) {
      let timePeriod = this.selectedValue.split("-");
      let from = timePeriod[0];
      let to = timePeriod[1];
      viewport["From"] = from;
      viewport["To"] = to;
      viewport["SwLat"] = searchTermViewPort.SwLat;
      viewport["SwLng"] = searchTermViewPort.SwLng;
      viewport["NeLat"] = searchTermViewPort.NeLat;
      viewport["NeLng"] = searchTermViewPort.NeLng;
      viewport["UserId"] = this.userId;
      viewport["PageNum"] = this.PageNum;
      viewport["AddressComponent"] = searchTermViewPort.AddressComponent;
      viewport["AddressType"] = searchTermViewPort.AddressType;
      viewport["SearchTerm"] = this.subHurbName;
      this.searchTerm = searchTermViewPort.SearchTerm;
      if (this.fromDashboard) {
        viewport["AddressComponent"] = null;
        viewport["AddressType"] = null;
      }
    }

    this.selectedBeds === "" ? viewport["Bedrooms"] = null : viewport["Bedrooms"] = this.selectedBeds;
    this.selectedBaths === "" ? viewport["Bathrooms"] = null : viewport["Bathrooms"] = this.selectedBaths;

    (this.isAllActiveStatus) ? viewport["Status"] = null : viewport["Status"] = this.selectedStatus;
    viewport["PropertyId"] = this.propertyId;

    viewport["AddressComponent"] = null;
    viewport["AddressType"] = null;
    viewport["PageNum"] = this.PageNum;
    this.isUserExist ? (viewport["UserId"] = this.userId ? this.userId : "") : viewport["UserId"] = "";

    this._unsubscribeAll.add(this.searchResultPageService.getSimilarSubHurbProperties(viewport).subscribe(data => {
      if (data.Success) {
        if (this.localStorage.getItem("SearchData")) {
          let searchdata = JSON.parse(this.localStorage.getItem('SearchData'));
        }
        this.changePerformanceForPropertyDetail(viewport, isSkipMapLoad);
        // this.getSortAddress();
        this.properties = [];
        this.isLoading = false;
        this.properties = data.Model;
        this.totalHome = this.properties.length;
        if (data.Model.length > 0) {
          this.totalProperties = data.Model[0].TotalCount;
        } else {
          this.totalProperties = 0;
        }
        if (isMarkerSet) {
          this.AllMarkers.forEach(element => {
            element.setVisible(false);
          });
          this.setMarkerOnGoogleMap(this.map);
        }
        if (isSkipMapLoad) {
        } else {
          this.bindGoogleMap(searchTermViewPort.Lat, searchTermViewPort.Lng, searchTermViewPort.AddressType);
        }
      } else {
        this.totalProperties = 0;
      }
      this.isLoaded = false;
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        this.isLoaded = false;
      }));
  }

  getRandom() {
    return Math.floor(Math.random() * 10) + 1;
  }

  changePerformanceForPropertyDetail(viewport: any, isSkipMapLoad?: boolean) {
    let ViewBlockSize = 4;
    let BlockDiff = 0;
    viewport["SwLat"] = viewport.SwLat;
    viewport["NeLat"] = viewport.NeLat;
    viewport["SwLng"] = viewport.SwLng;
    viewport["NeLng"] = viewport.NeLng;
    viewport["isSurroundingSuburb"] = localStorage.getItem("isSurroundingSuburb");
    this.selectedBeds === "" ? viewport["Bedrooms"] = null : viewport["Bedrooms"] = this.selectedBeds;
    this.selectedBaths === "" ? viewport["Bathrooms"] = null : viewport["Bathrooms"] = this.selectedBaths;
    (this.isAllActiveStatus) ? viewport["Status"] = null : viewport["Status"] = this.selectedStatus;
    (this.selectedMaxPrice === null || this.selectedMaxPrice === 0) ? viewport["MaxPrice"] = null : viewport["MaxPrice"] = this.selectedMaxPrice;
    (this.selectedMinPrice === null || this.selectedMinPrice === 0) ? viewport["MinPrice"] = null : viewport["MinPrice"] = this.selectedMinPrice;
    this.isExactMatchBath ? viewport["IsExactMatchBath"] = true : false;
    this.isExactMatchBed ? viewport["IsExactMatchBed"] = true : false;
    if (viewport["isSurroundingSuburb"] == "false") {
      viewport["SearchTerm"] = null;
    }
    viewport["SearchTerm"] = null;
    //  get timeperiod
    let timePeriod = this.selectedValue.split("-");
    let from = timePeriod[0];
    let to = timePeriod[1];
    viewport["From"] = from;
    viewport["To"] = to;
    viewport["AddressComponent"] = null;
    viewport["AddressType"] = null;
    viewport["PageNum"] = this.PageNum;
    this.isUserExist ? (viewport["UserId"] = this.userId ? this.userId : "") : viewport["UserId"] = "";
    this._unsubscribeAll.add(this.searchResultPageService.getRanking(viewport).subscribe((data: any) => {
      if (data) {
        let modal = data.Model;
        this.rankedVM = [];
        this.maxRankedVM = [];
        this.minRankedVM = [];
        this.rankedVM = data.Model;
        this.maxRankedVM = this.rankedVM.filter(t => t.Status == "hot");
        this.minRankedVM = this.rankedVM.filter(t => t.Status == "cooling");
        this.stableRankedVM = this.rankedVM.filter(t => t.Status == "stable");
        if (this.properties.length == 0) {
          let htmlMarkers: HTMLCollectionOf<HTMLElement> = this.document.getElementsByClassName("htmlMarker") as HTMLCollectionOf<HTMLElement>;
          while (htmlMarkers.length > 0) {
            htmlMarkers[0].parentNode.removeChild(htmlMarkers[0]);
          }
          this.htmlMarkers = [];
        }
        this.properties.forEach(element => {
          let RankedObj = modal.find(t => t.PropertyDetailId == element.PropertyDetailId);
          if (RankedObj) {
            element.Ranking = RankedObj.Ranked;
          }

          let index1 = this.rankedVM.findIndex(t => t.PropertyDetailId == element.PropertyDetailId);
          if (index1 > -1)
            element.RankingStatus = this.rankedVM[index1].Status;
        });
        this.properties.forEach(element => {

          let secondArr = this.properties.filter(t => t.RankingStatus == element.RankingStatus);
          let totlaViewCount = 0;
          let ComparativeInterest;
          let ViewBlock;
          let PerformanceRange;
          let HigherPerformanceRange;
          let LowerPerformanceRange;
          let Performance;
          for (let index = 0; index < secondArr.length; index++) {
            totlaViewCount += secondArr[index].ViewCount;
          }
          if (secondArr.length == 0) {
            ComparativeInterest = 0
          } else {
            ComparativeInterest = Math.ceil(totlaViewCount / secondArr.length);
          }

          ViewBlock = Math.ceil(element.ViewCount / ViewBlockSize);
          PerformanceRange = ViewBlock + BlockDiff;
          HigherPerformanceRange = element.ViewCount + PerformanceRange;
          LowerPerformanceRange = element.ViewCount - PerformanceRange;

          if (ComparativeInterest > HigherPerformanceRange) {
            Performance = "Under average";
          } else if (ComparativeInterest >= LowerPerformanceRange) {
            Performance = "Average";
          } else {
            Performance = "Above average";
          }

          element.ViewBlock = ViewBlock;
          element.ComparativeInterest = ComparativeInterest;
          element.PerformanceRange = PerformanceRange;
          element.HigherPerformanceRange = HigherPerformanceRange;
          element.LowerPerformanceRange = LowerPerformanceRange;
          element.Performance = Performance;

          if (element.Performance == "Above average" && element.Ranking > 0) {
            element.ViewerStrength = "Strong";
          } else if (element.Performance == "Under average" && element.Ranking < 0) {
            element.ViewerStrength = "Weak";
          } else if (element.Performance == "Under average" && element.Ranking == 0) {
            element.ViewerStrength = "Weak";
          } else if (element.Performance == "Above average" && element.Ranking == 0) {
            element.ViewerStrength = "Strong";
          } else {
            element.ViewerStrength = "Average";
          }
        });
        this.setMarkerOnGoogleMap(this.map);
        // this.drawHigherAndLowerPolylines(null, isSkipMapLoad);
      }
    }));
    // console.log("performance", this.properties);
  }

  getSubHurbLatLong(subHurbName) {
    let _this = this;
    var request = {
      address: subHurbName,
      componentRestrictions: {
        country: 'nz'
      }
    }
    if (isPlatformBrowser(this.platformId)) {
      this.mapsAPILoader.load().then(() => {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode(request, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            let place = results[0];
            let viewport = {};
            viewport["SwLat"] = place.geometry.viewport.getSouthWest().lat();
            viewport["SwLng"] = place.geometry.viewport.getSouthWest().lng();
            viewport["NeLat"] = place.geometry.viewport.getNorthEast().lat();
            viewport["NeLng"] = place.geometry.viewport.getNorthEast().lng();
            viewport["Lat"] = place.geometry.location.lat();
            viewport["Lng"] = place.geometry.location.lng();
            viewport["SearchTerm"] = place.formatted_address;
            viewport["AddressType"] = place.types[0];
            if (_this.pageName === "SearchResultPage") {
              _this.getSubHurbInfo(viewport);
            } else {
              _this.searchSubHurbProperties(viewport);
            }

          } else {
            console.log("Geocode was not successful for the following reason: " + status);
          }
        });
      });
    }
  }

  draw() {
    let canvas: any;
    if (this.properties.length > 0 && this.pageName == "SearchResultPage") {
      this.maxViewCount = this.properties[0].MaxViewCount;
      let viwercount = this.document.getElementById('viwerCountSpan');
      if (viwercount) {
        this.maxViewCount ? viwercount.innerText = this.maxViewCount.toString() : false;
      }
    } else {
      var leftControlDiv = this.document.getElementById('leftControlDiv');
      leftControlDiv ? leftControlDiv.style.display = "none" : false;
    }
    if (!this.ctx) {
      canvas = this.document.getElementById('canvas');
      canvas ? this.ctx = canvas.getContext('2d') : false;
      // this.ctx = canvas.getContext('2d');
      // this.ctx = this.canvas.nativeElement.getContext('2d');
    }
    let width;
    let height;
    canvas ? width = canvas.width : false;
    canvas ? height = canvas.height : false;
    if (this.ctx) {
      // console.log("height", height);
      if (height) {
        const gradient = this.ctx.createLinearGradient(0, 0, 150, 0);
        // gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        // gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
        // gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
        gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
        gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
        gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');
        this.ctx.beginPath();
        this.ctx.rect(0, 0, width, 150);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
  }

  checkToChangeAgentOption(agentOption, property) {
    this.userId = +this.cookieService.get("user");
    if (!property.IsClaimed && agentOption.Id == 1) {
      this.ownerProp.emit(property);
    } else {
      if (property.IsClaimed && property.AgentOptionId == 1 && (agentOption.Id == 2 || agentOption.Id == 3)) {
        const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
          width: "400px"
        });
        dialogConfirmRef.componentInstance.title = "Delist property";
        dialogConfirmRef.componentInstance.message =
          "By clicking delist you agree you want to cancel your listing of " + property.Address + " and move to " + "<span Class='text-lowercase'>" + agentOption.Option + "</span>.";
        dialogConfirmRef.componentInstance.PropertyDetailId = property.PropertyDetailId;
        dialogConfirmRef.componentInstance.btnText1 = "Delist";
        // dialogConfirmRef.componentInstance.btnText2 = "No";
        dialogConfirmRef.componentInstance.pageName = "SearchResultPage";
        dialogConfirmRef.componentInstance.url1 = "yes";

        dialogConfirmRef.afterClosed().subscribe(result => {
          if (result) {
            let Obj = {
              PropertyDetailId: property.PropertyDetailId
            }
            this.searchResultPageService.unClaim(Obj).subscribe((data: any) => {
              if (data.Success) {
                this.eventEmitterService.onGetPropertyEventEmmit(property.PropertyDetailId, "UnClaimProperty");
                this.changeAgentOption(agentOption, property);
              }
            },
              error => {
                // this.commonService.toaster(error.statusText, false);
                console.log(error);
                if (error.status == 401) {
                  this.commonService.toaster("You have not access for claim property module. Please login.", false);
                }
              });
          }
        });
      } else {
        this.changeAgentOption(agentOption, property);
      }
    }
  }

  changeAgentOption(agentOption, property) {
    this.userId = +this.cookieService.get("user");
    let Obj = {
      AgentOptionId: agentOption.Id,
      AgentOptionName: agentOption.Option,
      AgentOption: agentOption.Id,
      PropertyDetailId: property.PropertyDetailId,
      OwnerId: this.userId,
      IsListProperty: false
    }
    this._unsubscribeAll.add(this.searchResultPageService.updateAgentOption(Obj).subscribe((data: any) => {
      if (data.Success) {
        let index = this.properties.findIndex(t => t.PropertyDetailId == property.PropertyDetailId);
        if (index > -1) {
          this.properties[index].AgentOptionId = data.Model.AgentOptionId;
          Obj.AgentOptionId = data.Model.AgentOptionId;
          this.properties[index].AgentOption = this.agentOption.find(t => t.Id == data.Model.AgentOptionId).Option;
          this.properties[index].AgentOptionArr = this.agentOption.filter(t => t.Id != data.Model.AgentOptionId);
          this.properties[index].AgentId = this.userId;
          this.properties[index].IsAgentListProperty = data.Model.IsListProperty;
          Obj.IsListProperty = data.Model.IsListProperty;

          if (this.properties[index].IsClaimed) {
            this.properties[index].AgentOptionArr = this.properties[index].AgentOptionArr.filter(t => t.Id != 1);
          }
          this.eventEmitterService.onAgentOptionEventEmit(Obj);
          this.commonService.toaster("Agent option updated successfully.", true);
        } else {
          this.commonService.toaster(data.ErrorMessage, false);
        }
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for agent module. Please login.", false);
        }
      }));
  }

  updateAgentOptionEvent(Obj) {
    if (this.mapProperty.PropertyDetailId == Obj.PropertyDetailId) {
      this.mapProperty.AgentOption = Obj.AgentOptionName;
      this.mapProperty.AgentOptionId = Obj.AgentOptionId;
      this.mapProperty.IsAgentListProperty = Obj.IsListProperty;
      this.mapProperty.AgentOptionArr = this.agentOption.filter(t => t.Id != Obj.AgentOptionId);
      if (this.mapProperty.IsClaimed) {
        this.mapProperty.AgentOptionArr = this.mapProperty.AgentOptionArr.filter(t => t.Id != 1);
      }
    }
  }


  ngOnChanges() {
    if (this.pageName == "SearchResultPage") {
      if (this.localStorage.getItem("SearchData")) {
        let sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
        if (this.fromDashboard == false) {
          this.bindGoogleMap(sessionData.Lat, sessionData.Lng, sessionData.AddressType);
        }
      }
    }
  }

  ngOnDestroy(): any {
    this.subsVar.unsubscribe();
    this._unsubscribeAll.unsubscribe();
  }

  changePerformance(isMarkerSet?: boolean) {
    let ViewBlockSize = 4;
    let BlockDiff = 0;
    // let BlockDiff = 2;
    let viewport = {};
    let sessionData;
    if (this.localStorage.getItem("SearchData")) {
      sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
    }
    viewport["SwLat"] = sessionData.SwLat;
    viewport["NeLat"] = sessionData.NeLat;
    viewport["SwLng"] = sessionData.SwLng;
    viewport["NeLng"] = sessionData.NeLng;
    viewport["isSurroundingSuburb"] = this.localStorage.getItem("isSurroundingSuburb");
    this.selectedBeds === "" ? viewport["Bedrooms"] = null : viewport["Bedrooms"] = this.selectedBeds;
    this.selectedBaths === "" ? viewport["Bathrooms"] = null : viewport["Bathrooms"] = this.selectedBaths;
    (this.isAllActiveStatus) ? viewport["Status"] = null : viewport["Status"] = this.selectedStatus;
    (this.selectedMaxPrice === null || this.selectedMaxPrice === 0) ? viewport["MaxPrice"] = null : viewport["MaxPrice"] = this.selectedMaxPrice;
    (this.selectedMinPrice === null || this.selectedMinPrice === 0) ? viewport["MinPrice"] = null : viewport["MinPrice"] = this.selectedMinPrice;
    this.isExactMatchBath ? viewport["IsExactMatchBath"] = true : false;
    this.isExactMatchBed ? viewport["IsExactMatchBed"] = true : false;
    if (viewport["isSurroundingSuburb"] == "false") {
      viewport["SearchTerm"] = this.searchTerm;
    }

    //  get timeperiod
    let timePeriod = this.selectedValue.split("-");
    let from = timePeriod[0];
    let to = timePeriod[1];
    viewport["From"] = from;
    viewport["To"] = to;
    viewport["AddressComponent"] = null;
    viewport["AddressType"] = null;
    viewport["PageNum"] = this.PageNum;
    this.isUserExist ? (viewport["UserId"] = this.userId ? this.userId : "") : viewport["UserId"] = "";
    this._unsubscribeAll.add(this.searchResultPageService.getRanking(viewport).subscribe((data: any) => {
      if (data) {
        let modal = data.Model;
        // console.log("Ranked by SP", modal);
        this.rankedVM = [];
        this.maxRankedVM = [];
        this.minRankedVM = [];
        this.rankedVM = data.Model;
        this.maxRankedVM = this.rankedVM.filter(t => t.Status == "hot");
        this.minRankedVM = this.rankedVM.filter(t => t.Status == "cooling");
        this.stableRankedVM = this.rankedVM.filter(t => t.Status == "stable");
        if (this.properties.length == 0) {
          let htmlMarkers: HTMLCollectionOf<HTMLElement> = this.document.getElementsByClassName("htmlMarker_" + this.pageName) as HTMLCollectionOf<HTMLElement>;
          while (htmlMarkers.length > 0) {
            htmlMarkers[0].parentNode.removeChild(htmlMarkers[0]);
          }
          this.htmlMarkers = [];
        }
        this.properties.forEach(element => {
          let RankedObj = modal.find(t => t.PropertyDetailId == element.PropertyDetailId);
          if (RankedObj) {
            element.Ranking = RankedObj.Ranked;
          }

          let index1 = this.rankedVM.findIndex(t => t.PropertyDetailId == element.PropertyDetailId);
          if (index1 > -1)
            element.RankingStatus = this.rankedVM[index1].Status;
          if (isMarkerSet) {
            this.AllMarkers.forEach(element => {
              element.setVisible(false);
            });
            this.setMarkerOnGoogleMap(this.map);
          }
        });
        this.properties.forEach(element => {
          let secondArr = this.properties.filter(t => t.RankingStatus == element.RankingStatus);
          let totlaViewCount = 0;
          let ComparativeInterest;
          let ViewBlock;
          let PerformanceRange;
          let HigherPerformanceRange;
          let LowerPerformanceRange;
          let Performance;
          for (let index = 0; index < secondArr.length; index++) {
            totlaViewCount += secondArr[index].ViewCount;
          }
          if (secondArr.length == 0) {
            ComparativeInterest = 0
          } else {
            ComparativeInterest = Math.ceil(totlaViewCount / secondArr.length);
          }

          ViewBlock = Math.ceil(element.ViewCount / ViewBlockSize);
          PerformanceRange = ViewBlock + BlockDiff;
          HigherPerformanceRange = element.ViewCount + PerformanceRange;
          LowerPerformanceRange = element.ViewCount - PerformanceRange;

          if (ComparativeInterest > HigherPerformanceRange) {
            Performance = "Under average";
          } else if (ComparativeInterest >= LowerPerformanceRange) {
            Performance = "Average";
          } else {
            Performance = "Above average";
          }

          element.ViewBlock = ViewBlock;
          element.ComparativeInterest = ComparativeInterest;
          element.PerformanceRange = PerformanceRange;
          element.HigherPerformanceRange = HigherPerformanceRange;
          element.LowerPerformanceRange = LowerPerformanceRange;
          element.Performance = Performance;

          if (element.Performance == "Above average" && element.Ranking > 0) {
            element.ViewerStrength = "Strong";
          } else if (element.Performance == "Under average" && element.Ranking < 0) {
            element.ViewerStrength = "Weak";
          } else if (element.Performance == "Under average" && element.Ranking == 0) {
            element.ViewerStrength = "Weak";
          } else if (element.Performance == "Above average" && element.Ranking == 0) {
            element.ViewerStrength = "Strong";
          } else {
            element.ViewerStrength = "Average";
          }
        });
        this.drawHigherAndLowerPolylines(null, false, true);
      }
    }));
    // console.log("performance", this.properties);
  }

  drawHigherAndLowerPolylines(property?: Property, isSkipMapLoad?: boolean, isEmit?: boolean) {
    this.isDblClicked = false;
    this.rankedVM = this.rankedVM.sort(t => t.Ranked);
    this.polylines.forEach(element => {
      element.setMap(null);
    });
    this.polylines = [];
    this.AllCenteredMarkers.forEach(element => {
      element.setMap(null);
    })
    this.AllCenteredMarkers = [];
    if (!isSkipMapLoad) {
      if (this.markerPreviousInfoWindow) {
        this.markerPreviousInfoWindow.close();
      }
    }

    if (this.markerInfoWindow) {
      this.markerInfoWindow.close();
    }

    var symbolCircle = {
      path: "M37 19 a19 19 0 1 1-38 0 a19 19 0 1 1 38 0z",
      fillColor: '#fff',
      strokeColor: '#0075d2',
      fillOpacity: .8,
      anchor: new google.maps.Point(18, 21),
      scaledSize: new google.maps.Size(20, 20),
      strokeWeight: 0.2,
      strokeOpacity: 1,
      scale: 1,
      zIndex: 99999
    }

    var symbolArrow = {
      path: "M17.27,3.55l-9.78,24a.28.28,0,0,0,.41.35l9.53-6a.18.18,0,0,1,.2,0l9.64,6a.28.28,0,0,0,.41-.34l-9.89-24a.28.28,0,0,0-.52,0Z",
      fillColor: '#0075d2',
      fillOpacity: .8,
      anchor: new google.maps.Point(17, 20),
      scaledSize: new google.maps.Size(20, 20),
      strokeWeight: 0.2,
      strokeOpacity: 1,
      scale: 1,
      zIndex: 99999
    }

    // Start Third Logic
    if (this.rankedVM.length > 0) {
      // start logic for max ranked properties
      var maxRanked = Math.max(...this.maxRankedVM.map(o => o.Ranked));
      let maxRankedArr: RankedPropertyVM[] = [];
      let maxTotalRank = 1;
      for (let index = maxRanked; index > 0; index--) {
        let count = this.maxRankedVM.filter(t => t.Ranked == index).length;
        if (count == 1) {
          let element = this.maxRankedVM.find(t => t.Ranked == index);
          element.TotalRank = maxTotalRank;
          maxTotalRank++;
          maxRankedArr.push(element);
        } else if (count > 1) {
          let orderedArr = this.maxRankedVM.filter(t => t.Ranked == index);
          var minBlock30 = Math.min(...orderedArr.map(o => o.Ranked30));
          var maxBlock30 = Math.max(...orderedArr.map(o => o.Ranked30));
          for (let indexBlock = minBlock30; indexBlock <= maxBlock30; indexBlock++) {
            let blockCount = orderedArr.filter(t => t.Ranked30 == indexBlock).length;
            if (blockCount == 1) {
              let propertyobj = orderedArr.find(t => t.Ranked30 == indexBlock);
              let isExist = maxRankedArr.some(t => t.Ranked30 == indexBlock && t.PropertyDetailId == propertyobj.PropertyDetailId);
              if (!isExist) {
                let element1 = orderedArr.find(t => t.Ranked30 == indexBlock);
                element1.TotalRank = maxTotalRank;
                maxTotalRank++;
                maxRankedArr.push(element1);
              }
            } else if (blockCount > 1) {
              let arr = orderedArr.filter(t => t.Ranked30 == indexBlock);
              let orderByDateArr = this.sortByDate(arr);
              for (let dateIndex = orderByDateArr.length - 1; dateIndex >= 0; dateIndex--) {
                let dateObj: RankedPropertyVM = orderByDateArr[dateIndex];
                let isExist = maxRankedArr.some(t => t.PropertyDetailId == dateObj.PropertyDetailId);
                if (!isExist) {
                  dateObj.TotalRank = maxTotalRank;
                  maxTotalRank++;
                  maxRankedArr.push(dateObj);
                }
              }
            }
          }
        }
      }
      maxRankedArr.forEach(element => {
        element.PropertyWeight = ((100 / element.TotalRank) + (100 / element.Ranked30)) / 2;
      });
      this.maxRankedArr = maxRankedArr;
      console.log('maxRankedArr', maxRankedArr);

      // End

      // start logic for stable ranked properties

      let minStableRank = Math.min(...this.stableRankedVM.map(o => o.Ranked30));
      let maxStableRank = Math.max(...this.stableRankedVM.map(o => o.Ranked30));

      let stableRankedArr: RankedPropertyVM[] = [];
      let stableCounter = 1;
      for (let index = minStableRank; index <= maxStableRank; index++) {
        let count = this.stableRankedVM.filter(t => t.Ranked30 == index).length;
        if (count == 1) {
          let element = this.stableRankedVM.find(t => t.Ranked30 == index);
          element.Id = stableCounter;
          element.PropertyWeight = stableCounter;
          element.TotalRank = stableCounter;
          stableRankedArr.push(element);
          stableCounter++;
        } else if (count > 1) {
          let arr = this.stableRankedVM.filter(t => t.Ranked30 == index);
          let orderByDateArr = this.sortByDate(arr);
          for (let dateIndex = orderByDateArr.length - 1; dateIndex >= 0; dateIndex--) {
            let dateObj: RankedPropertyVM = orderByDateArr[dateIndex];
            let isExist = stableRankedArr.some(t => t.PropertyDetailId == dateObj.PropertyDetailId);
            if (!isExist) {
              dateObj.Id = stableCounter;
              dateObj.PropertyWeight = stableCounter;
              dateObj.TotalRank = stableCounter;
              stableCounter++;
              stableRankedArr.push(dateObj);
            }
          }
        }
      }
      // console.log('stableRankedArr', stableRankedArr);
      // End

      // start logic for min ranked properties

      var minRanked = Math.min(...this.minRankedVM.map(o => o.Ranked));
      let minRankedArr: any[] = [];
      let minTotalRank = 1;
      for (let index = minRanked; index < 0; index++) {
        let count = this.minRankedVM.filter(t => t.Ranked == index).length;
        if (count == 1) {
          let element = this.minRankedVM.find(t => t.Ranked == index);
          element.TotalRank = minTotalRank;
          minTotalRank++;
          minRankedArr.push(element);
        } else if (count > 1) {
          let orderedMinArr = this.minRankedVM.filter(t => t.Ranked == index);
          var minBlock60 = Math.min(...orderedMinArr.map(o => o.Ranked60));
          var maxBlock60 = Math.max(...orderedMinArr.map(o => o.Ranked60));
          for (let indexBlock1 = minBlock60; indexBlock1 <= maxBlock60; indexBlock1++) {
            let blockCount1 = orderedMinArr.filter(t => t.Ranked60 == indexBlock1).length;
            if (blockCount1 == 1) {
              // let isExist = minRankedArr.some(t => t.Ranked60 == indexBlock1);
              let propertyobj = orderedMinArr.find(t => t.Ranked60 == indexBlock1);
              let isExist = minRankedArr.some(t => t.Ranked60 == indexBlock1 && t.PropertyDetailId == propertyobj.PropertyDetailId);
              if (!isExist) {
                let element1 = orderedMinArr.find(t => t.Ranked60 == indexBlock1);
                element1.TotalRank = minTotalRank;
                minTotalRank++;
                minRankedArr.push(element1);
              }
            } else if (blockCount1 > 1) {
              let arr = orderedMinArr.filter(t => t.Ranked60 == indexBlock1);
              let orderByDateArr = this.sortByDate(arr);
              for (let dateIndex = orderByDateArr.length - 1; dateIndex >= 0; dateIndex--) {
                let dateObj: RankedPropertyVM = orderByDateArr[dateIndex];
                let isExist = minRankedArr.some(t => t.PropertyDetailId == dateObj.PropertyDetailId);
                if (!isExist) {
                  dateObj.TotalRank = minTotalRank;
                  minTotalRank++;
                  minRankedArr.push(dateObj);
                }
              }
            }
          }
        }
      }
      minRankedArr.forEach(element => {
        element.PropertyWeight = ((100 / element.TotalRank) + (100 / element.Ranked30)) / 2;
      });
      this.minRankedArr = minRankedArr;
      // console.log('minRankedArr', minRankedArr);
      // End
      if (!property) {
        let hotProerty;
        if (maxRankedArr.length > 0) {
          hotProerty = this.properties.find(t => t.PropertyDetailId == maxRankedArr[0].PropertyDetailId);
          property = hotProerty;
        }
      }
      if (property) {
        let maxIndex = maxRankedArr.findIndex(t => t.PropertyDetailId == property.PropertyDetailId);
        if (maxIndex > -1) {
          property.RankingStatus = "hot";
        }
        let minIndex = minRankedArr.findIndex(t => t.PropertyDetailId == property.PropertyDetailId);
        if (minIndex > -1) {
          property.RankingStatus = "cooling";
        }
        if (minIndex == -1 && maxIndex == -1) {
          property.RankingStatus = "stable";
        }
        // logic for find maxArr by sorted with LastViewedDate and Raked

        if (property.RankingStatus == "cooling") {
          this.AllMarkers.forEach(element => {
            element.setVisible(false);
          });
          let coolingProperty = property;
          this.centerPolyLinePropertyId = coolingProperty.PropertyId;
          let coolingPropertyRank = minRankedArr.find(t => t.PropertyDetailId == coolingProperty.PropertyDetailId).PropertyWeight;

          const coolingPropertylat1 = parseFloat(coolingProperty.LatitudeLongitude.split(',')[0]);
          const coolingPropertylong1 = parseFloat(coolingProperty.LatitudeLongitude.split(',')[1]);
          let coolingRank = {
            lat: coolingPropertylat1,
            lng: coolingPropertylong1
          };

          if (maxRankedArr.length > 0) {
            let rank1;
            maxRankedArr.forEach(element => {
              if (element.TotalRank < 4) {
                let hotProperty = this.properties.find(t => t.PropertyDetailId == element.PropertyDetailId);
                let rankedProperties: any[] = [];
                const lat1 = parseFloat(hotProperty.LatitudeLongitude.split(',')[0]);
                const long1 = parseFloat(hotProperty.LatitudeLongitude.split(',')[1]);
                rank1 = {
                  lat: lat1,
                  lng: long1
                };
                rankedProperties.push(coolingRank);
                rankedProperties.push(rank1);

                let strokeWeight = 15;
                let average = ((coolingPropertyRank + element.PropertyWeight) / 2);
                let avgText = "FlowStrength " + average.toFixed(2) + "%";
                let weight = ((average * strokeWeight) / 100);
                this.userPath = new google.maps.Polyline({
                  path: rankedProperties,
                  geodesic: true,
                  strokeColor: '#0075d2',
                  strokeOpacity: 1.0,
                  strokeWeight: weight,
                  zIndex: weight,
                  icons: [
                    {
                      icon: symbolCircle,
                      offset: "49%"
                    },
                    {
                      icon: symbolArrow,
                      offset: "49%"
                    }
                  ],
                  map: this.map
                });

                var tooltipOptions = {
                  poly: this.userPath,
                  content: "",
                  cssClass: 'custom-tooltip',
                  map: this.map /* name of a css class to apply to tooltip */
                };
                // create the tooltip
                var tooltip = new Tooltip(tooltipOptions);
                google.maps.event.addListener(this.userPath, "mouseover", function (event) {
                  tooltip.setContent(avgText);
                });
              }

              if (this.pageName === "SearchResultPage") {
                this.polylines.push(this.userPath);
                this.userPath.setMap(this.map);
              }
            });
          }
          this.setMarkerOnGoogleMap(this.map);
        }
        // logic for find minArr by sorted with LastViewedDate and Raked
        if (property.RankingStatus == "hot") {
          this.AllMarkers.forEach(element => {
            element.setVisible(false);
          });

          let hotProperty = property;
          this.centerPolyLinePropertyId = hotProperty.PropertyId;
          let hotPropertyRank = maxRankedArr.find(t => t.PropertyDetailId == hotProperty.PropertyDetailId).PropertyWeight;
          const hotPropertylat1 = parseFloat(hotProperty.LatitudeLongitude.split(',')[0]);
          const hotPropertylong1 = parseFloat(hotProperty.LatitudeLongitude.split(',')[1]);
          let hotRank = {
            lat: hotPropertylat1,
            lng: hotPropertylong1
          };

          if (minRankedArr.length > 0) {
            let rank1;
            minRankedArr.forEach(element => {
              if (element.TotalRank < 4) {
                let hotProperty1 = this.properties.find(t => t.PropertyDetailId == element.PropertyDetailId);
                if (hotProperty1) {
                  let rankedProperties: any[] = [];
                  const lat1 = parseFloat(hotProperty1.LatitudeLongitude.split(',')[0]);
                  const long1 = parseFloat(hotProperty1.LatitudeLongitude.split(',')[1]);
                  rank1 = {
                    lat: lat1,
                    lng: long1
                  };
                  rankedProperties.push(rank1);
                  rankedProperties.push(hotRank);
                  let strokeWeight = 15;
                  let average = ((hotPropertyRank + element.PropertyWeight) / 2);
                  let avgText = "FlowStrength " + average.toFixed(2) + "%";
                  let weight = ((average * strokeWeight) / 100);

                  this.userPath = new google.maps.Polyline({
                    path: rankedProperties,
                    geodesic: true,
                    strokeColor: '#0075d2',
                    strokeOpacity: 1.0,
                    strokeWeight: weight,
                    zIndex: weight,
                    icons: [
                      {
                        icon: symbolCircle,
                        offset: "49%"
                      },
                      {
                        icon: symbolArrow,
                        offset: "49%"
                      }
                    ],
                  });
                  // ReferenceLink for custom tooltip : http://jsfiddle.net/Monya/28AXw/ [07/10/2020]
                  var tooltipOptions = {
                    poly: this.userPath,
                    content: "",
                    cssClass: 'custom-tooltip', /* name of a css class to apply to tooltip */
                    map: this.map
                  };
                  // create the tooltip
                  var tooltip = new Tooltip(tooltipOptions);
                  google.maps.event.addListener(this.userPath, "mouseover", function (event) {
                    tooltip.setContent(avgText);
                  });
                }
              }

              if (this.pageName === "SearchResultPage") {
                this.polylines.push(this.userPath);
                this.userPath.setMap(this.map);
              }
            });
          }
          this.setMarkerOnGoogleMap(this.map);
        }
        if (property.RankingStatus == "stable") {
          this.centerPolyLinePropertyId = property.PropertyId;
          this.AllMarkers.forEach(item => {
            item.setMap(null);
          });
          this.setMarkerOnGoogleMap(this.map);
        }

        if ((property.RankingStatus == "stable" || (property.RankingStatus == "hot") || (property.RankingStatus == "cooling"))) {
          this.markerPreviousInfoWindow = this.markerInfoWindow;
          let text;
          if (property.RankingStatus == "hot" && minRankedArr.length == 0) {
            text = "<div id='content_" + property.PropertyId + "' style='width: 100%;'><p class='mb-0 '>Interest is hot in <br/>" + property.Address + "</p> Estimate price " + this.currencyPipe.transform(property.HomebuzzEstimate, '$').split('.00')[0] + "<br/>There is no interest flow in this map area</div>";
          } else if (property.RankingStatus == "hot" && minRankedArr.length > 0) {
            text = "<div id='content_" + property.PropertyId + "' style='width: 100%;'><p class='mb-0 '>Interest is hot in <br/>" + property.Address + " for this map area</p> Estimate price " + this.currencyPipe.transform(property.HomebuzzEstimate, '$').split('.00')[0] + "</div>";
          } else if (property.RankingStatus == "cooling" && maxRankedArr.length == 0) {
            text = "<div id='content_" + property.PropertyId + "' style='width: 100%;'><p class='mb-0 '>Interest is cool in <br/>" + property.Address + "</p> Estimate price " + this.currencyPipe.transform(property.HomebuzzEstimate, '$').split('.00')[0] + "<br/>There is no interest flow in this map area</div>";
          } else if (property.RankingStatus == "cooling" && maxRankedArr.length > 0) {
            text = "<div id='content_" + property.PropertyId + "' style='width: 100%'><p class='mb-0 '>Interest is cool in <br/>" + property.Address + " for this map area</p> Estimate price " + this.currencyPipe.transform(property.HomebuzzEstimate, '$').split('.00')[0] + "</div>";
          }
          else {
            text = "<div id='content_" + property.PropertyId + "' style='width: 100%;'><p class='mb-0 '>Interest is stable in <br/>" + property.Address + " for this map area</p> Estimate price " + this.currencyPipe.transform(property.HomebuzzEstimate, '$').split('.00')[0] + "</div>";
          }

          let divmarker = this.document.createElement('div');
          divmarker.setAttribute("style", "left: auto;right: auto;cursor: pointer !important;");
          let spanmarker = this.document.createElement('span');
          spanmarker.setAttribute("style", "width: 260px; white-space: normal;padding-left: 13px;background-color: black !important;color: #fff;")
          divmarker.classList.add('input-group');
          spanmarker.classList.add('input-border-none');
          spanmarker.classList.add('input-group-text');
          divmarker.id = "divmarker_" + property.PropertyId;

          spanmarker.innerHTML = text;
          spanmarker.id = "linespan";
          let spanmarker2 = this.document.createElement('span');
          spanmarker2.id = "closeMarkerInfo";
          spanmarker2.setAttribute("style", "color: #fff;");

          let icon = this.document.createElement('span');
          icon.classList.add("cursor-pointer");
          icon.textContent = "X";
          icon.setAttribute("style", "position: absolute;top: 5px;right: 10px;font-size: 14px;");
          spanmarker2.appendChild(icon);
          divmarker.appendChild(spanmarker);
          divmarker.appendChild(spanmarker2);
          let address = property.Address + ", " + property.Suburb + ", " + property.City;
          let id = "marker_" + this.pageName + "_" + property.PropertyId;

          let lat = parseFloat(property.LatitudeLongitude.split(",")[0]);
          let lng = parseFloat(property.LatitudeLongitude.split(",")[1]);
          if (this.markerPreviousInfoWindow) {
            this.markerPreviousInfoWindow.close();
          }
          if (this.markerInfoWindow) {
            this.markerInfoWindow.close();
          }
          if (this.pageName === "SearchResultPage") {
            if (this.previousInfoWindow) {
              this.previousInfoWindow.close();
            }
          }
          let index = this.AllMarkers.findIndex(t => t.title == address);
          let markerlatlong = {
            lat: lat,
            lng: lng
          };
          var infowindow1 = new google.maps.InfoWindow({
            content: divmarker,
            maxWidth: 200,
            disableAutoPan: true,
            position: markerlatlong
          });

          if (this.pageName === "SearchResultPage") {
            infowindow1.open(this.map);
            this.markerInfoWindow = infowindow1;
            google.maps.event.addListener(this.markerInfoWindow, 'domready', function () {
              let classObj: HTMLCollectionOf<HTMLElement> = _this.document.getElementsByClassName('gm-ui-hover-effect') as HTMLCollectionOf<HTMLElement>;
              if (classObj.length > 0) {
                classObj[0].classList.add('hide');
              }
              // this.document.getElementsByClassName('gm-ui-hover-effect')[0].classList.add('hide');
              let linespan = _this.document.getElementById("content_" + property.PropertyId);
              if (linespan) {
                let divHeight = linespan.offsetHeight
                let lineHeight = +linespan.style.lineHeight;
                let lines = divHeight / lineHeight;
              }
              let center = _this.getPixelFromLatLng(_this.map.getCenter());
              let point;
              let indexmarker = _this.htmlMarkers.findIndex(t => t.lat == lat && t.lng == lng);
              if (indexmarker > -1) {
                point = _this.getPixelFromLatLng(_this.htmlMarkers[indexmarker].pos);
                let checkleftright = (point.x < center.x) ? "l" : "r";
                let checktopbottom = (point.y > center.y) ? "b" : "t";
                let quadrant = "",
                  offset;
                quadrant += (point.y > center.y) ? "b" : "t";
                quadrant += (point.x < center.x) ? "l" : "r";
                let arrowstyle: HTMLCollectionOf<HTMLElement> = _this.document.getElementsByClassName('gm-style-iw-t') as HTMLCollectionOf<HTMLElement>;
                let rightList: HTMLCollectionOf<HTMLElement> = _this.document.getElementsByClassName('gm-style-iw gm-style-iw-c') as HTMLCollectionOf<HTMLElement>;
                if (rightList.length > 0 && arrowstyle.length > 0) {
                  rightList[0].style.display = "block";
                  if (quadrant == "tr") {
                    rightList[0].style.left = "-146px";
                    rightList[0].style.top = "-40px";
                    if ((property.RankingStatus == "hot" && minRankedArr.length == 0) || (property.RankingStatus == "cooling" && maxRankedArr.length == 0)) {
                      rightList[0].style.left = "-146px";
                      rightList[0].style.top = "10px";
                      arrowstyle[0].classList.add('arrow-big-tr');
                    } else {
                      rightList[0].style.left = "-146px";
                      rightList[0].style.top = "-2px";
                      arrowstyle[0].classList.add('arrow-tr');
                    }
                  } else if (quadrant == "br") {
                    rightList[0].style.left = "-146px";
                    rightList[0].style.top = "-20px";
                    arrowstyle[0].classList.add('arrow-br');
                  } else if (quadrant == "tl") {
                    rightList[0].style.left = "146px";
                    rightList[0].style.top = "45px";
                    if ((property.RankingStatus == "hot" && minRankedArr.length == 0) || (property.RankingStatus == "cooling" && maxRankedArr.length == 0)) {
                      arrowstyle[0].classList.add('arrow-big-tl');
                      rightList[0].style.left = "146px";
                      rightList[0].style.top = "97px";
                    } else {
                      rightList[0].style.top = "76px";
                      rightList[0].style.left = "146px";
                      arrowstyle[0].classList.add('arrow-tl');
                    }
                  } else if (quadrant == "bl") {
                    rightList[0].style.left = "146px";
                    rightList[0].style.top = "20px";
                    arrowstyle[0].classList.add('arrow-bl');
                  }
                }
              }



              let divID = "divmarker_" + property.PropertyId;
              let divClickObj = _this.document.getElementById(divID);
              if (divClickObj) {
                divClickObj.addEventListener('click', function (event) {
                  if (_this.markerInfoWindow) {
                    if (_this.markerInfoWindow.getMap()) {
                      _this.onPropertyImageTileClick(null, property);
                    }
                  }
                });
              }
            });
          }


          let _this = this;
          spanmarker2.addEventListener('click', function (event) {
            _this.markerInfoWindow.close();
          });
        }
      }
    }
    let flowInterestText = this.document.getElementById('flowInterestText');
    if (this.polylines.length == 0) {
      if (property) {
        this.centerPolyLinePropertyId = property.PropertyId;
      }
      if (flowInterestText) {
        flowInterestText.style.color = "black";
      } else {
        setTimeout(() => {
          flowInterestText = this.document.getElementById('flowInterestText');
          if (flowInterestText) {
            flowInterestText.style.color = "black";
          }
        }, 500);
      }
    } else {
      if (flowInterestText) {
        flowInterestText.style.color = "#1294fb";
      } else {
        setTimeout(() => {
          flowInterestText = this.document.getElementById('flowInterestText');
          if (flowInterestText) {
            flowInterestText.style.color = "#1294fb";
          }
        }, 500);
      }
    }

    // Start Logic for top 5 hottest properties display on top
    let countmax = this.maxRankedArr.length;
    let hotPropertyCount = 0;
    if (isEmit) {
      if (this.maxRankedArr.length > 0 && this.properties.length > 0) {
        let sortedProperties = [];

        if (countmax > 5) {
          hotPropertyCount = 3;
          for (let i = 0; i < 5; i++) {
            let element = this.maxRankedArr[i];
            let property = this.properties.find(t => t.PropertyDetailId == element.PropertyDetailId);
            sortedProperties.push(property);
          }
        } else {
          if (countmax > 3) {
            hotPropertyCount = 3;
          } else {
            hotPropertyCount = this.maxRankedArr.length;
          }
          for (let j = 0; j < countmax; j++) {
            let element = this.maxRankedArr[j];
            let property = this.properties.find(t => t.PropertyDetailId == element.PropertyDetailId);
            sortedProperties.push(property);
          }

        }
        for (let index = 0; index < this.properties.length; index++) {
          let element = this.properties[index];
          let existIndex = sortedProperties.findIndex(t => t.PropertyDetailId == element.PropertyDetailId);
          if (existIndex < 0) {
            sortedProperties.push(element);
          }
        }

        this.properties = [];
        this.properties = JSON.parse(JSON.stringify(sortedProperties));
        // console.log("HOTProperties.....", this.properties);
        // console.log("hotPropertyCount", hotPropertyCount);
        this.eventEmitterService.OnSortedProperties(this.properties, true, hotPropertyCount);
      } else {
        this.eventEmitterService.OnSortedProperties(this.properties, false, hotPropertyCount);
      }
    }
    // End logic for top 5 hottest properties display on top
  }

  // clearPolylines() {
  //   this.polylines.forEach(element => {
  //     element.setMap(null);
  //   });
  //   this.polylines = [];
  //   let refresh_Btn = this.document.getElementById('refresh_Btn');
  //   if (refresh_Btn) {
  //     refresh_Btn.style.display = "none";
  //   }
  //   this.centerPolyLinePropertyId = 0;
  //   this.AllMarkers.forEach(item => {
  //     item.setMap(null);
  //   });
  //   this.setMarkerOnGoogleMap(this.map);
  // }

  sortByDate(arr) {
    arr.sort(function (a, b) {
      return Number(new Date(a.LastViewed)) - Number(new Date(b.LastViewed));
    });
    return arr;
  }

  getPixelFromLatLng(latLng) {
    var projection = this.map.getProjection();
    var point = projection.fromLatLngToPoint(latLng);
    return point;
  };

  ngAfterViewInit() {
  }
}

export enum PropertyStatus {
  Notlisted = 'Not listed',
  Premarket = 'Pre-market',
  ForSale = 'For sale'

  // Viewed = 'Viewed',
  // ViewedOwnerActive = 'Viewed / Owner active',
  // OpenHomeOwnerActive = 'Open home / Owner active',
  // ForSaleOwnerActive = 'For sale / Owner active'
}
