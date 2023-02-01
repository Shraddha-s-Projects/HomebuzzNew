import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditHomePhotoDescriptionComponent } from './add-edit-home-photo-description.component';

describe('AddEditHomePhotoDescriptionComponent', () => {
  let component: AddEditHomePhotoDescriptionComponent;
  let fixture: ComponentFixture<AddEditHomePhotoDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditHomePhotoDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditHomePhotoDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
