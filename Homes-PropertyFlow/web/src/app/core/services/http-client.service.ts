import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouteConfig } from '../../../app/route.config';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

export interface IRequestOptions {
  body?: any;
  headers?: HttpHeaders | { [header: string]: string | Array<string> };
  observe?: any;
  params?: HttpParams | { [param: string]: string | Array<string> };
  reportProgress?: boolean;
  responseType?: "arraybuffer" | "blob" | "json" | "text";
  withCredentials?: boolean;
}

@Injectable()
export class HttpClientService {

  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, private http: HttpClient,
    private routeConfig: RouteConfig) { }

  //######################## Http method to make anonymous request : start ########################
  get(url: string) {
    return this.http.get<any>(this.routeConfig.Url(url));
  }

  post(url: string, data: any) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const httpOptions = { headers: headers }
    let body = JSON.stringify(data);

    return this.http.post<any>(this.routeConfig.Url(url), body, httpOptions);
  }
  //######################## Http method to make anonymous request : End ##########################


  //######################## Http method to make authorize request : start ########################
  authGet(url: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var token =  this.localStorage.getItem('access_token');
    if(token){
      token = 'Bearer '+ token;
      headers = headers.set('Authorization', token);
    }
    // let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const httpOptions = { headers: headers }
    return this.http.get<any>(this.routeConfig.Url(url),httpOptions)
  }

  authPost(url: string, data: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    var token =  this.localStorage.getItem('access_token');
    if(token){
      token = 'Bearer '+ token;
      headers = headers.set('Authorization', token);
    }
    const options = { headers: headers };
    let body = JSON.stringify(data);

    return this.http.post<any>(this.routeConfig.Url(url), body, options);
  }

  authDownloadFile(url: string, data: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: "blob"
    }
    let body = JSON.stringify(data);

    return this.http
      .post<any>(this.routeConfig.Url(url), body, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'json'
      });
  }

  authImageUpload(url: string, file: any) {
    let input = new FormData();
    input.append("file", file);
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + this.localStorage.getItem('id_token'));
    const httpOptions = { headers: headers }
    return this.http.post<any>(this.routeConfig.Url(url), input, httpOptions)
  }

  authMultipleFileUpload(url: string, files: any[], model?: any) {
    let input = new FormData();

    if (files && files.length > 0) {
      for (let file of files) {
        input.append(file.name, file);
      }
    }

    input.append("model", JSON.stringify(model));
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + this.localStorage.getItem('id_token'));
    const httpOptions = { headers: headers }
    return this.http.post<any>(this.routeConfig.Url(url), input, httpOptions)
  }
  //######################## Http method to make authorize request : End ##########################
}
