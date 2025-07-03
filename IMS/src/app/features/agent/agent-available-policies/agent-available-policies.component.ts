
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { AvailablePolicyResponseDto } from '../../customer/dtos/availablePolicyResponse.dto';
import { Router } from '@angular/router';

import { ApiResponse } from '../../../shared/api-response.interface';
import { AgentService } from '../agent.service';
@Component({
  standalone: true,
  selector: 'app-agent-available-policies',
  templateUrl: './agent-available-policies.component.html',
  styleUrls: ['./agent-available-policies.component.css'],
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatCardModule]
})
export class AgentAvailablePoliciesComponent implements AfterViewInit {
    searchText: string = '';
    totalPolicies: number = 0;
    availablePolicies: AvailablePolicyResponseDto[]=[];
    dataSource = new MatTableDataSource<any>([]);
    displayedColumns: string[] = ['id', 'name', 'coverageDetails', 'basePremium', 'validityPeriod'];
 
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
 
    constructor(private agentService: AgentService, private router: Router){}
 
    ngOnInit(){
      this.getAvailablePolicies();
    }
    getAvailablePolicies(page: number = 1, size: number = 10): void { // Corrected function signature
      this.agentService.getAvailablePolicies(page, size) // Pass page and size to the service method
        .subscribe({
          next: (response: any) => {
            if (response.isSuccess && response.data) {
              this.availablePolicies = response.data.items;
              this.dataSource.data = this.availablePolicies;
              this.totalPolicies = response.data.totalCount;
              console.log('Available policies loaded successfully', this.dataSource.data);
            } else {
              console.error('Failed to fetch available policies:', response.message || 'Unknown error');
              this.availablePolicies = [];
              this.dataSource.data = [];
              this.totalPolicies = 0;
            }
          },
          error: (error: any) => {
            console.error('Error fetching available policies:', error);
            this.availablePolicies = [];
            this.dataSource.data = [];
            this.totalPolicies = 0;
          }
        });
    }
 
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAvailablePolicies();
  }
}
