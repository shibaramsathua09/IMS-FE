// src/app/claims/claims.component.ts
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ClaimStatusResponseDtoForCustomer } from '../dtos/claimStatusResponseDtoForCustomer.dto';
import { MatPaginator } from '@angular/material/paginator'; // Correctly imported
import { CustomerService } from '../customer.service';
import { ApiResponse } from '../../../shared/api-response.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customer-claims',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginator // MatPaginator included in imports for standalone component
  ],
  templateUrl: './customer-claims.component.html',
  styleUrls: ['./customer-claims.component.css']
})
export class CustomerClaimsComponent implements OnInit, AfterViewInit {

  searchText: string = '';
  totalClaims: number = 0; // Total number of claims for pagination display (if needed in template)
  claims: ClaimStatusResponseDtoForCustomer[] = []; // Raw data from the API
  displayedColumns: string[] = ['sno', 'claimId', 'policyName', 'claimAmount', 'filedDate','status'];
  dataSource = new MatTableDataSource<ClaimStatusResponseDtoForCustomer>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Used for pagination functionality
  @ViewChild(MatSort) sort!: MatSort; // Used for sorting functionality

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    // Fetch claims data when the component initializes
    this.getClaims();
  }

  ngAfterViewInit(): void {
    // Assign the MatPaginator and MatSort to the dataSource after the view has been initialized.
    // This is crucial because @ViewChild decorated properties are only available after ngAfterViewInit.
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Fetches claims data from the CustomerService.
   * Handles both successful responses and errors.
   */
  getClaims(): void {
    this.customerService.getClaims().subscribe({
      next: (response: ApiResponse<ClaimStatusResponseDtoForCustomer[]>) => {
        if (response.isSuccess) {
          console.log('Claims fetched successfully:', response.data);
          // Assign the fetched data to the 'claims' array
          this.claims = response.data;
          // Update the MatTableDataSource with the fetched data
          this.dataSource.data = this.claims;
          // Update the total claims count (useful if you display it separately or for debugging)
          this.totalClaims = this.claims.length;
          // The MatPaginator and MatSort will automatically update
          // because they are bound to the dataSource in ngAfterViewInit.
        } else {
          // Log specific error message from the API if isSuccess is false
          console.error('Failed to fetch claims:', response.message);
          // You could display a user-friendly error message here (e.g., using MatSnackBar)
        }
      },
      error: (err: HttpErrorResponse) => {
        // Log the full HTTP error response
        console.error('Error fetching claims:', err);
        // Provide a user-friendly error message to the user
        // Example: this.snackBar.open('An error occurred while fetching claims. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  /**
   * Applies a filter to the MatTableDataSource based on user input.
   * This method would typically be connected to an <input> element.
   * @param event The DOM event from the input field.
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // Trim whitespace and convert to lowercase for case-insensitive filtering
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // If a paginator is present, reset to the first page after filtering
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Returns a CSS class name based on the claim status.
   * This is used to style the status column differently (e.g., green for approved, red for rejected).
   * @param status The status string of the claim.
   * @returns A CSS class string.
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved': return 'status-approved';
      case 'Rejected': return 'status-rejected';
      case 'Pending': return 'status-pending';
      default: return ''; // No specific class for unknown statuses
    }
  }
}