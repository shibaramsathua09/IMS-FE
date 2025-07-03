import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router, NavigationEnd } from '@angular/router'; // Import Router and NavigationEnd
import { filter } from 'rxjs/operators'; // Import filter for RxJS
 
@Component({
  selector: 'app-policy-management',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule // Important for routerLink
  ],
  templateUrl: './policy-management.component.html',
  styleUrl: './policy-management.component.css'
})
export class PolicyManagementComponent implements OnInit {
 
  constructor(private router: Router) { } // Inject Router
 
  ngOnInit(): void {
    // --- Logic for automatic navigation to View All Policies ---
    // Subscribe to router events to check the current URL
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // If the current URL is the base policy-management path, redirect to view-all-policies
      if (event.urlAfterRedirects === '/admin/policy-management' || event.urlAfterRedirects === '/admin/policy-management/') {
        this.router.navigate(['/admin/policy-management/view-all-policies']);
      }
    });
 
    // Also handle the case where the component initializes directly on /admin/policy-management
    if (this.router.url === '/admin/policy-management' || this.router.url === '/admin/policy-management/') {
      this.router.navigate(['/admin/policy-management/view-all-policies']);
    }
  }
}
 