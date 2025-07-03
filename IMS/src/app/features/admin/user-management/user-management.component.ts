import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AdminService  } from '../admin.service'; // Assuming interfaces are defined in admin.service
import { CommonModule } from '@angular/common'; // Needed for NgIf, NgFor, etc.
import { MatFormFieldModule } from '@angular/material/form-field'; // For input field
import { MatInputModule } from '@angular/material/input'; // For input itself
import { MatTableModule } from '@angular/material/table'; // For mat-table
import { MatSort, MatSortModule } from '@angular/material/sort'; // For sorting (optional, but good practice)
import { UserWithRoleResponseDto } from '../../auth/dtos/userWithRoleReponse.dto';
import { ApiResponse } from '../../../shared/api-response.interface';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
// Define ApiResponse locally if it is not exported from the module

@Component({
  selector: 'app-user-management',
  standalone: true, // Use standalone components as per modern Angular practices
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginator, // MatPaginator is a standalone component in newer Angular versions
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    FormsModule,
    MatIcon,
    MatCardModule // Include MatSortModule if using MatSort
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  searchText: string = '';
  totalUsers: number = 0;
  users: UserWithRoleResponseDto[] = []; // Use the DTO type for better type safety
  dataSource = new MatTableDataSource<UserWithRoleResponseDto>([]);
  displayedColumns: string[] = ['sno', 'username', 'role','isDeleted'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; // Add MatSort for optional sorting

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  // AfterViewInit is used to ensure ViewChild elements (like paginator, sort) are available
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; // Assign sort to data source
  }

  fetchUsers():void {
    this.adminService.getAllUsers().subscribe({
      next: (response: ApiResponse<UserWithRoleResponseDto[]>) => {
        if (response.isSuccess && response) {
          this.users = response.data || []; // Ensure data is an array
          this.dataSource.data = this.users; // Assign data to MatTableDataSource
          this.totalUsers = this.users.length; // Update total users count
          // Paginator and Sort are assigned in ngAfterViewInit, but ensure data is set first
        } else {
          console.error('Failed to fetch users:', response.message);
          // Optionally, display an error message to the user
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        // Handle API errors (e.g., show a toast message)
      },
      complete: () => {
        console.log('User fetching completed.');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Reset the paginator if a filter is applied to ensure correct pagination
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Removed changePage as MatPaginator handles it internally.
  // Removed currentPage and totalPages as they are managed by MatPaginator.
}

// Assuming these interfaces are defined in admin.service.ts or a shared models file
// For completeness, I'll include them here, but they should ideally come from your service.
