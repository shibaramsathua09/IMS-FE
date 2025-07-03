import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
 
import { AgentAssignmentDialogComponent } from '../agent-assignment-dialog/agent-assignment-dialog.component';
import { PolicyRequestStatusResponseDto } from '../../../customer/dtos/policyRequestStatusResponse.dto';
import { MatSort } from '@angular/material/sort';
import { AdminService } from '../../admin.service';
import { PagedResult } from '../../../../shared/pagedResult.dto';
import { ApiResponse } from '../../../../shared/api-response.interface';
import { AssignAgentRequestDto } from '../../dtos/assignAgentRequest.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
 
interface RequestedPolicy {
  policyId: string;
  policyNumber: string;
  policyName: string;
}
 
@Component({
  selector: 'app-requested-policies',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule
  ],
  templateUrl: './requested-policies.component.html',
  styleUrl: './requested-policies.component.css'
})
 
export class RequestedPoliciesComponent implements OnInit {
  dataSource: PolicyRequestStatusResponseDto[] = [];

  currentPage = 1;
  agentToAssign!:PolicyRequestStatusResponseDto;
  searchText:string='';
  totalRequests:number=0;
  policyRequests: PolicyRequestStatusResponseDto[] = [];
 // dataSource = new MatTableDataSource<PolicyRequestStatusResponseDto>([]);
  displayedColumns: string[] = ['requestId', 'availablePolicyName','customerName','requestedOn','status', 'action'];
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20];
 
  constructor(public dialog: MatDialog,private adminService:AdminService, private snackBar: MatSnackBar,
    private router: Router
  ) { }
 
  ngOnInit(): void {
    this.getPolicies();
  }
 
  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }
 
  getPolicies(page: number = this.currentPage, size: number = this.pageSize): void {
    this.currentPage = page;
    //this.adminService.getPolicyRequests(page, size).subscribe({ ... });
   this.adminService.getPolicyRequests(page,size).subscribe({
    next:(
      response:ApiResponse<PagedResult<PolicyRequestStatusResponseDto>>)=>{
        if(response.isSuccess&& response.data){
          this.policyRequests=response.data.items;
          this.dataSource =[...response.data.items];

          //this.dataSource.data=this.policyRequests;
          this.totalRequests=response.data.totalCount;
        }
        else{
          console.error('Failed to fetch the Policy requests',response.message);
        }
      },
      error:(error:any)=>{
        console.error('Error While fetching the Policy requests',error);
      },
 
     });
   }
 
  // onPageChange(event: PageEvent): void {
  //   this.pageSize = event.pageSize;
  // }
  // onPageChange(event: PageEvent): void {
  //   this.pageSize = event.pageSize;
  //   const currentPage = event.pageIndex + 1;
  //   console.log('Fetching page:', currentPage, 'with size:', this.pageSize);
  //   this.getPolicies(currentPage, this.pageSize);
  // }
  onPageChange(event: PageEvent) {
    this.getPolicies(event.pageIndex + 1, event.pageSize);
  }
  
  
 
  onAccept(policy: PolicyRequestStatusResponseDto):void
  {
      const dialogRef = this.dialog.open(AgentAssignmentDialogComponent,{
        width: '450px',
        disableClose: true,
        data: {policyId: policy.requestId}
      });
 
      dialogRef.afterClosed().subscribe((result) => {
        if(result && result.agentId)
        {
           const assignAgent : AssignAgentRequestDto = {
            agentId: Number(result.agentId)
           }
 
           this.adminService
           .approvePolicyRequest(assignAgent, policy.requestId)
           .subscribe({
             next: (response: ApiResponse<boolean>) => {
               if(response.isSuccess && response.data)
               {
                 this.snackBar.open(
                   'Policy request approved and agent assigned!',
                   'Close',
                   {duration: 3000}
                   );
                   policy.status = 'Approved';
                   this.getPolicies();
               }
               else
               {
                 alert('Failed to approve policy request: '+ response.message);
               }
             },
             error: (error: any) => {
               alert('Error approving policy request: ' + error);
             }
           }
           )
        };
      });
  }
 
  onReject(policy: PolicyRequestStatusResponseDto): void {
    this.adminService.rejectPolicyRequest(policy.requestId).subscribe({
      next:(response:ApiResponse<boolean>)=>{
        if(response.isSuccess&& response.data)
        {
          this.snackBar.open(
            'Policy Request rejected Successfully','Close',{duration:3000}
          );
          policy.status = 'Rejected';
          this.getPolicies();
          console.log('Rejected policy:', policy.requestId);
 
        }
        else{
          alert('Failed to reject the policy request'+response.message);
        }
      },
      error:(error:any)=>{
        alert('Error while reject the policy request'+error)
      }
    });
   }
 
  openAgentAssignmentDialog(policyId: string): void {
    const dialogRef = this.dialog.open(AgentAssignmentDialogComponent, {
      width: '450px',
      disableClose: true,
      data: { policyId: policyId }
    });
 
    dialogRef.afterClosed().subscribe(result => {
      console.log('The agent assignment dialog was closed. Result:', result);
      if (result) {
      }
    });
  }
}
// import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';

