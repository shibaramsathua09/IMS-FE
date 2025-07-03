import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CustomerService } from '../../customer/customer.service';
import { AdminService } from '../admin.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { CustomerProfileResponseDto } from '../../customer/dtos/customerProfileResponse.dto';
import { MatSort } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';




@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIcon
    
  ],
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']
})
export class CustomerManagementComponent implements AfterViewInit, OnInit {
  searchText: string = '';
  totalCustomers: number = 0; // Total number of customers for pagination
  customers: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['index', 'name','username', 'email', 'phone'];
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(private adminService: AdminService,private router: Router) {}
 
  ngOnInit() {
    // Load customers when the component initializes
    this.loadCustomers();
  }
  loadCustomers(page: number = 1, size: number = 10): void {
    this.adminService.getAllCustomer(page,size)
      .pipe(
        tap(response => {
          if (response && response.data) {
            this.dataSource.data = response.data.items;
            this.totalCustomers = response.data.totalCount; 
          } else {
            console.error('API response or data is null/undefined', response);
            this.dataSource.data = [];
            this.totalCustomers = 0;
          }
        })
      )
      .subscribe({
        next: () => console.log('Customers loaded successfully',this.dataSource.data),
        error: (err) => console.error('Error fetching customers:', err)
      });
  }

 
  ngAfterViewInit() {
    // Only use paginator events to fetch new data from the backend
    this.paginator.page
      .pipe(
        tap(() =>
          this.loadCustomers(
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
          )
        )
      )
      .subscribe();
 
    // If you want to support server-side sorting, handle sort events here as well
    // (currently, only client-side sorting is set up)
 
    // Initial fetch after paginator is assigned (important for first load with pagination)
    this.loadCustomers(
      this.paginator.pageIndex + 1,
      this.paginator.pageSize
    );
  }
 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  addCustomer() {
    // Logic to add a new customer
   this.router.navigate(['/register']);
    // You can implement a dialog or form to add a new customer 
  }
}
