import { NgModule } from "@angular/core";
import { ModalModule } from "ngx-bootstrap/modal";
import { SharePropertyComponent } from "./share-property.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToasterModule } from "angular2-toaster";

@NgModule({
    imports: [
        ModalModule,
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        RouterModule,
        ToasterModule
    ],
    declarations: [
        SharePropertyComponent
    ],
    exports: [SharePropertyComponent],
    providers: [],
    entryComponents: [
        SharePropertyComponent
    ]
})
export class SharePropertyModule { }
