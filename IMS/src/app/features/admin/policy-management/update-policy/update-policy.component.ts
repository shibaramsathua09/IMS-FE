
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for ngModel
 
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // For ValidityPeriod dropdown
import { MatDialogModule } from '@angular/material/dialog'; // Crucial for dialog elements

import { AvailablePolicyRequestDto } from '../../../customer/dtos/availablePolicyRequest.dto';
import { AdminService } from '../../admin.service';
import { AvailablePolicyResponseDto } from '../view-all-policies/view-all-policies.component';
import { ApiResponse } from '../../../../shared/api-response.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
 
 // Import the interface
 
@Component({
  selector: 'app-policy-update-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule, // Add MatSelectModule
    MatDialogModule  // Add MatDialogModule
  ],
  templateUrl: './update-policy.component.html',
  styleUrl: './update-policy.component.css'
})
export class UpdatePolicyComponent implements OnInit {
  // We'll work with a copy to avoid directly modifying the original data until saved
  policyToUpdate!: AvailablePolicyResponseDto;
  //existingPolicy!: AvailablePolicyRequestDto;
 
  // Options for Validity Period dropdown
  validityPeriods: string[] = ['0', '1', '2', '3', '5', '10', '15', '20'];
  
 
  constructor(
    public dialogRef: MatDialogRef<UpdatePolicyComponent>,private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { policy: AvailablePolicyResponseDto }, private adminService: AdminService // Expects a policy object
  ) {}

  ngOnInit(): void {
    // Create a deep copy of the policy data to enable cancel/revert changes
    this.policyToUpdate = { ...this.data.policy };
  }
 
  /**
   * Handles the "Update" button click.
   * Passes the updated policy back to the calling component.
   */
  onUpdate(): void {
    // Basic validation
    if (!this.policyToUpdate.name || !this.policyToUpdate.coverageDetails ||
        this.policyToUpdate.basePremium === null || this.policyToUpdate.basePremium === undefined ||
        !this.policyToUpdate.validityPeriod) {
      alert('Please fill in all required fields.');
      return;
    }

   

    /*this.existingPolicy = {basePremium: this.policyToUpdate.basePremium,
                          coverageDetails: this.policyToUpdate.coverageDetails,
                          name: this.policyToUpdate.name,
                          validityPeriod: this.policyToUpdate.validityPeriod};*/

    

     // Assuming 'id' exists in policyToUpdate
    this.adminService.updateAvailablePolicy(this.policyToUpdate, this.policyToUpdate.id).subscribe({
          next:(
            response:ApiResponse<boolean>)=>{
              if (response.isSuccess && response.data){
                console.log('Policy Update Requested:', this.policyToUpdate);
                // alert(`Policy "${this.policyToUpdate.name}" updated successfully`);
                this.snackBar.open('Policy Updated succcesfully', 'close', {
                  duration: 3000,
                });
              }
              else{
                console.error('Failed to update Available Policies:',response.message);
              }
            },
            error:(error:any)=>{
              console.error('Error Fetching Available Policies:',error);
            },
          
        });
 
    
    this.dialogRef.close(this.policyToUpdate); // Close dialog and return the updated policy
  }
 
  /**
   * Handles the "Cancel" button click.
   * Closes the dialog without returning any data.
   */
  onCancel(): void {
    this.dialogRef.close(); // Close dialog without returning data
  }
}