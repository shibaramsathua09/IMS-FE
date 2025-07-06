//This component defines the layout and behavior for an admin dashboard in an Angular application.
//Used to detect screen size changes (e.g., switching between mobile and desktop views).
import { MediaMatcher } from '@angular/cdk/layout';

/*Component: Decorator to define metadata for the component.
OnInit, OnDestroy: Lifecycle hooks.
ViewChild: Access child components or DOM elements.
ChangeDetectorRef: Manually triggers change detection when needed.*/
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

/*These are Angular Material modules used to build the UI (sidenav, toolbar, icons, buttons, menus, etc.).*/
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider'; // Keep this for menu dividers

/*AuthService: Handles authentication and logout.
MatSnackBar: Displays temporary messages (e.g., logout success/failure).*/
import { Router, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs'; // For managing subscriptions
import { AuthService } from '../../features/auth/auth.services';
import { MatSnackBar } from '@angular/material/snack-bar';

/*elector: HTML tag used to include this component.
templateUrl: Path to the HTML file.
styleUrl: Path to the CSS file.
standalone: Indicates this is a standalone component (not declared in a module).
imports: Modules used in this component.*/
@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ]
})

export class AdminLayoutComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  isSidenavOpened: boolean = true;
  @ViewChild('sidenav') sidenav!: MatSidenav;
 
  // User-related data for the admin dashboard
  userName: string = 'Admin User'; // Example admin user name
  userProfilePicture: string = 'https://cdn-icons-png.flaticon.com/128/18570/18570963.png'; // Placeholder for admin profile picture

  /*_mobileQueryListener: Function to handle screen size changes.
destroy$: Used to unsubscribe from observables when the component is destroyed.*/
  // Private field to store the media query listener function
  private _mobileQueryListener: () => void;
  // Subject for managing component destruction and unsubscribing from observables
  private destroy$ = new Subject<void>();

  /*Sets up a media query to detect if the screen is mobile-sized.
Defines a listener to toggle the sidenav based on screen size.
Uses ChangeDetectorRef to manually trigger UI updates.
Adds the listener to the media query.
*/
  constructor(
    private authService:AuthService,
    private snackBar:MatSnackBar,
    private router: Router,
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
 
    this._mobileQueryListener = () => {
      this.isSidenavOpened = !this.mobileQuery.matches;
      this.changeDetectorRef.detectChanges();
    };
 
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }
 //Initializes the sidenav state based on screen size.
  ngOnInit(): void {
    this.isSidenavOpened = !this.mobileQuery.matches;
  }

  /*Removes the media query listener to prevent memory leaks.
    Emits and completes the destroy$ subject to clean up subscriptions.*/
  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.destroy$.next();
    this.destroy$.complete();
  }
 
  // Handle click on the 'Logout' menu item
  /*Calls the logout method from AuthService.
Shows a success or error message using MatSnackBar.
Clears local storage and navigates to the login page.
Closes the sidenav on mobile.*/
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
 //A helper method to navigate to a given route
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
