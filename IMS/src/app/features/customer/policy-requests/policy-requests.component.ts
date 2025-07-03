import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PolicyRequestStatusResponseDto } from '../dtos/policyRequestStatusResponse.dto';
import { CustomerService } from '../customer.service';
import { ApiResponse } from '../../../shared/api-response.interface';

@Component({
  selector: 'app-requested-policies',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './policy-requests.component.html',
  styleUrls: ['./policy-requests.component.css']
})
export class PolicyRequestsComponent implements OnInit, AfterViewInit {

  searchText: string = '';
  totalRequestedPolicies: number = 0;
  // No longer need 'requestedPolicies' as a separate array if only using dataSource.data
  // requestedPolicies: PolicyRequestStatusResponseDto[] = []; 
  displayedColumns: string[] = [
    'sno',
    'requestId',
    'availablePolicyName',
  
    'requestedOn',
    'status'
  ];
  dataSource = new MatTableDataSource<PolicyRequestStatusResponseDto>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.getRequestedPolicies();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    // Set up a custom sort function to prioritize 'Pending'
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'status') {
        // Custom sort for status: 'Pending' comes first
        return item.status === 'Pending' ? '0' : item.status;
      }
      return (item as any)[property];
    };
  }

  getRequestedPolicies(): void {
    this.customerService.getCustomerPolicyRequests().subscribe({
      next: (response: ApiResponse<PolicyRequestStatusResponseDto[]>) => {
        if (response.isSuccess && response.data) {
          console.log('Requested policies fetched successfully:', response.data);
          // Sort the data to put 'Pending' items first
          const sortedData = response.data.sort((a, b) => {
            if (a.status === 'Pending' && b.status !== 'Pending') {
              return -1; // a (Pending) comes before b
            }
            if (a.status !== 'Pending' && b.status === 'Pending') {
              return 1; // b (Pending) comes before a
            }
            return 0; // maintain original order for other statuses or if both are pending/not pending
          });
          this.dataSource.data = sortedData;
          this.totalRequestedPolicies = sortedData.length;
        } else {
          console.error('Failed to fetch requested policies:', response.message);
          this.dataSource.data = [];
          this.totalRequestedPolicies = 0;
        }
      },
      error: (err) => {
        console.error('Error fetching requested policies:', err);
        this.dataSource.data = [];
        this.totalRequestedPolicies = 0;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Returns a CSS class based on the policy status for styling.
   * @param status The status string (e.g., 'Approved', 'Rejected', 'Pending', 'Draft').
   * @returns A CSS class name.
   */
  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved': return 'status-approved';
      case 'Rejected': return 'status-rejected';
      case 'Pending': return 'status-pending';
      case 'Draft': return 'status-draft';
      default: return '';
    }
  }
}