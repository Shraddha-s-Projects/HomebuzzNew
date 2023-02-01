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
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

declare var google: any;

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
  public heatMapArray = [];
  public heatmap: any;
  public marker: any;
  public dublicateProperties: Property[] = [];
  public url: string;
  public globalzoom: number;
  public AllMarkers: any[] = [];
  public AllCircles: any[] = [];
  public showAllMarkers: any[] = [];
  public isListView: boolean = false;
  public previousInfoWindow: any;
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
  public centerPolyLinePropertyId: number;
  public isBrowser: boolean;

  public userPath: any;
  public polylines: Polyline[] = [];
  public userMarker: any;
  public userLowRankPropertyId: number;
  public userHighRankPropertyId: number;
  public highRankLng: number;
  public lowRankLng: number;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private cookieService: CookieService,
    private searchResultPageService: SearchResultPageService,
    private ngZoneService: NgZone,
    private eventEmitterService: EventEmitterService,
    private commonService: CommonService,
    private commonModalService: CommonModalService,
    public dialog: MatDialog
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.randomNo = this.getRandom();
    this.isUserExist = this.cookieService.check("user");
    this.userId = this.isUserCookieExist ? parseInt(this.localStorage.getItem("userId")) : null;
    // this.subsVar.add(this.eventEmitterService.mouseHoverOnMarker.subscribe(
    //   (element: any) => {
    //     this.showMarkerPin(element);
    //   }
    // ));

    // this.subsVar.add(this.eventEmitterService.mouseOutOnMarker.subscribe(
    //   (element: any) => {
    //     this.removeMarkerPin(element);
    //   }
    // ));

    // this.subsVar.add(this.eventEmitterService.agentOptionEmit.subscribe(
    //   (element: any) => {
    //     this.updateAgentOptionEvent(element);
    //   }
    // ));
    // this.subsVar.add(this.eventEmitterService.invokeSearchResultPageComponentFunction.subscribe(
    //   (Obj: any) => {
    //     if (Obj.Action != undefined) {
    //       let index = this.properties.findIndex(t => t.PropertyDetailId === Obj.PropertyDetailId);
    //       if(this.mapProperty && this.mapProperty.PropertyDetailId == Obj.PropertyDetailId){
    //         if (Obj.Action == "Dislike") {
    //           index > -1 ? this.properties[index].UserLiked = false : false;
    //         } else if (Obj.Action == "Like") {
    //           index > -1 ? this.properties[index].UserLiked = true : false;
    //         }
    //         else if (Obj.Action == "ClaimProperty") {
    //           index > -1 ? this.properties[index].IsClaimed = true : false;
    //           index > -1 ? this.properties[index].OwnerId = this.userId : null;
    //           index > -1 ? this.properties[index].Status = "Pre-market" : null;
    //         } else if (Obj.Action == "UnClaimProperty") {
    //           index > -1 ? this.properties[index].IsClaimed = false : false;
    //           index > -1 ? this.properties[index].OwnerId = null : this.userId;
    //           index > -1 ? this.properties[index].Status = "Not listed" : null;
    //         }
    //         else if (Obj.Action == "OfferMade") {
    //           index > -1 ? this.properties[index].UserOffered = true : false;
    //         } else if (Obj.Action == "RemoveOffer") {
    //           index > -1 ? this.properties[index].UserOffered = false : false;
    //         }
    //         this.mapProperty = this.properties[index];
    //       }
    //     }
    //   }
    // ));
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

    if (isPlatformBrowser(this.platformId)) {
      this.mapsAPILoader.load().then(() => {
        if (this.pageName === "SearchResultPage") {
          this.loadData();
        } else if (this.pageName === "PropertyImageGalleryPage") {
          // this.searchSubHurbProperties();
          this.getSubHurbLatLong(this.subHurbName);
        }

        this.initializeAllClass();
      });
    }
    // this.loadGoogleMap();
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
            // this.isLoadSubHurbInfo = false;
            // this.subHurbPropertyInfo = undefined;
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
        this.searchProperties(this.searchTermViewPort);
        this.localStorage.setItem("SearchData", JSON.stringify(viewPort));
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
    // this.isLoadPage ? this.isLoaded = false : this.isLoaded = true;
    // this.isLoadPage ? this.isLoading = false : this.isLoading = true;
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
        // this.fromDashboard = false;
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

    viewport["AddressType"] = null;
    viewport["PageNum"] = this.PageNum;
    this.isUserExist ? (viewport["UserId"] = this.userId ? this.userId : "") : viewport["UserId"] = "";

    // let queryObject = new Object();
    if (!isSkipMapLoad) {
      this.getSortAddress();
    }
    if (this.copyPreviousSubHurbName !== this.subHurbName || this.copyPreviousSubHurbName == "" || this.subHurbName == "") {
      this.isLoadSubHurbInfo = false;
      this.subHurbPropertyInfo = undefined;
      if (sessionData.AddressType != "street_address") {
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
        // this.searchedTerm = this.searchTerm;
        // this.clearHeatMap();
        // this.getSortAddress();
        if (this.PageNum == 1) {
          this.properties = [];
          this.properties = data.Model;
        }
        this.isLoading = false;
        if (this.totalHome != (this.PageNum * 100) && this.PageNum > 1) {
          this.properties = this.PageNum == 1 ? data.Model : this.properties.concat(data.Model);
        }
        // Start code for display ViewerStrength on property tile
        this.changePerformance();
        // End
        this.polylines.forEach(element => {
          element.setMap(null);
        });
        this.polylines = [];
        this.userLowRankPropertyId = undefined;
        this.userHighRankPropertyId = undefined;
        this.totalHome = this.properties.length;
        // Start to commented code for get highest and lowest property polyline
        // 4th August 2020
        // if (this.totalHome >= 2) {
        //   this.searchResultPageService.getRankedProperties(viewport).subscribe((res: any) => {
        //     if (res.Model.length > 0) {
        //       let rankedProperties = res.Model.map(itm => {
        //         return {
        //           lat: itm.Latitude,
        //           lng: itm.Longitude
        //         }
        //       });

        //       this.polylines.forEach(element => {
        //         element.setMap(null);
        //       });
        //       this.polylines = [];
        //       this.userPath = new google.maps.Polyline({
        //         path: rankedProperties,
        //         geodesic: true,
        //         strokeColor: '#0075d2',
        //         strokeOpacity: 1.0,
        //         strokeWeight: 5
        //       });
        //       this.polylines.push(this.userPath);
        //       this.userPath.setMap(this.map);

        //       // console.log(Math.atan2(rankedProperties[1][1],rankedProperties[1][1]));

        //       res.Model.forEach(element => {
        //         if (element.Ranked === 1) {
        //           this.userHighRankPropertyId = element.PropertyId;
        //           this.highRankLng = element.Longitude;
        //         }
        //         else {
        //           this.userLowRankPropertyId = element.PropertyId;
        //           this.lowRankLng = element.Longitude;
        //         }
        //       });
        //       if (isMarkerSet) {
        //         this.AllMarkers.forEach(element => {
        //           element.setVisible(false);
        //         });
        //         if ((this.properties.length >= 2) && (this.userLowRankPropertyId) && (this.userHighRankPropertyId)) {
        //           this.setMarkerOnGoogleMap(this.map);
        //         }
        //         if (this.properties.length < 2) {
        //           this.setMarkerOnGoogleMap(this.map);
        //         }
        //       }
        //     }
        //   });
        // }
        // else {
        // }
        // End


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

        // Start commented code for draw canvas in to google map
        // var leftControlDiv = this.document.getElementById('viewcountDiv');
        // var canvasDiv = this.document.getElementById('canvas');
        // if (this.properties.length <= 0) {
        //   leftControlDiv ? leftControlDiv.style.display = "none" : false;
        //   canvasDiv ? canvasDiv.style.display = "none" : false;
        // } else {
        //   leftControlDiv ? leftControlDiv.style.display = "block" : false;
        //   canvasDiv ? canvasDiv.style.display = "block" : false;
        // }
        //End

        // For update mapproperty when unlike, unclaime and remove offer
        if (this.updatedPropertyDetailId) {
          let index = this.properties.findIndex(t => t.PropertyDetailId == this.updatedPropertyDetailId);
          index > -1 ? this.mapProperty = this.properties[index] : false;
        }

        // Start to commented code for get highest and lowest property polyline
        // 4th August 2020
        // if (isMarkerSet && this.totalHome < 2) {
        //   this.AllMarkers.forEach(element => {
        //     element.setVisible(false);
        //   });
        //   if ((this.properties.length >= 2) && (this.userLowRankPropertyId) && (this.userHighRankPropertyId)) {
        //     this.setMarkerOnGoogleMap(this.map);
        //   }
        //   if (this.properties.length < 2) {
        //     this.setMarkerOnGoogleMap(this.map);
        //   }
        // }
        // End

        if (isMarkerSet) {
          this.AllMarkers.forEach(element => {
            element.setVisible(false);
          });
          this.setMarkerOnGoogleMap(this.map);
        }

        if (isSkipMapLoad) {
          // For remove heat map commented this code
          // this.properties.length > 0 ? this.setHeatMapLayerOnGoogleMap(this.map, true) : false;
          // End

          // For remove circle commented this code 
          // this.AllCircles.forEach(element => {
          //   element.setMap(null);
          // });
          // this.AllCircles = [];
          // this.properties.length > 0 ? this.setCircleOnGoogleMap(this.map, true) : false;
          // End
        } else {
          //  this.globalzoom = searchTermViewPort.Zoom;
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
          // searchedProperty = this.properties.filter(element => {
          //   return element.ViewCount == 0;
          // });
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
          // console.log("Address",this.searchedTerm);
          let property = this.properties.find(t => t.Address.includes(this.searchedTerm));
          // console.log("prop", property);
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
        this.updateTotalViews();
        this.isLoaded = false;
        if (this.pageName == "SearchResultPage") {
          this.refreshMap.emit();
        }
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      }));
  }

  saveProperty(searchTermViewPort: any) {
    this.isLoaded = true;
    // this.isLoadPage ? this.isLoaded = false : this.isLoaded = true;
    // this.isLoadPage ? this.isLoading = false : this.isLoading = true;
    let queryObject = {};
    queryObject["Lat"] = searchTermViewPort.Lat;
    queryObject["Lng"] = searchTermViewPort.Lng;
    queryObject["SearchTerm"] = searchTermViewPort.SearchTerm;
    queryObject["UserId"] = this.userId;
    queryObject["AddressComponent"] = searchTermViewPort.AddressComponent;
    this._unsubscribeAll.add(this.searchResultPageService.saveProperties(queryObject).subscribe(data => {
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
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
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
    this.searchTerm = sessionData.SearchTerm;
    let splitStr = "";
    let subHurbStr = "";
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
        // this.commonService.toaster(error.statusText, false);
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
          let el: HTMLCollectionOf<Element> = _this.document.getElementsByClassName('gm-style');
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

      // Start local Storage logic
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

      //     var a7Days = moment(ActivatedDate).add(7, 'days').format("MM/DD/YYYY");
      //     var Activate7Days = new Date(a7Days);

      //     var a8Days = moment(ActivatedDate).add(8, 'days').format("MM/DD/YYYY");
      //     var Activate8Days = new Date(a8Days);

      //     var a14Days = moment(ActivatedDate).add(14, 'days').format("MM/DD/YYYY");
      //     var Activate14Days = new Date(a14Days);

      //     var a15Days = moment(ActivatedDate).add(15, 'days').format("MM/DD/YYYY");
      //     var Activate15Days = new Date(a15Days);

      //     var a21Days = moment(ActivatedDate).add(21, 'days').format("MM/DD/YYYY");
      //     var Activate21Days = new Date(a21Days);

      //     var a22Days = moment(ActivatedDate).add(22, 'days').format("MM/DD/YYYY");
      //     var Activate22Days = new Date(a22Days);

      //     var a28Days = moment(ActivatedDate).add(28, 'days').format("MM/DD/YYYY");
      //     var Activate28Days = new Date(a28Days);

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

      // // if (!this.isUserCookieExist) {
      // //   this.AddViewCount(property);
      // //   this.savePropertyViewCount(property);
      // // } else {
      // if (proparr) {
      //   if (proparr.Homes.length > 0) {
      //     propertylen = proparr.Homes.filter(t => Number(t.Id) === property.PropertyDetailId).length;
      //   }
      //   if (propertylen <= 1) {
      //     this.AddViewCount(property);
      //   }
      // }
      // this.savePropertyViewCount(property);
      // // }
      // localStorage.setItem("prop_viewer", JSON.stringify(proparr));
      // End local Storage logic

      if (!property.IsViewedInWeek) {
        let isExist = this.localStorage.getItem("AddedViewCountId");
        if (isExist) {
          let propertydetailId = +isExist;
          if (property.PropertyDetailId != propertydetailId) {
            localStorage.removeItem("AddedViewCountId");
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
    // this.mapsAPILoader.load().then(() => {
    if (this.pageName === "SearchResultPage") {
      let map = new google.maps.Map(this.document.getElementById(this.pageName + this.randomNo), {
        zoom: zoomLevel,
        minZoom: 15,
        maxZoom: 21,
        center: center,
        // region : "",
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
        },
        mapTypeId: this.mapType,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
          // position: google.maps.ControlPosition.TOP_LEFT,
        },
        gestureHandling: "greedy",
        fullscreenControl: false,
        streetViewControl: false,
        scrollwheel: false,
        scaleControlOptions: false,
        disableDoubleClickZoom: true,
        // zoomControl: false,
        panControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{
              visibility: "off"
            }]
          }]
        // bounds: "strictBounds"
      });
      this.map = map;
    } else {
      let map = new google.maps.Map(this.document.getElementById(this.pageName + this.randomNo), {
        zoom: zoomLevel,
        minZoom: 14,
        maxZoom: 21,
        center: center,
        // region : "",
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
        },
        mapTypeId: this.mapType,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
          // position: google.maps.ControlPosition.TOP_LEFT,
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
        // bounds: "strictBounds"
      });
      this.map = map;
    }
    // });
    let _this = this;
    let propArray =
      this.dublicateProperties && this.dublicateProperties.length > 0 ? this.dublicateProperties : this.properties;
    if (this.map && propArray.length > 0) {
      // For remove heat map commented this code 
      // this.setHeatMapLayerOnGoogleMap(this.map);
      // End
      // For remove circle commented this code 
      // this.setCircleOnGoogleMap(this.map, true);
      // End
      this.setMarkerOnGoogleMap(this.map)
    } else {
      this.searchedAddressType == "street_address" ? this.map.setZoom(21) : false;
    }
    if (this.localStorage.getItem('SearchData')) {
      let serchedData = JSON.parse(this.localStorage.getItem('SearchData'));
    }
    let centerControlDiv = this.document.createElement('div');
    centerControlDiv.id = "centerControlDiv";
    centerControlDiv.setAttribute("style", "display: flex;z-index: 5;left:130px !important;");

    // let showMarkerbtn = this.document.createElement('div');
    // showMarkerbtn.id = "showMarkerbtn" + this.pageName;
    // showMarkerbtn.setAttribute("style", "background-color: rgb(255, 255, 255);border: 2px solid rgb(255, 255, 255);border-radius: 2px;box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;cursor: pointer;margin: 10px;text-align: center;z-index: 2;height: 38px;width: 120px;padding: 10px;color: rgb(0, 0, 0);font-weight: 500;font-family: Roboto, Arial, sans-serif;font-size: 13px;display: none;");
    // showMarkerbtn.title = 'Show status';
    // showMarkerbtn.innerHTML = 'Show status';

    // let hideMarkerbtn = this.document.createElement('div');
    // hideMarkerbtn.id = "hideMarkerbtn" + this.pageName;
    // hideMarkerbtn.setAttribute("style", "background-color: rgb(255, 255, 255);border: 2px solid rgb(255, 255, 255);border-radius: 2px;box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;margin: 10px;text-align: center;z-index: 2;height: 38px;width: 120px;padding: 10px;color: rgb(0, 0, 0);font-weight: 500;font-size: 13px;font-family: Roboto, Arial, sans-serif;display: block;")
    // hideMarkerbtn.title = 'Hide status';
    // hideMarkerbtn.innerHTML = 'Hide status';

    let refresh = this.document.createElement('BUTTON');
    refresh.id = "refresh_Btn";
    refresh.classList.add('cursor-pointer');
    refresh.setAttribute("style", "background-color: rgb(255, 255, 255);border: 2px solid rgb(255, 255, 255);border-radius: 2px;box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;margin: 10px;text-align: center;z-index: 2;height: 38px;width: 127px;padding: 10px;color: rgb(0, 0, 0);font-weight: 500;font-size: 13px;font-family: Roboto, Arial, sans-serif;display: none;");
    refresh.title = 'Reset';
    refresh.innerHTML = '<span class="mr10 cursor-pointer" id="flowInterestText" style="color:#1294fb;">Flowinterest</span><i class="fa fa-refresh cursor-pointer" id="Refresh" title="Reset" aria-hidden="true" ></i>';

    // centerControlDiv.appendChild(showMarkerbtn);
    // centerControlDiv.appendChild(hideMarkerbtn);
    centerControlDiv.appendChild(refresh);

    let leftControlDiv = this.document.createElement('div');
    leftControlDiv.style.marginLeft = "20px";

    // Start commented code for draw canvas in to google map
    // let canvas = this.document.createElement('canvas');
    // canvas.id = "canvas";
    // canvas.style.width = '150px';
    // canvas.style.height = '25px';
    // canvas.style.display = "block";

    // let viewcountDiv = this.document.createElement('div');
    // viewcountDiv.id = "viewcountDiv";
    // viewcountDiv.style.width = '150px';
    // viewcountDiv.style.height = '25px';
    // viewcountDiv.style.display = "block";
    // viewcountDiv.style.backgroundColor = "#fff";
    // viewcountDiv.style.textAlign = "center";
    // viewcountDiv.innerHTML = "<div class='d-flex justify-content-around h-100 font-16 align-items-center'><span>1</span> <span>Viewers</span><span id='viwerCountSpan'>" + this.maxViewCount + "</span></div>";
    // leftControlDiv.appendChild(viewcountDiv);
    // leftControlDiv.appendChild(canvas);
    // End

    // showMarkerbtn.addEventListener('click', function () {
    //   _this.showmarkerOnMap(_this.map);
    // });

    // hideMarkerbtn.addEventListener('click', function () {
    //   _this.hidemarkerOnMap();
    // });

    // google.maps.event.addListener(_this.map, "maptypeid_changed", function () {
    //   _this.mapType = _this.map.getMapTypeId();
    // });
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

    // if (_this.AllMarkers.length > 0) {

    if (_this.pageName == "SearchResultPage") {
      _this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);
      // _this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(leftControlDiv);
    }
    // }

    setTimeout(() => {
      // let flowInterestText = document.getElementById('flowInterestText');
      // if (flowInterestText) {
      //   flowInterestText.addEventListener('click', function () {
      //     _this.clearPolylines();
      //   });
      // }

      let refreshBtn = this.document.getElementById('refresh_Btn')
      if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
          _this.clearPolylines();
        });
      }
    }, 4000);

    // map.addListener("dragend", function () {
    //   _this.onDragOrZoomEventFire("drag", zoomLevel);
    // });
    // map.addListener("zoom_changed", function () {
    //   _this.onDragOrZoomEventFire("zoom", zoomLevel);
    // });
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

      // viewport["Lat"] = map
      //   .getCenter().lat();
      // viewport["Lng"] = map
      //   .getCenter().lng();

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
        var btnShow = this.document.getElementById("showMarkerbtn" + this.pageName);
        btnShow != null ? btnShow.style.display = "none" : false;
        var btnHide = this.document.getElementById("hideMarkerbtn" + this.pageName);
        btnHide != null ? btnHide.style.display = "block" : false;
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
    debugger
    let _this = this;
    let markers = [];
    let propArray =
      _this.dublicateProperties && _this.dublicateProperties.length > 0 ? _this.dublicateProperties : _this.properties;
    propArray.forEach(element => {
      if (element.LatitudeLongitude != "null"
      ) {
        let lat = 0;
        let lng = 0;
        //--- comment this code for lat long change so highlight property hover not work
        // if (propArray && propArray.length == 1) {
        //   lat = this.searchTermViewPort.Lat;
        //   lng = this.searchTermViewPort.Lng;
        // } else {
        lat = parseFloat(element.LatitudeLongitude.split(",")[0]);
        lng = parseFloat(element.LatitudeLongitude.split(",")[1]);
        //  }

        // if (isZoomAction) {
        //   this.marker.setMap(null);
        // }

        let address = element.Address + ", " + element.Suburb + ", " + element.City;
        let image;
        if (this.centerPolyLinePropertyId && element.PropertyId === this.centerPolyLinePropertyId) {
          let image = './assets/images/icons/centericon_24x24.png';
          _this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            // icon: {
            //   url: './assets/images/icons/centericon_24x24.png',
            //   // size: new google.maps.Size(45, 45),
            //   // origin: new google.maps.Point(0, 0),
            //   // anchor: new google.maps.Point(0, 20),
            //   // scaledSize: new google.maps.Size(20, 20),
            //   // labelOrigin: new google.maps.Point(9, 8)

            //   size: new google.maps.Size(24, 24),
            //   origin: new google.maps.Point(0, 0),
            //   anchor: new google.maps.Point(0, 24),
            //   // scaledSize: new google.maps.Size(12, 12),
            //   // labelOrigin: new google.maps.Point(5, 5)
            // },
            icon: image,
            title: address.toString()
          });
          _this.marker.setIcon(image);
        } else if (element.PropertyId != this.userLowRankPropertyId && element.PropertyId != this.userHighRankPropertyId) {
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
        // else if (this.userLowRankPropertyId && element.PropertyId === this.userLowRankPropertyId) {
        //   if (lng > this.highRankLng) {
        //     let image = './assets/images/icons/24x24_red_left.png';
        //     _this.marker = new google.maps.Marker({
        //       position: new google.maps.LatLng(lat, lng),
        //       icon: image,
        //       title: address.toString()
        //     });
        //     if (element.Status === PropertyStatus.ForSale) {
        //       image = './assets/images/icons/user_left_red_24x24.png';
        //     }
        //     else if (element.Status === PropertyStatus.Premarket) {
        //       image = './assets/images/icons/user_left_green_24x24.png';
        //     }
        //     else if (element.Status === PropertyStatus.Notlisted) {
        //       image = './assets/images/icons/user_left_black_24x24.png';
        //     }
        //     _this.marker.setIcon(image);
        //   } else {
        //     let image = './assets/images/icons/user_right_red_24x24.png';
        //     _this.marker = new google.maps.Marker({
        //       position: new google.maps.LatLng(lat, lng),
        //       icon: image,
        //       title: address.toString()
        //     });
        //     if (element.Status === PropertyStatus.ForSale) {
        //       image = './assets/images/icons/user_right_red_24x24.png';
        //     }
        //     else if (element.Status === PropertyStatus.Premarket) {
        //       image = './assets/images/icons/user_right_green24x24.png';
        //     }
        //     else if (element.Status === PropertyStatus.Notlisted) {
        //       image = './assets/images/icons/user_right_black_24x24.png';
        //     }
        //     _this.marker.setIcon(image);
        //   }
        // }
        // else {
        //   let image = './assets/images/icons/user-red-24x24.png';
        //   _this.marker = new google.maps.Marker({
        //     position: new google.maps.LatLng(lat, lng),
        //     icon: image,
        //     title: address.toString()
        //   });
        //   if (element.Status === PropertyStatus.ForSale) {
        //     image = './assets/images/icons/user_now_red_24x24.png';
        //   }
        //   else if (element.Status === PropertyStatus.Premarket) {
        //     image = './assets/images/icons/user_now_green_24x24.png';
        //   }
        //   else if (element.Status === PropertyStatus.Notlisted) {
        //     image = './assets/images/icons/user_now_black_24x24.png';
        //   }
        //   _this.marker.setIcon(image);
        // }

        // if (this.AllCircles.length > 1) {
        //   this.AllCircles.forEach(element => {
        //     element.setMap(null);
        //   });
        //   this.AllCircles = [];
        // }

        // if (propArray.length > 1) {
        //   let center = new google.maps.LatLng(lat, lng);


        //   if (this.AllCircles.length > 1) {
        //     this.AllCircles.forEach(element => {
        //       element.setMap(null);
        //     });
        //     this.AllCircles = [];
        //   }
        //   let radius = 15;
        //   if (element.ViewCount > 1 && element.ViewCount < element.MaxViewCount) {
        //     radius = +((element.ViewCount * 100) / element.MaxViewCount).toFixed(2);
        //   } else if (element.MaxViewCount == element.ViewCount) {
        //     radius = 100;
        //   } else {
        //     radius = 15;
        //   }
        //   let cityCircle = new google.maps.Circle({
        //     strokeColor: '#2196f3',
        //     strokeOpacity: 0,
        //     strokeWeight: 2,
        //     fillColor: '#2196f3',
        //     fillOpacity: 0.35,
        //     map: _this.map,
        //     center: center,
        //     radius: radius
        //   });
        // }
        // if (propArray.length == 1) {
        //   let element = propArray[0];
        //   let lat = parseFloat(element.LatitudeLongitude.split(",")[0]);
        //   let lng = parseFloat(element.LatitudeLongitude.split(",")[1]);
        //   let center = new google.maps.LatLng(lat, lng);

        //   let cityCircle = new google.maps.Circle({
        //     strokeColor: '#2196f3',
        //     strokeOpacity: 0,
        //     strokeWeight: 2,
        //     fillColor: '#2196f3',
        //     fillOpacity: 0.35,
        //     map: _this.map,
        //     center: center,
        //     radius: 4
        //   });
        // }

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

        if (_this.pageName === "SearchResultPage") {
          google.maps.event.addListener(_this.marker, "click", drawPolyline);
          google.maps.event.addListener(_this.marker, "dblclick", setPositionAsContent);
          if (_this.AllMarkers.length > 0) {
            google.maps.event.addListener(_this.marker, 'mouseover', mouseOverHandler);

            google.maps.event.addListener(_this.marker, 'mouseout', mouseOutHandler);
          }

        } else if (_this.pageName === "PropertyImageGalleryPage") {
          google.maps.event.addListener(_this.marker, "click", setPositionAsContent);
          // google.maps.event.addListener(this.marker, "click", openPropertyImageComponent);
        }

      }

      function openPropertyImageComponent() {
        _this.dialog.openDialogs.length > 0 ? _this.dialog.openDialogs[0].close(true) : false;
        // _this.dialog.closeAll();
        _this.eventEmitterService.openPropertyImageModal(element);

      }
      function setPositionAsContent() {
        let infoWindowType = "single";
        infoWindowType = _this.dublicateProperties && _this.dublicateProperties.length > 0 ? "list" : "single";
        _this.openInfoWindowOnGoogleMapMarkerClick(element, map, this, infoWindowType);
        // if (element.PropertyId != _this.userHighRankPropertyId) {
        //   _this.onPropertyTileClick(element);
        // }
      }

      function mouseOverHandler() {
        if (element)
          _this.showMarkerPin(element);
      }
      function mouseOutHandler() {
        _this.removeMarkerPin(element);
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
    // Start commented code for draw canvas in to google map
    // setTimeout(() => {
    //   this.draw();
    // }, 1000);
    // End
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
          // this.setMarkerOnGoogleMap(this.map);
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
        this.changePerformance();
        // End
        // this.searchProperties();
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      }));
  }

  setHeatMapLayerOnGoogleMap(map1: google.maps.Map, isCallByEvent?: boolean) {
    let _this = this;
    var heatmapData = [];
    var gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ];
    let propArray =
      _this.dublicateProperties && _this.dublicateProperties.length > 0 ? _this.dublicateProperties : _this.properties;
    if (propArray.length > 0) {
      propArray.forEach(element => {
        if (
          element.LatitudeLongitude &&
          element.LatitudeLongitude != "null"
          // && this.searchTermViewPort.Lat
          // && this.searchTermViewPort.Lng
        ) {
          let lat = 0;
          let lng = 0;
          // if (propArray && propArray.length == 1) {
          //   lat = this.searchTermViewPort.Lat;
          //   lng = this.searchTermViewPort.Lng;
          //  } else {
          lat = parseFloat(element.LatitudeLongitude.split(",")[0]);
          lng = parseFloat(element.LatitudeLongitude.split(",")[1]);
          //   }
          propArray && propArray.length == 1
            ? heatmapData.push({ location: new google.maps.LatLng(lat, lng), weight: 0 })
            : heatmapData.push({ location: new google.maps.LatLng(lat, lng), weight: 0 });

        } else {
          heatmapData = [];
        }
      });
    }
    else {
      heatmapData = [];
    }

    if (_this.properties.length == 0) {
      _this.heatmap = new google.maps.visualization.HeatmapLayer({
        opacity: 1,
        radius: 12
      });
      _this.heatmap.setData(null);
      _this.heatmap.setMap(null);
    }
    else {
      _this.heatmap = new google.maps.visualization.HeatmapLayer({
        opacity: 1,
        radius: 12
      });
      _this.heatmap.setData(heatmapData);
      _this.heatmap.setMap(_this.map);
      _this.heatmap.set('gradient', _this.heatmap.get('gradient') ? null : gradient);
    }

  }

  openInfoWindowOnGoogleMapMarkerClick(
    element: Property,
    map: google.maps.Map,
    self: google.maps.MVCObject,
    infoWindowType: string
  ) {
    console.log("map property click");

    let _this = this;
    let el: HTMLCollectionOf<Element> = _this.document.getElementsByClassName('map-agent-option');
    if (el) {
      for (let index = 0; index < el.length; index++) {
        el[index].classList.remove("show");
        el[index].classList.add("hide");
      }
    }
    if (_this.previousInfoWindow) {
      _this.previousInfoWindow.close();
    }
    this.ngZoneService.run(() => {
      this.isGoogleMapMarkerClicked = infoWindowType == "single" ? true : false;
      this.isGoogleMapMarkerListClicked = infoWindowType == "list" ? true : false;
      // this.mapProperty = element;
      this.mapProperty = this.properties.find(t => t.PropertyDetailId == element.PropertyDetailId);
      // console.log(this.mapProperty);
      this.dublicateProperties = this.dublicateProperties;
    });
    setTimeout(() => {
      let content = infoWindowType == "list" ? _this.popListTemplate.nativeElement : _this.popTemplate.nativeElement;
      let infowindow = new google.maps.InfoWindow({
        content: content,
        maxWidth: 340
      });
      infowindow.open(map, self);
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
      });
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
      let address = element.Address + ", " + element.Suburb + ", " + element.City;
      let index = this.AllMarkers.findIndex(t => t.title == address);
      let image;
      if (this.centerPolyLinePropertyId && element.PropertyId === this.centerPolyLinePropertyId) {
        image = './assets/images/icons/centericon_32x32.png';
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
      // else if (element.PropertyId == this.userLowRankPropertyId) {
      //   let lng = parseFloat(element.LatitudeLongitude.split(",")[1]);
      //   if (lng > this.highRankLng) {
      //     if (element.Status === PropertyStatus.ForSale) {
      //       image = './assets/images/icons/user_left_red_32x32.png';
      //     }
      //     else if (element.Status === PropertyStatus.Premarket) {
      //       image = './assets/images/icons/user_left_green_32x32.png';
      //     }
      //     else if (element.Status === PropertyStatus.Notlisted) {
      //       image = './assets/images/icons/user_left_black_32x32.png';
      //     }
      //   } else {
      //     if (element.Status === PropertyStatus.ForSale) {
      //       image = './assets/images/icons/user_right_red_32x32.png';
      //     }
      //     else if (element.Status === PropertyStatus.Premarket) {
      //       image = './assets/images/icons/user_right_green_32x32.png';
      //     }
      //     else if (element.Status === PropertyStatus.Notlisted) {
      //       image = './assets/images/icons/user_right_black_32x32.png';
      //     }
      //   }
      // } else if (element.PropertyId != this.centerPolyLinePropertyId) {
      //   if (element.Status === PropertyStatus.ForSale) {
      //     image = './assets/images/icons/user_now_red_32x32.png';
      //   }
      //   else if (element.Status === PropertyStatus.Premarket) {
      //     image = './assets/images/icons/user_now_green_32x32.png';
      //   }
      //   else if (element.Status === PropertyStatus.Notlisted) {
      //     image = './assets/images/icons/user_now_black_32x32.png';
      //   }
      // }
      index > -1 ? this.AllMarkers[index].setIcon(image) : false;
    }
  }

  removeMarkerPin(element) {
    if (element) {
      if (this.properties.length > 0) {
        element = this.properties.length > 0 ? this.properties.find(t => t.PropertyDetailId == element.PropertyDetailId && t.Status !== null && t.Status !== '') : element;
      }
      let address = element.Address + ", " + element.Suburb + ", " + element.City;
      let index = this.AllMarkers.findIndex(t => t.title == address);
      let image;
      if (this.centerPolyLinePropertyId && element.PropertyId === this.centerPolyLinePropertyId) {
        image = './assets/images/icons/centericon_24x24.png';
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
      // else if (element.PropertyId == this.userLowRankPropertyId) {
      //   let lng = parseFloat(element.LatitudeLongitude.split(",")[1]);
      //   if (lng > this.highRankLng) {
      //     if (element.Status === PropertyStatus.ForSale) {
      //       image = './assets/images/icons/user_left_red_24x24.png';
      //     }
      //     else if (element.Status === PropertyStatus.Premarket) {
      //       image = './assets/images/icons/user_left_green_24x24.png';
      //     }
      //     else if (element.Status === PropertyStatus.Notlisted) {
      //       image = './assets/images/icons/user_left_black_24x24.png';
      //     }
      //   } else {
      //     if (element.Status === PropertyStatus.ForSale) {
      //       image = './assets/images/icons/user_right_red_24x24.png';
      //     }
      //     else if (element.Status === PropertyStatus.Premarket) {
      //       image = './assets/images/icons/user_right_green24x24.png';
      //     }
      //     else if (element.Status === PropertyStatus.Notlisted) {
      //       image = './assets/images/icons/user_right_black_24x24.png';
      //     }
      //   }
      // } else if (element.PropertyId != this.centerPolyLinePropertyId) {
      //   if (element.Status === PropertyStatus.ForSale) {
      //     image = './assets/images/icons/user_now_red_24x24.png';
      //   }
      //   else if (element.Status === PropertyStatus.Premarket) {
      //     image = './assets/images/icons/user_now_green_24x24.png';
      //   }
      //   else if (element.Status === PropertyStatus.Notlisted) {
      //     image = './assets/images/icons/user_now_black_24x24.png';
      //   }
      // }
      index > -1 ? this.AllMarkers[index].setIcon(image) : false;
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
    if (event.target.classList.contains('fa-heart') || event.target.classList.contains('claim_' + prop.PropertyDetailId)
      || event.target.classList.contains('agentOpion_' + prop.PropertyDetailId) || event.target.classList.contains('edit-property')) {
      return false;
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
    this.onPropertyTileClick(property);
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

  getAddressLatLong(address) {
    let _this = this;
    if (isPlatformBrowser(_this.platformId)) {
      this.mapsAPILoader.load().then(() => {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: address }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            let place = results[0];
            _this.subHurbObj = place;
            _this.setPlaceObject(place);
          } else {
            console.log("Geocode was not successful for the following reason: " + status);
          }
        });
      });
    }
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
        // this.fromDashboard = false;
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
        // this.getSortAddress();
        this.properties = [];
        this.isLoading = false;
        this.properties = data.Model;
        this.totalHome = this.properties.length;
        if (isMarkerSet) {
          this.AllMarkers.forEach(element => {
            element.setVisible(false);
          });
          this.setMarkerOnGoogleMap(this.map);
        }
        if (isSkipMapLoad) {
          // For remove heat map commented this code
          // this.properties.length > 0 ? this.setHeatMapLayerOnGoogleMap(this.map, true) : false;
          // End
          // For remove circle commented this code 
          // this.properties.length > 0 ? this.setCircleOnGoogleMap(this.map, true) : false;
          // End
        } else {
          this.bindGoogleMap(searchTermViewPort.Lat, searchTermViewPort.Lng, searchTermViewPort.AddressType);
        }
      }
      if (data.Model.length > 0) {
        this.totalProperties = data.Model[0].TotalCount;
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
      // console.log("on google map change call");
      if (this.localStorage.getItem("SearchData")) {
        let sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
        if (this.fromDashboard == false) {
          // this.searchProperties(sessionData, false, false, false);
          this.bindGoogleMap(sessionData.Lat, sessionData.Lng, sessionData.AddressType);
        }
      }
    }
  }

  ngOnDestroy(): any {
    this.subsVar.unsubscribe();
    this._unsubscribeAll.unsubscribe();
  }

  setCircleOnGoogleMap(map1: google.maps.Map, isCallByEvent?: boolean) {
    let _this = this;
    if (_this.AllCircles.length > 0) {
      _this.AllCircles.forEach(element => {
        element.setMap(null);
      });
      _this.AllCircles = [];
    }
    let sessionData;
    if (this.localStorage.getItem("SearchData")) {
      sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
    }
    let meters_per_pixel = 156543.03392 * Math.cos(sessionData.Lat * Math.PI / 180) / Math.pow(2, sessionData.Zoom);
    // console.log('meters_per_pixel:----', meters_per_pixel);
    let propArray =
      _this.dublicateProperties && _this.dublicateProperties.length > 0 ? _this.dublicateProperties : _this.properties;

    if (propArray.length > 0) {//&& propArray.length !== 1 && sessionData.AddressType !== 'street_address') {
      propArray.forEach(element => {
        if (
          element.LatitudeLongitude &&
          element.LatitudeLongitude != "null"
        ) {
          let lat = 0;
          let lng = 0;
          // console.log('Maxviewcount', element.MaxViewCount);
          // console.log('viewcount', element.ViewCount);
          lat = parseFloat(element.LatitudeLongitude.split(",")[0]);
          lng = parseFloat(element.LatitudeLongitude.split(",")[1]);
          let radius = 0;

          let maxRadius = 40 * (meters_per_pixel > 0 ? meters_per_pixel : sessionData.Zoom);
          if (element.MaxViewCount === element.ViewCount) {
            radius = maxRadius;
          } else if (element.ViewCount >= 1 && element.ViewCount < element.MaxViewCount) {
            // radius = +((element.ViewCount * meters_per_pixel) / element.MaxViewCount).toFixed(2);
            radius = +((element.ViewCount * maxRadius) / element.MaxViewCount).toFixed(2);
          } else {
            radius = 30;
          }
          var center = new google.maps.LatLng(lat, lng);
          var cityCircle = new google.maps.Circle({
            strokeColor: '#2196f3',
            strokeOpacity: 0,
            strokeWeight: 2,
            fillColor: '#2196f3',
            fillOpacity: 0.35,
            map: _this.map,
            center: center,
            radius: radius
          });
          this.AllCircles.push(cityCircle);
        }
      });
    }
    else {
      _this.AllCircles = [];
    }
    // if (propArray.length == 1) {
    //   let element = propArray[0];
    //   let lat = parseFloat(element.LatitudeLongitude.split(",")[0]);
    //   let lng = parseFloat(element.LatitudeLongitude.split(",")[1]);
    //   let center = new google.maps.LatLng(lat, lng);
    //   if (this.AllCircles.length > 0) {
    //     this.AllCircles.forEach(element => {
    //       element.setMap(null);
    //     });
    //     this.AllCircles = [];
    //   }
    //   let cityCircle = new google.maps.Circle({
    //     strokeColor: '#2196f3',
    //     strokeOpacity: 0,
    //     strokeWeight: 2,
    //     fillColor: '#2196f3',
    //     fillOpacity: 0.35,
    //     map: _this.map,
    //     center: center,
    //     radius: 3.5
    //   });
    //   this.AllCircles.push(cityCircle);
    // }
    // if (propArray.length > 1 && sessionData.AddressType == 'street_address') {
    //   propArray.forEach(element => {
    //     if (
    //       element.LatitudeLongitude &&
    //       element.LatitudeLongitude != "null"
    //     ) {
    //       let lat = 0;
    //       let lng = 0;
    //       lat = parseFloat(element.LatitudeLongitude.split(",")[0]);
    //       lng = parseFloat(element.LatitudeLongitude.split(",")[1]);
    //       let radius = 2;
    //       if (element.ViewCount > 1 && element.ViewCount < element.MaxViewCount) {
    //         radius = +((element.ViewCount * 5) / element.MaxViewCount).toFixed(2);
    //       } else if (element.MaxViewCount == element.ViewCount) {
    //         radius = 5;
    //       } else {
    //         radius = 2;
    //       }

    //       if (radius < 2) {
    //         radius = 2;
    //       }

    //       var center = new google.maps.LatLng(lat, lng);
    //       var cityCircle = new google.maps.Circle({
    //         strokeColor: '#2196f3',
    //         strokeOpacity: 0,
    //         strokeWeight: 2,
    //         fillColor: '#2196f3',
    //         fillOpacity: 0.35,
    //         map: _this.map,
    //         center: center,
    //         radius: radius,
    //         zIndex: -1
    //       });
    //       this.AllCircles.push(cityCircle);
    //     }
    //   });
    // }

  }

  changePerformance() {
    let ViewBlockSize = 4;
    let BlockDiff = 2;
    let viewport = {};
    let sessionData = JSON.parse(localStorage.getItem("SearchData"));
    viewport["SwLat"] = sessionData.SwLat;
    viewport["NeLat"] = sessionData.NeLat;
    viewport["SwLng"] = sessionData.SwLng;
    viewport["NeLng"] = sessionData.NeLng;
    this.searchResultPageService.getRanking(viewport).subscribe((data: any) => {
      if (data) {
        this.rankedVM = [];
        this.maxRankedVM = [];
        this.minRankedVM = [];
        if (data.Model) {
          this.rankedVM = JSON.parse(data.Model);
        }
        this.maxRankedVM = this.rankedVM.filter(t => t.Status == "hot");
        this.minRankedVM = this.rankedVM.filter(t => t.Status == "cooling");
        this.drawHigherAndLowerPolylines();
        this.properties.forEach(element => {
          let RankedObj = this.rankedVM.find(t => t.PropertyDetailId == element.PropertyDetailId);
          if (RankedObj) {
            element.Ranking = RankedObj.Ranked;
          }
          if (element.Ranking > 0) {
            element.RankingStatus = "hot";
          } else if (element.Ranking < 0) {
            element.RankingStatus = "cooling";
          } else {
            element.RankingStatus = "";
          }
          let secondArr = this.properties.filter(t => t.PropertyId != element.PropertyId && t.Bedrooms == element.Bedrooms
            && t.Bathrooms == element.Bathrooms);
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
          } else {
            element.ViewerStrength = "Average";
          }
        });
      }
    });
    // console.log("performance", this.properties);
  }

  drawHigherAndLowerPolylines(property?: Property) {
    this.rankedVM = this.rankedVM.sort(t => t.Ranked);
    let refresh_Btn = this.document.getElementById('refresh_Btn');
    this.polylines.forEach(element => {
      element.setMap(null);
    });
    this.polylines = [];
    // Start Third Logic
    if (this.rankedVM.length > 0) {
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
              let isExist = maxRankedArr.some(t => t.Ranked30 == indexBlock);
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
      console.log('maxRankedArr', maxRankedArr);

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
              let isExist = minRankedArr.some(t => t.Ranked60 == indexBlock1);
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
      console.log('minRankedArr', minRankedArr);
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
          property.RankingStatus = "";
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
            maxRankedArr.forEach(element => {
              if (element.TotalRank < 4) {
                let hotProperty = this.properties.find(t => t.PropertyDetailId == element.PropertyDetailId);
                let rankedProperties: any[] = [];
                const lat1 = parseFloat(hotProperty.LatitudeLongitude.split(',')[0]);
                const long1 = parseFloat(hotProperty.LatitudeLongitude.split(',')[1]);
                let rank1 = {
                  lat: lat1,
                  lng: long1
                };
                rankedProperties.push(coolingRank);
                rankedProperties.push(rank1);
                const lineSymbol = {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
                  // path: google.maps.SymbolPath.CIRCLE
                };
                // let arrowSymbol = "./assets/images/icons/1111.png";
                var arrowSymbol = new google.maps.Marker({
                  icon: {
                    anchor: new google.maps.Point(16, 16), // center icon on end of polyline
                    origin: new google.maps.Point(0, 0),
                    scaledSize: new google.maps.Size(32, 32),
                    size: new google.maps.Size(64, 64),
                    url: "./assets/images/icons/test.svg",
                    scale: 5,
                    strokeOpacity: 1
                  }
                });
                let strokeWeight = 15;
                let average = ((coolingPropertyRank + element.PropertyWeight) / 2);
                let weight = ((average * strokeWeight) / 100);
                this.userPath = new google.maps.Polyline({
                  path: rankedProperties,
                  geodesic: true,
                  strokeColor: '#0075d2',
                  strokeOpacity: 1.0,
                  strokeWeight: weight,
                  icons: [
                    {
                      icon: lineSymbol,
                      offset: "50%"
                    }
                  ],
                });
              }
              this.polylines.push(this.userPath);
              this.userPath.setMap(this.map);
            });
          }
          this.setMarkerOnGoogleMap(this.map);
          if (refresh_Btn) {
            refresh_Btn.style.display = "block";
          }
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
            minRankedArr.forEach(element => {
              if (element.TotalRank < 4) {
                let hotProperty1 = this.properties.find(t => t.PropertyDetailId == element.PropertyDetailId);
                let rankedProperties: any[] = [];
                const lat1 = parseFloat(hotProperty1.LatitudeLongitude.split(',')[0]);
                const long1 = parseFloat(hotProperty1.LatitudeLongitude.split(',')[1]);
                let rank1 = {
                  lat: lat1,
                  lng: long1
                };
                rankedProperties.push(hotRank);
                rankedProperties.push(rank1);
                let strokeWeight = 15;
                let average = ((hotPropertyRank + element.PropertyWeight) / 2);
                let weight = ((average * strokeWeight) / 100);
                const lineSymbol = {
                  path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                  // path: google.maps.SymbolPath.CIRCLE
                };
                // let arrowSymbol = "./assets/images/icons/1111.png";
                var arrowSymbol = new google.maps.Marker({
                  icon: {
                    anchor: new google.maps.Point(16, 16), // center icon on end of polyline
                    origin: new google.maps.Point(0, 0),
                    scaledSize: new google.maps.Size(32, 32),
                    size: new google.maps.Size(64, 64),
                    url: "./assets/images/icons/test.svg",
                    scale: 5,
                    strokeOpacity: 1
                  }
                });
                this.userPath = new google.maps.Polyline({
                  path: rankedProperties,
                  geodesic: true,
                  strokeColor: '#0075d2',
                  strokeOpacity: 1.0,
                  strokeWeight: weight,
                  icons: [
                    {
                      icon: lineSymbol,
                      offset: "50%"
                    }
                  ],
                });
              }
              this.polylines.push(this.userPath);
              this.userPath.setMap(this.map);
            });
          }
          if (refresh_Btn) {
            refresh_Btn.style.display = "block";
          }
          this.setMarkerOnGoogleMap(this.map);
        }
        if (property.RankingStatus == "") {
          this.centerPolyLinePropertyId = 0;
          this.AllMarkers.forEach(item => {
            item.setMap(null);
          });
          this.setMarkerOnGoogleMap(this.map);
        }
      }
    }
    if (this.polylines.length == 0) {
      this.centerPolyLinePropertyId = undefined;
      if (refresh_Btn) {
        refresh_Btn.style.display = "none";
      }
    }
  }

  clearPolylines() {
    this.polylines.forEach(element => {
      element.setMap(null);
    });
    this.polylines = [];
    let refresh_Btn = this.document.getElementById('refresh_Btn');
    if (refresh_Btn) {
      refresh_Btn.style.display = "none";
    }
    this.centerPolyLinePropertyId = 0;
    this.AllMarkers.forEach(item => {
      item.setMap(null);
    });
    this.setMarkerOnGoogleMap(this.map);
  }

  sortByDate(arr) {
    arr.sort(function (a, b) {
      return Number(new Date(a.LastViewed)) - Number(new Date(b.LastViewed));
    });
    return arr;
  }

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