// import { AgentAssignmentDialogComponent } from '../agent-assignment-dialog/agent-assignment-dialog.component';
// import { PolicyRequestStatusResponseDto } from '../../../customer/dtos/policyRequestStatusResponse.dto';
// import { AdminService } from '../../admin.service';
// import { PagedResult } from '../../../../shared/pagedResult.dto';
// import { ApiResponse } from '../../../../shared/api-response.interface';
// import { AssignAgentRequestDto } from '../../dtos/assignAgentRequest.dto';
// import { CommonModule } from '@angular/common';
// import { MatTableModule } from '@angular/material/table';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';

// @Component({
//   selector: 'app-requested-policies',
//   imports: [
//     CommonModule,
//     MatTableModule,
//     MatButtonModule,
//     MatCardModule,
//     MatDialogModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatPaginatorModule, // ✅ This line must be here
//   ],
  
//   templateUrl: './requested-policies.component.html',
//   styleUrls: ['./requested-policies.component.css']
// })
// export class RequestedPoliciesComponent implements OnInit {
//   dataSource: PolicyRequestStatusResponseDto[] = [];
//   displayedColumns: string[] = ['requestId', 'availablePolicyName', 'customerName', 'requestedOn', 'status', 'action'];

//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;

//   currentPage = 1;
//   pageSize = 5;
//   totalRequests = 0;
//   pageSizeOptions: number[] = [5, 10, 20];

//   constructor(
//     public dialog: MatDialog,
//     private adminService: AdminService,
//     private snackBar: MatSnackBar,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.getPolicies();
//   }

//   getPolicies(page: number = this.currentPage, size: number = this.pageSize): void {
//     this.currentPage = page;
//     console.log('Calling API with page:', page, 'size:', size);

  
//     this.adminService.getPolicyRequests(page, size).subscribe({
//       next: (response: ApiResponse<PagedResult<PolicyRequestStatusResponseDto>>) => {
//         if (response.isSuccess && response.data) {
//           // Force Angular to recognize a new reference
//           this.dataSource = [...response.data.items];
//           this.totalRequests = response.data.totalCount;
  
//           console.log('Page', page, '→ requestIds:', this.dataSource.map(p => p.requestId));
//           console.log('Fetched data:', this.dataSource);
//         }
//       },
//       error: error => console.error('Error fetching data:', error)
//     });
//   }
  

//   onPageChange(event: PageEvent): void {
//     this.pageSize = event.pageSize;
//   this.currentPage = event.pageIndex + 1; // ← this was missing
//   this.getPolicies(this.currentPage, this.pageSize);
//   }

//   onAccept(policy: PolicyRequestStatusResponseDto): void {
//     const dialogRef = this.dialog.open(AgentAssignmentDialogComponent, {
//       width: '450px',
//       disableClose: true,
//       data: { policyId: policy.requestId }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result?.agentId) {
//         const assignAgent: AssignAgentRequestDto = { agentId: Number(result.agentId) };
//         this.adminService.approvePolicyRequest(assignAgent, policy.requestId).subscribe({
//           next: (response: ApiResponse<boolean>) => {
//             if (response.isSuccess && response.data) {
//               this.snackBar.open('Policy request approved and agent assigned!', 'Close', { duration: 3000 });
//               this.getPolicies(this.currentPage, this.pageSize);
//             } else {
//               alert('Failed to approve policy request: ' + response.message);
//             }
//           },
//           error: error => alert('Error approving policy request: ' + error)
//         });
//       }
//     });
//   }

//   onReject(policy: PolicyRequestStatusResponseDto): void {
//     this.adminService.rejectPolicyRequest(policy.requestId).subscribe({
//       next: (response: ApiResponse<boolean>) => {
//         if (response.isSuccess && response.data) {
//           this.snackBar.open('Policy request rejected successfully', 'Close', { duration: 3000 });
//           this.getPolicies(this.currentPage, this.pageSize);
//         } else {
//           alert('Failed to reject policy request: ' + response.message);
//         }
//       },
//       error: error => alert('Error rejecting policy request: ' + error)
//     });
//   }
// }
