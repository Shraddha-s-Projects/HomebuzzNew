import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteConfig } from 'src/app/route.config';
import { HttpClientService } from 'src/app/core/services/http-client.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable()
export class FileUploadService {

  constructor(private http: HttpClient,
    private routeConfig: RouteConfig,
    private httpClient: HttpClientService,
    private auth: AuthService) { }

  saveMasterFile(modal: any) {
    let input;
    input = new FormData();
    input.append('UserId', modal.UserId);
    input.append('File', modal.File);
    // return this.httpClient.post('/MasterFile/UploadFile', input);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers: headers }
    return this.http.post<any>(this.routeConfig.Url('/MasterFile/UploadFile'), input, httpOptions);
  }

}
