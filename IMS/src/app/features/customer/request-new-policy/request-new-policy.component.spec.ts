import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestNewPolicyComponent } from './request-new-policy.component';

describe('RequestNewPolicyComponent', () => {
  let component: RequestNewPolicyComponent;
  let fixture: ComponentFixture<RequestNewPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestNewPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestNewPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
