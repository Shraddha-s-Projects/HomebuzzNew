import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyHomesComponent } from './my-homes.component';

describe('MyHomesComponent', () => {
  let component: MyHomesComponent;
  let fixture: ComponentFixture<MyHomesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyHomesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyHomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
