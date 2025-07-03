import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for ngFor, ngIf, etc.
import { RouterLink } from '@angular/router'; 
import { Router } from '@angular/router';// For routerLink if you use Angular routing

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-home',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.css'],
  standalone: true, // Mark component as standalone if you are using Angular 15+
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule
  ]
})
export class HomeComponent {
  constructor(private router: Router) {}
 
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
