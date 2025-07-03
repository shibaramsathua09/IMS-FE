// logincomponent.ts
import { Component, Injectable } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { LoginRequestDto } from '../dtos/login-request.dto';
import { AuthService } from '../auth.services';
import { ApiResponse } from '../../../shared/api-response.interface';
import { LoginResponseDto } from '../dtos/loginResponse.dto';
import { CommonModule } from '@angular/common';

// Import Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule, // Add ReactiveFormsModule
    CommonModule,
    RouterLink,
    MatCardModule,         // Add MatCardModule
    MatFormFieldModule,    // Add MatFormFieldModule
    MatInputModule,        // Add MatInputModule
    MatButtonModule        // Add MatButtonModule
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null; // Declare errorMessage property and initialize it

  constructor(private fb: FormBuilder, private router: Router, private loginService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  loginRequest: LoginRequestDto = {
    username: '',
    password: ''
  };

  onLogin() {
    console.log('Login button clicked');
    this.errorMessage = null; // Clear any previous error message on new login attempt
    if (this.loginForm.valid) {
      this.loginRequest = this.loginForm.value;
      console.log('Attempting login with:', this.loginRequest);
      this.loginService.login(this.loginRequest).subscribe({
        next: (response: ApiResponse<LoginResponseDto>) => {
          if (response.data?.token) {
            localStorage.setItem('token', response.data.token);
          }
          
          console.log('Login successful:', response);
          if (response.data && response.data.role) {
            if (response.data.role === 'Admin') {
              this.router.navigate(['/admin/admin-dashboard']);
            } else if (response.data.role === 'Customer') {
              this.router.navigate(['/customer/customer-dashboard']);
            } else if (response.data.role === 'Agent') {
              this.router.navigate(['/agent/agent-dashboard']);
            } else {
              console.warn('Unknown role:', response.data.role);
              this.errorMessage = 'Login successful, but role is unknown. Please contact support.';
            }
          } else {
            this.errorMessage = 'Login successful, but no role information received.';
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          // Set the error message based on the API response or a generic message
          if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'Invalid username or password.';
          } else if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
          }
        }
      });
    }
  }
}