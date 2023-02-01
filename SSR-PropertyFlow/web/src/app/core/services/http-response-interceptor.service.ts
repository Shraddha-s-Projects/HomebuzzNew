import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import { XHRBackend, RequestOptions, Http } from '@angular/http';
import { Router } from "@angular/router";
import { tap} from 'rxjs/operators';
import 'rxjs/Rx';
import 'rxjs/add/operator/do';

declare var popupFunctionObject:any;

@Injectable()
export class HttpResponseInterceptorService extends Http {
  
  constructor(backend: XHRBackend, defaultOptions: RequestOptions, private router: Router, private commonService: CommonService) {
    super(backend, defaultOptions);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
    return next.handle(request)
    .pipe(
        tap(event => {
          // 200 OK
        }, error => {
          var regEx500 = /^5[0-9][0-9]$/;
          var regEx400 = /^4[0-9][0-9]$/;
          
          if (error.status === 403) {
              console.log('The authentication session expires. Force refresh of the current page.');
              this.router.navigate(['/logout']);
          }
          else if(error.status == 0){
            // popupFunctionObject.showPopUp('SomethingWentWrong');
          }
          else if(regEx500.test(error.status.toString())){
            this.commonService.toaster("500 - Internal Server Error", false);
          }
          else if(regEx400.test(error.status.toString()) && error.status != 401){
            this.commonService.toaster("404 - Not Found", false);
          }

          return Observable.throw(error);
        })
      )
  }
}
