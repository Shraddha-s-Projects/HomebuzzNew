import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthMessageComponent } from "./auth-message.component";
import { MatDialogModule } from "@angular/material";
import { AuthMessageService } from "./auth-message.service";
import { CommonService } from "../../../app/core/services/common.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MatDialogModule
    ],
    declarations: [
        AuthMessageComponent
    ],
    exports: [AuthMessageComponent],
    providers: [AuthMessageService, CommonService],
    entryComponents: [
        AuthMessageComponent
    ]
})
export class AuthMessageModule { }
