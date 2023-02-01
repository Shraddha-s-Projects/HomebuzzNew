import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'confirmDeleteModal',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css']
})
export class ConfirmDeleteComponent implements OnInit {
  
  //bootstrap modal and event emmitter
  @ViewChild('ContactDelete', {static: false}) modal: ModalDirective;
  @Output() onConfirmDelete = new EventEmitter<any>();

  public random: any;
  
  constructor() { }

  ngOnInit() {

  }

  show() {
    this.modal.show();
  }

  close() {
    this.modal.hide();
  }

  confirmDelete(){
    this.onConfirmDelete.emit();
  }
}


