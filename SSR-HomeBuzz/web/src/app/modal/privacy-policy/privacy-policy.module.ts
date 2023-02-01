import { NgModule } from "@angular/core";
import { ModalModule } from "ngx-bootstrap/modal";
import { PrivacyPolicyComponent } from "./privacy-policy.component";

@NgModule({
    imports: [
        ModalModule
    ],
    declarations: [
        PrivacyPolicyComponent
    ],
    exports: [PrivacyPolicyComponent],
    providers: [],
    entryComponents: [
        PrivacyPolicyComponent
    ]
})
export class PrivacyPolicyModule { }
