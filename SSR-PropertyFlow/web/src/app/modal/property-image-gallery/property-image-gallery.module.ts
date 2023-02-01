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
import { PropertyImageGalleryComponent } from "./property-image-gallery.component";
import { PropertyImageGalleryService } from "./property-image-gallery.service";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule } from "@angular/material";
import { MatTabsModule } from '@angular/material/tabs';
import { GoogleMapModule } from "../../../app/pages/google-map/google-map.module";
import { NotifyPropertyModule } from "../notify-property/notify-property.module";
import { PropertylightFooterModule } from "../../../app/pages/propertylight-footer/propertylight-footer.module";
import { SignInModalModule } from "../sign-in-modal/sign-in-modal.module";
import { MakeOfferComponent } from '../make-offer/make-offer.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ToasterModule,
        UnClaimHomeModule,
        ModalModule,
        SlickCarouselModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        // MatTabsModule,
        GoogleMapModule,
        NotifyPropertyModule,
        MatProgressSpinnerModule,
        PropertylightFooterModule,
        SignInModalModule
    ],
    declarations: [
        PropertyImageGalleryComponent, MakeOfferComponent
    ],
    exports: [PropertyImageGalleryComponent],
    providers: [ErrorMessage, PropertyImageGalleryService, MyOffersService, SearchResultPageService, MyLikesService, ToasterService, CommonService],
    entryComponents: [
        PropertyImageGalleryComponent, MakeOfferComponent
    ]
})
export class PropertyImageGalleryModule { }
