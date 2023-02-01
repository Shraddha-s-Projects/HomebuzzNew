import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertylightFooterComponent } from './propertylight-footer.component';

describe('PropertylightFooterComponent', () => {
  let component: PropertylightFooterComponent;
  let fixture: ComponentFixture<PropertylightFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertylightFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertylightFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
