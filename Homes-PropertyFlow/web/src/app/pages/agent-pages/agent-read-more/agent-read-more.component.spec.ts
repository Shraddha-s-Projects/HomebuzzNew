import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentReadMoreComponent } from './agent-read-more.component';

describe('AgentReadMoreComponent', () => {
  let component: AgentReadMoreComponent;
  let fixture: ComponentFixture<AgentReadMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentReadMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentReadMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
