import { Component } from '@angular/core';
import { AdminService } from '../admin.service';
import { AbstractControl, FormBuilder, FormGroup, Validators, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgentRegisterRequestDto } from '../../agent/dtos/agentRegisterRequest.dto';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ApiResponse } from '../../../shared/api-response.interface';
import { AgentRegisterResponseDto } from '../../agent/dtos/agentRegisterResponse.dto';
 
@Component({
  selector: 'app-add-agent',
  standalone: true,
  imports: [
    // Angular modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
 
    // Angular Material modules
    MatCardModule,
    MatFormFieldModule,
 
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css']
})
export class AddAgentComponent {
  agentForm!: FormGroup;
 
  fields = [
    { name: 'Username', label: 'Username', placeholder: 'Enter username', type: 'text' },
    { name: 'Password', label: 'Password', placeholder: 'Enter password', type: 'password' },
    { name: 'ConfirmPassword', label: 'Confirm Password', placeholder: 'Re-enter password', type: 'password' },
    { name: 'Name', label: 'Name', placeholder: 'Enter full name', type: 'text' },
    { name: 'Email', label: 'Email', placeholder: 'Enter email address', type: 'email' },
    { name: 'contactInfo', label: 'Contact Info', placeholder: 'Enter contact number', type: 'text' }
  ];
 
  constructor(private fb: FormBuilder, private adminService: AdminService, private snackBar: MatSnackBar, private router: Router) {
    this.agentForm = this.fb.group({
      Username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z0-9_]+$/) // Alphanumeric and underscores
        ]
      ],
      Password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
        ]
      ],
      ConfirmPassword: ['', Validators.required],
      Name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z\s]+$/),
          Validators.maxLength(25)// Only letters and spaces
        ]
      ],
      Email: ['', [Validators.required, Validators.email]],
      contactInfo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9]\d{9}$/) // Valid Indian mobile number
        ]
      ]
    }, { validators: this.passwordMatchValidator });
   
  }
 
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('Password');
    const confirmPassword = control.get('ConfirmPassword');
 
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    } else if (confirmPassword?.hasError('mismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }
 
  onSubmit(): void {
    if (this.agentForm.valid) {
      const request: AgentRegisterRequestDto = this.agentForm.value;
      console.log("payload",request)
      this.adminService.addAgent(request).subscribe({
        next: (response: ApiResponse<AgentRegisterResponseDto>) => {
          this.snackBar.open('Agent successfully added!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.agentForm.reset();
        },
        error: (error) => {
          const errorMessage = error?.error?.message || 'Failed to add agent. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.snackBar.open('Please correct the errors in the form.', 'Close', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      this.agentForm.markAllAsTouched();
    }
  }
}