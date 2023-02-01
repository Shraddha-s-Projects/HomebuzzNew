import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FileUploadService } from './file-upload.service';
import { CommonService } from 'src/app/core/services/common.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  public file: File;
  public isLoader: boolean;
  public isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookieService: CookieService,
    private fileUploadService: FileUploadService,
    private commonService: CommonService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
   }

  ngOnInit() {
  }

  uploadFile(isDrag, event) {
    if (isDrag) {
      this.file = event[0];
    } else {
      this.file = event.target.files[0];
    }
  }

  saveFile() {
    let Obj: any = {};
    Obj["UserId"] = +this.cookieService.get("user");
    Obj["File"] = this.file;
    this.isLoader = true;
    this.fileUploadService.saveMasterFile(Obj).subscribe((data: any) => {
      if (data.Success) {
        this.commonService.toaster(`You have successfully upload file.`, true);
      } else {
        this.commonService.toaster(data.ErrorMessage, false);
      }
      this.isLoader = false;
    });
  }

}
