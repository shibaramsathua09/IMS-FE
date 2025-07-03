import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core'; // Added OnInit
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ClaimFilingRequestDtoForAgent } from '../dtos/claimFilingRequestDtoForAgent.dto';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator'; // MatPaginator is standalone
import { MatSort, MatSortModule } from '@angular/material/sort'; // MatSortModule for mat-sort-header
 
import { MatInputModule } from '@angular/material/input'; // For search input
import { MatFormFieldModule } from '@angular/material/form-field'; // For mat-form-field
import { ClaimStatusResponseDtoForAgent } from '../dtos/claimStatusResponseDtoForAgent.dto';
import { ApiResponse } from '../../../shared/api-response.interface';
import { AgentService } from '../agent.service';
@Component({
  selector: 'app-filed-claims',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatPaginator,
    CommonModule,
    MatSortModule, // MatSortModule for mat-sort-header
    MatInputModule, // For search input
    MatFormFieldModule // For mat-form-field
  ],
  templateUrl: './filed-claims.component.html',
  styleUrl: './filed-claims.component.css'
})
export class FiledClaimsComponent implements OnInit, AfterViewInit { // Added OnInit
 
  searchText: string = '';
  totalFiledClaims: number = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20];
  allFiledClaims:ClaimStatusResponseDtoForAgent[]=[];
  // It's good practice to initialize arrays that will hold data
  // filedClaims: ClaimFilingRequestDtoForAgent[] = []; // Not directly used as dataSource takes care
  dataSource = new MatTableDataSource<ClaimStatusResponseDtoForAgent>([]); // Specific type for better safety
 
  displayedColumns: string[] = [
    'claimId', 'policyName', 'claimAmount', 'status', 'customerName'
  ];
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(private agentService: AgentService, private router: Router) { }
 
  ngOnInit(): void { // Correct ngOnInit signature
    this.getFiledClaimsForAgent();
  }
 
  ngAfterViewInit(): void { // Correct ngAfterViewInit signature and placement
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
 
    // Apply filter predicate for search functionality
   this.dataSource.filterPredicate = (data: ClaimStatusResponseDtoForAgent, filter: string) => {
         const dataStr = JSON.stringify(data).toLowerCase();
         return dataStr.indexOf(filter) !== -1;
       };
  }
 
  getFiledClaimsForAgent(): void { // Added void return type
    // Corrected the syntax for the subscribe call
    this.agentService.getFiledClaims()
      .subscribe({
        next: (response: ApiResponse<ClaimStatusResponseDtoForAgent>) => {
          if (response.isSuccess && response.data && response.data) {
            this.allFiledClaims = Array.isArray(response.data) ? response.data : []; // Ensure response.data is an array
            this.totalFiledClaims = this.allFiledClaims.length;
            this.dataSource.data=this.allFiledClaims;
            console.log('Filed claims loaded successfully', this.dataSource.data); // Corrected log message
          } else {
            console.error('Failed to fetch filed claims:', response.message || 'Unknown error'); // Corrected log message
            this.dataSource.data = [];
            this.totalFiledClaims = 0;
          }
        },
        error: (error: any) => {
          console.error('Error fetching filed claims:', error); // Corrected log message
          this.dataSource.data = [];
          this.totalFiledClaims = 0;
        }
      });
  }
  onPageChange(event: PageEvent): void {
   
  }
  applyFilter(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset pagination when filter changes
    }
  }
}