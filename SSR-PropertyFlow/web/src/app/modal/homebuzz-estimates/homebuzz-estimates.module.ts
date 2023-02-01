import { NgModule } from "@angular/core";
import { ModalModule } from "ngx-bootstrap/modal";
import { HomebuzzEstimatesComponent } from "./homebuzz-estimates.component";

@NgModule({
    imports: [
        ModalModule
    ],
    declarations: [
        HomebuzzEstimatesComponent
    ],
    exports: [HomebuzzEstimatesComponent],
    providers: [],
    entryComponents: [
        HomebuzzEstimatesComponent
    ]
})
export class HomebuzzEstimatesModule { }
