import { ToasterService, ToasterModule } from "angular2-toaster";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderModule } from "../header/header.module";
import { LeftSideMenuModule } from "../left-side-menu/left-side-menu.module";
import { MyHomeService } from "../../../app/modal/my-homes/my-homes.service";
import { MyOffersService } from "../../../app/modal/my-offers/my-offers.service";
import { CommonService } from "../../../app/core/services/common.service";
import { ErrorMessage } from "../../../app/core/services/errormessage.service";
// import { ModalModule } from "ngx-bootstrap/modal";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { PopoverModule } from "ngx-bootstrap/popover";
import { SearchResultPageService } from "../../../app/pages/search-result-page/search-result-page.service";
import { MyLikesService } from "../../../app/modal/my-likes/my-likes.service";
import { MyOffersModule } from "../../../app/modal/my-offers/my-offers.module";
import { MyHomesModule } from "../../../app/modal/my-homes/my-homes.module";
import { MyLikesModule } from "../../../app/modal/my-likes/my-likes.module";
import { DeclinePropertyOfferModule } from "../../../app/modal/decline-property-offer/decline-property-offer.module";
import { NegotiatePropertyOfferModule } from "../../../app/modal/negotiate-property-offer/negotiate-property-offer.module";
import { AgmCoreModule } from "@agm/core";
import { SearchResultPageComponent } from "../../../app/pages/search-result-page/search-result-page.component";
import { MyOffersComponent } from "../../../app/modal/my-offers/my-offers.component";
import { MyHomesComponent } from "../../../app/modal/my-homes/my-homes.component";
import { MyLikesComponent } from "../../../app/modal/my-likes/my-likes.component";
import { TermsModule } from "../../../app/modal/terms/terms.module";
import { PrivacyPolicyModule } from "../../../app/modal/privacy-policy/privacy-policy.module";
import { TermsComponent } from "../../../app/modal/terms/terms.component";
import { PrivacyPolicyComponent } from "../../../app/modal/privacy-policy/privacy-policy.component";
import { MatDialogModule } from "@angular/material";
import { MainLayoutComponent } from "./main-layout.component";
import { CommonModalService } from "../../../app/common-modal.service";
import { MySearchModule } from "../../../app/modal/my-search/my-search.module";
import { MySearchService } from "../../../app/modal/my-search/my-search.service";
import { DashboardModule } from 'src/app/pages/dashboard/dashboard.module';
import { SearchResultPageModule } from 'src/app/pages/search-result-page/search-result-page.module';

@NgModule({
    imports: [
        HeaderModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        LeftSideMenuModule,
        ToasterModule,
        // ModalModule,
        DashboardModule,
        SearchResultPageModule,
        MatDialogModule,
        MyOffersModule,
        MyHomesModule,
        MyLikesModule,
        TermsModule,
        MySearchModule,
        PrivacyPolicyModule,
        DeclinePropertyOfferModule,
        NegotiatePropertyOfferModule,
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        PopoverModule.forRoot(),
        AgmCoreModule.forRoot({
            // apiKey: "AIzaSyCWVd0v933wxKfFAGtWGWFYKUn65SK2HOQ",
            apiKey: 'AIzaSyDeZycYkU-eIbFWOeJGOytOW3W49zXAmeo',
            libraries: ['visualization', 'places']
        })
    ],
    declarations: [MainLayoutComponent],
    exports: [MainLayoutComponent],
    providers: [SearchResultPageComponent, ErrorMessage, MyHomeService, MyOffersService, CommonModalService, MySearchService,
        SearchResultPageService, MyLikesService, ToasterService, CommonService, MainLayoutComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [
        MyOffersComponent,
        MyHomesComponent,
        MyLikesComponent,
        TermsComponent,
        PrivacyPolicyComponent
    ]
})
export class MainLayoutModule { }
