import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AgentDashboardService } from './agent-dashboard.service';
import { AgentOption, AgentProperty } from './agent-dashboard';
import { CommonModalService } from '../../../../app/common-modal.service';
import { CommonService } from '../../../../app/core/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AddEditHomePhotoDescriptionComponent } from '../../../../app/modal/add-edit-home-photo-description/add-edit-home-photo-description.component';
import { EventEmitterService } from '../../../../app/event-emitter.service';
import { ClaimHomeComponent } from '../../../../app/modal/claim-home/claim-home.component';
import { AuthMessageComponent } from '../../../../app/modal/auth-message/auth-message.component';
import { MatDialog } from '@angular/material';
import { PropertyOffersComponent } from '../../../../app/modal/agent-modal/property-offers/property-offers.component';
import { ToasterConfig } from 'angular2-toaster';
import * as moment from 'moment';
import { TransferOwnershipComponent } from '../../../../app/modal/transfer-ownership/transfer-ownership.component';
import { Subscription } from 'rxjs';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css']
})
export class AgentDashboardComponent implements OnInit, OnDestroy {

  //toaster config
  public config1: ToasterConfig = new ToasterConfig({
    positionClass: "toast-top-right"
  });
  public minDate = new Date();
  public maxDate = moment(this.minDate).add(28, 'days');
  public past28Day = moment(this.minDate).add(-28, 'days');
  public userId: number = +this.cookieService.get("user");
  public userCookieName: string = "user";
  public isUserCookieExist: boolean = this.cookieService.check(this.userCookieName);
  public username: string;
  public agentOption: AgentOption[] = [];
  public isLoaded: boolean = false;
  public activeTab: string = "listing";
  public AgentOptionId: number = 1;
  public properties: AgentProperty[] = [];
  public totalHome: number;
  public scrollOffset: number = 0;
  public PageNum: number = 1;
  public PreviousPageNum: number = 1;
  public PageSize: number = 100;

  // open modal variable
  public modalComponent: any;
  public modalProperty: any;
  public pageName: string;

