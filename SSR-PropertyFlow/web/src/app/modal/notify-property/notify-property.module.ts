import { NgModule } from "@angular/core";
import { ModalModule } from "ngx-bootstrap/modal";
import { NotifyPropertyComponent } from "./notify-property.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ToasterModule } from "angular2-toaster";
import { MatFormFieldModule, MatInputModule, MatProgressSpinnerModule } from "@angular/material";
import { HttpClientModule } from "@angular/common/http";
import { InputTrimModule } from "ng2-trim-directive";
import { ErrorMessage } from "../../../app/core/services/errormessage.service";
import { NotifyPropertyService } from "./notify-property.service";

@NgModule({
    imports: [
        ModalModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ToasterModule,
        HttpClientModule,
        InputTrimModule,
        MatProgressSpinnerModule
    ],
    declarations: [
        NotifyPropertyComponent
    ],
    exports: [NotifyPropertyComponent],
    providers: [ErrorMessage, NotifyPropertyService],
    entryComponents: [
        NotifyPropertyComponent
    ]
})
export class NotifyPropertyModule { }
