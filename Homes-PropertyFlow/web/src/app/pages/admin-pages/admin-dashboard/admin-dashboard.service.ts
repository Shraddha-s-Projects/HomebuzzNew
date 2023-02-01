import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteConfig } from 'src/app/route.config';
import { HttpClientService } from 'src/app/core/services/http-client.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable()
export class AdminDashboardService {

  constructor(private http: HttpClient,
    private routeConfig: RouteConfig,
    private httpClient: HttpClientService,
    private auth: AuthService) { }

}
