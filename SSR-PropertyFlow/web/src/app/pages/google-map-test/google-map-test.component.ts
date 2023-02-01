import { Component, OnInit, NgZone, Input, ElementRef, ViewChild, Output, EventEmitter, OnChanges, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
// import { } from "googlemaps";
import { MapsAPILoader } from '@agm/core';
import { Property, SubHurbPropertyInfo, IHomeViewerCookie, PropertyView, PropertyStatusVM, IPropertyViewerCookie, IHomeCoockie, PropertyLike, AgentOption, PropertyDetail, PropertyStatus } from '../search-result-page/search-result-page';
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

@Component({
  selector: 'app-google-map-test',
  templateUrl: './google-map-test.component.html',
  styleUrls: ['./google-map-test.component.css']
})
export class GoogleMapTestComponent implements OnInit {
  @Input() fromDashboard: boolean;
  public properties: Property[] = [];
  public isLoaded: boolean;
  public isLoading: boolean;
  @Input() searchTerm: string = "";
  @Input() SearchedAddress: string;
  @Input() updatedPropertyDetailId: number;
  @Input() subHurbName: string;
  // @Input() propertyId: number;
  @Input() rolename: string;
  public searchedTerm: string;
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
  public isUserExist: boolean;
  public userCookieName: string = "user";
  public isUserCookieExist: boolean = this.cookieService.check(this.userCookieName);
  public userId: number;
  public searchTermViewPort: any = {};
  public totalView: number = 0;
  public totalHome: number = 0;
  public searchedAddressType: string;
  public mapProperty: Property;

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
    public dialog: MatDialog) { }

  ngOnInit() {
    this.loadData();
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
  }

  searchProperties(searchTermViewPort?: any, isSkipMapLoad?: boolean, isMarkerSet?: boolean, isScroll?: boolean) {
    this.isLoaded = true;
    // this.isLoadPage ? this.isLoaded = false : this.isLoaded = true;
    // this.isLoadPage ? this.isLoading = false : this.isLoading = true;
    let viewport = {};
    if (searchTermViewPort) {

      viewport["From"] = '0';
      viewport["To"] = '28';
      viewport["SwLat"] = searchTermViewPort.SwLat;
      viewport["SwLng"] = searchTermViewPort.SwLng;
      viewport["NeLat"] = searchTermViewPort.NeLat;
      viewport["NeLng"] = searchTermViewPort.NeLng;
      viewport["UserId"] = this.userId;
      viewport["PageNum"] = 1;
      viewport["AddressComponent"] = searchTermViewPort.AddressComponent;
      viewport["AddressType"] = searchTermViewPort.AddressType;
      viewport["SearchTerm"] = searchTermViewPort.SearchTerm;
      this.searchTerm = searchTermViewPort.SearchTerm;
      viewport["isSurroundingSuburb"] = this.localStorage.getItem("isSurroundingSuburb");
      if (this.fromDashboard) {
        viewport["AddressComponent"] = null;
        viewport["AddressType"] = null;
        this.fromDashboard = false;
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
      viewport["From"] = '0';
      viewport["To"] = '28';
    }

    viewport["Bedrooms"] = null;
    viewport["Bathrooms"] = null;
    viewport["Status"] = null;
    viewport["MaxPrice"] = null;
    viewport["MinPrice"] = null;
    viewport["IsExactMatchBath"] = false;
    viewport["IsExactMatchBed"] = false;
    // set latest map latlong in localstorage
    let sessionData;
    if (this.localStorage.getItem('SearchData')) {
      sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
      sessionData.SwLat = viewport["SwLat"];
      sessionData.NeLat = viewport["NeLat"];
      sessionData.SwLng = viewport["SwLng"];
      sessionData.NeLng = viewport["NeLng"];
    }
    // sessionData.Zoom = this.map.getZoom();

    // sessionData.Lat = this.map
    //   .getCenter().lat();
    // sessionData.Lng = this.map
    //   .getCenter().lng();
    // if (!this.isListView) {
    //   this.localStorage["AddressComponent"] = null;
    viewport["AddressType"] = null;
    viewport["PageNum"] = 1;
    this.isUserExist ? (viewport["UserId"] = this.userId ? this.userId : "") : viewport["UserId"] = "";

    // let queryObject = new Object();
    if (!isSkipMapLoad) {
      // this.getSortAddress();
    }

      // if (sessionData.AddressType != "street_address") {
      //   this.getSubHurbInfo(viewport);
      // } else {
      //   this.getSubHurbLatLong(this.subHurbName);
      //   // this.isLoadSubHurbInfo = false;
      //   // this.subHurbPropertyInfo = undefined;
      // }
    
    viewport["isSurroundingSuburb"] = this.localStorage.getItem("isSurroundingSuburb");
    this.searchResultPageService.getProperties(viewport).subscribe(data => {
      if (data.Success) {
        let searchdata;
        if (this.localStorage.getItem('SearchData')) {
          searchdata = JSON.parse(this.localStorage.getItem('SearchData'));
        }
        // if (!isScroll) {
        //   setTimeout(() => {
        //     let addressGrid: HTMLElement = this.document.getElementById('address-grid');
        //     addressGrid.scrollTop = 0;
        //   }, 500);
        // } else {
        //   let addressGrid: HTMLElement = this.document.getElementById('address-grid');
        //   addressGrid.scrollTop = 0;
        //   // this.PageNum == 1 ? false : addressGrid.scrollTop = this.scrollOffset;
        // }
        // this.searchedTerm = this.searchTerm;
        // this.clearHeatMap();
        // this.getSortAddress();
        this.properties = [];
        this.isLoading = false;
        // this.properties = this.PageNum == 1 ? data.Model : this.properties.concat(data.Model);
        this.totalHome = this.properties.length;

       

        
        var leftControlDiv = this.document.getElementById('viewcountDiv');
        var canvasDiv = this.document.getElementById('canvas');
        if (this.properties.length <= 0) {
          leftControlDiv ? leftControlDiv.style.display = "none" : false;
          canvasDiv ? canvasDiv.style.display = "none" : false;
        } else {
          leftControlDiv ? leftControlDiv.style.display = "block" : false;
          canvasDiv ? canvasDiv.style.display = "block" : false;
        }

        // For update mapproperty when unlike, unclaime and remove offer
        if (this.updatedPropertyDetailId) {
          let index = this.properties.findIndex(t => t.PropertyDetailId == this.updatedPropertyDetailId);
          index > -1 ? this.mapProperty = this.properties[index] : false;
        }

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
          this.AllCircles.forEach(element => {
            element.setMap(null);
          });
          this.AllCircles = [];
          // this.properties.length > 0 ? this.setCircleOnGoogleMap(this.map, true) : false;
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
          
        }
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      });
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
    this.searchResultPageService.saveProperties(queryObject).subscribe(data => {
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
      });
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
    

    // Set CSS for the control interior.
    var center = new google.maps.LatLng(Latitude, Longitude);
    // this.mapsAPILoader.load().then(() => {

      let map = new google.maps.Map(this.document.getElementById('googleMapTestDivId'), {
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
        // scaleControlOptions: false,
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
    // });
    let _this = this;
    let propArray =
      this.dublicateProperties && this.dublicateProperties.length > 0 ? this.dublicateProperties : this.properties;
    if (this.map && propArray.length > 0) {
      // For remove heat map commented this code 
      // this.setHeatMapLayerOnGoogleMap(this.map);
      // End
      // this.setCircleOnGoogleMap(this.map, true);
      this.setMarkerOnGoogleMap(this.map)
    } else {
      this.searchedAddressType == "street_address" ? this.map.setZoom(21) : false;
    }
    if (this.localStorage.getItem('SearchData')) {
      let serchedData = JSON.parse(this.localStorage.getItem('SearchData'));
    }
    let centerControlDiv = this.document.createElement('div');
    let showMarkerbtn = this.document.createElement('div');
    showMarkerbtn.id = "showMarkerbtn";
    showMarkerbtn.style.backgroundColor = 'rgb(255, 255, 255)';
    showMarkerbtn.style.border = '2px solid #fff';
    showMarkerbtn.style.borderRadius = '2px';
    showMarkerbtn.style.boxShadow = 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px';
    showMarkerbtn.style.cursor = 'pointer';
    showMarkerbtn.style.marginBottom = '22px';
    showMarkerbtn.style.textAlign = 'center';
    showMarkerbtn.title = 'Show status';
    showMarkerbtn.style.zIndex = '2';
    showMarkerbtn.style.height = '38px';
    showMarkerbtn.style.width = '120px';
    showMarkerbtn.style.margin = "10px";
    showMarkerbtn.innerHTML = 'Show status';
    showMarkerbtn.style.padding = "10px";
    showMarkerbtn.style.color = "rgb(0, 0, 0)";
    showMarkerbtn.style.fontWeight = "500";
    showMarkerbtn.style.fontFamily = "Roboto, Arial, sans-serif";
    showMarkerbtn.style.fontSize = "13px";
    showMarkerbtn.style.display = "none";

    let hideMarkerbtn = this.document.createElement('div');
    hideMarkerbtn.id = "hideMarkerbtn";
    hideMarkerbtn.style.backgroundColor = 'rgb(255, 255, 255)';
    hideMarkerbtn.style.border = '2px solid #fff';
    hideMarkerbtn.style.borderRadius = '2px';
    hideMarkerbtn.style.boxShadow = 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px';
    hideMarkerbtn.style.cursor = 'pointer';
    hideMarkerbtn.style.marginBottom = '22px';
    hideMarkerbtn.style.textAlign = 'center';
    hideMarkerbtn.title = 'Hide status';
    hideMarkerbtn.style.zIndex = '2';
    hideMarkerbtn.style.height = '38px';
    hideMarkerbtn.style.width = '120px';
    hideMarkerbtn.style.margin = "10px";
    hideMarkerbtn.innerHTML = 'Hide status';
    hideMarkerbtn.style.padding = "10px";
    hideMarkerbtn.style.color = "rgb(0, 0, 0)";
    hideMarkerbtn.style.fontWeight = "500";
    hideMarkerbtn.style.fontSize = "13px";
    hideMarkerbtn.style.fontFamily = "Roboto, Arial, sans-serif";
    hideMarkerbtn.style.display = "block";

    centerControlDiv.appendChild(showMarkerbtn);
    centerControlDiv.appendChild(hideMarkerbtn);

    let leftControlDiv = this.document.createElement('div');
    leftControlDiv.style.marginLeft = "20px";

    let circularCanvas = this.document.createElement('canvas');
    circularCanvas.id = "circularCanvas";

    let canvas = this.document.createElement('canvas');
    canvas.id = "canvas";
    canvas.style.width = '150px';
    canvas.style.height = '25px';
    canvas.style.display = "block";

    let viewcountDiv = this.document.createElement('div');
    viewcountDiv.id = "viewcountDiv";
    viewcountDiv.style.width = '150px';
    viewcountDiv.style.height = '25px';
    viewcountDiv.style.display = "block";
    viewcountDiv.style.backgroundColor = "#fff";
    viewcountDiv.style.textAlign = "center";
    viewcountDiv.innerHTML = "<div class='d-flex justify-content-around h-100 font-16 align-items-center'><span>1</span> <span>Viewers</span><span id='viwerCountSpan'>" + "5" + "</span></div>";
    // leftControlDiv.appendChild(circularCanvas);
    leftControlDiv.appendChild(viewcountDiv);
    leftControlDiv.appendChild(canvas);

    showMarkerbtn.addEventListener('click', function () {
      _this.showmarkerOnMap(_this.map);
    });

    hideMarkerbtn.addEventListener('click', function () {
      _this.hidemarkerOnMap();
    });

    // google.maps.event.addListener(_this.map, "maptypeid_changed", function () {
    //   _this.mapType = _this.map.getMapTypeId();
    // });
    if (_this.AllMarkers.length > 0) {
      _this.map.addListener("maptypeid_changed", function () {
        _this.mapType = _this.map.getMapTypeId();
      });
    }

    _this.map.addListener("idle", function () {
        _this.onDragOrZoomEventFire("drag", zoomLevel);
    });

    if (_this.AllMarkers.length > 0) {
      _this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);
        _this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(leftControlDiv);
    }
    // map.addListener("dragend", function () {
    //   _this.onDragOrZoomEventFire("drag", zoomLevel);
    // });
    // map.addListener("zoom_changed", function () {
    //   _this.onDragOrZoomEventFire("zoom", zoomLevel);
    // });
  }

  showmarkerOnMap(map) {
    var btnShow = this.document.getElementById("showMarkerbtn");
    btnShow.style.display = "none";
    var btnHide = this.document.getElementById("hideMarkerbtn");
    btnHide.style.display = "block";
    this.setMarkerOnGoogleMap(this.map);
  }

  hidemarkerOnMap() {
    var btnHide = this.document.getElementById("hideMarkerbtn");
    btnHide.style.display = "none";
    var btnShow = this.document.getElementById("showMarkerbtn");
    btnShow.style.display = "block";
    if (this.localStorage.getItem("SearchData")) {
      let sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
    }
    this.AllMarkers.forEach(element => {
      element.setVisible(false);
    });
  }

  setMarkerOnGoogleMap(map: google.maps.Map, isZoomAction?: boolean, isHide?: boolean) {
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

        _this.marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          icon: './assets/images/icons/dark_yellow_dot_24x24.png',
          // icon: {
          //   url: './assets/images/icons/darkyellow_32x32.png',
          // size: new google.maps.Size(45, 45),
          //  origin: new google.maps.Point(0, 0),
          // anchor: new google.maps.Point(0, 20),
          // scaledSize: new google.maps.Size(20, 20),
          // labelOrigin: new google.maps.Point(9, 8)

          //    size: new google.maps.Size(100, 100),
          //       origin: new google.maps.Point(0, 0),
          // anchor: new google.maps.Point(26, 50),
          //  scaledSize: new google.maps.Size(50, 50),
          //  labelOrigin: new google.maps.Point(11, 13)
          // },
          // label: {
          //   text: element.ViewCount.toString(),
          //   fontWeight: 'bold',
          //   fontSize: '12px',
          //   fontFamily: '"Courier New", Courier,Monospace',
          //   color: 'black',
          //   path: google.maps.SymbolPath.CIRCLE
          // },
          title: element.Address.toString()
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
        google.maps.event.addListener(_this.marker, "click", setPositionAsContent);
          if (_this.AllMarkers.length > 0) {
            google.maps.event.addListener(_this.marker, 'mouseover', mouseOverHandler);

            google.maps.event.addListener(_this.marker, 'mouseout', mouseOutHandler);
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
        // _this.openInfoWindowOnGoogleMapMarkerClick(element, map, this, infoWindowType);
        // _this.onPropertyTileClick(element);
      }

      function mouseOverHandler() {
        _this.showMarkerPin(element);
      }
      function mouseOutHandler() {
        _this.removeMarkerPin(element);
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
    // setTimeout(() => {
    //   this.draw();
    // }, 1000);
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
        _this.searchProperties(viewport, true, true);
        var btnShow = this.document.getElementById("showMarkerbtn");
        btnShow != null ? btnShow.style.display = "none" : false;
        var btnHide = this.document.getElementById("hideMarkerbtn");
        btnHide != null ? btnHide.style.display = "block" : false;
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

  
  showMarkerPin(element) {
    if (element) {
      if (this.properties.length > 0) {
        element = this.properties.find(t => t.PropertyDetailId == element.PropertyDetailId && t.Status !== null && t.Status !== '');
      }
      let index = this.AllMarkers.findIndex(t => t.title == element.Address);
      let image;
      if (element.Status === PropertyStatus.ForSale) {
        image = './assets/images/icons/red_location_27x27.png';
      }
      else if (element.Status === PropertyStatus.Premarket) {
        image = './assets/images/icons/green_location_27x27.png';
      }
      else if (element.Status === PropertyStatus.Notlisted) {
        image = './assets/images/icons/black_location_27x27.png';
      }
      index > -1 ? this.AllMarkers[index].setIcon(image) : false;
    }
    // setInterval(() => {
    //   this.ref.tick();
    // }, 1000000);
  }

  removeMarkerPin(element) {
    if (element) {
      if (this.properties.length > 0) {
        element = this.properties.length > 0 ? this.properties.find(t => t.PropertyDetailId == element.PropertyDetailId && t.Status !== null && t.Status !== '') : element;
      }
      let index = this.AllMarkers.findIndex(t => t.title == element.Address);
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
      index > -1 ? this.AllMarkers[index].setIcon(image) : false;
    }
  }
}
