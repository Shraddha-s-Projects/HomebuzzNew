import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Offer } from "../my-offers/my-offers";
import { MatDialogRef } from "@angular/material";
import { MyOffersService } from "../my-offers/my-offers.service";
import { CommonService } from "../../../app/core/services/common.service";

@Component({
  selector: "removePropertyOffer",
  templateUrl: "./remove-property-offer.component.html",
  styleUrls: ["./remove-property-offer.component.css"]
})
export class RemovePropertyOfferComponent implements OnInit {
  @Input() offer: Offer;
  @Output() onRemoveOffer = new EventEmitter<any>();
  public isLoaded: boolean;
  public offerId: number;
  public address: string;
  constructor(
    public dialogRef: MatDialogRef<RemovePropertyOfferComponent>,
    private myOffersService: MyOffersService,
    private commonService : CommonService
  ) { }

  ngOnInit() {
    this.getPropertyOfferById();
  }

  close() {
    this.dialogRef.close(false);
  }

  onRemoveBtnClick() {
    this.dialogRef.close(this.offer);
    this.onRemoveOffer.emit();
  }

  getPropertyOfferById() {
    this.myOffersService.getPropertyOfferById(this.offerId).subscribe((data: any) => {
      if(data.Success){
        this.offer = data.Model;
        this.offer.Address = this.address;
        this.isLoaded = true;
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
