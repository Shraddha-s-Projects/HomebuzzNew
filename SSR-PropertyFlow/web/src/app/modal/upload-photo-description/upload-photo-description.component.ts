import { Component, OnInit, ViewChild, Input, ViewContainerRef, ComponentFactoryResolver, Inject } from "@angular/core";
import { NgImageSliderComponent } from "ng-image-slider";
import { UploadPhotoDescriptionService } from "../upload-photo-description/upload-photo-description.service";
import { CommonService } from "../../core/services/common.service";
import { PropertyDetail } from "../../../app/pages/search-result-page/search-result-page";
import { EventEmitterService } from "../../../app/event-emitter.service";
import { environment } from "../../../environments/environment";
import { MatDialogRef } from "@angular/material";
import { AddEditHomePhotoDescriptionService } from "../add-edit-home-photo-description/add-edit-home-photo-description.service";
import { CookieService } from "ngx-cookie-service";
import { SlideInOutAnimation } from './animates';

const APIURL = environment.APIURL.toString();
const _ImageUrl = APIURL + "/PropertyDetail/PropertyImages?ImageId=";

@Component({
  selector: "app-upload-photo-description",
  templateUrl: "./upload-photo-description.component.html",
  styleUrls: ["./upload-photo-description.component.css"],
  animations: [SlideInOutAnimation]
})
export class UploadPhotoDescriptionComponent implements OnInit {
  @ViewChild("nav", { read: ViewContainerRef, static: false }) ds: NgImageSliderComponent;
  @Input() property: any;
  public urls: any = [];
  public isHidePhotoUploadDiv: boolean;
  public isTextAreaDisplay: boolean = true;
  public isUploading: boolean;
  public isUploaded: boolean;
  public propertyImage: any = [];
  public propertyDetailId: number;
  public address: string;
  public userId: number;
  public isUserExist: boolean;
  showSlider: boolean;
  imageObject = [];
  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    method: {},
    infinite: false
  };
  description: string;
  animationState = 'out';

  constructor(
    private uploadPhotoDescriptionService: UploadPhotoDescriptionService,
    private commonService: CommonService,
    private eventEmitterService: EventEmitterService,
    public dialogRef: MatDialogRef<UploadPhotoDescriptionComponent>,
    private addEditHomePhotoDescriptionService: AddEditHomePhotoDescriptionService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.imageObject = [];
    this.isUserExist = this.cookieService.check("user");
    this.isUserExist ? this.userId = +this.cookieService.get("user") : this.userId = null;
    this.getPropertyDetail(this.propertyDetailId);
    setTimeout(() => {
      if (this.imageObject.length > 0) this.showSlider = true;
    }, 1000);
  }

  close() {
    this.dialogRef.close(false);
  }

  getPropertyDetail(propDetailId) {
    this.addEditHomePhotoDescriptionService.getPropertyDetail(propDetailId, this.userId).subscribe((data: any) => {
      if (data.Success) {
        this.property = data.Model;
        if (this.property.ImageIdList) {
          this.description = this.property.Description;
          this.property.ImageIdList.forEach(element => {
            let object = new Object();
            let imgURL = _ImageUrl + element;
            object["thumbImage"] = imgURL;
            object["id"] = element;
            this.imageObject.push(object);
          });
        }
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for property image module. Please login.", false);
          this.close();
        }
      });
  }

  onselectFileChange(e) {
    this.detectFiles(e);
  }

  detectFiles(event) {
    let files = event.target.files;
    if (files.length > 0) {
      this.showSlider = false;
      this.isUploaded = false;
      let i = 0;
      for (let file of files) {
        this.propertyImage.push(file);
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let object = new Object();
        reader.onload = _event => {
          let imgURL = reader.result;
          object["thumbImage"] = imgURL;
        };
        object["id"] = i;
        this.imageObject.push(object);
        i++;
      }
      setTimeout(() => {
        if (this.imageObject.length > 0) this.showSlider = true;
      }, 1000);
    }
  }

  onRemoveSlidePhotoBtnClick(imageObj: any) {
    this.imageObject.forEach(slide => {
      if (slide.id == imageObj.id) {
        let index = this.imageObject.indexOf(slide);
        this.imageObject.splice(index, 1);
        this.propertyImage.splice(index, 1);
      }
    });
    let isUploaded = imageObj.thumbImage.includes("data:image/");
    if (!isUploaded) {
      this.uploadPhotoDescriptionService.removePhoto(imageObj.id).subscribe(data => {
        if (data.Success) {
          this.commonService.toaster("Image removed successfully.", true);
          this.eventEmitterService.onGetPropertyEventEmmit(this.property.PropertyDetailId, "RemoveImage", data.Model);
        } else {
          this.commonService.toaster("Something went to wrong.", false);
        }
      },
        error => {
          // this.commonService.toaster(error.statusText, false);
          console.log(error);
          if (error.status == 401) {
            this.commonService.toaster("You have not access for property image module. Please login.", false);
            this.close();
          }
        });
    }
    // else {
    //   this.commonService.toaster("Image removed successfully.", true);
    // }
  }

  onAddDescriptionBtnClick() {
    this.isTextAreaDisplay == true ? (this.isTextAreaDisplay = false) : (this.isTextAreaDisplay = true);
  }

  onUploadBtnClick() {
    let uploadObject = {};
    this.isUploading = true;
    uploadObject["files"] = this.propertyImage;
    uploadObject["id"] = this.property.PropertyDetailId;
    this.uploadPhotoDescriptionService.uploadPropertyPhoto(uploadObject).subscribe(data => {
      if (data) {
        this.isUploading = false;
        this.isUploaded = true;
        let object = new Object();
        this.imageObject = [];
        data.Model.forEach(element => {
          let object = new Object();
          let imgURL = _ImageUrl + element.Id;
          object["thumbImage"] = imgURL;
          object["id"] = element.Id;
          this.imageObject.push(object);
        });
        let imageList = [];
        data.Model.forEach(element => {
          element.Id ? imageList.push(element.Id.toString()) : false;
        });

        this.animationState = "in";
        setTimeout(() => {
          this.animationState = "out";
        }, 2500);
        this.eventEmitterService.onGetPropertyEventEmmit(this.property.PropertyDetailId, "UploadImage", imageList);
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for property image module. Please login.", false);
          this.close();
        }
      });
  }

  onAddPhotoDescriptionSaveBtnClick() {
    let propertyObject = new PropertyDetail();
    propertyObject.Id = this.property.PropertyDetailId;
    propertyObject["Description"] = this.description;
    this.uploadPhotoDescriptionService.savePropertyDescription(propertyObject).subscribe(data => {
      if (data.Success) {
        this.commonService.toaster("Description Saved!", true);
        this.eventEmitterService.onGetPropertyEventEmmit(this.property.PropertyDetailId, "UpdateDesc", data.Model);
        this.close();
      } else {
        this.commonService.toaster("Something went to wrong.", false);
      }
    },
      error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for property image module. Please login.", false);
          this.close();
        }
      });
  }
}
