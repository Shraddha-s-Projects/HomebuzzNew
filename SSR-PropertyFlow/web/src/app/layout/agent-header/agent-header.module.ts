import { ToasterModule } from 'angular2-toaster/src/toaster.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../app/core/services/common.service';
import { LoginService } from '../../../app/pages/login/login.service';
import { WebsocketService } from '../../../app/core/services/notification/websocket.service';
import { DesktopNotificationsService } from '../../../app/core/services/notification/desktop-notification.service';
import { FormsModule } from '@angular/forms';
import { AgentHeaderComponent } from './agent-header.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, RouterModule, ToasterModule,
  ],
  declarations: [AgentHeaderComponent],
  exports: [AgentHeaderComponent],
  providers: [WebsocketService, DesktopNotificationsService]
})
export class AgentHeaderModule { }