  public date = new Date();
  // start logic for today to past 28 day range
  // public year = this.past28Day.year();
  // public month = this.past28Day.month();
  // public day = this.past28Day.date();
  // end logic
  public year = this.date.getFullYear();
  public month = this.date.getMonth();
  public day = this.date.getDate();
  public firstDay = new Date(this.year, this.month, 1);
  public rolename: string = this.cookieService.get("rolename");
  public subsVar = new Subscription();

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, private cookieService: CookieService,
    private agentDashboardService: AgentDashboardService,
    private commonModalService: CommonModalService,
    private commonService: CommonService,
    private eventEmitterService: EventEmitterService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute) {
    // this.subsVar.add(this.eventEmitterService.invokeSearchResultPageComponentFunction.subscribe(
    //   (Obj: any) => {
    //     let index = this.properties.findIndex(t => t.PropertyDetailId == Obj.PropertyDetailId);
    //     if (Obj.Action && Obj.Action == "UpdateProperty") {
    //       this.getAgentProperties(this.AgentOptionId);
    //     } else if (Obj.Action == "ClaimProperty") {
    //       index > -1 ? this.properties[index].IsClaimed = true : false
    //       index > -1 ? this.properties[index].OwnerId = this.userId : false;
    //       index > -1 ? this.properties[index].Status = "Pre-market": false;
    //     } else if( Obj.Action == "TransferPropertyOwnership"){
    //       this.getAgentProperties(this.AgentOptionId);
    //     }
    //   }));
    this.username = this.localStorage.getItem("userame");
  }

  ngOnInit() {
    this.getAgentProperties(this.AgentOptionId);

    // this.subsVar.add(this.eventEmitterService.invokeSearchResultPageComponentFunction.subscribe(
    //   (Obj: any) => {
    //     let index = this.properties.findIndex(t => t.PropertyDetailId == Obj.PropertyDetailId);
    //     if (Obj.Action && Obj.Action == "UpdateProperty") {
    //       this.getAgentProperties(this.AgentOptionId);
    //     } else if (Obj.Action == "ClaimProperty") {
    //       if (this.AgentOptionId == 2) {
    //         if (this.rolename == "Agent" || this.rolename == "Agent_Admin") {
    //           let agentOption = this.agentOption.find(t => t.Id == 1);
    //           this.changeAgentOption(agentOption, this.properties[index]);
    //         }
    //       } else {
    //         index > -1 ? this.properties[index].IsClaimed = true : false
    //         index > -1 ? this.properties[index].OwnerId = this.userId : false;
    //         index > -1 ? this.properties[index].Status = "Pre-market" : false;
    //       }
    //       this.isLoaded = true;
    //     } else if (Obj.Action == "TransferPropertyOwnership") {
    //       this.getAgentProperties(this.AgentOptionId);
    //     }
    //   }));
    this.getAllAgentption();
    this.route.params.subscribe((params) => {
      if (params["pageName"] && params["Id"] && params["address"]) {
        let pageName = params["pageName"];
        let address = params["address"];
        let propDetailId = params["Id"];
        if (pageName == "edit") {
          this.commonModalService.openAddEditPropertyDialog("AddEditHomePhotoDescriptionComponent", propDetailId, address, true);
        } else if (pageName == "claimhome") {
          this.commonModalService.openClaimHomeDialog("ClaimHomeComponent", propDetailId, address, true);
        } else if (pageName == "uploadphoto") {
          this.commonModalService.openUploadPhotoDialog("UploadPhotoDescriptionComponent", propDetailId, address, true);
        } else if (pageName == "editdescription") {
          this.commonModalService.openUploadPhotoDialog("UploadPhotoDescriptionComponent", propDetailId, address, true, true);
        } else if (pageName == "propertyoffers") {
          this.commonModalService.openPropertyOffersDialog("PropertyOffersComponent", propDetailId, address, true);
        } else if (pageName == "transferowner") {
          this.commonModalService.openTransferOwnershipDialog("TransferOwnershipComponent", propDetailId, address, true);
        }
      } else if (params["pageName"]) {
        let pageName = params["pageName"];
        if (pageName == "terms") {
          this.commonModalService.openTermsDialog("TermsComponent", true);
        } else if (pageName == "privacy") {
          this.commonModalService.openTermsDialog("TermsComponent", true);
        }
      }
    });
  }

  getAgentProperties(AgentOptionId) {
    // for set date with (23:59:59) time
    let endDate = moment(this.date).endOf("day").toDate();
    let obj = {
      OwnerId: this.userId,
      AgentOptionId: AgentOptionId,
      StartDate: moment(this.firstDay.toString()).format("YYYY-MM-DD HH:mm:ss"),
      EndDate: moment(endDate.toString()).format("YYYY-MM-DD HH:mm:ss"),
      PageNum: this.PageNum
    }
    // this.properties = [];
    this.isLoaded = false;
    this.agentDashboardService.getAgentProperties(obj).subscribe((data: any) => {
      if (data.Success) {
        if(this.PageNum == 1){
          this.properties = [];
          this.properties = data.StateList;
        } else {
          if(this.totalHome != (this.PageSize * this.PageNum ))
          this.properties = this.properties.concat(data.StateList);
        }
        this.totalHome = this.properties.length;
        this.properties.forEach(element => {
          if (element.ComparativeInterest > element.HigherPerfomanceRange) {
            element.Performance = "Under average";
          } else if (element.ComparativeInterest >= element.LowerPerformanceRange) {
            element.Performance = "Average";
          } else {
            element.Performance = "Above average";
          }
        });
      } else {
        this.properties = [];
      }
      this.isLoaded = true;
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for agent module. Please login.", false);
        }
        this.isLoaded = true;
      });
  }

  getAllAgentption() {
    this.agentDashboardService.getAllAgentOptions().subscribe((data: any) => {
      if (data.Success) {
        this.agentOption = data.Model;
      } else {
        this.agentOption = [];
      }
      this.isLoaded = true;
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for agent module. Please login.", false);
        }
        this.isLoaded = true;
      });
  }

  tabChange(tab) {
    this.activeTab = tab;
    switch (tab) {
      case "listing":
        this.AgentOptionId = 1;
        break;
      case "salelead":
        this.AgentOptionId = 2;
        break;
      case "tracking":
        this.AgentOptionId = 3;
        break;
      default:
        break;
    }
    this.PageNum = 1;
    this.PreviousPageNum = 1;
    this.getAgentProperties(this.AgentOptionId);
  }

  getRandom() {
    return Math.floor(Math.random() * 10) + 1;
  }

  OnRenewClaimLinkClick(home: AgentProperty) {
    // // this.isLoaded = false;
    // let queryObject = {};
    // queryObject["PropertyDetailId"] = home.PropertyDetailId;
    // queryObject["OwnerId"] = this.userId;
    // queryObject["Address"] = home.Address;
    // this.agentDashboardService.renewClaim(queryObject).subscribe(data => {
    //   if (data.Success) {
    //     let index = this.properties.findIndex(t => t.PropertyDetailId == home.PropertyDetailId);
    //     index > -1 ? this.properties[index].DayLeft = 28 : false;
    //     let ToastMessage = "You have successfully renewed your claim of " + home.Address + " for the next 28 days. A confirmation email has been sent to you.";
    //     this.commonService.toaster(ToastMessage, true)
    //   } else {
    //     this.commonService.toaster("Something went to wrong.", false);
    //   }
    //   // this.isLoaded = true;
    // },
    //   error => {
    //     // this.commonService.toaster(error.statusText, false);
    //     console.log(error);
    //     if (error.status == 401) {
    //       this.commonService.toaster("You have not access for agent module. Please login.", false);
    //     }
    //   });
  }

  // Open modal popup function start
  onEditAddPhotoDescriptionLinkClick(prop: AgentProperty) {
    // let url = this.router.url.split("/");
    // this.pageName = url[2];
    // this.modalProperty = prop;
    // this.modalComponent = AddEditHomePhotoDescriptionComponent;
    // let address = prop.Address + ", " + prop.Suburb + ", " + prop.City;
    // if (typeof this.window !== 'undefined' && this.window.history) {
    //   this.window.history.pushState(null, null, "agent/" + this.pageName + '/edit/' + address.replace(/[\W_]/g, "-") + "/" + prop.PropertyDetailId + "/" + this.getRandom());
    // }
    // this.commonModalService.openAddEditPropertyDialog("AddEditHomePhotoDescriptionComponent", prop.PropertyDetailId, address, true);
  }

  onClaimPropertyLinkClick(prop: AgentProperty) {
    // let url = this.router.url.split("/");
    // this.pageName = url[2];
    // this.modalProperty = prop;
    // this.modalComponent = ClaimHomeComponent;
    // let address = prop.Address + ", " + prop.Suburb + ", " + prop.City;
    // if (typeof this.window !== 'undefined' && this.window.history) {
    //   this.window.history.pushState(null, null, "agent/" + this.pageName + '/claimhome/' + address.replace(/[\W_]/g, "-") + "/" + prop.PropertyDetailId + "/" + this.getRandom());
    // }
    // this.commonModalService.openClaimHomeDialog("ClaimHomeComponent", prop.PropertyDetailId, address, true);
  }

  onPropertyOffersOptionClick(prop: AgentProperty) {
    // let url = this.router.url.split("/");
    // this.pageName = url[2];
    // this.modalComponent = PropertyOffersComponent;
    // let address = prop.Address + ", " + prop.Suburb + ", " + prop.City;
    // if (typeof this.window !== 'undefined' && this.window.history) {
    //   this.window.history.pushState(null, null, "agent/" + this.pageName + '/propertyoffers/' + address.replace(/[\W_]/g, "-") + "/" + prop.PropertyDetailId + "/" + this.getRandom());
    // }
    // this.commonModalService.openPropertyOffersDialog("PropertyOffersComponent", prop.PropertyDetailId, address, true);
  }

  onMoveToSakesLeadProperty(prop: AgentProperty) {
    // const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
    //   width: "400px"
    // });
    // dialogConfirmRef.componentInstance.message =
    //   "<p class='mb-0'> Are you sure you want to move property to sales lead?</p>";
    // dialogConfirmRef.componentInstance.PropertyDetailId = prop.PropertyDetailId;
    // dialogConfirmRef.componentInstance.btnText1 = "Yes";
    // dialogConfirmRef.componentInstance.btnText2 = "No";
    // dialogConfirmRef.componentInstance.pageName = "AgentDashboard";
    // dialogConfirmRef.componentInstance.url1 = "yes";
    // dialogConfirmRef.componentInstance.agentOptionId = 2;

    // dialogConfirmRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.commonService.toaster("Move property to sales lead successfully.", true);
    //     // this.getAgentProperties(this.AgentOptionId);
    //     let index = this.properties.findIndex(t => t.PropertyDetailId == prop.PropertyDetailId && t.Address == prop.Address);
    //     this.properties.splice(index, 1);
    //   }
    // });
  }

  onMoveToTrackProperty(prop: AgentProperty) {
    // const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
    //   width: "400px"
    // });
    // dialogConfirmRef.componentInstance.message =
    //   "<p class='mb-0'> Are you sure you want to move property to tracking?</p>";
    // dialogConfirmRef.componentInstance.PropertyDetailId = prop.PropertyDetailId;
    // dialogConfirmRef.componentInstance.btnText1 = "Yes";
    // dialogConfirmRef.componentInstance.btnText2 = "No";
    // dialogConfirmRef.componentInstance.pageName = "AgentDashboard";
    // dialogConfirmRef.componentInstance.url1 = "yes";
    // dialogConfirmRef.componentInstance.agentOptionId = 3;

    // dialogConfirmRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.commonService.toaster("Move property to tracking successfully.", true);
    //     let index = this.properties.findIndex(t => t.PropertyDetailId == prop.PropertyDetailId && t.Address == prop.Address);
    //     this.properties.splice(index, 1);
    //   }
    // });
  }

  onDelistProperty(prop: AgentProperty) {
    // let address = prop.Address + ", " + prop.Suburb + ", " + prop.City;
    // let agentOption = this.agentOption.find(t => t.Id == 3);
    // const dialogConfirmRef = this.dialog.open(AuthMessageComponent, {
    //   width: "400px"
    // });
    // dialogConfirmRef.componentInstance.title = "Delist property";
    // dialogConfirmRef.componentInstance.message =
    //   "By clicking delist you agree you want to cancel your listing of " + address + " and move to " + "<span Class='text-lowercase'>" + agentOption.Option + "</span>.";
    // dialogConfirmRef.componentInstance.PropertyDetailId = prop.PropertyDetailId;
    // dialogConfirmRef.componentInstance.btnText1 = "Delist";
    // dialogConfirmRef.componentInstance.pageName = "SearchResultPage";
    // dialogConfirmRef.componentInstance.url1 = "yes";

    // dialogConfirmRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     let Obj = {
    //       PropertyDetailId: prop.PropertyDetailId
    //     }
    //     this.agentDashboardService.unClaim(Obj).subscribe((data: any) => {
    //       if (data.Success) {
    //         let agentOption = this.agentOption.find(t => t.Id == 3);
    //         this.commonService.toaster("Agent option update successfully.", true);
    //         this.changeAgentOption(agentOption, prop);
    //       }
    //     },
    //       error => {
    //         // this.commonService.toaster(error.statusText, false);
    //         console.log(error);
    //         if (error.status == 401) {
    //           this.commonService.toaster("You have not access for agent module. Please login.", false);
    //         }
    //       });
    //   }
    // });
  }

  onTransferOwnerShipOptionLinkClick(prop: AgentProperty) {
    // let url = this.router.url.split("/");
    // this.pageName = url[2];
    // this.modalComponent = TransferOwnershipComponent;
    // let address = prop.Address + ", " + prop.Suburb + ", " + prop.City;
    // if (typeof this.window !== 'undefined' && this.window.history) {
    //   this.window.history.pushState(null, null, "agent/" + this.pageName + '/transferowner/' + address.replace(/[\W_]/g, "-") + "/" + prop.PropertyDetailId + "/" + this.getRandom());
    // }
    // this.commonModalService.openTransferOwnershipDialog("TransferOwnershipComponent", prop.PropertyDetailId, address, true);
  }

  receiveDateRange(event) {
    // let startDate = new Date(event.startDate);
    // let endDate = new Date(event.endDate);
    if (event.startDate == "" && event.endDate == "") {
      this.firstDay = new Date(this.year, this.month, 1);
    }
    this.date = event.endDate;
    this.firstDay = event.startDate;
    this.getAgentProperties(this.AgentOptionId);
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
    this.agentDashboardService.updateAgentOption(Obj).subscribe((data: any) => {
      if (data.Success) {
        let index = this.properties.findIndex(t => t.PropertyDetailId == property.PropertyDetailId);
        index > -1 ? this.properties.splice(index, 1) : false;
      } else {
        this.commonService.toaster(data.ErrorMessage, false);
      }
    });
  }

  onScroll(event: any): void {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      this.onScrollEnd();
    }
  }

  onScrollEnd(isLoad?: boolean) {
    if (this.totalHome == this.PageSize * this.PageNum) {
      this.PreviousPageNum = this.PageNum;
      this.PageNum += 1;
      if(this.PreviousPageNum != this.PageNum){
        this.getAgentProperties(this.AgentOptionId);
      }
    }
  }

  ngOnDestroy(): any {
    this.subsVar.unsubscribe();
  }

}
