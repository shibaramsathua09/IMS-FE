import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'; // Use MatIconModule
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'; // Import for dialog functionality
import { MatSelectModule } from '@angular/material/select'; // For validityPeriod dropdown

import { AvailablePolicyRequestDto } from '../../../customer/dtos/availablePolicyRequest.dto';
import { AdminService } from '../../admin.service';
import { ApiResponse } from '../../../../shared/api-response.interface';
import { Router } from '@angular/router';

// Import the interface for type safety

@Component({
  selector: 'app-add-policy-dialog', // Renamed selector to reflect dialog purpose
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule, // Use MatIconModule
    MatButtonModule, // Added MatButtonModule for dialog buttons
    MatDialogModule, // Essential for MatDialog components
    MatSelectModule, // Added MatSelectModule for the dropdown
  ],
  templateUrl: './create-policy.component.html',
  styleUrl: './create-policy.component.css', // You can reuse or adapt the create-policy.component.css
})
export class CreatePolicyComponent implements OnInit {
  policyForm!: FormGroup; // Use definite assignment assertion

  validityPeriods: string[] = [
    '1',
    '2',
    '3',
    '5',
    '10',
    '15',
    '20',
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreatePolicyComponent>, // Inject MatDialogRef
    private adminService: AdminService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.policyForm = this.fb.group({
      policyName: ['', Validators.required], // Changed from 'name' to 'policyName'
      premiumAmount: ['', [Validators.required, Validators.min(1)]],
      coverage: ['', Validators.required], // Changed from 'coverageDetails' to 'coverage'
      validityPeriod: ['', Validators.required],
    });
  }

  /**
   * Handles the form submission.
   * If valid, closes the dialog and returns the new policy data.
   */
  onSubmit(): void {
    if (this.policyForm.valid) {
      const newPolicy: AvailablePolicyRequestDto = {
        name: this.policyForm.value.policyName,
        basePremium: this.policyForm.value.premiumAmount,
        coverageDetails: this.policyForm.value.coverage,
        validityPeriod: this.policyForm.value.validityPeriod,
      };
      console.log("newPolicy",newPolicy)
      this.adminService.addNewPolicy(newPolicy).subscribe({
        next: (response: ApiResponse<boolean>) => {
          if (response.isSuccess && response.data) {
            console.log('New Policy  Form submitted:', newPolicy);
            // alert(`New Policy  Created successfully`);
            this.router.navigate(['admin/policy-management/view-all-policies']);
          } else {
            console.error('Failed to create New Policy:', response.message);
          }
        },
        error: (error: any) => {
          console.error('Error Submmitting the form', error);
        },
      });
      console.log('New Policy Data:', newPolicy);
      this.dialogRef.close(newPolicy); // Close dialog and return the new policy object
    } else {
      // Mark all fields as touched to display validation errors
      this.policyForm.markAllAsTouched();
      alert('Please fill in all required fields correctly.');
    }
  }

  /**
   * Closes the dialog without adding a policy.
   */
  onCancel(): void {
    this.dialogRef.close(); // Close dialog without returning data
  }
}
