import {
  Component,
  OnInit,
  ViewChild,
  Pipe,
  PipeTransform,
  EventEmitter,
  Output,
  Input,
  ViewContainerRef,
  ComponentFactoryResolver,
  OnDestroy, Inject
} from "@angular/core";
import { HomeForm } from "./add-edit-home-photo-description";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DatePipe, DecimalPipe } from "@angular/common";
import { UploadPhotoDescriptionComponent } from "../upload-photo-description/upload-photo-description.component";
import { AddEditHomePhotoDescriptionService } from "./add-edit-home-photo-description.service";
import { CommonService } from "../../../app/core/services/common.service";
import { BsDropdownDirective } from "ngx-bootstrap/dropdown";
import { Promise } from "q";
import { EventEmitterService } from "../../../app/event-emitter.service";
import { CookieService } from "ngx-cookie-service";
import { MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";
import { CommonModalService } from "../../../app/common-modal.service";
import { Subscription } from "rxjs";
import { WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: "addEditHomePhotoDescriptionModal",
  templateUrl: "./add-edit-home-photo-description.component.html",
  styleUrls: ["./add-edit-home-photo-description.component.css"],
  providers: [DatePipe, DecimalPipe, BsDropdownDirective]
})
export class AddEditHomePhotoDescriptionComponent implements OnInit, OnDestroy {
  @ViewChild("uploadPhoto", { read: ViewContainerRef, static: false }) entry: ViewContainerRef;
  @Input() propertyVar: any;
  @Output() onUpdatePropertyDetail = new EventEmitter<any>();

  public form: HomeForm;
  public fileData: File;
  public weekDays: any = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  imageFileForm: FormGroup;
  public imageUrl: any;
  public isForSaleStatusCheck: boolean;
  public isPreMarketStatusCheck: boolean;
  public PropertyDetailId: number;
  public PropertyAddress: string;
  public isLoaded: boolean;
  public userId: number;
  public isUserExist: boolean;
  public modalComponent: any;
  public pageName: string;
  public isFormSubmit: boolean;
  public _unsubscribeAll = new Subscription();
  public module = "edit property module";

  constructor(@Inject(WINDOW) private window: Window, 
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private resolver: ComponentFactoryResolver,
    private addEditHomePhotoDescriptionService: AddEditHomePhotoDescriptionService,
    private commonService: CommonService,
    private eventEmitterService: EventEmitterService,
    private cookieService: CookieService,
    public dialogRef: MatDialogRef<AddEditHomePhotoDescriptionComponent>,
    private router: Router,
    private commonModalService: CommonModalService
  ) { }

  ngOnInit() {
    this.isUserExist = this.cookieService.check("user");
    this.isUserExist ? this.userId = +this.cookieService.get("user") : this.userId = null;
    this.getPropertyDetail(this.PropertyDetailId);
  }

  close() {
    this.form = new HomeForm();
    this.form.HomeType = "for sale";
    this.dialogRef.close(false);
  }

  onTimePickerModelChange() {
    this.form.Time = this.datePipe.transform(this.form.Time, "shortTime");
  }

