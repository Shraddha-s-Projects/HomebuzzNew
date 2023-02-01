import { Component, OnInit, ViewContainerRef, ViewChild, Input, EventEmitter, Output, OnDestroy, Inject, PLATFORM_ID } from "@angular/core";
import { drawDOM, Group, exportImage, pdf } from '@progress/kendo-drawing';
import { NgImageSliderComponent } from "ng-image-slider";
import { environment } from "../../../environments/environment";
import { PropertyImageGalleryService } from "./property-image-gallery.service";
// import html2canvas from 'html2canvas';
import { Property, PropertyView } from "../../../app/pages/search-result-page/search-result-page";
import { MatDialogRef, MatDialogConfig, MatDialog } from "@angular/material";
import { CookieService } from "ngx-cookie-service";
import { MakeOfferComponent } from "../make-offer/make-offer.component";
import { Router } from "@angular/router";
import { EventEmitterService } from "../../../app/event-emitter.service";
import { MapsAPILoader } from "@agm/core";
import { CommonModalService } from "../../../app/common-modal.service";
import { SignInModalComponent } from "../sign-in-modal/sign-in-modal.component";
import { UploadPhotoDescriptionComponent } from "../upload-photo-description/upload-photo-description.component";
import { CommonService } from "../../../app/core/services/common.service";
import { Subscription } from "rxjs";
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';

// import { Canvas2Image } from "../../../../node_modules/canvas2image";

declare var google: any;

@Component({
  selector: "propertyImageGallery",
  templateUrl: "./property-image-gallery.component.html",
  styleUrls: ["./property-image-gallery.component.css"]
})
export class PropertyImageGalleryComponent implements OnInit, OnDestroy {
  @ViewChild("nav", { read: ViewContainerRef, static: false }) ds: NgImageSliderComponent;
  @Input() property: any;
  @Input() activeHome: any;
  @Output() onMakeOfferBtnClickEvent = new EventEmitter<any>();
  PropertyDetailId: number;
  public PropertyAddress: string;
  noImages: boolean = false;
  loadSimilarhomes: boolean;
  public Image_Url = environment.APIURL.toString();
  public showSlider: boolean;
  public imageObject: any;
  public userId: number;
  public isUserExist: boolean;
  public isLoaded: boolean;
  public modalComponent: any;
  public modalProperty: Property;
  public subHurbName: string;
  public pageName: string;
  public isLoadSubHurb: boolean = false;
  public openActiveHeader: string = "Photos";
  public rolename: string = this.cookieService.get("rolename");
  public userCookieName: string = "user";
  public isUserCookieExist: boolean = this.cookieService.check(this.userCookieName);
  public isGraterThanPercentage: boolean;
  public subsVar = new Subscription();
  public _unsubscribeAll = new Subscription();
  public flowInterestHourlyArr: any[] = [];
  public flowInterestDailyArr: any[] = [];
  public flowInterestWeeklyArr: any[] = [];
  public timeWeightedFlowInterestHourlyArr: any[] = [];
  public timeWeightedFlowInterestDailyArr: any[] = [];
  public timeWeightedFlowInterestWeeklyArr: any[] = [];

