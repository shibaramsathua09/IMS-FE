import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AgentAssignedPolicyResponseDto } from '../dtos/agentAssignedPolicy.dto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
 
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule for search input
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { AgentService } from '../agent.service';
 
@Component({
  standalone: true,
  selector: 'app-assigned-policies',
  templateUrl: './assigned-policies.component.html',
  styleUrls: ['./assigned-policies.component.css'],
  imports: [
    MatTableModule,
    MatCardModule,
    CommonModule,
    MatSortModule,
    MatInputModule, // Needed for search input if you use matInput
    MatFormFieldModule, // Needed for mat-form-field
    MatPaginator
  ],
})
export class AssignedPoliciesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['availablePolicyId','availablePolicyName','policyId',  'name', 'customerEmail', 'phone', 'issuedDate', 'expiryDate', 'action'];
  dataSource = new MatTableDataSource<AgentAssignedPolicyResponseDto>([]);
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  loggedInAgentId:number|null=null;
 
  searchText: string = '';
  totalPolicies: number = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20];
 
  constructor(private agentService: AgentService, private router: Router) {}
 
  ngOnInit(): void {
    this.agentService.getAgentProfile$().subscribe((profile) => {
      if (profile) {
     
        this.loggedInAgentId =
          typeof profile.agentId === 'string'
            ? Number(profile.agentId)
            : profile.agentId;
      } else {
        this.agentService.fetchAndStoreAgentProfile().subscribe();
      }
    });
 
    this.getAssignedPolicies();
  }
 
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
 
    // Apply filter predicate for search functionality
    this.dataSource.filterPredicate = (data: AgentAssignedPolicyResponseDto, filter: string) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    };
  }
 
  getAssignedPolicies(): void {
    this.agentService.getAllAssignedPolicies().subscribe({
      // ...
next: (response: any) => {
  if (response.isSuccess && response.data) {
    this.dataSource.data = response.data;
    console.log('Assigned policies loaded successfully', this.dataSource.data);
  }
 
  else if (response.isSuccess && response.data && response.data.items) {
    this.dataSource.data = response.data.items;
    this.totalPolicies = response.data.totalCount;
    console.log('Assigned policies loaded successfully', this.dataSource.data);
  }
  else {
    console.error('Failed to fetch assigned policies:', response.message || 'Unknown error');
    this.dataSource.data = [];
    this.totalPolicies = 0;
  }
},
// ...,
      error: (error: any) => {
        console.error('Error fetching assigned policies:', error);
        this.dataSource.data = [];
        this.totalPolicies = 0;
      },
    });
  }
  onPageChange(event: PageEvent): void {
   
  }
  applyFilter(): void{
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 
 
  fileClaim(policy: AgentAssignedPolicyResponseDto): void {
      console.log(`Filing a claim for policy ID: ${policy.policyId}`);
      this.router.navigate(['/agent/file-a-claim'], {
        queryParams: {
          policyId: policy.policyId,
          agentId: this.loggedInAgentId,
          customerId: policy.customerId
        }
      });
    }
   
}