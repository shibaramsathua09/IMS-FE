import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePolicyComponent } from './update-policy.component';

describe('UpdatePolicyComponent', () => {
  let component: UpdatePolicyComponent;
  let fixture: ComponentFixture<UpdatePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
