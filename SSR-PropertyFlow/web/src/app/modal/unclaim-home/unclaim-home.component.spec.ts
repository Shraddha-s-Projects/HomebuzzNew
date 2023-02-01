import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnclaimHomeComponent } from './unclaim-home.component';

describe('UnclaimHomeComponent', () => {
  let component: UnclaimHomeComponent;
  let fixture: ComponentFixture<UnclaimHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnclaimHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnclaimHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
