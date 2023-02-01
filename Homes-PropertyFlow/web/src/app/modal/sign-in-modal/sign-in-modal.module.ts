import { NgModule } from "@angular/core";
import { ModalModule } from "ngx-bootstrap/modal";
import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
import { LaddaModule } from 'angular2-ladda';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {  MatDialogModule, MatButtonModule } from '@angular/material';
import { SignInModalComponent } from "./sign-in-modal.component";

@NgModule({
    imports: [
        CommonModule, RouterModule, FormsModule, ReactiveFormsModule, LaddaModule, ToasterModule, HttpClientModule, ModalModule, TimepickerModule, BsDatepickerModule.forRoot(), BsDropdownModule.forRoot(), PopoverModule, 
    MatDialogModule,
    MatButtonModule,
    ],
    declarations: [
        SignInModalComponent
    ],
    exports: [SignInModalComponent],
    providers: [],
    entryComponents: [
        SignInModalComponent
    ]
})
export class SignInModalModule { }
