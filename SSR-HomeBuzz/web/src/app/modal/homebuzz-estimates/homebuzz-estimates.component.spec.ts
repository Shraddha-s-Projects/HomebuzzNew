import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomebuzzEstimatesComponent } from './homebuzz-estimates.component';

describe('HomebuzzEstimatesComponent', () => {
  let component: HomebuzzEstimatesComponent;
  let fixture: ComponentFixture<HomebuzzEstimatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomebuzzEstimatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomebuzzEstimatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
