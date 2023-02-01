import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'PrivacyPolicyModal',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {
  @ViewChild("privacypolicy", { static: false }) modal: ModalDirective;
  @Output() onPrivacyPolicyEvent = new EventEmitter<any>();
  constructor(public dialogRef: MatDialogRef<PrivacyPolicyComponent>) { }

  ngOnInit() {
  }

  open() {
    this.modal.show();
  }

  close(){
    this.dialogRef.close(false);
  }
}
