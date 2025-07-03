import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterOutlet, RouterLink, Router, ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '../../features/auth/auth.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgentService } from '../../features/agent/agent.service';
 
@Component({
  selector: 'app-agent-layout', // Changed selector
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatBadgeModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './agent-layout.component.html', // Changed template URL
  styleUrls: ['./agent-layout.component.css'] // Changed style URL
})
export class AgentLayoutComponent implements OnInit, OnDestroy { // Renamed class
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
 
  mobileQuery: MediaQueryList;
  isSidenavOpened: boolean = true; // Sidenav starts opened on desktop
 
  userName: string = ' '; // Changed to agent name
  private agentProfileSubscription :any;
  userProfilePicture: string = 'https://cdn-icons-png.flaticon.com/128/11938/11938037.png'; // Kept same profile picture
  notificationsCount: number = 5; // Example notification count for agent
 
  private _mobileQueryListener: () => void;
 
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService:AuthService,
    private snackBar:MatSnackBar,
    private agentService:AgentService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this._mobileQueryListener = () => {
      this.isSidenavOpened = !this.mobileQuery.matches;
      if (!this.mobileQuery.matches && this.sidenav && !this.isSidenavOpened) {
        this.sidenav.open();
      } else if (this.mobileQuery.matches && this.sidenav && this.isSidenavOpened) {
        this.sidenav.close();
      }
      changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }
 
  ngOnInit(): void {
    this.isSidenavOpened = !this.mobileQuery.matches;
 
    if (this.sidenav) {
        if (this.isSidenavOpened) {
            this.sidenav.open();
        } else {
            this.sidenav.close();
        }
    }
 
    this.agentProfileSubscription = this.agentService.getAgentProfile$().subscribe(profile => {
      if (profile) {
        this.userName = profile.name || profile.username || '';
      }
    });
    this.loadNotificationsCount();
  }
 
  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
 
  loadUserData(): void {
    console.log('Fetching agent data...');
    // Implement actual fetching of agent data here, similar to CustomerDashboard
    // For example, from an AuthService or AgentService
    // this.userName = this.authService.getAgentName();
    // this.userId = this.authService.getAgentId();
  }
 
  loadNotificationsCount(): void {
    console.log('Fetching agent notifications count...');
    // Implement actual fetching of agent notifications count here
  }
 
  onProfileClick(): void {
    console.log('Profile clicked: Navigating to agent profile page.');
    this.router.navigate(['/agent/agent-profile']); // Adjusted route for agent profile
    if (this.mobileQuery.matches && this.sidenav) {
      this.sidenav.close();
    }
  }
 
  onSignOut(): void {
    console.log('Logout clicked: Performing sign out...');
 
    this.authService.logout().subscribe({
      next: (res) => {
        this.snackBar.open('Logged out Successfully', 'Close', { duration: 3000 });
        localStorage.clear(); // Clear any stored tokens or user data
        this.router.navigate(['/login']);
        if (this.mobileQuery.matches && this.sidenav) {
          this.sidenav.close();
        }
      },
      error: (err) => {
        this.snackBar.open('Logout failed. Please try again.', 'Close', { duration: 3000 });
        console.error('Logout error:', err);
      }
    });
  }
 
 
 
  onBellIconClick(): void {
    console.log('Bell icon clicked: Navigating to notifications page.');
    // Keep relativeTo this.activatedRoute if notifications is a child route of agent-dashboard
    this.router.navigate(['notifications'], { relativeTo: this.activatedRoute });
    if (this.mobileQuery.matches && this.sidenav) {
      this.sidenav.close();
    }
  }
}