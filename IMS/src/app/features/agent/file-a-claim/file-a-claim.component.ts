
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
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from '../agent.service';
import { ClaimFilingRequestDtoForAgent } from '../dtos/claimFilingRequestDtoForAgent.dto';
import { Subscription } from 'rxjs';

// REMOVED: import { Claim } from '../claims/claims.component'; // No longer importing, defined locally
// REMOVED: import { ClaimDataService } from '../services/claim-data.service'; // No longer using service
 
// Define the Claim interface directly in this file

 
@Component({
  selector: 'app-file-a-claim',
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
  templateUrl: './file-a-claim.component.html',
  styleUrls: [ './file-a-claim.component.css']
})
export class FileAClaimComponent implements OnInit {
  customerId!: number; // Added property to resolve the error
  agentId!: number; // Added property to resolve the error
  claimForm!: FormGroup;
  profileSub?:Subscription;
  // claimTypes: string[] = ['Medical', 'Accident', 'Vehicle Damage', 'Dental', 'Travel Delay', 'Critical Illness', 'Theft', 'Property Damage', 'Life Insurance', 'Hospitalization', 'Car Repair', 'Home Contents', 'Retirement Payout', 'Other'];

 
  selectedFiles: File[] | null = null;
 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private agentService: AgentService,
    // REMOVED: private claimDataService: ClaimDataService // No longer injecting the service
  ) {}
  fileClaimForm:ClaimFilingRequestDtoForAgent={
    policyId: 0,
    customerId: 0, // Assuming customerId is available in the context
    // claimType: '',
    claimAmount: 0,
    agentId:0
   
    // description: ''
  }
 
  ngOnInit(): void {
    this.claimForm = this.fb.group({
      policyId: ['', Validators.required],
      customerId: ['', Validators.required],
      claimAmount: ['', [Validators.required, Validators.min(0.01), Validators.max(10000000)]],
      agentId: ['', Validators.required]
 
    });
    this.route.queryParams.subscribe(params => {
      const policyId = params['policyId'];
      const customerId = params['customerId'];
      const agentId=params['agentId'];
 
      if (policyId) {
        this.claimForm.patchValue({ policyId: Number(policyId) });
      }
      if (customerId) {
        this.claimForm.patchValue({ customerId: Number(customerId) });
        this.customerId = customerId;
      }
      if (agentId) {
        this.claimForm.patchValue({ agentId: Number(agentId) });
        this.agentId = agentId;
      }

    });
 
    // Subscribe to customer profile from BehaviorSubject
    this.profileSub = this.agentService.getAgentProfile$().subscribe(profile => {
      if (profile) {
      
        this.agentId = profile.agentId;
        // If customerId is not already set from query param, patch it
        if (!this.claimForm.get('agentId')?.value) {
          this.claimForm.patchValue({ agentId: profile.agentId });
        }
      } else {
        // If not loaded yet, fetch and store
        this.agentService.fetchAndStoreAgentProfile().subscribe();
      }
    });
  }
 

 
  onSubmit(): void {
    if(this.claimForm.valid) {
      //this.fileClaimForm=this.claimForm.value;
      this.fileClaimForm = this.claimForm.value;
      console.log('Claim Form Submitted:', this.fileClaimForm);
      this.agentService.fileClaim(this.fileClaimForm).subscribe({
        next: (response) => {
          console.log('Claim filed successfully:', response);
          // Handle success (e.g., show a success message)
          this.router.navigate(['/agent/filed-claims']); // Navigate on success
        },
        error: (error) => {
          console.error('Error filing claim:', error);
          // Handle error (e.g., show an error message)
        }
      });
     
      // this.router.navigate(['/customer/customer-claims']);
 
    } else {
      console.error('Form is invalid. Please fill in all required fields correctly.');
      this.claimForm.markAllAsTouched();
    }
  }
 
  onCancel(): void {
    this.router.navigate(['/agent/assigned-policies']);
  }
}
