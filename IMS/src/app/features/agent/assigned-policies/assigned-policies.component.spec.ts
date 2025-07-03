import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedPoliciesComponent } from './assigned-policies.component';

describe('AssignedPoliciesComponent', () => {
  let component: AssignedPoliciesComponent;
  let fixture: ComponentFixture<AssignedPoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedPoliciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
