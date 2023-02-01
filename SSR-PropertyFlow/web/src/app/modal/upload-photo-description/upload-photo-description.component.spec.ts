import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPhotoDescriptionComponent } from './upload-photo-description.component';

describe('UploadPhotoDescriptionComponent', () => {
  let component: UploadPhotoDescriptionComponent;
  let fixture: ComponentFixture<UploadPhotoDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPhotoDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPhotoDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
