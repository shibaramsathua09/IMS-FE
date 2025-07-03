import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
 
@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  templateUrl: './reject-dialog.component.html',
  styleUrls: ['./reject-dialog.component.css'],
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class RejectDialogComponent {
  constructor(public dialogRef: MatDialogRef<RejectDialogComponent>) {}
 
  confirm(): void {
    this.dialogRef.close(true);
   
  }
 
  cancel(): void {
    this.dialogRef.close(false);
  }
}
