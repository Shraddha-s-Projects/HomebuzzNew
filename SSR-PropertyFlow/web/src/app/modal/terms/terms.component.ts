import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'termHomeModal',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {
  @ViewChild("termHomeModal", { static: false }) modal: ModalDirective;
  @Output() onTermsEvent = new EventEmitter<any>();

  constructor(public dialogRef: MatDialogRef<TermsComponent>) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close(false);
  }

  open(){ }
}
