import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyOffersComponent } from './property-offers.component';

describe('PropertyOffersComponent', () => {
  let component: PropertyOffersComponent;
  let fixture: ComponentFixture<PropertyOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
