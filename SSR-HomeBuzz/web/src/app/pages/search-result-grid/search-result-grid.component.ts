import { Component, OnInit, Input, NgZone, Output, EventEmitter, OnDestroy, Inject, OnChanges } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { IPropertyViewerCookie, IHomeCoockie, PropertyView, PropertyLike, Property, AgentOption } from '../search-result-page/search-result-page';
import { SearchResultPageService } from '../search-result-page/search-result-page.service';
import { EventEmitterService } from '../../../app/event-emitter.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../app/core/services/common.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { AuthMessageComponent } from '../../../app/modal/auth-message/auth-message.component';
import { v4 as uuidv4 } from 'uuid';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-search-result-grid',
  templateUrl: './search-result-grid.component.html',
  styleUrls: ['./search-result-grid.component.css']
})
export class SearchResultGridComponent implements OnInit, OnDestroy, OnChanges {
  @Input() searchedTerm: string;
  @Input() properties: any;
  @Input() totalHome: number = 0;
  @Input() subHurbPropertyInfo: any;
  @Input() isLoadSubHurbInfo: boolean;
  @Input() subHurbName: string;
  @Input() totalView: number = 0;
  @Input() isLoaded: boolean;
  @Input() isLoading: boolean;
  @Input() agentOption: AgentOption[] = [];
  @Input() rolename: string;
  @Output() refreshProp: EventEmitter<any> = new EventEmitter<any>();
  @Output() makeOfferBtn: EventEmitter<any> = new EventEmitter<any>();
  @Output() ownerProp: EventEmitter<any> = new EventEmitter<any>();
  @Output() editProp: EventEmitter<any> = new EventEmitter<any>();
  @Output() propImageTile: EventEmitter<any> = new EventEmitter<any>();
  @Output() termsModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() privacyModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() estimateModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() likeProp: EventEmitter<any> = new EventEmitter<any>();

  public Image_Url = environment.APIURL.toString();
  public AllMarkers: any[] = [];
  public userCookieName: string = "user";
  public isUserCookieExist: boolean = this.cookieService.check(this.userCookieName);
  public UserKey: any;
  public userId: number;
  public modalProperty: Property;
  public modalComponent: any;
  public mapProperty: Property;
  public searchTermViewPort: any = {};
  public PageNum: number = 1;
  public PageSize: number = 100;
  public totalProperties: number = 0;
  public scrollOffset: number = 0;
  public testString: string;
  public isSurroundingSuburb: boolean = true;

  public subsVar = new Subscription();
  public _unsubscribeAll = new Subscription();

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any,
  @Inject(DOCUMENT) private document: Document,
    private cookieService: CookieService,
    private searchResultPageService: SearchResultPageService,
    private ngZoneService: NgZone,
    private router: Router,
    public dialog: MatDialog,
    private eventEmitterService: EventEmitterService,
    private commonService: CommonService,
  ) {
    this.userId = this.isUserCookieExist ? parseInt(this.localStorage.getItem("userId")) : null;
  }

  ngOnInit() {
    this.subsVar.add(this.eventEmitterService.invokeSearchResultPageComponentFunction.subscribe(
      (Obj: any) => {
        if (Obj.Action != undefined) {
          let index = this.properties.findIndex(t => t.PropertyDetailId === Obj.PropertyDetailId);
          if (Obj.Action == "ClaimProperty") {
            if (this.properties[index].Status == "Not listed") {
              let agentOption = this.agentOption.find(t => t.Id == 1);
              index > -1 ? this.properties[index].IsClaimed = true : false;
              index > -1 ? this.properties[index].OwnerId = this.userId : null;
              index > -1 ? this.properties[index].Status = "Pre-market" : null;
              if (this.rolename == "Agent" || this.rolename == "Agent_Admin") {
                let agentOption = this.agentOption.find(t => t.Id == 1);
                this.changeAgentOption(agentOption, this.properties[index]);
              }
            }
          }
        }
      }
    ));
  }

  showMarkerPin(element) {
    this.eventEmitterService.markerMouseHoverEventEmmit(element);
  }

  removeMarkerPin(element) {
    this.eventEmitterService.markerMouseOutEventEmmit(element);
  }

  /** Like Property Start */
  onTileLikeClick(event: any, property: any) {
    this.onPropertyTileClick(property);
    this.likeProperty(event, property);
  }

  likeProperty(event: any, property: any) {
    if (!this.isUserCookieExist) {
      this.likeProp.emit(property);
      // this.modalProperty = property;
      // this.modalComponent = SignInModalComponent;
      // window.history.pushState(null,null,'property/login/' + this.getRandom());
      // this.commonModalService.openSignUpDialog("SignInModalComponent");
      // this.router.navigate(['/property/SignUp']);
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
        if (!isExist) {
          property.PropertyDetailId ? this.localStorage.setItem("AddedViewCountId", property.PropertyDetailId.toString()): false;
          this.AddViewCount(property)
          this.savePropertyViewCount(property);
        }
      }
    }
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
    if(this.cookieService.get("UserKey")){
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
        // this.searchProperties();
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
      }));
  }

  updateTotalViews() {
    var total = 0;
    this.properties.forEach(item => (total += item.ViewCount));
    this.ngZoneService.run(() => {
      this.totalView = total;
    });
  }

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
    if(ell) {
      scrollTop = ell.scrollTop;
    }
    if(scrollTop >= scrollOffset && scrollOffset){
      this.onScrollEnd();
    }
  }

  onScrollEnd(isLoad?: boolean) {
    if (this.totalHome == this.PageSize * this.PageNum) {
      console.log("On scroll call");
      // this.searchProperties(this.searchTermViewPort);
      this.PageNum += 1;
      this.refreshProp.emit(this.PageNum);
    }
  }
  /** Lazy Loading End */

  onMakeOfferButtonClick(prop) {
    this.makeOfferBtn.emit(prop);
  }

  onOwnerBuzzHomeButtonClick(prop) {
    this.ownerProp.emit(prop);
  }

  onPropertyImageTileClick(event: any, prop: Property) {
    if (event.target.classList.contains('fa-heart') || event.target.classList.contains('claim_' + prop.PropertyDetailId)
      || event.target.classList.contains('edit-property')) {
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
            this._unsubscribeAll.add(this.searchResultPageService.unClaim(Obj).subscribe((data: any) => {
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
              }));
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
          this.properties[index].IsClaimed = data.Model.IsListProperty;
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

  onSurroundSuburbChange(event) {
    this.isSurroundingSuburb = event.target.checked;
    this.isSurroundingSuburb ? this.localStorage.setItem("isSurroundingSuburb", this.isSurroundingSuburb.toString()): false;
    this.refreshProp.emit();
  }

  getRandom() {
    return Math.floor(Math.random() * 10) + 1;
  }

  ngOnDestroy() {
    this.subsVar.unsubscribe();
    this._unsubscribeAll.unsubscribe();
  }

  ngOnChanges() {
    let sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
    let searchedterm = sessionData.SearchTerm.substring(0, sessionData.SearchTerm.length - 13);
    searchedterm = searchedterm.replace(/[0-9]/g, '');
    searchedterm = searchedterm.trim();
    this.searchedTerm = searchedterm;
  }
}
