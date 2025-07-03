import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRegisteredPoliciesComponent } from './customer-registered-policies.component';

describe('CustomerRegisteredPoliciesComponent', () => {
  let component: CustomerRegisteredPoliciesComponent;
  let fixture: ComponentFixture<CustomerRegisteredPoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerRegisteredPoliciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerRegisteredPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
