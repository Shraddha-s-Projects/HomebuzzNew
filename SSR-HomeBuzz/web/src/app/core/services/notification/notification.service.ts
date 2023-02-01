import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import 'rxjs/Rx';
import { RouteConfig } from '../../../../app/route.config';
import { HttpClientService } from '../http-client.service';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

export interface Message {
	message: Array<any>;
}

@Injectable({
	providedIn: 'root',
})
export class NotificationService {

	public uid: any;
	public clientId: any;
	public property = new Subject();
	public messages: Subject<Message>;

	constructor(@Inject(LOCAL_STORAGE) private localStorage: any, wsService: WebsocketService, private routeConfig: RouteConfig, private httpClient: HttpClientService) {
		// this.messages = <Subject<Message>>wsService
		// .connect(this.routeConfig.NotificationUrl().replace("[TokenId]", this.clientId))
		// .map((response: MessageEvent): Message => {
		// 	let data = response.data;
		// 	return {
		// 		message: data
		// 	}
		// }).share();

		this.uid = this.localStorage.getItem("loggedInUserId");
		this.clientId = this.localStorage.getItem("userId") + (this.uid ? '_' + this.localStorage.getItem("uid") : '');
	}
}
