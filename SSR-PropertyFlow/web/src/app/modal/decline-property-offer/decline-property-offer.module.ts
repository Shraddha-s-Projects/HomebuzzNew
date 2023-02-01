import { ToasterService, ToasterModule } from "angular2-toaster";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MyHomeService } from "../../../app/modal/my-homes/my-homes.service";
import { MyOffersService } from "../../../app/modal/my-offers/my-offers.service";
import { CommonService } from "../../../app/core/services/common.service";
import { ErrorMessage } from "../../../app/core/services/errormessage.service";
import { ModalModule } from "ngx-bootstrap/modal";
import { SearchResultPageService } from "../../../app/pages/search-result-page/search-result-page.service";
import { MyLikesService } from "../../../app/modal/my-likes/my-likes.service";
import { UnClaimHomeModule } from "../unclaim-home/unclaim-home.module";
import { DeclinePropertyOfferComponent } from "./decline-property-offer.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ToasterModule,
        UnClaimHomeModule,
        ModalModule,
    ],
    declarations: [
        DeclinePropertyOfferComponent
    ],
    exports: [DeclinePropertyOfferComponent],
    providers: [ErrorMessage, MyHomeService, MyOffersService, SearchResultPageService, MyLikesService, ToasterService, CommonService],
    entryComponents: [
        DeclinePropertyOfferComponent
    ]
})
export class DeclinePropertyOfferModule { }
