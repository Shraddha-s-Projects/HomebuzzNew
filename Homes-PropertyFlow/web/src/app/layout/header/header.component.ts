import { ToasterConfig } from 'angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, Input, ViewChild, ElementRef, NgZone, EventEmitter, Output, OnChanges, OnInit, Inject, AfterViewInit, ChangeDetectorRef, AfterContentChecked, PLATFORM_ID, AfterViewChecked } from '@angular/core';
import { CommonService } from '../../../app/core/services/common.service';
import { NotificationService } from '../../../app/core/services/notification/notification.service';
import { DesktopNotificationsService } from '../../../app/core/services/notification/desktop-notification.service';
import { CookieService } from "ngx-cookie-service";
import { MyOffersComponent } from '../../../app/modal/my-offers/my-offers.component';
import { MyHomesComponent } from '../../../app/modal/my-homes/my-homes.component';
import { MyLikesComponent } from '../../../app/modal/my-likes/my-likes.component';
import { MySearchComponent } from '../../../app/modal/my-search/my-search.component';
import { PrivacyPolicyComponent } from '../../../app/modal/privacy-policy/privacy-policy.component';
import { TermsComponent } from '../../../app/modal/terms/terms.component';
import { MyLikesService } from '../../../app/modal/my-likes/my-likes.service';
import { UserPropertyInfo } from '../../../app/pages/search-result-page/search-result-page';
import { EventEmitterService } from '../../../app/event-emitter.service';
import { MapsAPILoader } from '@agm/core';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { CommonModalService } from '../../../app/common-modal.service';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

declare var google: any;

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.css'],
})

export class HeaderComponent implements OnInit, OnChanges {

  @Input() profilePicUrl: string;
  @Input() showSearchbox: boolean = false;
  @ViewChild("search", { static: false }) searchElementRef: ElementRef;
  public searchPlaceHolder: string = "Enter an address, street or suburb";
  public isNewContact: boolean = false;
  public isNewProperty: boolean = false;
  public isLoading: boolean;
  public isRightSideBarEnabled: boolean;
  public sidebarToggle: boolean;
  public toggleClickCounter: number = 0;
  public userProfile: any;
  public searchTerm: string;
  public isDashboard: boolean = false;
  public userCookieName: string = "user";
  public isUserCookieExist: boolean = this.cookieService.check(this.userCookieName);
  public userId: number;
  public userPropInfo: UserPropertyInfo;
  public modalComponent: any;
  public pageName: string;
  public editURL: string;
  public count = 0;


  public isUserExist: boolean;
  public username: string;
  public rolename: string = this.cookieService.get("rolename");

