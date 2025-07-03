import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { CommonModule, NgFor, NgIf, DecimalPipe } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { MatInputModule } from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatIconModule } from '@angular/material/icon';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { MatButtonModule } from '@angular/material/button';

import { Router, RouterModule } from '@angular/router'; // Ensure RouterModule is here for standalone

import { MatSort, MatSortModule } from '@angular/material/sort';

import { CustomerService } from '../customer.service'; // Assuming this service is correctly implemented

import { pipe, tap } from 'rxjs'; // Keep if used elsewhere, not strictly needed for this change

import { AvailablePolicyRequestDto } from '../dtos/availablePolicyRequest.dto'; // Keep if used elsewhere

import { AvailablePolicyResponseDto } from '../dtos/availablePolicyResponse.dto'; // Keep if used elsewhere

import { ApiResponse } from '../../../shared/api-response.interface'; // Keep if used elsewhere

import { PagedResult } from '../../../shared/pagedResult.dto'; // Keep if used elsewhere

@Component({
  selector: 'app-available-policies',

  standalone: true,

  imports: [
    CommonModule,

    MatTableModule,

    MatInputModule,

    MatFormFieldModule,

    MatIconModule,

    MatPaginatorModule,

    MatButtonModule,

    MatSortModule,

    DecimalPipe, // Added for clarity

    RouterModule, // Important for standalone components using Router
  ],

  templateUrl: './available-policies.component.html',

  styleUrls: ['./available-policies.component.css'],
})
export class AvailablePoliciesComponent implements OnInit, AfterViewInit {
  searchText: string = '';

  totalPolicies: number = 0;

  availablePolicies: AvailablePolicyResponseDto[] = [];

  dataSource = new MatTableDataSource<AvailablePolicyResponseDto>([]);

  displayedColumns: string[] = [
    'sno',
    'id',
    'name',
    'coverageDetails',
    'basePremium',
    'validityPeriod',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  // Simulate a logged-in customer ID.

  // In a real application, fetch this from your authentication state/service.
 customerName:string='';
  loggedInCustomerId: number | null=null; // Replace 123 with actual logic to get customer ID

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.customerService.getCustomerProfile$().subscribe((profile) => {
      if (profile) {
        this.customerName = profile.name;
        // Ensure customerId is always a number
        this.loggedInCustomerId =
          typeof profile.customerId === 'string'
            ? Number(profile.customerId)
            : profile.customerId;
      } else {
        this.customerService.fetchAndStoreCustomerProfile().subscribe();
      }
    });
    this.getAvailablePolicies();
  }

  getAvailablePolicies(page: number = 1, size: number = 10): void {
    // Note: If your backend paginates, you should pass `page` and `size` to customerService.getAllAvailablePolicies

    // and then update `this.totalPolicies` with `response.data.totalItems` or similar from your PagedResult.

    this.customerService
      .getAllAvailablePolicies(page, size)

      .subscribe({
        next: (
          response: ApiResponse<PagedResult<AvailablePolicyResponseDto>>
        ) => {
          // Use specific types if available

          if (response.isSuccess && response.data) {
            this.availablePolicies = response.data.items;

            this.dataSource.data = this.availablePolicies;

            this.totalPolicies = response.data.totalCount; // Assuming totalCount is in PagedResult
          } else {
            console.error(
              'Failed to fetch available policies:',
              response.message
            );
          }
        },

        error: (error: any) => {
          console.error('Error fetching available policies:', error);
        },
      });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;

    // this.dataSource.sort = this.sort;

    // Listen for paginator changes to re-fetch data for the new page

    this.paginator.page
      .pipe(
        tap(() =>
          this.getAvailablePolicies(
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
          )
        )
      )
      .subscribe();

    // Re-fetch on sort change

    // this.sort.sortChange
    //   .pipe(
    //     tap(() => {
    //       this.paginator.firstPage(); // Go to first page on sort change

          // You would typically pass sort parameters (e.g., this.sort.active, this.sort.direction)

          // to your backend API call (getAvailablePolicies) here if backend sorting is implemented.

        
        
      
        

    // Initial fetch after paginator and sort are assigned (important for first load with pagination/sort)

    this.getAvailablePolicies(
      this.paginator.pageIndex + 1,
      this.paginator.pageSize
    );

    // Custom sorting for specific columns (if default string/number comparison isn't enough)

    this.dataSource.sortingDataAccessor = (
      item: AvailablePolicyResponseDto,
      property: string
    ) => {
      switch (property) {
        case 'basePremium': // For 'Premium Amount' column
          return item.basePremium;

        case 'validityPeriod': // For 'Tenure' column
          return item.validityPeriod; // Assuming validityPeriod is directly sortable (e.g., number of years)

        case 'coverageDetails': // For 'Coverage' column
          // Implement custom logic if coverageDetails contains strings like "5 Lakhs"

          // and you want to sort numerically. Example from your previous code:

          const coverageValue = parseFloat(
            item.coverageDetails.replace(/[^0-9.]/g, '')
          );

          if (item.coverageDetails.includes('Lakhs')) {
            return coverageValue * 100000;
          } else if (item.coverageDetails.includes('Crore')) {
            return coverageValue * 10000000;
          } else if (item.coverageDetails.includes('USD')) {
            return coverageValue * 83; // Example conversion rate USD to INR
          }

          return coverageValue;

        default:
          return (item as any)[property];
      }
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // MODIFIED METHOD: Now passes availablePolicyId and customerId to the request-policy component

  // applyForPolicy(availablePolicyId: number): void {
  //   console.log(
  //     `Navigating to request policy for Available Policy ID: ${availablePolicyId}, Customer ID: ${this.loggedInCustomerId}`
  //   );

  //   this.router.navigate(['/customer/request-newPolicy'], {
  //     queryParams: {
  //       availablePolicyName: availablePolicyId,

  //       customerId: this.loggedInCustomerId,
  //     },
  //   });
  // }
  applyForPolicy(policy: AvailablePolicyResponseDto): void {
    console.log('FULL policy object:', policy); // 🎉 Now you'll see the real object
    console.log(`Navigating to request policy for NAME: ${policy.name}, Customer ID: ${this.loggedInCustomerId}`);
  
    this.router.navigate(['/customer/request-newPolicy'], {
      queryParams: {
        availablePolicyName: policy.name,
        customerId: this.loggedInCustomerId
      }
    });
}

}
