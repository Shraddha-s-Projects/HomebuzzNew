import { Component, OnInit, ViewChild, EventEmitter, Output, Input, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-share-property',
  templateUrl: './share-property.component.html',
  styleUrls: ['./share-property.component.css']
})
export class SharePropertyComponent implements OnInit {
  public isCopied: boolean = false;
  public shareUrl: any;
  @Output() onPrivacyPolicyEvent = new EventEmitter<any>();
  constructor(@Inject(WINDOW) private window: Window, public dialogRef: MatDialogRef<SharePropertyComponent>,
    private router: Router,
    private location: Location) { }

  ngOnInit() {
    this.shareUrl = this.location.path(false);
    console.log("origin", location.origin);
  }

  close() {
    let url = this.shareUrl.split("/");
    if(url[1]== "property" && url[2]== "share"){
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(false);
    }
  }

  shareURL(url: string) {
    var sharableUrl = "";
    var targetName = "";
    switch (url) {
      case 'facebook':
        sharableUrl = 'https://www.facebook.com/dialog/share?app_id=1055149084843117&display=popup';
        break;
      case "twitter":
        if(location.origin == "http://203.192.235.219:9091"){
          sharableUrl =
          "https://twitter.com/intent/tweet?text=" +
          encodeURIComponent(location.origin + "/web" + this.location.path(false));
        } else {
          sharableUrl =
          "https://twitter.com/intent/tweet?text=" +
          encodeURIComponent(location.origin + this.location.path(false));
        }
 
        targetName = "Twitter Share";
        break;
      default:
        break;
    }
    let sizingParams = "width=" + (this.window.innerWidth * 80) / 100;
    sizingParams += ",height=" + (this.window.innerHeight * 80) / 100;
    this.window.open(sharableUrl, targetName, sizingParams);
  }

  copyURL() {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    if(location.origin == "http://203.192.235.219:9091"){
      selBox.value = location.origin + "/web"+ this.location.path(false);
    } else {
      selBox.value = location.origin + this.location.path(false);
    }
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    this.isCopied = true;
    document.body.removeChild(selBox);
  }
}
