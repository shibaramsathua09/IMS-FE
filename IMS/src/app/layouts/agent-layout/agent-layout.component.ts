/*A responsive sidebar for navigation.
A top toolbar with user info and actions.
Dynamic routing for different agent features.
Mobile-friendly behavior with toggling and backdrop.*/

/*Component: Decorator to define metadata for the Angular component.
OnInit, OnDestroy: Lifecycle hooks. OnInit runs when the component initializes, OnDestroy when it's destroyed.
ViewChild: Used to access a child component or DOM element (like the sidenav).
ChangeDetectorRef: Manually triggers change detection when needed (especially useful with media queries).*/
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
/*Provides common directives like ngIf, ngFor, etc.
*/
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';

/*These are Angular Material modules used for UI elements like icons, buttons, toolbar, badges, cards, menus, etc.
*/
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

/*RouterOutlet: Placeholder for routing views.
RouterLink: Directive to link to routes.
Router: Service to navigate programmatically.
ActivatedRoute: Provides info about the current route.
*/
import { RouterOutlet, RouterLink, Router, ActivatedRoute } from '@angular/router';

/*Used to detect screen size changes (e.g., mobile vs desktop)*/
import { MediaMatcher } from '@angular/cdk/layout';

/*AuthService: Handles authentication.
MatSnackBar: Displays temporary messages.
AgentService: Fetches agent-specific data.*/
import { AuthService } from '../../features/auth/auth.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgentService } from '../../features/agent/agent.service';

/*selector: HTML tag to use this component.
standalone: Indicates this is a standalone component (no need to declare in a module).
imports: Modules used in this component.
templateUrl: HTML file for layout.
styleUrls: CSS file for styling.*/
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
  /*Defines the component class and implements lifecycle hooks*/
export class AgentLayoutComponent implements OnInit, OnDestroy { // Renamed class

  /*Accesses the sidenav element in the template.*/
  @ViewChild('sidenav') sidenav!: MatSidenav;
  
 /*mobileQuery: Holds media query result.
isSidenavOpened: Controls whether sidenav is open.*/
  mobileQuery: MediaQueryList;
  isSidenavOpened: boolean = true; // Sidenav starts opened on desktop

  /*userName: Displays agent's name.
agentProfileSubscription: Stores subscription to agent profile observable.
userProfilePicture: Default profile picture.
notificationsCount: Number of notifications (static for now)*/
  userName: string = ' '; // Changed to agent name
  private agentProfileSubscription :any;
  userProfilePicture: string = 'https://cdn-icons-png.flaticon.com/128/11938/11938037.png'; // Kept same profile picture
  notificationsCount: number = 5; // Example notification count for agent

  /*Listener for screen size changes.*/
  private _mobileQueryListener: () => void;

  /*Sets up media query to detect mobile screens.
Adds a listener to open/close sidenav based on screen size.
Uses ChangeDetectorRef to manually trigger UI updates.*/
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

  
 /*Initializes sidenav state.
Subscribes to agent profile data and sets userName.
Calls method to load notifications count.*/
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
