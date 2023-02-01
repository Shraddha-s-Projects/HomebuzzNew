import { ToasterService, ToasterModule } from "angular2-toaster";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CommonService } from "../../../app/core/services/common.service";
import { ErrorMessage } from "../../../app/core/services/errormessage.service";
import { ModalModule } from "ngx-bootstrap/modal";
import { MySearchComponent } from "./my-search.component";
import { MatProgressSpinnerModule } from "@angular/material";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ToasterModule,
        ModalModule,
        MatProgressSpinnerModule
    ],
    declarations: [
        MySearchComponent
    ],
    exports: [MySearchComponent],
    providers: [ErrorMessage, ToasterService, CommonService],
    entryComponents: [
        MySearchComponent
    ]
})
export class MySearchModule { }
