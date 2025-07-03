import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiledClaimsComponent } from './filed-claims.component';

describe('FiledClaimsComponent', () => {
  let component: FiledClaimsComponent;
  let fixture: ComponentFixture<FiledClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiledClaimsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiledClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
