import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { ToasterService, Toast } from 'angular2-toaster';
import { Observable, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

declare var popupFunctionObject: any;

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public subject: Subject<any> = new Subject();
  public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    @Inject(LOCAL_STORAGE) private localStorage: any,
    private toasterService: ToasterService,
    private cookieService: CookieService,
    private router: Router) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.toasterService = toasterService;
  }

  // Common toaster function
  toaster(data: string, flag: boolean) {
    var toast: Toast = {
      type: flag ? 'success' : 'error',
      title: flag ? 'Success' : 'Error',
      body: data,
      timeout: 8000,
      showCloseButton: true,
    };
    if (isPlatformBrowser(this.platformId)) {
      this.toasterService.pop(toast);
    }
  }

  toasterNotification(data: string) {
    var toast: Toast = {
      type: 'info',
      title: 'Notification',
      body: data,
      timeout: 8000,
      showCloseButton: true,
    };
    if (isPlatformBrowser(this.platformId)) {
      this.toasterService.pop(toast);
    }
  }

  toasterWarning(data: string) {
    var toast: Toast = {
      type: 'info',
      title: 'Warning',
      body: data,
      timeout: 8000,
      showCloseButton: true,
    };
    if (isPlatformBrowser(this.platformId)) {
      this.toasterService.pop(toast);
    }
  }

  toasterWelcome(data: string, flag: boolean) {
    var toast: Toast = {
      type: flag ? 'success' : 'error',
      title: 'Welcome',
      body: data,
      timeout: 8000,
      showCloseButton: true,
    };
    if (isPlatformBrowser(this.platformId)) {
      this.toasterService.pop(toast);
    }
  }


  public getConfig(height: number) {
    return {
      customConfig: '/assets/js/ckeditor/config.ts',
      height: height,
    };
  }

  updateProperty(param: String) {
    this.subject.next({ text: param });
  }

  getProperty(): Observable<any> {
    return this.subject.asObservable();
  }

  onLogoutOptionClick() {
    this.cookieService.deleteAll();
    this.localStorage.removeItem("roleId");
    this.localStorage.removeItem("userId");
    this.localStorage.removeItem("rolename");
    this.localStorage.removeItem("userame");
    this.localStorage.removeItem("access_token");
    this.router.navigate(['/login']);
  }
}
