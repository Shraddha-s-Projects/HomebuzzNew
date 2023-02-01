import { HttpClientModule } from '@angular/common/http';
import { ToasterModule } from 'angular2-toaster';
// import { LaddaModule } from 'angular2-ladda';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddEditHomePhotoDescriptionModule } from '../../../app/modal/add-edit-home-photo-description/add-edit-home-photo-description.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { Ng2CompleterModule } from "ng2-completer";
import { AgmCoreModule } from '@agm/core';
import { PropertyImageGalleryService } from '../../../app/modal/property-image-gallery/property-image-gallery.service';
import { CommonService } from '../../../app/core/services/common.service';
import { MyOffersModule } from '../../../app/modal/my-offers/my-offers.module';
import { MyHomesModule } from '../../../app/modal/my-homes/my-homes.module';
import { MyLikesModule } from '../../../app/modal/my-likes/my-likes.module';
import { DeclinePropertyOfferModule } from '../../../app/modal/decline-property-offer/decline-property-offer.module';
import { NegotiatePropertyOfferModule } from '../../../app/modal/negotiate-property-offer/negotiate-property-offer.module';
import { MySearchModule } from '../../../app/modal/my-search/my-search.module';
import { MySearchService } from '../../../app/modal/my-search/my-search.service';
import { TermsModule } from '../../../app/modal/terms/terms.module';
import { PrivacyPolicyModule } from '../../../app/modal/privacy-policy/privacy-policy.module';
import { HomebuzzEstimatesModule } from '../../../app/modal/homebuzz-estimates/homebuzz-estimates.module';
import { MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { MyModalComponent } from '../../../app/my-modal/my-modal.component';
import { SearchResultGridComponent } from '../search-result-grid/search-result-grid.component';
import { PropertylightFooterComponent } from '../propertylight-footer/propertylight-footer.component';
import { PropertyImageGalleryModule } from '../../../app/modal/property-image-gallery/property-image-gallery.module';
import { ClaimHomeModule } from '../../../app/modal/claim-home/claim-home.module';
import { SignInModalModule } from '../../../app/modal/sign-in-modal/sign-in-modal.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { PropertylightFooterModule } from '../propertylight-footer/propertylight-footer.module';

export const ROUTES: Routes = [
  { path: '', component: SearchResultGridComponent }
];

@NgModule({
  imports: [
    // RouterModule.forChild(ROUTES),
    AgmCoreModule.forRoot({
      // apiKey: "AIzaSyCWVd0v933wxKfFAGtWGWFYKUn65SK2HOQ",
      apiKey: 'AIzaSyDeZycYkU-eIbFWOeJGOytOW3W49zXAmeo',
      libraries: ['visualization', 'places']
    }),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // LaddaModule,
    ToasterModule,
    HttpClientModule,
    MatDialogModule,
    ModalModule,
    MatDialogModule,
    MyOffersModule,
    MyHomesModule,
    MyLikesModule,
    MySearchModule,
    DeclinePropertyOfferModule,
    NegotiatePropertyOfferModule,
    AddEditHomePhotoDescriptionModule,
    TermsModule,
    PrivacyPolicyModule,
    HomebuzzEstimatesModule,
    // PropertyImageGalleryModule,
    SlickCarouselModule,
    Ng2CompleterModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PopoverModule.forRoot(),
    ClaimHomeModule,
    SignInModalModule,
    MatProgressSpinnerModule,
    PropertylightFooterModule
  ],
  declarations: [SearchResultGridComponent, MyModalComponent],
  providers: [PropertyImageGalleryService, CommonService, MySearchService],
  //entryComponents: [SearchResultGridComponent],
  exports:[
    SearchResultGridComponent
  ],
  bootstrap: [SearchResultGridComponent]
})
export class SearchResultGridModule { }
