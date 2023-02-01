import { ToasterService, ToasterModule } from "angular2-toaster";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CommonService } from "../../../../app/core/services/common.service";
import { ErrorMessage } from "../../../../app/core/services/errormessage.service";
import { ModalModule } from "ngx-bootstrap/modal";
import { MatProgressSpinnerModule } from "@angular/material";
import { PropertyOffersComponent } from "./property-offers.component";
import { PropertyOffersService } from "./property-offers.service";

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
        PropertyOffersComponent
    ],
    exports: [PropertyOffersComponent],
    providers: [ErrorMessage, ToasterService, CommonService, PropertyOffersService],
    entryComponents: [
        PropertyOffersComponent
    ]
})
export class PropertyOffersModule { }
