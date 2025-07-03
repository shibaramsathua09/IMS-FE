import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimManagementComponent } from './claim-management.component';

describe('ClaimManagementComponent', () => {
  let component: ClaimManagementComponent;
  let fixture: ComponentFixture<ClaimManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
