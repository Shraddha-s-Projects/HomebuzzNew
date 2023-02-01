import { NgModule } from "@angular/core";
import { ModalModule } from "ngx-bootstrap/modal";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ToasterModule } from "angular2-toaster";
import { MatFormFieldModule, MatInputModule } from "@angular/material";
import { HttpClientModule } from "@angular/common/http";
import { InputTrimModule } from "ng2-trim-directive";
import { ErrorMessage } from "../../../app/core/services/errormessage.service";
import { TransferOwnershipComponent } from "./transfer-ownership.component";
import { TransferOwnershipService } from "./transfer-ownership.service";
import { LaddaModule } from "angular2-ladda";

@NgModule({
    imports: [
        ModalModule,
        CommonModule,
        FormsModule,
        LaddaModule,
        ReactiveFormsModule,
        RouterModule,
        ToasterModule,
        HttpClientModule,
        InputTrimModule
    ],
    declarations: [
        TransferOwnershipComponent
    ],
    exports: [TransferOwnershipComponent],
    providers: [ErrorMessage, TransferOwnershipService],
    entryComponents: [
        TransferOwnershipComponent
    ]
})
export class TransferOwnershipModule { }
