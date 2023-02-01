import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyImageGalleryComponent } from './property-image-gallery.component';

describe('PropertyImageGalleryComponent', () => {
  let component: PropertyImageGalleryComponent;
  let fixture: ComponentFixture<PropertyImageGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyImageGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyImageGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
