import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider'; // Keep this for menu dividers
import { Router, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs'; // For managing subscriptions
import { AuthService } from '../../features/auth/auth.services';
import { MatSnackBar } from '@angular/material/snack-bar';
 
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
 
  // Private field to store the media query listener function
  private _mobileQueryListener: () => void;
  // Subject for managing component destruction and unsubscribing from observables
  private destroy$ = new Subject<void>();
 
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
 
  ngOnInit(): void {
    this.isSidenavOpened = !this.mobileQuery.matches;
  }
 
  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    this.destroy$.next();
    this.destroy$.complete();
  }
 
  // Handle click on the 'Logout' menu item
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
 
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}