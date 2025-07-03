import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// Assuming these DTOs are defined in your project
import { CustomerRegisterResponseDto } from '../dtos/customerRegisterResponse.dto';
import { CustomerPoliciesResponseDto } from '../dtos/customerPoliciesResponse.dto';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Import MatPaginatorModule
import { CustomerService } from '../customer.service';
import { ApiResponse } from '../../../shared/api-response.interface';
 
@Component({
  selector: 'app-customer-registered-policies',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSortModule,
    MatButtonModule,
    RouterModule,
    MatPaginatorModule, // Added MatPaginatorModule to imports
    // MatDialogModule // Uncomment and add MatDialogModule if you are using MatDialog
  ],
  templateUrl: './customer-registered-policies.component.html',
  styleUrls: ['./customer-registered-policies.component.css']
})
export class CustomerRegisteredPoliciesComponent implements OnInit, AfterViewInit {
  searchText: string = '';
  totalPolicies: number = 0; // Total number of policies for pagination display (if needed in template)
  registerdPolicies: CustomerPoliciesResponseDto[] = []; // Raw data from the API, assuming Policy is defined elsewhere
 
  // Defines the columns to be displayed in the table
  displayedColumns: string[] = [
    'policyId',
    'availablePolicyName',
    'issuedDate',
    'expiryDate',
    'agentName',
    'agentContact',
    'premiumAmount',
    'actions'
  ];
  // DataSource for the Material Table, initialized with an empty array
  dataSource = new MatTableDataSource<CustomerPoliciesResponseDto>([]);
 
  // ViewChild to get a reference to the MatPaginator component in the template
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Used for pagination functionality
  // ViewChild to get a reference to the MatSort component in the template
  @ViewChild(MatSort) sort!: MatSort;
  loggedInCustomerId:number|null=null;
 
  // Constructor to inject services
  constructor(private router: Router, private customerService: CustomerService) { }
 
  // Lifecycle hook: Called after Angular has initialized all data-bound properties of a directive.
  ngOnInit() {
    this.customerService.getCustomerProfile$().subscribe((profile) => {
      if (profile) {
     
        // Ensure customerId is always a number
        this.loggedInCustomerId =
          typeof profile.customerId === 'string'
            ? Number(profile.customerId)
            : profile.customerId;
      } else {
        this.customerService.fetchAndStoreCustomerProfile().subscribe();
      }
    });
    this.getRegisteredPolicies(); // Fetch policies when the component initializes
  }
 
  // Lifecycle hook: Called after Angular has fully initialized a component's view.
  ngAfterViewInit(): void {
    // Assign the paginator and sort instances to the dataSource after
    //  the view has initialized
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
 
  // Fetches registered policies from the customer service
  getRegisteredPolicies(): void {
    this.customerService.getCustomerPolicies().subscribe({
      next: (response: ApiResponse<CustomerPoliciesResponseDto[]>) => {
        if (response.isSuccess && response.data) {
          this.registerdPolicies = response.data || []; // Ensure data is an array
          this.dataSource.data = this.registerdPolicies; // Assign data to MatTableDataSource
          this.totalPolicies = this.registerdPolicies.length; // Update total policies count
        } else {
          console.error('Failed to fetch registered policies:', response.message);
        }
      },
      error: (error: any) => {
        console.error('Error fetching registered policies:', error);
      }
    });
  }
 
  // Applies filter to the table data based on user input
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
 
    // If a paginator is available, reset to the first page after filtering
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 
  // Checks if claiming is enabled for a given policy (currently always true)
  isClaimEnabled(policy: { status: string }): boolean {
    return true;
  }
 
  // Handles the "File a Claim" action for a policy
  fileAClaim(policy: CustomerPoliciesResponseDto): void {
    console.log(`Attempting to file a claim for Policy ID: ${policy.policyId}`);
  // this.router.navigate(['/customer/file-claim'], {
  //   queryParams: {
  //     customerId: this.loggedInCustomerId,
  //     policyId: policy.policyId
  //   }
  this.router.navigate(['/customer/file-claim'], {
    queryParams: {
      customerId: this.loggedInCustomerId,
      policyName: policy.availablePolicyName // ✅ use this instead of policyId
    }
  }); // Navigates to the file claim route
 
  console.log('Claim Data:', {
    customerId: this.loggedInCustomerId,
    policyId: policy.policyId
  });
 
  }
}
 