import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CommonModalService } from 'src/app/common-modal.service';
import { EventEmitterService } from 'src/app/event-emitter.service';
import { SharePropertyComponent } from 'src/app/modal/share-property/share-property.component';

@Component({
  selector: 'app-seller-read-more',
  templateUrl: './seller-read-more.component.html',
  styleUrls: ['./seller-read-more.component.css']
})
export class SellerReadMoreComponent implements OnInit, AfterViewInit {

  public pageName: string;
  public currentYear = moment(new Date()).format('YYYY');
  constructor(private router: Router,
    private route: ActivatedRoute,
    private commonModalService: CommonModalService,
    private eventEmitterService: EventEmitterService,
    public dialog: MatDialog,) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params["pageName"]) {
        let pageName = params["pageName"];
        // if (pageName == "terms") {
        //   this.commonModalService.openTermsDialog("TermsComponent");
        // } else if (pageName == "privacy") {
        //   this.commonModalService.openPrivacyDialog("PrivacyPolicyComponent");
        // } else 
        if (pageName == "estimate") {
          this.commonModalService.openEstimateDialog("HomebuzzEstimatesComponent");
        } else if (pageName == "mylikes") {
          this.commonModalService.openMyLikesDialog("MyLikesComponent");
        } else if (pageName == "myhomes") {
          this.commonModalService.openMyHomesDialog("MyHomesComponent");
        } else if (pageName == "myoffers") {
          this.commonModalService.openMyOffersDialog("MyOffersComponent")
        } else if (pageName == "mysearches") {
          this.commonModalService.openMySearchesDialog("MySearchComponent");
        }
      }
    });
  }

  onTermsOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    window.history.pushState(null, null, this.pageName + '/terms' + "/" + this.getRandom());
    this.commonModalService.openTermsDialog("TermsComponent");
  }

  onPrivacyOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    window.history.pushState(null, null, this.pageName + '/privacy' + "/" + this.getRandom());
    this.commonModalService.openPrivacyDialog("PrivacyPolicyComponent");
  }

  onHomebuzzEstimatesOptionClick() {
    let url = this.router.url.split("/");
    this.pageName = url[1];
    window.history.pushState(null, null, this.pageName + '/estimate' + "/" + this.getRandom());
    this.commonModalService.openEstimateDialog("HomebuzzEstimatesComponent");
  }

  onShareOptionClick() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "SharePropertyComponent";
    dialogConfig.role = "alertdialog";
    dialogConfig.width = "400px";
    const dialogRef = this.dialog.open(SharePropertyComponent, dialogConfig);
    dialogRef.componentInstance.shareUrl = this.router.url;
    dialogRef.afterClosed().subscribe(res => {
    });
  }

  getRandom() {
    return Math.floor(Math.random() * 10) + 1;
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
 }
}