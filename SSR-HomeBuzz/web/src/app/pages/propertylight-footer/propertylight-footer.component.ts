import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import * as moment from 'moment';
import { EventEmitterService } from '../../../app/event-emitter.service';
import { WINDOW } from '@ng-toolkit/universal';

@Component({
  selector: 'app-propertylight-footer',
  templateUrl: './propertylight-footer.component.html',
  styleUrls: ['./propertylight-footer.component.css']
})
export class PropertylightFooterComponent implements OnInit {
  @Output() termsModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() privacyModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() estimateModal: EventEmitter<any> = new EventEmitter<any>();
  @Input() isLoaded: boolean;
  public currentYear = moment(new Date()).format('YYYY');

  constructor(@Inject(WINDOW) private window: Window, private eventEmitterService: EventEmitterService) { }

  ngOnInit() {
  }

  onTermsOptionClick() {
    this.termsModal.emit();
  }

  onPrivacyOptionClick() {
    this.privacyModal.emit();
  }

  onHomebuzzEstimatesOptionClick() {
    this.estimateModal.emit();
  }

  onShareOptionClick() {
    this.eventEmitterService.onSharePropertyEventEmmit();
  }

  getRandom() {
    return Math.floor(Math.random() * 10) + 1;
  }
}
