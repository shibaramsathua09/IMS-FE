
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
 
// Import MatDialog and MatDialogModule for any dialogs
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
 
// Import your dialog components
import { UpdatePolicyComponent } from '../update-policy/update-policy.component'; // Corrected path for Update Policy Dialog
import { CreatePolicyComponent } from '../create-policy/create-policy.component'; // New import for Add Policy Dialog
import { AvailablePolicyResponseDto } from '../../../customer/dtos/availablePolicyResponse.dto';
import { AdminService } from '../../admin.service';
import { ApiResponse } from '../../../../shared/api-response.interface';
import { PagedResult } from '../../../../shared/pagedResult.dto';
import { tap } from 'rxjs';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component.spec';
import { MatSnackBar } from '@angular/material/snack-bar';
 

 
 
@Component({
  selector: 'app-view-all-policies',
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
    MatDialogModule,
    DecimalPipe
  ],
  templateUrl: './view-all-policies.component.html',
  styleUrl: './view-all-policies.component.css'
})
export class ViewAllPoliciesComponent implements OnInit, AfterViewInit {
  searchText:string='';
  totalPolicies:number=0;
  availablePolicies:AvailablePolicyResponseDto[]=[];
  
  // Added 'id' to displayedColumns
  displayedColumns: string[] = ['sno', 'id', 'policyName', 'premiumAmount', 'validityPeriod', 'viewDetails'];
  dataSource = new MatTableDataSource<AvailablePolicyResponseDto>([]);
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(private router: Router, public dialog: MatDialog,private adminService:AdminService,private snackBar:MatSnackBar) { } // Inject MatDialog
 
  ngOnInit() {
   this.getAllAvailablePolicies();
  }
  getAllAvailablePolicies(page:number=1,size:number=10):void{
    this.adminService.getAvailablePolicies(page,size).subscribe({
      next:(
        response:ApiResponse<PagedResult<AvailablePolicyResponseDto>>)=>{
          if (response.isSuccess&&response.data){
            this.availablePolicies=response.data.items;
            this.dataSource.data=this.availablePolicies;
            this.totalPolicies=response.data.totalCount;
          }
          else{
            console.error('Failed to fetch Available Policies:',response.message);
          }
        },
        error:(error:any)=>{
          console.error('Error Fetching Available Policies:',error);
        },
      
    });
  }
 
  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() =>
          this.getAllAvailablePolicies(
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
          )
        )
      )
      .subscribe();
 
   
 
    this.getAllAvailablePolicies(
      this.paginator.pageIndex + 1,
      this.paginator.pageSize
    );
 
    this.dataSource.sortingDataAccessor = (item: AvailablePolicyResponseDto, property: string) => {
      switch (property) {
        case 'premiumAmount':
          return item.basePremium;
        case 'coverage':
          const coverageValue = parseFloat(item.coverageDetails.replace(/[^0-9.]/g, ''));
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
 
  /**
   * Opens the dialog to update an existing policy.
   * @param policy The policy object to be updated.
   */
  openUpdatePolicyDialog(policy: AvailablePolicyResponseDto): void {
    const dialogRef = this.dialog.open(UpdatePolicyComponent, {
      width: '600px',
      data: { policy: policy } // Pass the existing policy data
    });
 
    dialogRef.afterClosed().subscribe(updatedPolicy => {
      if (updatedPolicy) {
        // Find the index of the updated policy and replace it
        const index = this.dataSource.data.findIndex(p => p.id === updatedPolicy.id);
        if (index > -1) {
          this.dataSource.data[index] = updatedPolicy;
          // Trigger the table to re-render changes
          this.dataSource._updateChangeSubscription();
          // alert(`Policy "${updatedPolicy.policyName}" updated successfully!`);
        }
      }
    });
  }
 
  /**
   * Opens the dialog to add a new policy.
   */
  openAddPolicyDialog(): void {
    const dialogRef = this.dialog.open(CreatePolicyComponent, {
      width: '650px' // Adjust width as needed for the add form
    });
 
    dialogRef.afterClosed().subscribe(newPolicy => {
      if (newPolicy) {
        // Add the new policy to the existing data source
        const currentData = this.dataSource.data;
        // Check for duplicate ID before adding (optional but good practice)
        if (currentData.some(p => p.id === newPolicy.id)) {
          alert(`Policy with ID "${newPolicy.id}" already exists. Please use a unique ID.`);
          return;
        }
 
        this.dataSource.data = [...currentData, newPolicy];
        // Trigger the table to re-render and sort/paginate appropriately
        this.dataSource._updateChangeSubscription();
        // Optional: Go to the last page if you want to see the new item immediately
        if (this.dataSource.paginator) {
          this.dataSource.paginator.lastPage();
        }
        this.snackBar.open('New Policy Created succcesfully','close',{duration:3000});
        
      } else {
        console.log('Add policy dialog closed without adding a new policy.');
      }
    });
  }
 
  // --- Start: New deletePolicy method ---
  /**
   * Handles the deletion of a policy.
   * In a real application, this would interact with a backend service.
   * @param policyId The ID of the policy to be deleted.
   */
  deletePolicy(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
 
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        var policy=this.adminService.getAvailablePolicyById(id);
        console.log('Policy object:', policy);
        this.adminService.deleteAvailablePolicy(id).subscribe({
          next: (response: ApiResponse<boolean>) => {
            if (response.isSuccess) {
              console.log('Policy is deleted', id);
              this.snackBar.open('Policy deleted succcesfully','close',{duration:3000});
              this.dataSource.data = this.dataSource.data.filter(policy => policy.id !== id);
              this.dataSource._updateChangeSubscription(); // Refresh the table
            } else {
              
              console.error('Failed to delete the Policy', id);
            }
          },
          error: (error: any) => {
            console.error(`Error deleting Policy "${id}"`, error);
          }
        });
 
      }
    });
  }

  viewDetails(policyId: string): void {
    this.router.navigate(['/policy-details', policyId]);
  }
}
 
export type { AvailablePolicyResponseDto };
