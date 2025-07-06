/*This component is responsible for managing the layout and behavior of the customer dashboard in your application. */
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
import { CustomerService } from '../../features/customer/customer.service';
import { AuthService } from '../../features/auth/auth.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component.spec';
import { MatDialog } from '@angular/material/dialog';
 /*selector: Used to include this component in HTML.
standalone: true: This component doesn’t need to be declared in an Angular module.
imports: Includes Angular Material modules and routing tools needed for layout and navigation.*/
@Component({
  selector: 'app-customer-layout',
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
  templateUrl: './customer-layout.component.html',
  styleUrls: ['./customer-layout.component.css']
})
export class CustomerLayoutComponent implements OnInit, OnDestroy {
  /*sidenav: Reference to the side navigation panel.
mobileQuery: Used to detect screen size (mobile vs desktop).
isSidenavOpened: Controls whether the side menu is open.
userName, userProfilePicture, notificationsCount: Display user info and notifications.*/
  @ViewChild('sidenav') sidenav!: MatSidenav;
 
  mobileQuery: MediaQueryList;
  isSidenavOpened: boolean = true; // Sidenav starts opened on desktop
 
  userName: string = '';
  private customerProfileSubscription:any;
 
  userProfilePicture: string = 'https://cdn-icons-png.flaticon.com/128/11938/11938037.png';
  notificationsCount: number = 2;
 
  private _mobileQueryListener: () => void;

  /*Sets up a listener to detect screen size changes.
Automatically opens or closes the side menu based on screen size.*/
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private customerService:CustomerService,
    private authService:AuthService,
    private snackBar:MatSnackBar,
    private dialog:MatDialog
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


  /*Initializes the layout based on screen size.
Subscribes to customer profile data from the backend.
Loads notification count.*/
  ngOnInit(): void {
    this.isSidenavOpened = !this.mobileQuery.matches;
 
    if (this.sidenav) {
        if (this.isSidenavOpened) {
            this.sidenav.open();
        } else {
            this.sidenav.close();
        }
    }
 
    this.customerProfileSubscription = this.customerService.getCustomerProfile$().subscribe(profile => {
      if (profile) {
        this.userName = profile.name || profile.username || '';
      }
    });
    this.loadNotificationsCount();
  }

  /*Cleans up the screen size listener when the component is destroyed.*/
  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
 
  loadUserData(): void {
    console.log('Fetching user data...');
  }
 
  loadNotificationsCount(): void {
    console.log('Fetching notifications count...');
  }

  /*Navigates to the customer profile page.*/
  onProfileClick(): void {
    console.log('Profile clicked: Navigating to user profile page.');
    this.router.navigate(['/customer/customer-profile']);
    if (this.mobileQuery.matches && this.sidenav) {
      this.sidenav.close();
    }
  }

  /*Logs the user out:

Calls authService.logout()
Clears local storage
Shows a snackbar message
Redirects to login page*/
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

  /*If user confirms, calls customerService.deleteCustomer()
Shows success or error message
Redirects to home page*/
  onDeleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
 
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.customerService.deleteCustomer().subscribe({
          next: (res) => {
            this.snackBar.open('Account deleted Successfully', 'Close', { duration: 3000 });
            localStorage.clear();
            this.router.navigate(['/home']);
            if (this.mobileQuery.matches && this.sidenav) {
              this.sidenav.close();
            }
          },
          error: (err) => {
            this.snackBar.open('Deletion failed. Please try again.', 'Close', { duration: 3000 });
            console.error('Logout error:', err);
          }
        });
      }
 
    });
  }
 
 /*Navigates to the notifications page.*/
  onBellIconClick(): void {
    console.log('Bell icon clicked: Navigating to notifications page.');
    this.router.navigate(['customer-notification'], { relativeTo: this.activatedRoute });
    if (this.mobileQuery.matches && this.sidenav) {
      this.sidenav.close();
    }
  }
}
