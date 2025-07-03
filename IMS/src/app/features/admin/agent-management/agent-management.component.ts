import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'; // Added AfterViewInit
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'; // Needed for mat-raised-button
import { MatCardModule } from '@angular/material/card'; // Needed for mat-card
 // If you are using Flex-Layout directives (fxLayout etc.)
import { CommonModule } from '@angular/common'; // Needed for NgIf, NgFor, etc.
import { FormsModule } from '@angular/forms'; // Needed for ngModel
import { MatTabLabel } from '@angular/material/tabs';


@Component({
  selector: 'app-agent-management',
  imports: [
    CommonModule, // Ensure CommonModule is imported for *ngIf, *ngFor
    FormsModule,    // Ensure FormsModule is imported for [(ngModel)]
    MatBadgeModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, // Added for mat-raised-button
    MatCardModule,
    MatTableModule  // Added for mat-card
  ],
  standalone: true,
  templateUrl: './agent-management.component.html',
  styleUrl: './agent-management.component.css'
})
export class AgentManagementComponent implements OnInit, AfterViewInit { // Implements AfterViewInit
  searchText: string = '';
  totalAgents: number = 0;
  agents:any[] = []; // You don't need this if you're directly using dataSource.data
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['index', 'name','username', 'contactInfo'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
 
    this.fetchAgents();
  }

  ngAfterViewInit() {
    
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
     
      this.paginator.page.subscribe((event: PageEvent) => {
        this.fetchAgents(event.pageIndex + 1, event.pageSize);
      });
    } else {
      console.warn('Paginator or DataSource not initialized in ngAfterViewInit.');
    }
  }

  fetchAgents(page: number = 1, size: number = 5): void { // Default to page size 5 as per your template
    this.adminService.getAllAgents(page, size).pipe(
      tap(response => {
        if (response && response.data) {
          this.dataSource.data = response.data.items;
          this.totalAgents = response.data.totalCount;
        } else {
          this.dataSource.data = [];
          this.totalAgents = 0;
        }
      })
    ).subscribe({
      next: (response) => {
        // Data is already set in tap, but you can also do it here if tap isn't used
        this.dataSource.data = response.data.items;
        this.totalAgents = response.data.totalCount;
      },
      error: (error) => {
        console.error('Error fetching agents:', error);
        this.dataSource.data = [];
        this.totalAgents = 0;
      }
    });
  }

  // Method to handle page changes from MatPaginator
  // This method will be called when the user changes the page or page size
  onPageChange(event: PageEvent): void {
    console.log('Page event:', event);
    // The fetchAgents method is already subscribed to paginator.page in ngAfterViewInit
    // So you don't need to call fetchAgents directly here if you already have the subscription.
    // If you want to decouple the call, you could do it here and remove the ngAfterViewInit subscription.
    // For now, let's assume ngAfterViewInit's subscription is the primary handler.
    // You can remove this method if the ngAfterViewInit subscription handles everything.
    // However, based on your HTML, you *are* calling this method.
    // So, we need to ensure it calls fetchAgents correctly.
    this.fetchAgents(event.pageIndex + 1, event.pageSize);
  }


  // This method will be called when the search input changes
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Reset paginator to the first page when filter is applied
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Renamed from updateFilteredAgents() to match your template (input)
  updateFilteredAgents(): void {
    // This is called by (input)="updateFilteredAgents()"
    // Your current applyFilter method already uses event.target.value.
    // Let's modify this to use searchText directly, or consolidate with applyFilter.
    // For consistency, let's call applyFilter directly, passing the current searchText.
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  addAgent() {
   this.router.navigate(['admin/agent-management/add-agent']);
  }
}