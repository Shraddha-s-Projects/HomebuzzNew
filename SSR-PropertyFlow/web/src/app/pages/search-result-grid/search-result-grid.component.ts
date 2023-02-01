import { Component, OnInit, Input, NgZone, Output, EventEmitter, OnDestroy, Inject, OnChanges } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { IPropertyViewerCookie, IHomeCoockie, PropertyView, PropertyLike, Property, AgentOption, HotPropertyFlowInterestVM } from '../search-result-page/search-result-page';
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

declare var google: any;

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
  public isShowChart: boolean;
  public hotProperties: Property[] = [];
  public hotPropertyCount: number;
  public isLoadedHotProperties: boolean;
  public flowInterestDailyArr: HotPropertyFlowInterestVM[] = [];

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
          if (Obj.Action == "TransferPropertyOwnership") {
            index > -1 ? this.properties[index].IsClaimed = true : false;
            index > -1 ? this.properties[index].OwnerId = null : null;
          }
          if (Obj.Action == "GoogleImageUpload") {
            index > -1 ? this.properties[index].isLoadGoogleImageDiv = false : false;
            if (Obj.Model) {
              index > -1 ? this.properties[index].GoogleImage = Obj.Model : null;
            }
          }
        }
      }
    ));

    this.subsVar.add(this.eventEmitterService.invokeSearchResultPageComponentFunction.subscribe(
      (Obj: any) => {
        if (Obj.Action != undefined) {
          this.updateProperty(Obj);
        } 
      }
    ));

    this.subsVar.add(this.eventEmitterService.propertyDetailIncreaseViewCountEmit.subscribe(
      (PropertyDetailId: number) => {
        if (PropertyDetailId) {
          let index = this.properties.findIndex(t => t.PropertyDetailId == PropertyDetailId);
          if (index > -1) {
            this.properties[index].ViewCount += 1;
            this.properties[index].IsViewedInWeek = true;
            this.updateTotalViews();
          }
        }
      }));

    this.subsVar.add(this.eventEmitterService.sortedPropertiesEmit.subscribe((data: any) => {
      if (data) {
        this.isLoadedHotProperties = true;
        this.isShowChart = false;
        if (data.isHotPropeties) {
          this.properties = data.Properties;
          this.hotPropertyCount = data.HotPropertyCount;
          this.hotProperties = [];
          for (let index = 0; index < this.hotPropertyCount; index++) {
            let element = this.properties[index];
            this.hotProperties.push(element);
            // console.log('hotProperties', this.hotProperties);
          }
        } else {
          this.hotPropertyCount = data.HotPropertyCount;
          this.hotProperties = [];
          this.isLoadedHotProperties = false;
        }
      }
    }));
  }

  showMarkerPin(element) {
    this.eventEmitterService.markerMouseHoverEventEmmit(element);
  }

  removeMarkerPin(element) {
    this.eventEmitterService.markerMouseOutEventEmmit(element);
  }

  /** Like Property Start */
  onTileLikeClick(event: any, property: any) {
    this.likeProperty(event, property);
  }

  displayHotProperties() {

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
    this.agentOptionClick(property);
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

  agentOptionClick(property: Property) {
    let propindex = this.properties.findIndex(t => t.PropertyDetailId == property.PropertyDetailId);
    if (propindex > -1) {
      let el: HTMLCollectionOf<Element> = this.document.getElementsByClassName('agent-option');
      if (el) {
        for (let index = 0; index < el.length; index++) {
          if (propindex == index) {
            if (el[index].classList.contains('hide')) {
              el[index].classList.remove('hide');
              el[index].classList.add('show');
            }
          } else {
            if (el[index].classList.contains('show')) {
              el[index].classList.remove('show');
              el[index].classList.add('hide');
            }
          }
        }
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
    this.localStorage.setItem("isSurroundingSuburb", this.isSurroundingSuburb.toString());
    // this.isSurroundingSuburb ? this.localStorage.setItem("isSurroundingSuburb", this.isSurroundingSuburb.toString()): false;
    this.refreshProp.emit();
  }

  getRandom() {
    return Math.floor(Math.random() * 10) + 1;
  }

  showChart() {
    this.isShowChart = true;
    if (this.hotProperties.length > 0) {
      let propertyDetailId = this.hotProperties[0].PropertyDetailId;
      let PropertyDetailIds = [];
      this.hotProperties.forEach(element => {
        PropertyDetailIds.push(element.PropertyDetailId);
      });
      this.getFlowInterestDailyData(PropertyDetailIds);
    }
  }

  hideChart(){
    this.isShowChart = false;
  }

  getFlowInterestDailyData(PropertyDetailIds) {
    this._unsubscribeAll.add(this.searchResultPageService.getHotPropertyFlowInterestByDaily(PropertyDetailIds).subscribe((data: any) => {
      if (data.Success) {
        this.flowInterestDailyArr = data.Model;
        this.localStorage.setItem('hotPropertyflowInterestDailyArr', JSON.stringify(this.flowInterestDailyArr));
        this.localStorage.setItem('properties', JSON.stringify(this.properties));
        google.load("visualization", "1", {
          packages: ["corechart"]
        });
        google.charts.setOnLoadCallback(this.getFlowInterestDaily);
      }
    }));
  }

  getFlowInterestDaily() {
    let flowInterestDailyArr: any[] = [];
    var data = [];
    if (localStorage.getItem("hotPropertyflowInterestDailyArr")) {
      flowInterestDailyArr = JSON.parse(localStorage.getItem('hotPropertyflowInterestDailyArr'));
      localStorage.removeItem("hotPropertyflowInterestDailyArr")
    }
    let length = flowInterestDailyArr.length;
    var Header;
    var element1 = {};
    var element2 = {};
    var element3 = {};
    let address1;
    let address2;
    let address3;
    let properties: any[] = [];
    if (localStorage.getItem("properties")) {
      properties = JSON.parse(localStorage.getItem('properties'));
      localStorage.removeItem("properties");
    }
    for (let x = 0; x < flowInterestDailyArr.length; x++) {
      let element1 = flowInterestDailyArr[x];
      let propIndex = properties.findIndex(t => t.PropertyDetailId == element1.PropertyDetailId);
      if (propIndex > -1) {
        if (x == 0) {
          address1 = properties[propIndex].Address;
        }
        if (x == 1) {
          address2 = properties[propIndex].Address;
        }
        if (x == 2) {
          address3 = properties[propIndex].Address;
        }
      }
    }

    if (length == 1) {
      Header = ['Time', address1, { type: 'string', role: 'tooltip', 'p': { 'html': true } }];
    } else if (length == 2) {
      Header = ['Time', address1, { type: 'string', role: 'tooltip', 'p': { 'html': true } }, address2, { type: 'string', role: 'tooltip', 'p': { 'html': true } }];
    } else if (length == 3) {
      Header = ['Time', address1, { type: 'string', role: 'tooltip', 'p': { 'html': true } }, address2, { type: 'string', role: 'tooltip', 'p': { 'html': true } }, address3, { type: 'string', role: 'tooltip', 'p': { 'html': true } }];
    }

    data.push(Header);

    let i = 0
    for (let index = 0; index < flowInterestDailyArr[i].FlowInterest.length; index++) {
      var temp = [];
      let element = flowInterestDailyArr[i].FlowInterest[index];
      // console.log("------Start---------")
      // console.log("element1111", element.CreatedOn);
      let element2;
      let element3;
      if (flowInterestDailyArr.length == 2) {
        element2 = flowInterestDailyArr[i + 1].FlowInterest[index];
        // console.log("element2222", element2.CreatedOn);
      } else if (flowInterestDailyArr.length == 3) {
        element2 = flowInterestDailyArr[i + 1].FlowInterest[index];
        element3 = flowInterestDailyArr[i + 2].FlowInterest[index];
        // console.log("element2222", element2.CreatedOn);
        // console.log("element3333", element3.CreatedOn);
      }
      // console.log("------End---------");
      let localTime = moment.utc(element.CreatedOn).local().format('Do MMM,hh:mm A');
      // console.log('localTime', localTime);
      let flowInterestNo = 0;
      let rankingStatus;
      let flowInterestNo1 = 0;
      let rankingStatus1;
      let flowInterestNo2 = 0;
      let rankingStatus2;

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
      else {
        flowInterestNo = 2;
        rankingStatus = 'Stable';
      }

      temp.push("Time: " + localTime);

      temp.push(flowInterestNo);
      let Flowinterest = rankingStatus;
      temp.push(Flowinterest);

      if (flowInterestDailyArr.length >= 2 && flowInterestDailyArr.length < 4) {
        if (element2.Ranking > 0 && element2.ViewCount > 1) {
          flowInterestNo1 = 3;
          rankingStatus1 = 'Hot';
        } else if (element2.Ranking < 0 && element2.Performance != 'No flow') {
          flowInterestNo1 = 1;
          rankingStatus = 'Cool';
        } else if (element2.Ranking == 0 && element2.Performance == 'No flow') {
          flowInterestNo1 = 0;
          rankingStatus1 = 'No flow';
        }
        else {
          flowInterestNo1 = 2;
          rankingStatus1 = 'Stable';
        }
        temp.push(flowInterestNo1);
        let Flowinterest1 = rankingStatus1;
        temp.push(Flowinterest1);
      }
      if (flowInterestDailyArr.length == 3) {
        if (element3.Ranking > 0 && element3.ViewCount > 1) {
          flowInterestNo2 = 3;
          rankingStatus2 = 'Hot';
        } else if (element3.Ranking < 0 && element3.Performance != 'No flow') {
          flowInterestNo2 = 1;
          rankingStatus2 = 'Cool';
        } else if (element3.Ranking == 0 && element3.Performance == 'No flow') {
          flowInterestNo2 = 0;
          rankingStatus2 = 'No flow';
        }
        else {
          flowInterestNo2 = 2;
          rankingStatus2 = 'Stable';
        }

        temp.push(flowInterestNo2);
        let Flowinterest2 = rankingStatus2;
        temp.push(Flowinterest2);
      }
      data.push(temp);
      // console.log(data);
    }

    // console.log("linedata", data);
    var chartdata = new google.visualization.arrayToDataTable(data);

    var options = {
      title: 'Flow (daily)',
      // backgroundColor: '#e2ebef',
      focusTarget: 'category',
      legend: { position: 'bottom' },
      colors: ['#0000ff', '#08660c', '#ff0000', '#00ff00'],
      chartArea: { width: '100%' },
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
      },
    };
    setTimeout(() => {
      let chartElem = document.getElementById('chart_Daily_div');
      if (!chartElem) {
        setTimeout(() => {
          chartElem = document.getElementById('chart_Daily_div');
          var chart = new google.visualization.LineChart(document.getElementById('chart_Daily_div'));
          chart.draw(chartdata, options);
        }, 500);
      } else {
        var chart = new google.visualization.LineChart(document.getElementById('chart_Daily_div'));
        chart.draw(chartdata, options);
      }
    }, 1000);
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
        this.properties[index].CarSpace = Obj.Model.CarSpace;
        let Status = Obj.Model.HomeType;
        Status == "for sale" ? this.properties[index].Status = "For sale" : this.properties[index].Status = "Pre-market";
        this.properties[index].Day = Obj.Model.Day;
        this.properties[index].Time = Obj.Model.Time;
        this.properties[index].IsShowAskingPrice = Obj.Model.IsShowAskingPrice;
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

  ngOnDestroy() {
    this.subsVar.unsubscribe();
    this._unsubscribeAll.unsubscribe();
  }

  ngOnChanges() {
    // this.isLoadedHotProperties = false;
    if (this.localStorage.getItem("SearchData")) {
      let sessionData = JSON.parse(this.localStorage.getItem("SearchData"));
      if (sessionData) {
        let searchedterm = sessionData.SearchTerm.substring(0, sessionData.SearchTerm.length - 13);
        searchedterm = searchedterm.replace(/[0-9]/g, '');
        searchedterm = searchedterm.trim();
        this.searchedTerm = searchedterm;
      }
    }
  }
}
