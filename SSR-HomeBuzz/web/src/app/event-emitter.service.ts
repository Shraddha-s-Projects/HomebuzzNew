import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  invokeSearchResultPageComponentFunction = new EventEmitter();
  invokeSearchResultPageAddressRefresh = new EventEmitter();
  sideBarMenuRefresh = new EventEmitter();
  mouseHoverOnMarker = new EventEmitter();
  mouseOutOnMarker = new EventEmitter();
  propertyImageModal = new EventEmitter();
  zoomMapEvent = new EventEmitter();
  likePropertyEvent = new EventEmitter();
  shareModalEvent = new EventEmitter();
  notifyPropertyModalEvent = new EventEmitter();
  subsVar = new Subscription();
  negotiateAndRemovePropRefresh = new EventEmitter();
  termsModalEmit = new EventEmitter();
  privacyModalEmit = new EventEmitter();
  agentOptionEmit = new EventEmitter();
  estimateModalEmit = new EventEmitter();
  headerSearchTextEmit = new EventEmitter();

  constructor() { }

  onGetPropertyEventEmmit(PropertyDetailId, action?: string, Model?: any) {
    let obj = {
      PropertyDetailId: PropertyDetailId,
      Action: action,
      Model: Model
    };
    this.invokeSearchResultPageComponentFunction.emit(obj);
  }

  onGetHeaderEventEmmit() {
    this.invokeSearchResultPageAddressRefresh.emit();
  }

  markerMouseHoverEventEmmit(element) {
    this.mouseHoverOnMarker.emit(element);
  }

  markerMouseOutEventEmmit(element) {
    this.mouseOutOnMarker.emit(element);
  }

  onSideBarMenuRefresh() {
    this.sideBarMenuRefresh.emit();
  }

  openPropertyImageModal(element) {
    this.propertyImageModal.emit(element);
  }

  onzoomMapEvent() {
    this.zoomMapEvent.emit();
  }

  onPropertyLikeEventEmmit(property) {
    console.log("Emit service");
    this.likePropertyEvent.emit(property);
  }

  onSharePropertyEventEmmit() {
    this.shareModalEvent.emit();
  }

  onNotifyPropertyEventEmmit(property) {
    this.notifyPropertyModalEvent.emit(property);
  }

  onNegotiatePropertyEventEmmit(property) {
    this.negotiateAndRemovePropRefresh.emit(property);
  }

  onTermsEventEmit() {
    this.termsModalEmit.emit();
  }

  onEstimateEventEmit() {
    this.estimateModalEmit.emit();
  }

  onPrivacyEventEmit() {
    this.privacyModalEmit.emit();
  }

  onAgentOptionEventEmit(Obj) {
    this.agentOptionEmit.emit(Obj);
  }

  onHeaderSearchTextEmit(address) {
    this.headerSearchTextEmit.emit(address);
  }
}
