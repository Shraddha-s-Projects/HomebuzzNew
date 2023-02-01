import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerReadMoreComponent } from './buyer-read-more.component';

describe('BuyerReadMoreComponent', () => {
  let component: BuyerReadMoreComponent;
  let fixture: ComponentFixture<BuyerReadMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerReadMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerReadMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
