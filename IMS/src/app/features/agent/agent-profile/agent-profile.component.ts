import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AgentProfileResponseDto } from '../dtos/agentProfileResponse.dto';
 
import { ApiResponse } from '../../../shared/api-response.interface';
import { AgentProfileUpdateRequestDto } from '../dtos/agentProfileUpdateResponse.dto';
import { AgentService } from '../agent.service';
 
@Component({
  selector: 'app-agent-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDividerModule],
  templateUrl: './agent-profile.component.html',
  styleUrl: './agent-profile.component.css'
})
export class AgentProfileComponent implements OnInit {
 
 
 
  user:  AgentProfileResponseDto= {} as  AgentProfileResponseDto;
   
    profileForm: FormGroup;
    // Initialize with a default or current profile image URL
    profileImageUrl: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfl0ysscI4q3OX1RU9o7N6MKpQ4GJdczAmlA&s';
   
    isEditing = false;
   
   
    constructor(private fb: FormBuilder,private agentService: AgentService) {
      this.profileForm = this.fb.group({
        name: '',
        contactInfo: '',
       username: '',
        agentId: ''  
       
      });
    }
   
    ngOnInit(): void {
      this.agentService.fetchAndStoreAgentProfile().subscribe({
        next: (res) => {
          if (res.isSuccess && res.data) {
            this.user = res.data;
            this.profileForm.patchValue({
              name: res.data.name,
              contactInfo: res.data.contactInfo,
              username: res.data.username,
              agentId: res.data.agentId
            });
          }
        },
        error: (err) => {
          console.error('Error loading profile:', err);
        }
      });
      this.getAgentProfile();
    }
 
   
    getAgentProfile(): void {
      // Use the observable from the BehaviorSubject
      this.agentService.getAgentProfile$().subscribe({
        next: (profile) => {
          console.log('Fetched profile from API:', profile);

          if (profile) {
            this.user = profile;
            this.profileForm.patchValue({
              name: profile.name,
              contactInfo: profile.contactInfo,
              username: profile.username,
              agentId: profile.agentId
             
            });
          } else {
            // If not loaded yet, fetch and store, then patch
            this.agentService.fetchAndStoreAgentProfile().subscribe({
              next: (response: ApiResponse<AgentProfileResponseDto>) => {
                if (response.isSuccess && response.data) {
                  this.user = response.data;
                  this.profileForm.patchValue({
                    name: response.data.name,
                    contactInfo: response.data.contactInfo,
                    agentId: response.data.agentId,
                    username: response.data.username,
                   
                  });
                } else {
                  console.error('Failed to load user profile:', response.message);
                }
              },
              error: (error: any) => {
                console.error('Error fetching user profile:', error);
              },
              complete: () => {
                console.log('User profile loaded successfully');
              },
            });
          }
        },
        error: (error: any) => {
          console.error('Error fetching user profile:', error);
        },
        complete: () => {
          console.log('User profile loaded successfully');
        },
      });
    }
   
    enableEdit(): void {
      this.isEditing = true;
      this.getAgentProfile(); // Ensure form is populated with current user data on edit
    }
   
    updateProfile(): void {
      if (this.profileForm.valid) {
        console.log('Profile updated:', this.profileForm.value);
        const payload = this.profileForm.value as AgentProfileUpdateRequestDto;
        this.agentService.updateAgentProfile(payload).subscribe({
          next: (response: ApiResponse<boolean>) => {
            if (response.isSuccess) {
              console.log('Profile updated successfully');
            } else {
              console.error('Failed to update profile:', response.message);
            }
          },
          error: (error) => {
            console.error('Error updating profile:', error);
          }
        });
        this.user = { ...this.user, ...this.profileForm.value };
        // In a real application, you would send profileImageUrl to your backend here
        console.log('New Profile Image URL:', this.profileImageUrl);
        this.isEditing = false;
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
      this.getAgentProfile(); // Revert form to original values on cancel
    }
  }