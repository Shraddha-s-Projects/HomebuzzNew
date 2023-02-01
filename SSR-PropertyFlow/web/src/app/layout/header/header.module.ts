import { ToasterModule } from 'angular2-toaster/src/toaster.module';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../app/core/services/common.service';
import { LoginService } from '../../../app/pages/login/login.service';
import { WebsocketService } from '../../../app/core/services/notification/websocket.service';
import { DesktopNotificationsService } from '../../../app/core/services/notification/desktop-notification.service';
import { FormsModule } from '@angular/forms';
import { MyOffersModule } from '../../../app/modal/my-offers/my-offers.module';
import { MyHomesModule } from '../../../app/modal/my-homes/my-homes.module';
import { MyLikesModule } from '../../../app/modal/my-likes/my-likes.module';
import { MySearchModule } from '../../../app/modal/my-search/my-search.module';
import { TermsModule } from '../../../app/modal/terms/terms.module';
import { PrivacyPolicyModule } from '../../../app/modal/privacy-policy/privacy-policy.module';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule, ToasterModule,
    MyOffersModule,
    MyHomesModule,
    MyLikesModule,
    MySearchModule,
    TermsModule,
    PrivacyPolicyModule
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  providers: [CommonService, LoginService, WebsocketService, DesktopNotificationsService]
})
export class HeaderModule { }
