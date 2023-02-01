import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../app/core/services/http-client.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RouteConfig } from '../../../app/route.config';
@Injectable({
  providedIn: 'root'
})
export class UploadPhotoDescriptionService {
  [x: string]: any;

  constructor(private httpClient: HttpClientService, private http: HttpClient, private routeConfig: RouteConfig) { }

  uploadPropertyPhoto(fileObj: any) {
    let frmData = new FormData();
    frmData.append('PropertDetailId', fileObj.id);
    for (let i = 0; i < fileObj.files.length; i++) {
      frmData.append('fileList', fileObj.files[i]);
    }
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const httpOptions = { headers: headers }
    return this.http.post<any>(this.routeConfig.Url('/PropertyDetail/UploadFiles'), frmData, httpOptions)
  }
  savePropertyDescription(PropertyObject: any) {
    return this.httpClient.authPost('/PropertyDetail/UpdateDescription', PropertyObject);
  }
  removePhoto(Id: number) {
    return this.httpClient.authPost('/PropertyDetail/DeletePropertyImage?PropertyImageId=' + Id, {});
  }
}