  onAddPhotoDescriptionModelBtnClick() {
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
      this.window.history.pushState(null, null, "agent/" + this.pageName + '/uploadphoto/' + this.PropertyAddress.replace(/[\W_]/g, "-") + "/" + this.PropertyDetailId + "/" + this.getRandom());
      }
      this.commonModalService.openUploadPhotoDialog("UploadPhotoDescriptionComponent", this.PropertyDetailId, this.PropertyAddress, true);
    } else {
      if (typeof this.window !== 'undefined' && this.window.history) {
      this.window.history.pushState(null, null, this.pageName + '/uploadphoto/' + this.PropertyAddress.replace(/[\W_]/g, "-") + "/" + this.PropertyDetailId + "/" + this.getRandom());
      }
      this.commonModalService.openUploadPhotoDialog("UploadPhotoDescriptionComponent", this.PropertyDetailId, this.PropertyAddress);
    }
  }

  onAddPhotoDescriptionUpdateBtnClick() {
    if (this.form.IsOpenHome) {
      if (this.form.Day == null || this.form.Time == null) {
        this.isFormSubmit = true;
        return false;
      }
    }
    let PropertyDetailId = this.form.PropertyDetailId;
    let isExist = this.form.HomebuzzEstimate.includes("$ ");
    if (isExist) {
      this.form.HomebuzzEstimate = this.form.HomebuzzEstimate.split("$ ")[1];
      this.form.HomebuzzEstimate = this.form.HomebuzzEstimate.replace(/,/g, "");
    }
    if (this.form.AskingPrice) {
      this.form.AskingPrice = this.form.AskingPrice.trim();
      let isExist = this.form.AskingPrice.includes("$");
      if (isExist) {
        this.form.AskingPrice = this.form.AskingPrice.split("$")[1];
        this.form.AskingPrice = this.form.AskingPrice.replace(/,/g, "");
      }
    }
    if (this.form.IsShowAskingPrice) {
      let askingprice = (this.form.AskingPrice)
      if (askingprice == null || askingprice == ' ' || askingprice == '') {
        askingprice == ' ' ? this.form.AskingPrice = this.form.AskingPrice.trim() : false;
        this.isFormSubmit = true;
        return false;
      }
    }
    if (!this.form.IsOpenHome) {
      this.form.Day = null;
      this.form.Time = null;
    }
    let form = this.form;
    this._unsubscribeAll.add(this.addEditHomePhotoDescriptionService.updatePropertyDetail(this.form).subscribe(data => {
      if (data.Success) {
        this.commonService.toaster(`You have successfully updated ${form.Address} details.`, true);
        this.form = new HomeForm();
        this.form.HomeType = "for sale";
        this.dialogRef.close(false);
        this.eventEmitterService.onGetPropertyEventEmmit(PropertyDetailId, "UpdateProperty", form);
      } else {
        this.commonService.toaster("Something went to wrong.", false);
      }
    },
      error => {
        // // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for " + this.module + ". Please login", false);
          this.close();
        }
        this.isLoaded = true;
      }));
  }

  onForstatusChange(event) {
    this.isForSaleStatusCheck = event.target.checked;
    if (this.isForSaleStatusCheck) {
      this.form.HomeType = "for sale";
      this.isPreMarketStatusCheck = false;
      // this.form.IsShowAskingPrice = true;
    } else {
      this.form.HomeType = "pre market";
      this.form.IsShowAskingPrice = false;
      this.form.IsOpenHome = false;
      this.isPreMarketStatusCheck = true;
    }
  }

  onPreMarketChange(event){
    this.isPreMarketStatusCheck = event.target.checked;
    if (this.isPreMarketStatusCheck) {
      this.form.HomeType = "pre market";
      this.isForSaleStatusCheck = false;
      this.form.IsShowAskingPrice = false;
      this.form.IsOpenHome = false;
    } else {
      this.form.HomeType = "for sale";
      this.form.IsShowAskingPrice = true;
      this.form.IsOpenHome = true;
      this.isForSaleStatusCheck = true;
    }
  }

  onOptionsSelected(event) {
    var day = event.target.value.split(": ");
    this.form.Day = day[1];
  }

  getPropertyDetail(propDetailId) {
    this._unsubscribeAll.add(this.addEditHomePhotoDescriptionService.getPropertyDetail(propDetailId, this.userId).subscribe((data: any) => {
      if (data.Success) {
        this.propertyVar = data.Model;
        this.initialize();
      }
    },
      error => {
        console.log(error)
        // // this.commonService.toaster(error.statusText, false);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for " + this.module + ". Please login.", false);
          this.close();
        }
      }));
  }

  initialize() {
    this.form = new HomeForm();
    let property = this.propertyVar;
    this.form.PropertyDetailId = this.propertyVar.PropertyDetailId;
    this.form.HomebuzzEstimate = "$ " + this.decimalPipe.transform(parseInt(property.HomebuzzEstimate), "");
    // if (property.AskingPrice === null || !property.AskingPrice) {
    //   // this.form.AskingPrice = "$ " + this.decimalPipe.transform(parseInt(property.HomebuzzEstimate), "");
    // } else {
    //   this.form.AskingPrice = "$ " + this.decimalPipe.transform(parseInt(property.AskingPrice), "");
    // }
    this.form.HomeType = property.Status && property.Status.includes("sale") ? "for sale" : "pre market";
    this.form.HomeType === "for sale" ? this.isForSaleStatusCheck = true : this.isForSaleStatusCheck = false;
    this.form.HomeType === "for sale" ? this.isPreMarketStatusCheck = false : this.isPreMarketStatusCheck = true;
    if (property.AskingPrice === null || !property.AskingPrice) {
      this.form.AskingPrice = "$ "
    }
    this.form.Bedrooms = property.Bedrooms;
    this.form.Bathrooms = parseInt(property.Bathrooms);
    this.form.Carparks = property.Carparks;
    this.form.Landarea = property.Landarea;
    this.form.IsOpenHome = property.IsOpenHome;
    if (this.isForSaleStatusCheck) {
      if (this.form.IsOpenHome) {
        this.form.Time = property.Time;
        this.form.Day = property.Day;
      }
      this.form.IsShowAskingPrice = property.IsShowAskingPrice;
      if (this.form.IsShowAskingPrice) {
        this.form.AskingPrice = "$ " + this.decimalPipe.transform(parseInt(property.AskingPrice), "");
      }
    } else {
      this.form.IsShowAskingPrice = false;
      this.form.IsOpenHome = false;
    }
    this.form.Address = property.Address;
    this.form.Suburb = property.Suburb;
    this.form.City = property.City;
    this.isLoaded = true;
  }

  checkPrice(event) {
    if (event.target.value === "askingprice") {
      this.form.IsShowAskingPrice = true;
    } else {
      this.form.IsShowAskingPrice = false;
    }
  }

  checkOpenHome(event) {
    this.form.IsOpenHome = event.checked;
  }

  getRandom() {
    return Math.floor(Math.random() * 10) + 1;
  }

  ngOnDestroy() {
    this._unsubscribeAll.unsubscribe();
  }
}
