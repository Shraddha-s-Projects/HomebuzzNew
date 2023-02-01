import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapTestComponent } from './google-map-test.component';

describe('GoogleMapTestComponent', () => {
  let component: GoogleMapTestComponent;
  let fixture: ComponentFixture<GoogleMapTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleMapTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
