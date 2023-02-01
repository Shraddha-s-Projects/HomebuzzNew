import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy, Inject, PLATFORM_ID } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { MyLikesService } from "./my-likes.service";
import { PropertyLike } from "../../../app/pages/search-result-page/search-result-page";
import { SearchResultPageService } from "../../../app/pages/search-result-page/search-result-page.service";
import { CommonService } from "../../../app/core/services/common.service";
import { EventEmitterService } from "../../../app/event-emitter.service";
import { MatDialogRef } from "@angular/material";
import { Subscription } from "rxjs";
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: "myLikesModal",
  templateUrl: "./my-likes.component.html",
  styleUrls: ["./my-likes.component.css"]
})
export class MyLikesComponent implements OnInit, OnDestroy {

  @Output() likeoutput: EventEmitter<any> = new EventEmitter<any>();
  public userId: string;
  public isBrowser: boolean;

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    public dialogRef: MatDialogRef<MyLikesComponent>,
    private myLikesService: MyLikesService,
    private searchResultPageService: SearchResultPageService,
    private commonService: CommonService,
    private eventEmitterService: EventEmitterService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.userId = this.localStorage.getItem("userId");
  }


  public myLikedHomes: any = [];
  public IsDisable: boolean = false;
  public isLoaded: boolean = false;
  public module = "my likes module";
  public _unsubscribeAll = new Subscription();

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if(this.userId){
        this.open();
      } else {
        this.isLoaded = true; 
      }  
    }
  }

   open() {
    this._unsubscribeAll.add(this.myLikesService.getMyLikedHomes(this.userId).subscribe(data => {
      if (data.Success) {
        this.myLikedHomes = data.Model;
        this.isLoaded = true;
      } else {
        this.commonService.toaster("Something went to wrong.", false);
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for my likes module. Please login.", false);
          this.close();
        }
        this.isLoaded = true;
      }));
  }

  close() {
    this.dialogRef.close(false);
  }

  OnUnlikeLinkClick(property: any) {
    this.IsDisable = true;
    let obj = new PropertyLike();
    obj.PropertyDetailId = property.PropertyDetailId;
    obj.UserId = parseInt(this.userId);
    this._unsubscribeAll.add(this.searchResultPageService.likeProperty(obj).subscribe(data => {
      if (data.Success) {
        let ToastMessage = `You have successfully unliked ${property.Address}.`;
        this.commonService.toaster(ToastMessage, true);
        this.myLikedHomes = this.myLikedHomes.filter(ml => ml.PropertyDetailId !== data.Model.PropertyDetailId);
        this.IsDisable = false;
        this.eventEmitterService.onGetPropertyEventEmmit(property.PropertyDetailId, "Dislike");
        //   this.likeoutput.emit(property);
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for my likes module. Please login.", false);
          this.close();
        }
        this.IsDisable = false;
      }));
  }

  ngOnDestroy() {
    this._unsubscribeAll.unsubscribe();
  }
}
