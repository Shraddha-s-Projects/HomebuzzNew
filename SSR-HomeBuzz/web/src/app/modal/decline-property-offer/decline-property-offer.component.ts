import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MyOffersService } from '../my-offers/my-offers.service';
import { CommonService } from '../../../app/core/services/common.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'declinePropertyOffer',
  templateUrl: './decline-property-offer.component.html',
  styleUrls: ['./decline-property-offer.component.css']
})
export class DeclinePropertyOfferComponent implements OnInit {
  @Input() offer: any;
  @Input() offerIdVar: number;
  @Input() address: string;
  @Output() onNegotiateOffer = new EventEmitter<any>();
  @Output() onDeclineOffer = new EventEmitter<any>();
  public isLoaded: boolean = true;
  constructor(
    private myOffersService: MyOffersService,
    private commonService: CommonService,
    private router: Router,
    public dialogRef: MatDialogRef<DeclinePropertyOfferComponent>
  ) { }

  ngOnInit() {
  }
  close() {
    this.dialogRef.close(false);
  }

  onDeclineBtnClick() {
    this.myOffersService.removeMyOffer(this.offerIdVar).subscribe(
      data => {
        if (data.Success) {
          this.close();
          // this.offer.forEach(data => {
          //   if (data.Id == this.offerIdVar) {
          //     let index = this.offer.indexOf(data);
          //     this.offer.splice(index, 1);
          //   }
          // })
          // this.onDeclineOffer.emit(null);
          // this.onNegotiateOffer.emit(null);
        }
      },
      error => {
          // this.commonService.toaster(error.statusText, false);
          console.log(error);
          if (error.status == 401) {
            this.commonService.toaster("You have not access for property offer module. Please login.", false);
            this.close();
          }
      });
  }
}
