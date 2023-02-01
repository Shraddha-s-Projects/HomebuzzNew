import { ToasterService } from "angular2-toaster";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToasterModule } from "angular2-toaster/src/toaster.module";
import { BrowserModule, BrowserTransferStateModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule, Http } from "@angular/http";
import { RouteConfig } from "./route.config";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtModule } from "@auth0/angular-jwt";
import { HttpResponseInterceptorService } from "./core/services/http-response-interceptor.service";
import { HttpClientService } from "./core/services/http-client.service";
import { AuthService } from "./core/services/auth.service";
import { AuthGuard } from "./core/services/auth-guard.service";
import { ErrorMessage } from "./core/services/errormessage.service";
import { ModalModule } from "ngx-bootstrap/modal";
import { CookieService } from "ngx-cookie-service";
import { EventEmitterService } from "./event-emitter.service";
import { MainLayoutModule } from "./layout/main-layout/main-layout.module";
import { MatDialogModule, MatFormFieldModule } from "@angular/material";
import { MatStepperModule } from '@angular/material/stepper';
import { AgentLayoutModule } from "./layout/agent-layout/agent-layout.module";
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutModule } from "./layout/admin-layout/admin-layout.module";
import { HomebuzzEstimatesModule } from "./modal/homebuzz-estimates/homebuzz-estimates.module";
import { AppService } from "./app.service";
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { GoogleMapsAPIWrapper } from '@agm/core';
// import { LaddaModule } from 'angular2-ladda';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  declarations: [AppComponent
    // AutocompleteComponent
  ],
  imports: [
    RouterModule,
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    BrowserAnimationsModule,
    ToasterModule,
    HttpModule,
    HttpClientModule,
    MainLayoutModule,
    AgentLayoutModule,
    AdminLayoutModule,
    MatDialogModule,
    MatStepperModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    HomebuzzEstimatesModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        skipWhenExpired: true,
        whitelistedDomains: environment.whitelistedDomains,
        blacklistedRoutes: environment.blacklistedRoutes
      }
    }),
    ModalModule.forRoot(),
    CommonModule,
    TransferHttpCacheModule,
    NgtUniversalModule
  ],
  providers: [
    {
      provide: Http,
      useClass: HttpResponseInterceptorService
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpResponseInterceptorService,
      multi: true
    },
    // MatDialogRef,
    HttpClientService,
    RouteConfig,
    CookieService,
    AuthService,
    AuthGuard,
    ErrorMessage,
    ToasterService,
    EventEmitterService,
    AppService,
    GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
