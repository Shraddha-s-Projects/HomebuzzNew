import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePropertyComponent } from './share-property.component';

describe('SharePropertyComponent', () => {
  let component: SharePropertyComponent;
  let fixture: ComponentFixture<SharePropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharePropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
