import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class RouteConfig {

    Url(url): string {       
        return  environment.APIURL.toString() + url;
    }

    NotificationUrl() : string{
        return  environment.NotificationUrl.toString();
    }

    ProfilePicUrl() : string{
        return  environment.APIURL + environment.ProfilePicUrl;
    }
}