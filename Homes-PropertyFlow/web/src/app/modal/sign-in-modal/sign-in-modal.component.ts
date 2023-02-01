import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'signInModal',
  templateUrl: './sign-in-modal.component.html',
  styleUrls: ['./sign-in-modal.component.css']
})
export class SignInModalComponent implements OnInit {
  public selectedValue:string;
  @ViewChild('SignIn', { static: false }) modal: ModalDirective;
  @Output() onDeclineSignIn = new EventEmitter<any>();
  Id : String;
  constructor(public dialogRef: MatDialogRef<SignInModalComponent>,
    private router: Router) { }

  ngOnInit() {
  }

  show() {
    this.modal.show();
  }

  close() {
    this.dialogRef.close(false);
  }

  gotologin(){
    this.dialogRef.close(true);
  }

}
