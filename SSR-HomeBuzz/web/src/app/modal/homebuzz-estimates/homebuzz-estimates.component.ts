import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'homebuzzEstimatesModal',
  templateUrl: './homebuzz-estimates.component.html',
  styleUrls: ['./homebuzz-estimates.component.css']
})
export class HomebuzzEstimatesComponent implements OnInit {
  @ViewChild("homebuzzEstimates", { static: false }) modal: ModalDirective;

  constructor(public dialogRef: MatDialogRef<HomebuzzEstimatesComponent>) { }

  ngOnInit() {
  }

  close(){
    this.dialogRef.close(false);
  }

}
