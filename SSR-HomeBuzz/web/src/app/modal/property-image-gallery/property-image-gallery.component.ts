import { Component, OnInit, ViewContainerRef, ViewChild, Input, EventEmitter, Output, OnDestroy, Inject, PLATFORM_ID } from "@angular/core";
import { drawDOM, Group, exportImage, pdf } from '@progress/kendo-drawing';
import { NgImageSliderComponent } from "ng-image-slider";
import { environment } from "../../../environments/environment";
import { PropertyImageGalleryService } from "./property-image-gallery.service";
// import html2canvas from 'html2canvas';
import { Property } from "../../../app/pages/search-result-page/search-result-page";
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
    { Id: 'Watching', Name: 'Watching' },
    { Id: 'HomeValue', Name: 'Property value' },
    { Id: 'OpenHome', Name: 'Open home' },
    { Id: 'ListingAgent', Name: 'Listing agent' },
    { Id: 'SimilarProperty', Name: 'Similar properties in area' }
  ];
  public tab: TabList;
  public selectedIndex: number = 0;
  public transformCss: string;
  public leftTabIdx = 0;
  public atStart = true;
  public atEnd = false
  public index = 0;

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
    if (this.atStart && x < 0 || this.atEnd && x > 0) {
      return
    }
    this.leftTabIdx = this.leftTabIdx + x;
    // logic for transformCss = -500 px
    if (x == -1) {
      this.leftTabIdx > 3 ? this.leftTabIdx = 4 : false;
    } else {
      this.leftTabIdx >= 3 ? this.leftTabIdx = 4 : false;
    }
    this.leftTabIdx < 0 ? this.leftTabIdx = 0 : false;
    this.transformCss = `translateX(${(this.leftTabIdx) * -125}px)`
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
    this.propertyImageGalleryService.getPropertyDetail(propDetailId, this.userId).subscribe((data: any) => {
      if (data.Success) {
        this.property = data.Model;
        // console.log(this.property);
        this.getAddressLatLong(data.Model.Address);
        this.imageObject = this.property.ImageIdList;
        const property = this.property;
        if (this.property.ImageIds == null && !this.property.GoogleImage) {
          this.noImages = true;
        }
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
      });
  }

  getSubHurbLatLong(subHurbName) {
    let _this = this;
    var request = {
      address: subHurbName,
      componentRestrictions: {
        country: 'nz'
      }
    }
    if (isPlatformBrowser(_this.platformId)) {
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
            viewport["Bedrooms"] = _this.property.Bedrooms;
            viewport["Bathrooms"] = _this.property.Bathrooms;
            viewport["PropertyId"] = _this.property.PropertyId;
            _this.isLoaded = true;
            _this.getSimilarProperties(viewport);
          } else {
            console.log("Geocode was not successful for the following reason: " + status);
          }
        });
      });
    }
  }

  getSimilarProperties(objProp) {
    this.loadSimilarhomes = false;
    this.propertyImageGalleryService.getSimilarProperties(objProp)
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
        });
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
            console.log(dataUri);
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
    if (isPlatformBrowser(_this.platformId)) {
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
    }
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

export class TabList {
  Id: string;
  Name: string;
}