  public config1: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right'
  });
  private _unsubscribeAll: Subject<any>;
  public subsVar = new Subscription();
  public isBrowser: boolean;

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private notificationService: NotificationService,
    private cookieService: CookieService,
    private desktopNotificationService: DesktopNotificationsService,
    private commonService: CommonService,
    private router: Router,
    private myLikesService: MyLikesService,
    private eventEmitterService: EventEmitterService,
    private route: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader,
    private ngZoneService: NgZone,
    private ngZone: NgZone,
    public dialog: MatDialog,
    private commonModalService: CommonModalService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this._unsubscribeAll = new Subject();
    //   this.eventEmitterService.subsVar = this.eventEmitterService.invokeSearchResultPageComponentFunction.subscribe(
    //     (name: string) => {
    //       this.getUserInfo();
    //     }
    //   );

    //   this.eventEmitterService.subsVar = this.eventEmitterService.sideBarMenuRefresh.subscribe(
    //     () => {
    //       this.getUserInfo();
    //     }
    //   );
    this.userId = this.isUserCookieExist ? parseInt(this.localStorage.getItem("userId")) : null;
  }

  ngOnInit() {

    // this.subsVar.add(this.eventEmitterService.invokeSearchResultPageComponentFunction.subscribe(
    //   (name: string) => {
    //     if (this.isUserCookieExist && this.userId) {
    //       this.getUserInfo()
    //     }
    //   }
    // ));

    // this.subsVar.add(this.eventEmitterService.sideBarMenuRefresh.subscribe(
    //   () => {
    //     if (this.isUserCookieExist && this.userId) {
    //       this.getUserInfo()
    //     }
    //   }
    // ));

    this.subsVar.add(this.eventEmitterService.headerSearchTextEmit.subscribe(
      (address: any) => {
        this.searchTerm = address;
      }
    ));

    let url = this.router.url.split("/");
    this.pageName = url[1];
    this.editURL = "/edit-user/" + this.userId;
    // Goto Login page if not Login
    this.checkUserLogin();
    this.isUserExist = this.cookieService.check("user");
    this.username = this.localStorage.getItem("userame");
    // Get User profile related data used accross the system.
    if (this.isUserCookieExist && this.userId) {
      // this.getUserInfo();
    }
    // if (isPlatformBrowser(this.platformId)) {
      if (this.showSearchbox) {
        this.initGoogleAutoComplete();
      }
    // }
    // setInterval(() => {
    //   this.checkDdl();
    // }, 100);
    // Subscribe Notification
    //this.subscribeNotification();
  }

  initGoogleAutoComplete() {
    this.count = this.count + 1;
    console.log("Call autocomplete:-", this.count);
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement,
        {
          types: ["geocode"],
          componentRestrictions: { country: ["nz"], },
          strictBounds: true
        }
      );
      // console.log("autocomplete", autocomplete);
      autocomplete.addListener("place_changed", () => {
        this.checkDdl();
        // this.searchControl.setValue(this.searchControl);
        // this.ngZone.run(() => {
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();
        if (place.geometry) {
          console.log('google autocomplete called');
          // console.log(place);
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
          this.localStorage.setItem("SearchData", JSON.stringify(viewport));
          this.eventEmitterService.onGetHeaderEventEmmit();
        }
      });
    });
    // });
  }

  subscribeNotification = () => {
    this.notificationService.messages.subscribe(
      data => {
        if (data.message) {
          let notification = JSON.parse(data.message.toString());
        }
      }
    );
  }

  triggerNotification(notification: any) {
    if (!notification.ToastContent) return false;

    // Web notification
    this.commonService.toasterNotification(notification.ToastContent);

    // Desktop notification
    let desktopNotification: Array<any> = [];
    desktopNotification.push({
      'title': 'Homebuzz',
      'alertContent': notification.ToastContent
    });
    this.desktopNotificationService.generateNotification(desktopNotification);
  }

  checkUserLogin() {
    if (this.localStorage.getItem("SearchData")) {
      let searchTermViewPort = JSON.parse(this.localStorage.getItem("SearchData"));
      this.searchTerm = searchTermViewPort ? searchTermViewPort.SearchTerm : '';
    }
  }

  logout() {
    this.localStorage.removeItem('access_token');
    this.localStorage.removeItem('id_token');
    this.localStorage.removeItem('role');
    this.localStorage.removeItem('dateformat');
    this.localStorage.removeItem('userId');
    this.localStorage.removeItem('uid');
    this.router.navigate(['/login']);
  }

  // getUserInfo() {
  //   let time = new Date();
  // }

  enableRightSideBar() {
    this.isRightSideBarEnabled = true;
  }

  public sidebarToggleClick() {
    this.toggleClickCounter += 1;
    if (this.toggleClickCounter % 3 == 0)
      this.sidebarToggle = true;
    this.toggleClickCounter = 0;
  }

  onMyOffersOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    this.modalComponent = MyOffersComponent;
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, this.pageName + '/myoffers' + "/" + this.getRandom());
    }
    this.commonModalService.openMyOffersDialog("MyOffersComponent");
  }

  onMyHomesOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    this.modalComponent = MyHomesComponent;
    if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, this.pageName + '/myhomes' + "/" + this.getRandom());
    }
    this.commonModalService.openMyHomesDialog("MyHomesComponent");
  }

  onMyLikesOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    this.modalComponent = MyLikesComponent;
    if (typeof this.window !== 'undefined' && this.window.history) {
    this.window.history.pushState(null, null, this.pageName + '/mylikes' + "/" + this.getRandom());
    }
    this.commonModalService.openMyLikesDialog("MyLikesComponent");
  }
  onMySearchOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    this.modalComponent = MySearchComponent;
    if (typeof this.window !== 'undefined' && this.window.history) {
    this.window.history.pushState(null, null, this.pageName + '/mysearches' + "/" + this.getRandom());
    }
    this.commonModalService.openMySearchesDialog("MySearchComponent");
  }
  onTermsOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    this.modalComponent = TermsComponent;
    if (typeof this.window !== 'undefined' && this.window.history) {
    this.window.history.pushState(null, null, this.pageName + '/terms' + "/" + this.getRandom());
    }
    this.commonModalService.openTermsDialog("TermsComponent");
  }
  onPrivacyOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    this.modalComponent = PrivacyPolicyComponent;
    if (typeof this.window !== 'undefined' && this.window.history) {
    this.window.history.pushState(null, null, this.pageName + '/privacy' + "/" + this.getRandom());
    }
    this.commonModalService.openPrivacyDialog("PrivacyPolicyComponent");
  }

  onLogoutOptionClick() {
    this.cookieService.deleteAll();
    this.localStorage.removeItem("roleId");
    this.localStorage.removeItem("userId");
    this.localStorage.removeItem("rolename");
    this.localStorage.removeItem("userame");
    // this.localStorage.removeItem("userame");
    this.router.navigate(['/login']);
  }

  getRandom() {
    return Math.floor(Math.random() * 10) + 1;
  }

  getUserInfo() {
    this.myLikesService.getUserInfo(this.userId).subscribe(data => {
      if (data.Model) {
        this.userPropInfo = data.Model[0];
      }
    });
  }

  RefreshProperty() {
    if (this.isUserCookieExist && this.userId) {
      // this.getUserInfo()
    }
  }

  openNav() {
    // if(this.rolename == "Agent"){
    //   this.router.navigate(["/agent/dashboard"]);
    // } else {
    this.document.getElementById("mySidenav").style.width = "250px";
    // this.router.navigate(["edit-user/"+ this.userId])
    // }
  }

  closeNav() {
    this.document.getElementById("mySidenav").style.width = "0";
  }

  checkDdl() {
    let elements = this.document.getElementsByClassName("pac-container");
    for (let index = 0; index < elements.length; index++) {
      let searchinputs = this.document.getElementsByClassName("search-input");
      const element: HTMLElement = elements[index] as HTMLElement;
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

  ngOnChanges() {
    if (this.showSearchbox) {
      if (this.localStorage.getItem("SearchData")) {
        let searchTermViewPort = JSON.parse(this.localStorage.getItem("SearchData"));
        this.searchTerm = searchTermViewPort ? searchTermViewPort.SearchTerm : '';
      }
      // if (this.count < 1) {
      // if (isPlatformBrowser(this.platformId)) {
        this.initGoogleAutoComplete();
      // }
      // }

    }
  }

  ngOnDestroy() {
    this.subsVar.unsubscribe();
  }

}