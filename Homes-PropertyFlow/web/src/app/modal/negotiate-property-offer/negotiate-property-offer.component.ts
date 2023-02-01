import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NegotiatePropertyOfferService } from "./negotiate-property-offer.service";
import { CommonService } from "../../../app/core/services/common.service";
import { MyOffersService } from "../my-offers/my-offers.service";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "negotiatePropertyOffer",
  templateUrl: "./negotiate-property-offer.component.html",
  styleUrls: ["./negotiate-property-offer.component.css"]
})
export class NegotiatePropertyOfferComponent implements OnInit {
  @Input() offerVar: any;
  @Output() onNegotiateOffer = new EventEmitter<any>();
  public propertyDetailId: number;
  public address: string;
  public name: any;
  public phoneOrEmail: any;
  public offerId: number;
  public isLoaded: boolean;

  constructor(
    private negotiatePropertyOfferService: NegotiatePropertyOfferService,
    private commonService: CommonService,
    private myOffersService: MyOffersService,
    public dialogRef: MatDialogRef<NegotiatePropertyOfferComponent>,
  ) { }

  ngOnInit() { 
    this.getPropertyOfferById();
  }

  close() {
    this.dialogRef.close(false);
  }

  getPropertyOfferById() {
    this.myOffersService.getPropertyOfferById(this.offerId).subscribe((data: any) => {
      if(data.Success){
        // this.offer = new Offer();
        this.offerVar = data.Model;
        this.offerVar.Address = this.address;
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

  onSubmitBtnClick() {
    let queryObject = new Object();
    queryObject["Id"] = this.offerVar.Id;
    queryObject["Name"] = this.name;
    queryObject["EmailOrPhone"] = this.phoneOrEmail;
    queryObject["Address"] = this.address;
    queryObject["OfferingAmount"] = this.offerVar.OfferingAmount;
    queryObject["Status"] = "In negotiation";
    this.negotiatePropertyOfferService.changePropertyOfferStatus(queryObject).subscribe(data => {
      if (data.Success) {
        this.dialogRef.close(data.Model);
        this.commonService.toaster("You have successfully sent your contact details to the buyer", true);
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
