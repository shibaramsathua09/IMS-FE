import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
// Removed MatDividerModule as it's not used in the provided HTML/logic

import { CustomerProfileResponseDto } from '../dtos/customerProfileResponse.dto';
import { CustomerService } from '../customer.service';
import { ApiResponse } from '../../../shared/api-response.interface';
import { CustomerProfileUpdateRequestDto } from '../dtos/customerProfileUpdatedRequest.dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit {

  user: CustomerProfileResponseDto = {} as CustomerProfileResponseDto;

  profileForm: FormGroup;
  // Initialize with a default or current profile image URL
  profileImageUrl: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfl0ysscI4q3OX1RU9o7N6MKpQ4GJdczAmlA&s';

  isEditing = false;

  constructor(private fb: FormBuilder, 
    private customerService: CustomerService,
    private snackBar: MatSnackBar // Removed MatDividerModule as it's not used in the provided HTML/logic
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [''],
      userId: [''],
      dateOfBirth: ['', Validators.required],
      username: ['', Validators.required],
      customerId: [''] // Added customerId to form group for potential updates or data consistency
    });
  }

  ngOnInit(): void {
    this.populateForm();
  }

  populateForm(): void {
    this.customerService.getCustomerProfile$().subscribe({
      next: (profile) => {
        if (profile) {
          this.user = profile;
          this.profileForm.patchValue({
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
            userId: profile.userId,
            dateOfBirth: profile.dateOfBirth,
            username: profile.username,
            customerId: profile.customerId,
          });
        } else {
          this.customerService.fetchAndStoreCustomerProfile().subscribe({
            next: (response: ApiResponse<CustomerProfileResponseDto>) => {
              if (response.isSuccess && response.data) {
                this.user = response.data;
                this.profileForm.patchValue({
                  name: response.data.name,
                  email: response.data.email,
                  phone: response.data.phone,
                  address: response.data.address,
                  userId: response.data.userId,
                  dateOfBirth: response.data.dateOfBirth,
                  username: response.data.username,
                  customerId: response.data.customerId,
                });
              } else {
                console.error('Failed to load user profile:', response.message);
              }
            },
            error: (error: any) => {
              console.error('Error fetching user profile:', error);
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }

  enableEdit(): void {
    this.isEditing = true;
    this.populateForm(); // Ensure form is populated with current user data on edit
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const payload = this.profileForm.value as CustomerProfileUpdateRequestDto;
      this.customerService.updateCustomerProfile(payload).subscribe({
        next: (response: ApiResponse<boolean>) => {
          if (response.isSuccess) {
            console.log('Profile updated successfully');
            this.snackBar.open('Profile updated successfully', 'Close', {
              duration: 3000
            });
            
            // Update the local user object with the form's current values
            this.user = { ...this.user, ...this.profileForm.value };
            this.isEditing = false;
          } else {
            console.error('Failed to update profile:', response.message);
          }
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        }
      });
      // In a real application, you would send profileImageUrl to your backend here
      // console.log('New Profile Image URL:', this.profileImageUrl); // Removed this console log
    } else {
      Object.values(this.profileForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.populateForm(); // Revert form to original values on cancel
  }

  /**
   * Handles the file selection for updating the profile image.
   * In a real application, you would upload this file to a server
   * and update the profileImageUrl with the URL returned by the server.
   * For this example, we'll use FileReader to display a local preview.
   * @param event The file input change event.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Basic file type validation (optional)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPEG, PNG, and GIF images are allowed.');
        input.value = ''; // Clear the input
        return;
      }

      // Max file size (optional, e.g., 5MB)
      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSize) {
        alert('File size exceeds the limit of 5MB.');
        input.value = ''; // Clear the input
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = reader.result as string;
        // In a real application, you would typically upload 'file' to a backend
        // and then update 'profileImageUrl' with the URL provided by the backend.
        // console.log('File selected and preview generated.'); // Removed this console log
      };
      reader.readAsDataURL(file);
    }
  }
}