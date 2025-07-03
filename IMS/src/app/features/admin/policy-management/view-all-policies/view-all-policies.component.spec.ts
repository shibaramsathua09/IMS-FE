import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllPoliciesComponent } from './view-all-policies.component';

describe('ViewAllPoliciesComponent', () => {
  let component: ViewAllPoliciesComponent;
  let fixture: ComponentFixture<ViewAllPoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllPoliciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
