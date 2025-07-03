import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileClaimComponent } from './file-claim.component';

describe('FileClaimComponent', () => {
  let component: FileClaimComponent;
  let fixture: ComponentFixture<FileClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileClaimComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
