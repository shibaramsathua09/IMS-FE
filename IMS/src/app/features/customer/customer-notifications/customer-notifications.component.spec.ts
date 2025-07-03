import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerNotificationsComponent } from './customer-notifications.component';

describe('CustomerNotificationsComponent', () => {
  let component: CustomerNotificationsComponent;
  let fixture: ComponentFixture<CustomerNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
