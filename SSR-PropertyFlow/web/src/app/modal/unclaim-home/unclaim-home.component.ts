import { Component, OnInit, Output, EventEmitter, Inject } from "@angular/core";
import { Home } from "../my-homes/my-homes";
import { MatDialogRef } from "@angular/material";
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

@Component({
  selector: "unclaimHomeModal",
  templateUrl: "./unclaim-home.component.html",
  styleUrls: ["./unclaim-home.component.css"]
})
export class UnclaimHomeComponent implements OnInit {
  @Output() onUnclaimEvent = new EventEmitter<any>();
  public address: string;
  public propertyDetailId: number;
  public home: Home;
  public userId: number = +this.localStorage.getItem("userId");
  constructor(
    public dialogRef: MatDialogRef<UnclaimHomeComponent>,
    @Inject(LOCAL_STORAGE) private localStorage: any,
  ) { }

  ngOnInit() {
    this.home = new Home();
    this.home.Address = this.address;
    this.home.PropertyDetailId = this.propertyDetailId;
    this.home.UserId = this.userId;
  }

  close() {
    this.dialogRef.close(false);
  }

  unClaimHome(home?: any) {
    this.dialogRef.close(this.home);
  }
}
