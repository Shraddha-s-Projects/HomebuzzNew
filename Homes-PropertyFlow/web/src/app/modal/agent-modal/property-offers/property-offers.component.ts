import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PropertyOffers } from './property-offers';
import { PropertyOffersService } from './property-offers.service';
import { MatDialogRef } from '@angular/material';
import { CommonService } from '../../../../app/core/services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-property-offers',
  templateUrl: './property-offers.component.html',
  styleUrls: ['./property-offers.component.css']
})
export class PropertyOffersComponent implements OnInit, OnDestroy {

  public propertyOffers: PropertyOffers[] = [];
  @Input() PropertyDetailId: number;
  public isLoaded: boolean;
  public module = "property offer module";
  public _unsubscribeAll = new Subscription();

  constructor(private propertyOffersService: PropertyOffersService,
    public dialogRef: MatDialogRef<PropertyOffersComponent>,
    private commonService: CommonService) { }

  ngOnInit() {
    this.getPropertyOffers();
  }

  getPropertyOffers() {
    this._unsubscribeAll.add(this.propertyOffersService.getPropertyOffersByDetailId(this.PropertyDetailId).subscribe((data: any) => {
      if (data.Success) {
        this.propertyOffers = data.Model;
        this.isLoaded = true;
      }
    },
    error => {
        // this.commonService.toaster(error.statusText, false);
        console.log(error);
        if (error.status == 401) {
          this.commonService.toaster("You have not access for " + this.module + ". Please login.", false);
          this.close();
        }
        this.isLoaded = true;
    }));
  }

  close() {
    this.dialogRef.close(false);
  }

  ngOnDestroy() {
    this._unsubscribeAll.unsubscribe();
  }
}
