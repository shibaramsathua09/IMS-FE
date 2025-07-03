import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedPoliciesComponent } from './requested-policies.component';

describe('RequestedPoliciesComponent', () => {
  let component: RequestedPoliciesComponent;
  let fixture: ComponentFixture<RequestedPoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestedPoliciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestedPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
