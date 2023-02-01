import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovePropertyOfferComponent } from './remove-property-offer.component';

describe('RemovePropertyOfferComponent', () => {
  let component: RemovePropertyOfferComponent;
  let fixture: ComponentFixture<RemovePropertyOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemovePropertyOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovePropertyOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
