import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailablePoliciesComponent } from './available-policies.component';

describe('AvailablePoliciesComponent', () => {
  let component: AvailablePoliciesComponent;
  let fixture: ComponentFixture<AvailablePoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailablePoliciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailablePoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
