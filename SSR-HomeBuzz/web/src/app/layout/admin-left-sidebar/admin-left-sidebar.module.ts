import { ToasterModule } from 'angular2-toaster/src/toaster.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLeftSidebarComponent } from './admin-left-sidebar.component';
import { CommonService } from 'src/app/core/services/common.service';
import { LoginService } from 'src/app/pages/login/login.service';
import { WebsocketService } from 'src/app/core/services/notification/websocket.service';
import { DesktopNotificationsService } from 'src/app/core/services/notification/desktop-notification.service';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule, ToasterModule,
  ],
  declarations: [AdminLeftSidebarComponent],
  exports: [AdminLeftSidebarComponent],
  providers: [CommonService, LoginService, WebsocketService, DesktopNotificationsService]
})
export class AdminLeftSidebarModule { }
