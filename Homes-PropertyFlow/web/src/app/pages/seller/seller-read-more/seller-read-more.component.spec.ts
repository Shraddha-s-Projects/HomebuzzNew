import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerReadMoreComponent } from './seller-read-more.component';

describe('SellerReadMoreComponent', () => {
  let component: SellerReadMoreComponent;
  let fixture: ComponentFixture<SellerReadMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerReadMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerReadMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
