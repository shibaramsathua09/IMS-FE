import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-admin-profile',
  standalone: true, // Mark component as standalone if you are using Angular 15+
  imports: [CommonModule, MatCardModule, MatDividerModule, MatIconModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {
  adminEmail: string = 'admin@example.com';
  adminName: string = 'Admin User';

}
