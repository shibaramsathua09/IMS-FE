import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileAClaimComponent } from './file-a-claim.component';

describe('FileAClaimComponent', () => {
  let component: FileAClaimComponent;
  let fixture: ComponentFixture<FileAClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileAClaimComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileAClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
