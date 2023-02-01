import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclinePropertyOfferComponent } from './decline-property-offer.component';

describe('DeclinePropertyOfferComponent', () => {
  let component: DeclinePropertyOfferComponent;
  let fixture: ComponentFixture<DeclinePropertyOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclinePropertyOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclinePropertyOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
