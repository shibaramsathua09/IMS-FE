
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute, RouterModule } from '@angular/router'; // Import ActivatedRoute
import { CustomerService } from '../customer.service';
import { PolicyRequestDto } from '../dtos/policyrequest.dto';
import { ApiResponse } from '../../../shared/api-response.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, tap } from 'rxjs';
 

 
@Component({
  selector: 'app-request-new-policy',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule // Needed for standalone component imports
  ],
  templateUrl: './request-new-policy.component.html',
  styleUrls: ['./request-new-policy.component.css']
})
export class RequestNewPolicyComponent implements OnInit {
  requestForm!: FormGroup;
  policyRequest:PolicyRequestDto[]=[];
 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, // Inject ActivatedRoute to read URL parameters
    private customerService:CustomerService,
    private snackBar:MatSnackBar
  ) {}
 
  ngOnInit(): void {
    // Initialize the form group with validators
    this.requestForm = this.fb.group({
      availablePolicyName: ['', [Validators.required]],//, Validators.pattern(/^[0-9]+$/)]], // Ensure it's a number
      customerId: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]] // Ensure it's a number
    });
 
    // Subscribe to query parameters to pre-fill the form
    this.route.queryParams.subscribe(params => {
      const availablePolicyName = params['availablePolicyName'];
      const customerId = params['customerId'];
 
      // Patch the form values if parameters are present
      if (availablePolicyName) {
        this.requestForm.patchValue({ availablePolicyName: (availablePolicyName) });
        // Optionally disable the field if it should not be editable after pre-filling
        // this.requestForm.get('availablePolicyId')?.disable();
      }
      if (customerId) {
        this.requestForm.patchValue({ customerId: Number(customerId) });
        // Optionally disable the field if it should not be editable after pre-filling
        // this.requestForm.get('customerId')?.disable();
      }
    });
  }
 
 
  onSubmit(): void {
    const formValues = this.requestForm.getRawValue();

    if (this.requestForm.valid) {
      const policyRequest: PolicyRequestDto = {
        availablePolicyName: (formValues.availablePolicyName),
        customerId: Number(formValues.customerId)
      };

      console.log('Policy Request from submitted:', policyRequest);

      this.customerService.requestPolicy(policyRequest).pipe(
        tap((response: ApiResponse<boolean>) => {
          if (response.isSuccess) {
            console.log('Policy Requested Successfully:', response);
            this.snackBar.open(`Policy request successful! ${response.message || ''}`, 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success'] // Apply success styling
            });
            // Navigate only on successful policy request
            this.router.navigate(['/customer/policy-requests']);
          } else {
            // Handle cases where API call was successful but backend logic failed
            console.error('Policy Request Failed:', response.message);
            this.snackBar.open(`Failed to request policy: ${response.message || 'Unknown error'}`, 'Close', {
              duration: 5000,
              panelClass: ['snackbar-error'] // Apply error styling
            });
          }
        }),
        catchError(error => {
          if (
            error.status === 409 &&
            error.error === "Policy request already exists for this customer."
          ) {
            this.snackBar.open("You’ve already requested this policy.", 'Close', { duration: 3000 });
          } else {
            this.snackBar.open("Something went wrong while requesting the policy.", 'Close', { duration: 3000 });
          }
          console.error('Error requesting policy:', error);
          // Handle network errors or server errors (e.g., 500 status)
          console.error('Error requesting policy:', error);
          this.snackBar.open('An unexpected error occurred while requesting the policy. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error'] // Apply error styling
          });
          // Return a new observable with a null or empty value to prevent the error from breaking the stream
          return of({ isSuccess: false, message: 'Network or server error', data: false } as ApiResponse<boolean>);
        })
      ).subscribe();

    } else {
      console.error('Form is invalid. Please fill in all required fields correctly.');
      this.requestForm.markAllAsTouched(); // Marks all fields as touched to show validation errors
      this.snackBar.open('Please correct the form errors before submitting.', 'Close', {
        duration: 5000,
        panelClass: ['snackbar-warn'] // Optional: For form validation warnings
      });
    }
  }

 onCancel(): void {
    this.router.navigate(['/customer/available-policies']); // Navigate back to available policies or a suitable page
  }
}