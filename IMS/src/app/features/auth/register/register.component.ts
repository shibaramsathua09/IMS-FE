import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
// Import Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from '../auth.services';
import { CustomerRegisterRequestDto } from '../../customer/dtos/customerRegisterRequest.dto';
 
 
@Component({ 
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
 
export class RegistrationFormComponent implements OnInit {
  registrationForm!: FormGroup;
  maxDate: Date; // Property to hold the current date
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private loginService: AuthService, private router: Router) {
    this.maxDate = new Date(); // Initialize maxDate to the current date
  }
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/),
        Validators.maxLength(20)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]],
      name: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      dateOfBirth: ['', [
        Validators.required,
        this.futureDateValidator // Add the custom validator here
      ]],
 
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
 
      address: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
 
  // Custom validator to prevent future dates
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = control.value;
    if (!selectedDate) {
      return null; // Don't validate if no date is selected (handled by Validators.required)
    }
 
    const today = new Date();
    // Normalize today's date to midnight to compare only dates, not times
    today.setHours(0, 0, 0, 0);
    // Convert selectedDate to Date object if it's a string or other format
 
    const dateToCompare = new Date(selectedDate);
    dateToCompare.setHours(0, 0, 0, 0); // Normalize selected date
    if (dateToCompare.getTime() > today.getTime()) {
      return { futureDate: true }; // Return error if selected date is in the future
    }
    return null; // No error
  }
 
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword) {
      return null;
    }
    if (confirmPassword.hasError('mismatch') && password.value === confirmPassword.value) {
      confirmPassword.setErrors(null);
    }
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }
 
  registerRequest: CustomerRegisterRequestDto = {} as CustomerRegisterRequestDto;
  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.registerRequest = this.registrationForm.value;
      console.log('Form Submitted!', this.registerRequest);
      this.loginService.register(this.registerRequest).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this._snackBar.open('Registration successful!', 'Close', {
            duration: 3000,
          });
 
          this.router.navigate(['/login']);
        },
 
        error: (error) => {
          console.error('Registration failed:', error);
          let errorMessage = 'Registration failed. Please try again.';
          if (error.error && error.error.message) {
              errorMessage = error.error.message;
          }
          this._snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this._snackBar.open('Please correct the errors in the form.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.registrationForm.markAllAsTouched();
    }
  }
}
 
 