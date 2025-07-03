// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { ClaimFilingRequestDtoForCustomer } from '../dtos/claimFilingRequestDtoForCustomer.dto';
// import { CustomerService } from '../customer.service';
// // REMOVED: import { Claim } from '../claims/claims.component'; // No longer importing, defined locally
// // REMOVED: import { ClaimDataService } from '../services/claim-data.service'; // No longer using service
 
// // Define the Claim interface directly in this file

 
// @Component({
//   selector: 'app-file-claim',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatButtonModule,
//     MatIconModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//   ],
//   templateUrl: './file-claim.component.html',
//   styleUrls: ['./file-claim.component.css']
// })
// export class FileClaimComponent implements OnInit {
//   claimForm!: FormGroup;
//   // claimTypes: string[] = ['Medical', 'Accident', 'Vehicle Damage', 'Dental', 'Travel Delay', 'Critical Illness', 'Theft', 'Property Damage', 'Life Insurance', 'Hospitalization', 'Car Repair', 'Home Contents', 'Retirement Payout', 'Other'];

 
//   selectedFiles: File[] | null = null;
//   customerId: string = ''; // Define customerId property
 
//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private customerService: CustomerService,
//     private route: ActivatedRoute, // Inject ActivatedRoute to access queryParams
//     // REMOVED: private claimDataService: ClaimDataService // No longer injecting the service
//   ) {}
//   fileClaimForm:ClaimFilingRequestDtoForCustomer={
//     policyName: '',
    
//     customerId: '', // Assuming customerId is available in the context
//     // claimType: '',
//     claimAmount: 0,
   
//     // description: ''
//   }
 
//   ngOnInit(): void {
//     this.claimForm = this.fb.group({
//       policyName: ['', Validators.required],
//       customerId: ['', Validators.required],
//       claimAmount: ['', [Validators.required, Validators.min(0.01), Validators.max(10000000)]],
 
//     });
//     this.route.queryParams.subscribe(params => {
//       const policyName = params['policyName'];
//       const customerId = params['customerId'];
 
//       if (policyName) {
//         this.claimForm.patchValue({ policyName: String(policyName) });
//       }
//       if (customerId) {
//         this.claimForm.patchValue({ customerId: Number(customerId) });
//         this.customerId = customerId;
//       }
//     });
//   }
 

 
//   onSubmit(): void {
//     if(this.claimForm.valid) {
//       //this.fileClaimForm=this.claimForm.value;
//       this.fileClaimForm = this.claimForm.value;
//       console.log('Claim Form Submitted:', this.fileClaimForm);
//       this.customerService.fileClaim(this.fileClaimForm).subscribe({
//         next: (response) => {
//           console.log('Claim filed successfully:', response);
//           // Handle success (e.g., show a success message)
//           this.router.navigate(['/customer/customer-claims']); // Navigate on success
//         },
//         error: (error) => {
//           console.error('Error filing claim:', error);
//           // Handle error (e.g., show an error message)
//         }
//       });
     
//       // this.router.navigate(['/customer/customer-claims']);
 
//     } else {
//       console.error('Form is invalid. Please fill in all required fields correctly.');
//       this.claimForm.markAllAsTouched();
//     }
//   }
 
//   onCancel(): void {
//     this.router.navigate(['/customer/customer-claims']);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClaimFilingRequestDtoForCustomer } from '../dtos/claimFilingRequestDtoForCustomer.dto';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-file-claim',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './file-claim.component.html',
  styleUrls: ['./file-claim.component.css']
})
export class FileClaimComponent implements OnInit {
  claimForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.claimForm = this.fb.group({
      policyName: ['', Validators.required],
      customerId: ['', Validators.required],
      claimAmount: [
        '',
        [Validators.required, Validators.min(0.01), Validators.max(10000000)]
      ]
    });

    this.route.queryParams.subscribe(params => {
      const policyName = params['policyName'];
      const customerId = params['customerId'];

      if (policyName) {
        this.claimForm.patchValue({ policyName });
      }
      if (customerId) {
        this.claimForm.patchValue({ customerId });
      }
    });
  }

  onSubmit(): void {
    if (this.claimForm.invalid) {
      console.error('Form is invalid. Please fill in all required fields correctly.');
      this.claimForm.markAllAsTouched();
      return;
    }

    const fileClaimForm: ClaimFilingRequestDtoForCustomer = {
      policyName: this.claimForm.value.policyName,
      customerId: String(this.claimForm.value.customerId),

      claimAmount: Number(this.claimForm.value.claimAmount)
    };

    console.log('Claim Form Submitted:', fileClaimForm);

    this.customerService.fileClaim(fileClaimForm).subscribe({
      next: (response) => {
        console.log('Claim filed successfully:', response);
        this.router.navigate(['/customer/customer-claims']);
      },
      error: (error) => {
        console.error('Error filing claim:', error);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/customer/customer-claims']);
  }
}