  public slideConfigFor = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: ".slider-nav"
  };
  public slideConfigNav = {
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: ".slider-for",
    dots: true,
    arrows: true,
    centerMode: true,
    focusOnSelect: true
  };
  public marker: any;

  // Tab variables start

  tabs: TabList[] = [
    { Id: 'Photos', Name: 'Photos' },
    { Id: 'PropertyOverView', Name: 'Property overview' },
    { Id: 'SimilarPropertySubHurb', Name: 'Property supply' },
    { Id: 'Interest', Name: 'Viewers' },
    // { Id: 'Watching', Name: 'Watching' },
    // { Id: 'HomeValue', Name: 'Property value' },
    // { Id: 'OpenHome', Name: 'Open home' },
    // { Id: 'ListingAgent', Name: 'Listing agent' },
    { Id: 'Metrics', Name: 'Metrics' },
    // { Id: 'SimilarProperty', Name: 'Similar properties in area' }
  ];
  public tab: TabList;
  public selectedIndex: number = 0;
  public transformCss: string;
  public leftTabIdx = 0;
  public atStart = true;
  public atEnd = false
  public index = 0;
  public isMobile: boolean;
  public timeOutVar: any;

  public isBrowser: boolean;
  // Tab variables end

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    public dialogRef: MatDialogRef<PropertyImageGalleryComponent>,
    private propertyImageGalleryService: PropertyImageGalleryService,
    private cookieService: CookieService,
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private mapsAPILoader: MapsAPILoader,
    public dialog: MatDialog,
    private commonModalService: CommonModalService,
    private commonService: CommonService) {
    this.isBrowser = isPlatformBrowser(platformId);
    // this.subsVar.add(this.eventEmitterService.invokeSearchResultPageComponentFunction.subscribe(
    //   (name: string) => {
    //     this.getPropertyDetail(this.PropertyDetailId);
    //   }
    // ));
  }

  ngOnInit() {

    this.subsVar.add(this.eventEmitterService.invokeSearchResultPageComponentFunction.subscribe(
      (name: string) => {
        this.getPropertyDetail(this.PropertyDetailId);
      }
    ));

    this.isUserExist = this.cookieService.check("user");
    this.isUserExist ? this.userId = +this.cookieService.get("user") : this.userId = null;
    this.getPropertyDetail(this.PropertyDetailId);
    this.isMobile = /iPhone|iPod|Android/i.test(this.window.navigator.userAgent);
    // objProp.PropertyId = this.property.Id;
    // objProp.SearchTerm = this.property.Address;


    // else if(this.property.ImageIds != null && !this.property.GoogleImage){
    //   this.noImages = true;
    // }
    setTimeout(() => {
      this.showSlider = true;
    }, 600);
  }

  // Tab methods start
  // https://stackblitz.com/edit/scrollable-tabs

  selectedTab(e) {
    this.tab = e
  }

  selectTab(index) {
    this.selectedIndex = index
    this.selectedTab(this.tabs[index]);
    this.scrollTab(index - this.leftTabIdx - 1);
    this.moveScrollBottom(this.tabs[index].Id);
  }

  scrollTab(x) {
    this.isMobile = /iPhone|iPod|Android/i.test(this.window.navigator.userAgent);
    if (this.atStart && x < 0 || this.atEnd && x > 0) {
      return
    }
    this.leftTabIdx = this.leftTabIdx + x;
    // logic for transformCss = -500 px
    // if (x == -1) {
    //   this.leftTabIdx > 3 ? this.leftTabIdx = 4 : false;
    // } else {
    //   this.leftTabIdx >= 3 ? this.leftTabIdx = 4 : false;
    // }
    this.leftTabIdx < 0 ? this.leftTabIdx = 0 : false;
    if (this.isMobile) {
      this.transformCss = `translateX(${(this.leftTabIdx) * -120}px)`
    } else {
      this.transformCss = `translateX(${(this.leftTabIdx) * -0}px)`
    }

    this.atStart = this.leftTabIdx === 0;
    this.atEnd = this.leftTabIdx === (this.tabs.length - 1);
    this.leftTabIdx > 2 ? this.atEnd = true : this.atEnd = false;
  }

  scrollTab_New(x) {
    if (this.atStart && x < 0 || this.atEnd && x > 0) {
      return
    }
    this.leftTabIdx = this.leftTabIdx + x;
    console.log("leftTabIdx111", this.leftTabIdx);
    // logic for transformCss = -500 px
    // if (x == -1) {
    //   this.leftTabIdx > 3 ? this.leftTabIdx = 4 : false;
    // } else {
    //   this.leftTabIdx >= 3 ? this.leftTabIdx = 4 : false;
    // }
    this.leftTabIdx < 0 ? this.leftTabIdx = 0 : false;
    console.log("leftTabIdx2222", this.leftTabIdx);
    // this.transformCss = `translateX(${(this.leftTabIdx) * -145}px)`
    if (this.leftTabIdx < 3) {
      this.transformCss = `translateX(${(this.leftTabIdx) * -145}px)`
    }

    this.atStart = this.leftTabIdx === 0;
    this.atEnd = this.leftTabIdx === (this.tabs.length - 1);
    this.leftTabIdx > 2 ? this.atEnd = true : this.atEnd = false;
  }

  moveScrollBottom(id) {
    this.openActiveHeader = id;
    let element = this.document.getElementById(id);
    element.scrollIntoView({
      block: "start",
      behavior: "smooth"
    });
  }

  // Tab methods end

  getPropertyDetail(propDetailId) {
    let Obj = {};
    Obj["PropertyDetailId"] = propDetailId;
    Obj["UserId"] = this.userId;
    this._unsubscribeAll.add(this.propertyImageGalleryService.getPropertyDetail(Obj).subscribe((data: any) => {
      if (data.Success) {
        this.property = data.Model;
        let address = data.Model.Address + ", " + data.Model.Suburb + ", " + data.Model.City;
        this.timeOutVar = setTimeout(() => {
          if (!this.property.IsViewedInWeek) {
            this.onPropertyTileClick(this.property);
          }
        }, 3000);
        this.getAddressLatLong(address);
        this.imageObject = this.property.ImageIdList;
        const property = this.property;
        if (this.property.ImageIds == null && !this.property.GoogleImage) {
          this.noImages = true;
        }
        // this.getFlowInterestData();
        this.getFlowInterestHourlyData();
        this.getFlowInterestDailyData();
        this.getFlowInterestWeeklyData();
        this.getTimeWeightedFlowInterestHourlyData();
        this.getTimeWeightedFlowInterestDailyData();
        this.getTimeWeightedFlowInterestWeeklyData();
        // this.isLoaded = true;
        // if (this.localStorage.getItem('SearchData')) {
        //   let objProp = JSON.parse(this.localStorage.getItem('SearchData'));
        // }
        // objProp.Bedrooms = this.property.Bedrooms;
        // objProp.Bathrooms = this.property.Bathrooms;
        // objProp.PropertyId = this.property.PropertyId;
        // this.isLoaded = true;
        // this.getSimilarProperties(objProp);
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for property detail module. Please login.", false);
        }
      }));
  }

  getSubHurbLatLong(subHurbName) {
    let _this = this;
    var request = {
      address: subHurbName,
      componentRestrictions: {
        country: 'nz'
      }
    }
    // if (isPlatformBrowser(_this.platformId)) {
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
          viewport["SearchTerm"] = _this.subHurbName;
          viewport["AddressType"] = place.types[0];
          viewport["Bedrooms"] = _this.property.Bedrooms ? _this.property.Bedrooms : "";
          viewport["Bathrooms"] = _this.property.Bathrooms ? _this.property.Bathrooms : "";
          viewport["PropertyId"] = _this.property.PropertyId;
          _this.isLoaded = true;
          _this.getSimilarProperties(viewport);
        } else {
          console.log("Geocode was not successful for the following reason: " + status);
        }
      });
    });
    // }
  }

  getSimilarProperties(objProp) {
    this.loadSimilarhomes = false;
    this._unsubscribeAll.add(this.propertyImageGalleryService.getSimilarProperties(objProp)
      .subscribe((res: any) => {
        this.property.ActiveHomes = res.Model.ActiveHomes;
        this.property.InActiveHomes = res.Model.InActiveHomes;
        this.property.AverageCount = res.Model.AverageCount;
        this.property.AveragePercentage = res.Model.AveragePercentage.toFixed(2);
        this.property.AveragePropertyLikes = res.Model.AveragePropertyLikes;
        if (this.property.AveragePercentage > 1) {
          this.isGraterThanPercentage = true;
        }
        if (res.Model.AverageEstimatePrice == 0) {
          this.property.AverageEstimatePrice = this.property.HomebuzzEstimate;
        } else {
          this.property.AverageEstimatePrice = res.Model.AverageEstimatePrice;
        }
        this.loadSimilarhomes = true;
        this.noImages ? this.createMapImageAt45('divId') : false;
      },
        error => {
          // this.commonService.toaster(error.statusText, false);
          console.log(error);
          if (error.status == 401) {
            this.commonService.toaster("You have not access for property detail module. Please login.", false);
          }
          this.loadSimilarhomes = true;
        }));
  }

  close() {
    this.dialogRef.close(false);
  }

  onMakeOfferBtnClick(property: any) {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    if (!this.isUserCookieExist) {
      this.modalProperty = property;
      this.modalComponent = SignInModalComponent;
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(null, null, this.pageName + '/login/' + this.getRandom());
      }
      this.openSignUpDialog("SignInModalComponent");
    } else {
      this.modalProperty = property;
      this.modalComponent = MakeOfferComponent;
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(null, null, this.pageName + '/makeoffer/' + property.Address.replace(/[\W_]/g, "-") + "/" + property.PropertyDetailId + "/" + this.getRandom());
      }
      this.openMakeOfferDialog("MakeOfferComponent", property.PropertyDetailId, property.Address);
      this.onMakeOfferBtnClickEvent.emit(property);
    }
  }

  createMapImageAt45(divId: string) {
    let _this = this;
    const lat = parseFloat(this.property.LatitudeLongitude.split(',')[0]);
    const long = parseFloat(this.property.LatitudeLongitude.split(',')[1]);
    var latlng = new google.maps.LatLng(lat, long);
    var map = new google.maps.Map(this.document.getElementById(divId), {
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
    map.setTilt(45);

    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, long),
      icon: './assets/images/icons/home25x25.png'
    });

    // if (this.property.GoogleImage) {
    //   let image;
    //   if (this.property.Status === PropertyStatus.ForSaleOwnerActive) {
    //     image = './assets/images/icons/red_24x24.png';
    //   }
    //   else if (this.property.Status === PropertyStatus.OpenHomeOwnerActive) {
    //     image = './assets/images/icons/green_24x24.png';
    //   }
    //   else if (this.property.Status === PropertyStatus.ViewedOwnerActive) {
    //     image = './assets/images/icons/blue_24x24.png';
    //   }
    //   else if (this.property.Status === PropertyStatus.Viewed) {
    //     image = './assets/images/icons/light-yellow_24x24.png';
    //   }
    //   this.marker.setIcon(image);
    // }


    // this.marker.setMap(map);

    // dont remove code please
    // Code for draw circle based on lat-long
    // var Circle = new google.maps.Circle({
    //   strokeColor: '#FF0000',
    //   strokeOpacity: 0.8,
    //   strokeWeight: 2,
    //   fillColor: 'transparent',
    //   fillOpacity: 0.35,
    //   map: map,
    //   center: { lat: lat, lng: long },
    //   radius: 7
    // });

    // dont remove code please
    google.maps.event.addListenerOnce(map, "tilesloaded", function () {
      let el: HTMLCollectionOf<Element> = _this.document.getElementsByClassName('gm-style');
      if (el.length > 0) {
        drawDOM(_this.document.querySelector('#divId'))
          .then((group: Group) => {
            // console.log(group);
            return exportImage(group);
          })
          .then((dataUri) => {
            // console.log(dataUri);
            dataUri = dataUri.replace('data:image/png;base64,', '');
            _this.saveImageToserver(dataUri);
            // saveAs(dataUri, fileName + '.jpg');
          });

        // html2canvas(el).then((canvas) => {
        //   let imageBase64 = canvas.toDataURL("image/jpg");
        //   imageBase64 = imageBase64.replace('data:image/jpg;base64,', '');
        //   _this.saveImageToserver(imageBase64);
        // });
      }
    });
  }

  saveImageToserver(imageBase64: any) {
    const obj = {
      "propertyId": this.property.PropertyId,
      "imageData": imageBase64
    };
    this.propertyImageGalleryService.saveGoogleMapAsImage(obj).subscribe((res: any) => {
      if (res.Success) {
        this.property.GoogleImage = res.Model.GoogleImage;
        this.eventEmitterService.onGetPropertyEventEmmit(this.PropertyDetailId, "GoogleImageUpload", this.property.GoogleImage);
        this.noImages = false;
      }
    },
      (error: any) => {
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for property detail module. Please login.", false);
        }
      });
  }

  ToBase64 = function (u8) {
    return new Blob([u8], { type: "image/jpeg" });
  }

  getAddressLatLong(address) {
    let _this = this;
    // if (isPlatformBrowser(_this.platformId)) {
    this.mapsAPILoader.load().then(() => {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          let place = results[0];
          let subHurbStr = "";
          place.address_components.forEach(element => {
            element.types.forEach(type => {
              if (type === "sublocality") {
                subHurbStr = element.long_name;
              }
              if (type === "locality") {
                if (subHurbStr == "") {
                  subHurbStr = element.long_name;
                }
              }
            });
          });
          _this.subHurbName = subHurbStr;
          _this.isLoadSubHurb = true;
          _this.getSubHurbLatLong(_this.subHurbName);
          // console.log("subHurbName", _this.subHurbName);
        } else {
          console.log("Geocode was not successful for the following reason: " + status);
        }
      });
    });
    // }
  }

  getRandom() {
    return Math.floor(Math.random() * 10) + 1;
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
        this.window.history.pushState(null, null, environment.StaticUrl.toString());
      }
      return false;
    });
  }

  openEditDescriptionModal() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    let isAgent = false;
    if (this.pageName == "agent") {
      isAgent = true;
      this.pageName = url[2];
    }
    this.modalComponent = UploadPhotoDescriptionComponent;
    if (isAgent) {
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(null, null, "agent/" + this.pageName + '/editdescription/' + this.PropertyAddress.replace(/[\W_]/g, "-") + "/" + this.PropertyDetailId + "/" + this.getRandom());
      }
      this.commonModalService.openUploadPhotoDialog("UploadPhotoDescriptionComponent", this.PropertyDetailId, this.PropertyAddress, true);
    } else {
      if (typeof this.window !== 'undefined' && this.window.history) {
        this.window.history.pushState(null, null, this.pageName + '/editdescription/' + this.PropertyAddress.replace(/[\W_]/g, "-") + "/" + this.PropertyDetailId + "/" + this.getRandom());
      }
      this.commonModalService.openUploadPhotoDialog("UploadPhotoDescriptionComponent", this.PropertyDetailId, this.PropertyAddress, false, true);
    }
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
        // this.dialog.openDialogs.length > 0 ? this.dialog.openDialogs[0].close(true) : false;
        // this.dialog.closeAll();
        this.router.navigate(["/login"]);
      } else {
        if (typeof this.window !== 'undefined' && this.window.history) {
          this.window.history.pushState(null, null, environment.StaticUrl.toString());
        }
      }
    });
  }

  onPropertyLike(property) {
    // console.log("Call method");
    this.eventEmitterService.onPropertyLikeEventEmmit(property);
  }

  getAddressFormated(address: string) {
    address = address.split("--").join(", ");
    address = address.split("-").join(" ");
    return address;
  }

  getFlowInterestData() {
    this._unsubscribeAll.add(this.propertyImageGalleryService.getPropertyFlowInterest(this.PropertyDetailId).subscribe((data: any) => {
      if (data.Success) {
        this.flowInterestHourlyArr = data.Model;
        this.localStorage.setItem('flowInterestHourlyArr', JSON.stringify(this.flowInterestHourlyArr));
        google.load("visualization", "1", {
          packages: ["corechart"]
        });
        google.charts.setOnLoadCallback(this.getFlowInterest);
      }
    }));
  }

  getFlowInterestHourlyData() {
    this._unsubscribeAll.add(this.propertyImageGalleryService.getPropertyFlowInterestByHourly(this.PropertyDetailId).subscribe((data: any) => {
      if (data.Success) {
        this.flowInterestHourlyArr = data.Model;
        this.localStorage.setItem('flowInterestHourlyArr', JSON.stringify(this.flowInterestHourlyArr));
        google.load("visualization", "1", {
          packages: ["corechart"]
        });
        google.charts.setOnLoadCallback(this.getFlowInterest);
      }
    }));
  }

  getTimeWeightedFlowInterestHourlyData() {
    this._unsubscribeAll.add(this.propertyImageGalleryService.getTimeWeightedPropertyFlowInterestByHourly(this.PropertyDetailId).subscribe((data: any) => {
      if (data.Success) {
        this.timeWeightedFlowInterestHourlyArr = data.Model;
        this.localStorage.setItem('timeWeightedFlowInterestHourlyArr', JSON.stringify(this.timeWeightedFlowInterestHourlyArr));
        google.load("visualization", "1", {
          packages: ["corechart"]
        });
        google.charts.setOnLoadCallback(this.getTimeWeightedHourlyFlowInterest);
      }
    }));
  }

  getTimeWeightedFlowInterestDailyData() {
    this._unsubscribeAll.add(this.propertyImageGalleryService.getTimeWeightedPropertyFlowInterestByDaily(this.PropertyDetailId).subscribe((data: any) => {
      if (data.Success) {
        this.timeWeightedFlowInterestDailyArr = data.Model;
        this.localStorage.setItem('timeWeightedFlowInterestDailyArr', JSON.stringify(this.timeWeightedFlowInterestDailyArr));
        google.load("visualization", "1", {
          packages: ["corechart"]
        });
        google.charts.setOnLoadCallback(this.getTimeWeightedFlowInterestDaily);
      }
    }));
  }

  getFlowInterestDailyData() {
    this._unsubscribeAll.add(this.propertyImageGalleryService.getPropertyFlowInterestByDaily(this.PropertyDetailId).subscribe((data: any) => {
      if (data.Success) {
        this.flowInterestDailyArr = data.Model;
        this.localStorage.setItem('flowInterestDailyArr', JSON.stringify(this.flowInterestDailyArr));
        google.load("visualization", "1", {
          packages: ["corechart"]
        });
        google.charts.setOnLoadCallback(this.getFlowInterestDaily);
      }
    }));
  }

  getTimeWeightedFlowInterestWeeklyData() {
    this._unsubscribeAll.add(this.propertyImageGalleryService.getTimeWeightedPropertyFlowInterestByWeekly(this.PropertyDetailId).subscribe((data: any) => {
      if (data.Success) {
        this.timeWeightedFlowInterestWeeklyArr = data.Model;
        this.localStorage.setItem('timeWeightedFlowInterestWeeklyArr', JSON.stringify(this.timeWeightedFlowInterestWeeklyArr));
        google.load("visualization", "1", {
          packages: ["corechart"]
        });
        google.charts.setOnLoadCallback(this.getTimeWeightedFlowInterestWeekly);
      }
    }));
  }

  getFlowInterestWeeklyData() {
    this._unsubscribeAll.add(this.propertyImageGalleryService.getPropertyFlowInterestByWeekly(this.PropertyDetailId).subscribe((data: any) => {
      if (data.Success) {
        this.flowInterestWeeklyArr = data.Model;
        this.localStorage.setItem('flowInterestWeeklyArr', JSON.stringify(this.flowInterestWeeklyArr));
        google.load("visualization", "1", {
          packages: ["corechart"]
        });
        google.charts.setOnLoadCallback(this.getFlowInterestWeekly);
      }
    }));
  }

  getFlowInterest() {
    let _this = this;
    let flowInterestHourlyArr: any[] = [];
    var data = [];
    if (localStorage.getItem("flowInterestHourlyArr")) {
      flowInterestHourlyArr = JSON.parse(localStorage.getItem('flowInterestHourlyArr'));
      localStorage.removeItem("flowInterestHourlyArr");
    }
    var Header = ['Time', 'Flowinterest', { type: 'string', role: 'tooltip', 'p': { 'html': true } }, 'ViewerStrength', { type: 'string', role: 'tooltip', 'p': { 'html': true } }];

    data.push(Header);
    for (var i = 0; i < flowInterestHourlyArr.length; i++) {
      var temp = [];
      let element = flowInterestHourlyArr[i];
      // let localTime = moment.utc(element.CreatedOn).local().format('hh:mm');
      let localTime = moment.utc(element.CreatedOn).local().format('Do MMM,hh:mm A');

      let viewerStrengthNo = 0;
      let flowInterestNo = 0;
      let rankingStatus;
      if (element.ViewerStrength == 'Average') {
        viewerStrengthNo = 2;
      } else if (element.ViewerStrength == 'Weak') {
        viewerStrengthNo = 1;
      } else if (element.ViewerStrength == 'Strong') {
        viewerStrengthNo = 3;
      } else {
        viewerStrengthNo = 0;
      }
      if (element.Ranking > 0 && element.ViewCount > 1) {
        flowInterestNo = 3;
        rankingStatus = 'Hot';
      } else if (element.Ranking < 0 && element.Performance != 'No flow') {
        flowInterestNo = 1;
        rankingStatus = 'Cool';
      } else if (element.Ranking == 0 && element.Performance == 'No flow') {
        flowInterestNo = 0;
        rankingStatus = 'No flow';
      }
      // else if (element.Ranking == 0 && element.Performance != 'No flow') {
      else {
        flowInterestNo = 2;
        rankingStatus = 'Stable';
      }


      temp.push("Time: " + localTime);

      let viewerStrengthTxt = element.ViewerStrength;

      temp.push(flowInterestNo);
      let Flowinterest = rankingStatus;
      temp.push(Flowinterest);
      temp.push(viewerStrengthNo);
      temp.push(viewerStrengthTxt);
      data.push(temp);
    }

    // console.log("linedata", data);
    var chartdata = new google.visualization.arrayToDataTable(data);

    var options = {
      title: 'Flow (hourly)',
      // backgroundColor: '#e2ebef',
      focusTarget: 'category',
      colors: ['#0000ff', '#a52714', '#ff0000', '#00ff00'],
      chartArea: { width: '60%' },
      vAxis: {
        textPosition: 'none',
        viewWindow: {
          min: 0,
          max: 3
        },
        ticks: [0, 1, 2, 3]
      },
      hAxis:
      {
        textPosition: 'none'
        // viewWindow: {
        //   min: 1,
        //   max: 14
        // },
        // ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
      },
      // tooltip: {isHtml: true}
    };
    setTimeout(() => {
      let chartElem = document.getElementById('chart_div');
      if (!chartElem) {
        setTimeout(() => {
          chartElem = document.getElementById('chart_div');
          var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
          chart.draw(chartdata, options);
        }, 500);
      } else {
        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(chartdata, options);
      }
    }, 1000);
  }

  getTimeWeightedHourlyFlowInterest() {
    let _this = this;
    let timeWeightedFlowInterestHourlyArr: any[] = [];
    var data = [];
    if (localStorage.getItem("timeWeightedFlowInterestHourlyArr")) {
      timeWeightedFlowInterestHourlyArr = JSON.parse(localStorage.getItem('timeWeightedFlowInterestHourlyArr'));
      localStorage.removeItem("timeWeightedFlowInterestHourlyArr");
    }
    var Header = ['Time', 'Flowinterest', { type: 'string', role: 'tooltip', 'p': { 'html': true } }, 'Viewerstrength', { type: 'string', role: 'tooltip', 'p': { 'html': true } }];

    data.push(Header);
    for (var i = 0; i < timeWeightedFlowInterestHourlyArr.length; i++) {
      var temp = [];
      let element = timeWeightedFlowInterestHourlyArr[i];
      // let localTime = moment.utc(element.CreatedOn).local().format('hh:mm');
      let localTime = moment.utc(element.CreatedOn).local().format('Do MMM,hh:mm A');

      let viewerStrengthNo = 0;
      let flowInterestNo = 0;
      let rankingStatus;
      if (element.ViewerStrength == 'Average') {
        viewerStrengthNo = 2;
      } else if (element.ViewerStrength == 'Weak') {
        viewerStrengthNo = 1;
      } else if (element.ViewerStrength == 'Strong') {
        viewerStrengthNo = 3;
      } else {
        viewerStrengthNo = 0;
      }
      if (element.Ranking > 0 && element.ViewCount > 1) {
        flowInterestNo = 3;
        rankingStatus = 'Hot';
      } else if (element.Ranking < 0 && element.Performance != 'No flow') {
        flowInterestNo = 1;
        rankingStatus = 'Cool';
      } else if (element.Ranking == 0 && element.Performance == 'No flow') {
        flowInterestNo = 0;
        rankingStatus = 'No flow';
      }
      // else if (element.Ranking == 0 && element.Performance != 'No flow') {
      else {
        flowInterestNo = 2;
        rankingStatus = 'Stable';
      }

      temp.push("Time: " + localTime);

      let viewerStrengthTxt = element.ViewerStrength;

      temp.push(flowInterestNo);
      let Flowinterest = rankingStatus;
      temp.push(Flowinterest);
      temp.push(viewerStrengthNo);
      temp.push(viewerStrengthTxt);
      data.push(temp);
    }

    // console.log("linedata", data);
    var chartdata = new google.visualization.arrayToDataTable(data);

    var options = {
      title: 'Time weighted flow (hourly)',
      // backgroundColor: '#e2ebef',
      focusTarget: 'category',
      colors: ['#0000ff', '#a52714', '#ff0000', '#00ff00'],
      chartArea: { width: '60%' },
      vAxis: {
        textPosition: 'none',
        viewWindow: {
          min: 0,
          max: 3
        },
        ticks: [0, 1, 2, 3]
      },
      hAxis:
      {
        textPosition: 'none'
        // viewWindow: {
        //   min: 1,
        //   max: 14
        // },
        // ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
      },
      // tooltip: {isHtml: true}
    };
    setTimeout(() => {
      let chartElem = document.getElementById('TimeWeighted_Hourly_chart_div');
      if (!chartElem) {
        setTimeout(() => {
          chartElem = document.getElementById('TimeWeighted_Hourly_chart_div');
          var chart = new google.visualization.LineChart(document.getElementById('TimeWeighted_Hourly_chart_div'));
          chart.draw(chartdata, options);
        }, 500);
      } else {
        var chart = new google.visualization.LineChart(document.getElementById('TimeWeighted_Hourly_chart_div'));
        chart.draw(chartdata, options);
      }
    }, 1000);
  }

  getFlowInterestDaily() {
    let _this = this;
    let flowInterestDailyArr: any[] = [];
    var data = [];
    if (localStorage.getItem("flowInterestDailyArr")) {
      flowInterestDailyArr = JSON.parse(localStorage.getItem('flowInterestDailyArr'));
      localStorage.removeItem("flowInterestDailyArr")
    }
    var Header = ['Time', 'Flowinterest', { type: 'string', role: 'tooltip', 'p': { 'html': true } }, 'ViewerStrength', { type: 'string', role: 'tooltip', 'p': { 'html': true } }];

    data.push(Header);
    for (var i = 0; i < flowInterestDailyArr.length; i++) {
      var temp = [];
      let element = flowInterestDailyArr[i];
      // let localTime = moment.utc(element.CreatedOn).local().format('hh:mm');
      let localTime = moment.utc(element.CreatedOn).local().format('Do MMM,hh:mm A');

      let viewerStrengthNo = 0;
      let flowInterestNo = 0;
      let rankingStatus;
      if (element.ViewerStrength == 'Average') {
        viewerStrengthNo = 2;
      } else if (element.ViewerStrength == 'Weak') {
        viewerStrengthNo = 1;
      } else if (element.ViewerStrength == 'Strong') {
        viewerStrengthNo = 3;
      } else {
        viewerStrengthNo = 0;
      }
      if (element.Ranking > 0 && element.ViewCount > 1) {
        flowInterestNo = 3;
        rankingStatus = 'Hot';
      } else if (element.Ranking < 0 && element.Performance != 'No flow') {
        flowInterestNo = 1;
        rankingStatus = 'Cool';
      } else if (element.Ranking == 0 && element.Performance == 'No flow') {
        flowInterestNo = 0;
        rankingStatus = 'No flow';
      }
      // else if (element.Ranking == 0 && element.Performance != 'No flow') {
      else {
        flowInterestNo = 2;
        rankingStatus = 'Stable';
      }


      temp.push("Time: " + localTime);

      let viewerStrengthTxt = element.ViewerStrength;

      temp.push(flowInterestNo);
      let Flowinterest = rankingStatus;
      temp.push(Flowinterest);
      temp.push(viewerStrengthNo);
      temp.push(viewerStrengthTxt);
      data.push(temp);
    }

    // console.log("linedata", data);
    var chartdata = new google.visualization.arrayToDataTable(data);

    var options = {
      title: 'Flow (daily)',
      // backgroundColor: '#e2ebef',
      focusTarget: 'category',
      colors: ['#0000ff', '#a52714', '#ff0000', '#00ff00'],
      chartArea: { width: '60%' },
      vAxis: {
        textPosition: 'none',
        viewWindow: {
          min: 0,
          max: 3
        },
        ticks: [0, 1, 2, 3]
      },
      hAxis:
      {
        textPosition: 'none'
        // viewWindow: {
        //   min: 1,
        //   max: 14
        // },
        // ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
      },
      // tooltip: {isHtml: true}
    };
    setTimeout(() => {
      let chartElem = document.getElementById('chart_Daily_div_PropertyDetail');
      if (!chartElem) {
        setTimeout(() => {
          chartElem = document.getElementById('chart_Daily_div_PropertyDetail');
          var chart = new google.visualization.LineChart(document.getElementById('chart_Daily_div_PropertyDetail'));
          chart.draw(chartdata, options);
        }, 500);
      } else {
        var chart = new google.visualization.LineChart(document.getElementById('chart_Daily_div_PropertyDetail'));
        chart.draw(chartdata, options);
      }
    }, 1000);
  }

  getTimeWeightedFlowInterestDaily() {
    let _this = this;
    let timeWeightedFlowInterestDailyArr: any[] = [];
    var data = [];
    if (localStorage.getItem("timeWeightedFlowInterestDailyArr")) {
      timeWeightedFlowInterestDailyArr = JSON.parse(localStorage.getItem('timeWeightedFlowInterestDailyArr'));
      localStorage.removeItem("timeWeightedFlowInterestDailyArr")
    }
    var Header = ['Time', 'Flowinterest', { type: 'string', role: 'tooltip', 'p': { 'html': true } }, 'ViewerStrength', { type: 'string', role: 'tooltip', 'p': { 'html': true } }];

    data.push(Header);
    for (var i = 0; i < timeWeightedFlowInterestDailyArr.length; i++) {
      var temp = [];
      let element = timeWeightedFlowInterestDailyArr[i];
      // let localTime = moment.utc(element.CreatedOn).local().format('hh:mm');
      let localTime = moment.utc(element.CreatedOn).local().format('Do MMM,hh:mm A');

      let viewerStrengthNo = 0;
      let flowInterestNo = 0;
      let rankingStatus;
      if (element.ViewerStrength == 'Average') {
        viewerStrengthNo = 2;
      } else if (element.ViewerStrength == 'Weak') {
        viewerStrengthNo = 1;
      } else if (element.ViewerStrength == 'Strong') {
        viewerStrengthNo = 3;
      } else {
        viewerStrengthNo = 0;
      }
      if (element.Ranking > 0 && element.ViewCount > 1) {
        flowInterestNo = 3;
        rankingStatus = 'Hot';
      } else if (element.Ranking < 0 && element.Performance != 'No flow') {
        flowInterestNo = 1;
        rankingStatus = 'Cool';
      } else if (element.Ranking == 0 && element.Performance == 'No flow') {
        flowInterestNo = 0;
        rankingStatus = 'No flow';
      }
      // else if (element.Ranking == 0 && element.Performance != 'No flow') {
      else {
        flowInterestNo = 2;
        rankingStatus = 'Stable';
      }


      temp.push("Time: " + localTime);

      let viewerStrengthTxt = element.ViewerStrength;

      temp.push(flowInterestNo);
      let Flowinterest = rankingStatus;
      temp.push(Flowinterest);
      temp.push(viewerStrengthNo);
      temp.push(viewerStrengthTxt);
      data.push(temp);
    }

    // console.log("linedata", data);
    var chartdata = new google.visualization.arrayToDataTable(data);

    var options = {
      title: 'Time weighted flow (daily)',
      // backgroundColor: '#e2ebef',
      focusTarget: 'category',
      colors: ['#0000ff', '#a52714', '#ff0000', '#00ff00'],
      chartArea: { width: '60%' },
      vAxis: {
        textPosition: 'none',
        viewWindow: {
          min: 0,
          max: 3
        },
        ticks: [0, 1, 2, 3]
      },
      hAxis:
      {
        textPosition: 'none'
        // viewWindow: {
        //   min: 1,
        //   max: 14
        // },
        // ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
      },
      // tooltip: {isHtml: true}
    };
    setTimeout(() => {
      let chartElem = document.getElementById('TimeWeighted_Daily_chart_div');
      if (!chartElem) {
        setTimeout(() => {
          chartElem = document.getElementById('TimeWeighted_Daily_chart_div');
          var chart = new google.visualization.LineChart(document.getElementById('TimeWeighted_Daily_chart_div'));
          chart.draw(chartdata, options);
        }, 500);
      } else {
        var chart = new google.visualization.LineChart(document.getElementById('TimeWeighted_Daily_chart_div'));
        chart.draw(chartdata, options);
      }
    }, 1000);
  }

  getFlowInterestWeekly() {
    let _this = this;
    let flowInterestWeeklyArr: any[] = [];
    var data = [];
    if (localStorage.getItem("flowInterestWeeklyArr")) {
      flowInterestWeeklyArr = JSON.parse(localStorage.getItem('flowInterestWeeklyArr'));
      localStorage.removeItem("flowInterestWeeklyArr")
    }
    var Header = ['Time', 'Flowinterest', { type: 'string', role: 'tooltip', 'p': { 'html': true } }, 'ViewerStrength', { type: 'string', role: 'tooltip', 'p': { 'html': true } }];

    data.push(Header);
    for (var i = 0; i < flowInterestWeeklyArr.length; i++) {
      var temp = [];
      let element = flowInterestWeeklyArr[i];
      // let localTime = moment.utc(element.CreatedOn).local().format('hh:mm');
      let localTime = moment.utc(element.CreatedOn).local().format('Do MMM,hh:mm A');

      let viewerStrengthNo = 0;
      let flowInterestNo = 0;
      let rankingStatus;
      if (element.ViewerStrength == 'Average') {
        viewerStrengthNo = 2;
      } else if (element.ViewerStrength == 'Weak') {
        viewerStrengthNo = 1;
      } else if (element.ViewerStrength == 'Strong') {
        viewerStrengthNo = 3;
      } else {
        viewerStrengthNo = 0;
      }
      if (element.Ranking > 0 && element.ViewCount > 1) {
        flowInterestNo = 3;
        rankingStatus = 'Hot';
      } else if (element.Ranking < 0 && element.Performance != 'No flow') {
        flowInterestNo = 1;
        rankingStatus = 'Cool';
      } else if (element.Ranking == 0 && element.Performance == 'No flow') {
        flowInterestNo = 0;
        rankingStatus = 'No flow';
      }
      // else if (element.Ranking == 0 && element.Performance != 'No flow') {
      else {
        flowInterestNo = 2;
        rankingStatus = 'Stable';
      }


      temp.push("Time: " + localTime);

      let viewerStrengthTxt = element.ViewerStrength;

      temp.push(flowInterestNo);
      let Flowinterest = rankingStatus;
      temp.push(Flowinterest);
      temp.push(viewerStrengthNo);
      temp.push(viewerStrengthTxt);
      data.push(temp);
    }

    // console.log("linedata", data);
    var chartdata = new google.visualization.arrayToDataTable(data);

    var options = {
      title: 'Flow (weekly)',
      // backgroundColor: '#e2ebef',
      focusTarget: 'category',
      colors: ['#0000ff', '#a52714', '#ff0000', '#00ff00'],
      chartArea: { width: '60%' },
      vAxis: {
        textPosition: 'none',
        viewWindow: {
          min: 0,
          max: 3
        },
        ticks: [0, 1, 2, 3]
      },
      hAxis:
      {
        textPosition: 'none'
        // viewWindow: {
        //   min: 1,
        //   max: 14
        // },
        // ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
      },
      // tooltip: {isHtml: true}
    };
    setTimeout(() => {
      let chartElem = document.getElementById('chart_Weekly_div');
      if (!chartElem) {
        setTimeout(() => {
          chartElem = document.getElementById('chart_Weekly_div');
          var chart = new google.visualization.LineChart(document.getElementById('chart_Weekly_div'));
          chart.draw(chartdata, options);
        }, 500);
      } else {
        var chart = new google.visualization.LineChart(document.getElementById('chart_Weekly_div'));
        chart.draw(chartdata, options);
      }
    }, 1000);
  }

  getTimeWeightedFlowInterestWeekly() {
    let _this = this;
    let timeWeightedFlowInterestWeeklyArr: any[] = [];
    var data = [];
    if (localStorage.getItem("timeWeightedFlowInterestWeeklyArr")) {
      timeWeightedFlowInterestWeeklyArr = JSON.parse(localStorage.getItem('timeWeightedFlowInterestWeeklyArr'));
      localStorage.removeItem("timeWeightedFlowInterestWeeklyArr")
    }
    var Header = ['Time', 'Flowinterest', { type: 'string', role: 'tooltip', 'p': { 'html': true } }, 'ViewerStrength', { type: 'string', role: 'tooltip', 'p': { 'html': true } }];

    data.push(Header);
    for (var i = 0; i < timeWeightedFlowInterestWeeklyArr.length; i++) {
      var temp = [];
      let element = timeWeightedFlowInterestWeeklyArr[i];
      // let localTime = moment.utc(element.CreatedOn).local().format('hh:mm');
      let localTime = moment.utc(element.CreatedOn).local().format('Do MMM,hh:mm A');

      let viewerStrengthNo = 0;
      let flowInterestNo = 0;
      let rankingStatus;
      if (element.ViewerStrength == 'Average') {
        viewerStrengthNo = 2;
      } else if (element.ViewerStrength == 'Weak') {
        viewerStrengthNo = 1;
      } else if (element.ViewerStrength == 'Strong') {
        viewerStrengthNo = 3;
      } else {
        viewerStrengthNo = 0;
      }
      if (element.Ranking > 0 && element.ViewCount > 1) {
        flowInterestNo = 3;
        rankingStatus = 'Hot';
      } else if (element.Ranking < 0 && element.Performance != 'No flow') {
        flowInterestNo = 1;
        rankingStatus = 'Cool';
      } else if (element.Ranking == 0 && element.Performance == 'No flow') {
        flowInterestNo = 0;
        rankingStatus = 'No flow';
      }
      // else if (element.Ranking == 0 && element.Performance != 'No flow') {
      else {
        flowInterestNo = 2;
        rankingStatus = 'Stable';
      }


      temp.push("Time: " + localTime);

      let viewerStrengthTxt = element.ViewerStrength;

      temp.push(flowInterestNo);
      let Flowinterest = rankingStatus;
      temp.push(Flowinterest);
      temp.push(viewerStrengthNo);
      temp.push(viewerStrengthTxt);
      data.push(temp);
    }

    // console.log("linedata", data);
    var chartdata = new google.visualization.arrayToDataTable(data);

    var options = {
      title: 'Time weighted flow (weekly)',
      // backgroundColor: '#e2ebef',
      focusTarget: 'category',
      colors: ['#0000ff', '#a52714', '#ff0000', '#00ff00'],
      chartArea: { width: '60%' },
      vAxis: {
        textPosition: 'none',
        viewWindow: {
          min: 0,
          max: 3
        },
        ticks: [0, 1, 2, 3]
      },
      hAxis:
      {
        textPosition: 'none'
        // viewWindow: {
        //   min: 1,
        //   max: 14
        // },
        // ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
      },
      // tooltip: {isHtml: true}
    };
    setTimeout(() => {
      let chartElem = document.getElementById('TimeWeighted_Weekly_chart_div');
      if (!chartElem) {
        setTimeout(() => {
          chartElem = document.getElementById('TimeWeighted_Weekly_chart_div');
          var chart = new google.visualization.LineChart(document.getElementById('TimeWeighted_Weekly_chart_div'));
          chart.draw(chartdata, options);
        }, 500);
      } else {
        var chart = new google.visualization.LineChart(document.getElementById('TimeWeighted_Weekly_chart_div'));
        chart.draw(chartdata, options);
      }
    }, 1000);
  }

  onPropertyTileClick(property: any) {
    // console.log("Address", property.Address);
    if (property) {
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

  AddViewCount(property: any) {
    this._unsubscribeAll.add(this.propertyImageGalleryService.savePropertyDetailAndPropertyCRUD(property.PropertyDetailId).subscribe(data => {
      if (data.Success) {
        this.property.ViewCount = data.Model.ViewCount;
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
    this._unsubscribeAll.add(this.propertyImageGalleryService.savePropertyViewCount(propertyViewObj).subscribe(data => {
      if (data.Success) {
        this.property.IsViewedInWeek = true;
        this.eventEmitterService.OnPropertyDetailIncreseViewCountAfter3secEmit(property.PropertyDetailId);
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      }));
  }

  openPropertyImageComponent(element) {
    this.dialog.openDialogs.length > 0 ? this.dialog.openDialogs[0].close(true) : false;
    // _this.dialog.closeAll();
    this.eventEmitterService.openPropertyImageModal(element);
  }

  onShareOptionClick() {
    this.eventEmitterService.onSharePropertyEventEmmit();
  }

  onNotifyPropertyOptionClick() {
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, 'property/notify/' + this.property.PropertyDetailId + '/' + this.getRandom());
    }
    this.eventEmitterService.onNotifyPropertyEventEmmit(this.property);
  }

  onTermsOptionClick() {
    this.eventEmitterService.onTermsEventEmit();
  }

  onPrivacyOptionClick() {
    this.eventEmitterService.onPrivacyEventEmit();
  }

  onHomebuzzEstimatesOptionClick() {
    this.eventEmitterService.onEstimateEventEmit();
  }

  ngOnDestroy(): any {
    this.subsVar.unsubscribe();
    this._unsubscribeAll.unsubscribe();
    clearTimeout(this.timeOutVar);
  }

}

// var transform = $(".gm-style>div:first>div").css("transform");
// var comp = transform.split(","); //split up the transform matrix
// var mapleft = parseFloat(comp[4]); //get left value
// var maptop = parseFloat(comp[5]); //get top value

// $(".no-image .gm-style>div:first>div").css({ //get the map container.
//   "transform": "none",
//   "left": mapleft,
//   "top": maptop,
// });

// var imagePath = this.document.getElementById("divId");

// html2canvas($("#divId"), {
//   onrendered: function (canvas) {
//     theCanvas = canvas;


//     canvas.toBlob(function (blob) {
//       saveAs(blob, "Dashboard.png");
//     });
//   }
// }

// Reference Link for loader
// https://stackoverflow.com/questions/43228698/how-can-i-keep-the-text-of-the-loader-static

export class TabList {
  Id: string;
  Name: string;
}