/*You're working with an Angular component that shows a confirmation dialog when a user tries to reject something. 
This is a common UI pattern used to ask for confirmation before performing a critical action 
(like deleting or rejecting something). 
Let's break it down step by step:
This file defines the logic for the dialog box.

🔹 What it does:
Displays a confirmation dialog.
Has two buttons: Cancel and Reject.
If the user clicks Reject, it returns true.
If the user clicks Cancel, it returns false.

standalone: true: This component doesn't need to be declared in a module.
selector: The name used to include this component in other templates.
templateUrl and styleUrls: Point to the HTML and CSS files.
imports: Angular modules needed for this component to work.
*/
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
  //MatDialogRef: A reference to the dialog box. It allows you to close the dialog and send back a result.
  constructor(public dialogRef: MatDialogRef<RejectDialogComponent>) {}

  
 //These methods are called when the user clicks the buttons.

  confirm(): void {
    this.dialogRef.close(true);
   
  }
 
  cancel(): void {
    this.dialogRef.close(false);
  }
}
