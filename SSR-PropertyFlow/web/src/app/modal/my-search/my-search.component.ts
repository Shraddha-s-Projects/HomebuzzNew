import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Output, EventEmitter, Inject } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { EventEmitterService } from "../../event-emitter.service";
import { CommonService } from "../../../app/core/services/common.service";
import { MySearchService } from "./my-search.service";
import { MySearch, PropertyStatus } from "./my-search";
import { Router } from "@angular/router";
import { MatDialogRef } from "@angular/material";
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Component({
    selector: "mySearchModal",
    templateUrl: "./my-search.component.html",
    styleUrls: ["./my-search.component.css"]
})
export class MySearchComponent implements OnInit {
    @ViewChild("MySearches", { static: false }) modal: ModalDirective;
    @ViewChild("removeOffer", { read: ViewContainerRef, static: false }) removeOffer: ViewContainerRef;
    public userId: string;
    public mySearchedHomes: MySearch[] = [];
    public propertyStatus: PropertyStatus[] = [];
    public isLoaded: boolean = false;

    constructor(@Inject(LOCAL_STORAGE) private localStorage: any,
        private commonService: CommonService,
        private resolver: ComponentFactoryResolver,
        private eventEmitterService: EventEmitterService,
        private mySearchService: MySearchService,
        private router: Router,
        public dialogRef: MatDialogRef<MySearchComponent>
    ) {
        this.userId = this.localStorage.getItem("userId");
    }

    ngOnInit() {
        this.getAllPropertyStatus();
        if (this.userId) {
            this.open();
        } else {
            this.isLoaded = true;
        }
    }

    open() {
        this.mySearchService.getMySearchedHomes(this.userId).subscribe(data => {
            if (data.Success) {
                this.mySearchedHomes = data.Model;
                this.mySearchedHomes.forEach(element => {
                    if (element.PropertyStatus === "5") {
                        element.PropertyStatusList = 'All active properties';
                    }
                    else if (element.PropertyStatus) {
                        let propertyStatusIdArr = element.PropertyStatus.split(',');
                        propertyStatusIdArr.forEach(proStatusId => {
                            let statusObj = this.propertyStatus.find(t => t.Id == +proStatusId);
                            let status;
                            if (statusObj) {
                                status = statusObj.Name;
                            }
                            // let status  = this.propertyStatus.find(t => t.Id == +proStatusId).Name;
                            if (element.PropertyStatusList == null || element.PropertyStatusList == '') {
                                element.PropertyStatusList = status;
                            } else {
                                element.PropertyStatusList = element.PropertyStatusList + ', ' + status;
                            }
                        });
                    } else {
                        element.PropertyStatusList = "";
                    }
                });
                this.isLoaded = true;
            }
        },
            error => {
                // this.commonService.toaster(error.statusText, false);
                console.log(error);
                if (error.status == 401) {
                    this.commonService.toaster("You have not access for my searches module. Please login.", false);
                    this.close();
                }
                this.isLoaded = true;
            });
    }

    onRemoveMySearch(search) {
        this.mySearchService.removeMySearchedHomes(search.Id).subscribe(data => {
            if (data.Success) {
                let removedSeachedHome = data.Model;
                let index = this.mySearchedHomes.findIndex(t => t.Id == removedSeachedHome.Id);
                index > -1 ? this.mySearchedHomes.splice(index, 1) : false;
                let ToastMessage = `You have successfully removed ${data.Model.Address}.`;
                this.commonService.toaster(ToastMessage, true);
                this.eventEmitterService.onSideBarMenuRefresh();
            } else {
                let ToastMessage = data.ErrorMessage;
                this.commonService.toaster(ToastMessage, false);
            }
        },
            error => {
                // this.commonService.toaster(error.statusText, false);
                console.log(error);
                if (error.status == 401) {
                    this.commonService.toaster("You have not access for my searches module. Please login.", false);
                    this.close();
                }
            });
    }

    close() {
        this.dialogRef.close(false);
    }

    getAllPropertyStatus() {
        this.mySearchService.getAllPropertyStatus().subscribe(data => {
            if (data.Success) {
                this.propertyStatus = data.Model;
            } else {
                this.propertyStatus = [];
            }
        },
            error => {
                // this.commonService.toaster(error.statusText, false);
                console.log(error);
                if (error.status == 401) {
                    this.commonService.toaster("You have not access for my searches module. Please login.", false);
                    this.close();
                }
            });
    }

    searchHome(home) {
        this.dialogRef.close(home);
        // this.router.navigate(['/property'], { queryParams: { SearchId: home.Id } });
    }
}
