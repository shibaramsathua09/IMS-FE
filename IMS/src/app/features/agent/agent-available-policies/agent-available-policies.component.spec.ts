import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentAvailablePoliciesComponent } from './agent-available-policies.component';

describe('AgentAvailablePoliciesComponent', () => {
  let component: AgentAvailablePoliciesComponent;
  let fixture: ComponentFixture<AgentAvailablePoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentAvailablePoliciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentAvailablePoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
