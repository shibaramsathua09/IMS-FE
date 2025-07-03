import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AdminService } from '../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClaimStatusResponseDtoForAdmin } from '../dtos/claimStatusResponseDtoForAdmin.dto';
import { ApiResponse } from '../../../shared/api-response.interface';
import { RejectDialogComponent } from '../../../shared/reject-dialog/reject-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
 
@Component({
  selector: 'app-claim-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './claim-management.component.html',
  styleUrls: ['./claim-management.component.css']
})
export class ClaimManagementComponent implements OnInit, AfterViewInit {
  totalClaims = 0;
  searchTerm = '';
  dataSource = new MatTableDataSource<ClaimStatusResponseDtoForAdmin>([]);
  displayedColumns: string[] = ['sno', 'claimId', 'policyName', 'claimAmount', 'status', 'customerName', 'agentName', 'actions'];
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
 
  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: ClaimStatusResponseDtoForAdmin, filter: string): boolean => {
      return data.status.toLowerCase().includes(filter.trim().toLowerCase());
    };
    
  }
 
  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap(() => this.fetchClaims(this.paginator.pageIndex + 1, this.paginator.pageSize))
      )
      .subscribe();
 
    this.fetchClaims(this.paginator.pageIndex + 1, this.paginator.pageSize);
  }
 
  fetchClaims(page: number = 1, size: number = 10, searchTerm: string = ''): void {
    this.adminService.getAllClaims(page, size).pipe(
      tap((response: ApiResponse<{ items: ClaimStatusResponseDtoForAdmin[], totalCount: number }>) => {
        if (response && response.isSuccess && response.data) {
          // Sort by claimId descending (newest first)
          const sortedItems = response.data.items.sort((a, b) => b.claimId - a.claimId);
  
          this.dataSource.data = sortedItems;
          this.totalClaims = response.data.totalCount;
        } else {
          this.dataSource.data = [];
          this.totalClaims = 0;
          this.snackBar.open(`Failed to fetch claims: ${response?.message || 'Unknown error'}`, 'Close', {
            duration: 3000, panelClass: ['snackbar-error']
          });
        }
      }),
      catchError(error => {
        console.error('Error fetching claims:', error);
        this.dataSource.data = [];
        this.totalClaims = 0;
        this.snackBar.open('An error occurred while fetching claims.', 'Close', {
          duration: 3000, panelClass: ['snackbar-error']
        });
        return of({} as ApiResponse<{ items: ClaimStatusResponseDtoForAdmin[], totalCount: number }>);
      })
    ).subscribe();
  }
  
  // fetchClaims(page: number = 1, size: number = 10): void {
  //   this.adminService.getAllClaims(page, size).pipe(
  //     tap((response: ApiResponse<{ items: ClaimStatusResponseDtoForAdmin[], totalCount: number }>) => {
  //       if (response?.isSuccess && response.data) {
  //         this.dataSource.data = response.data.items;
  //         this.totalClaims = response.data.totalCount;
  //       } else {
  //         this.dataSource.data = [];
  //         this.totalClaims = 0;
  //         this.snackBar.open(`Failed to fetch claims: ${response?.message || 'Unknown error'}`, 'Close', {
  //           duration: 3000,
  //           panelClass: ['snackbar-error']
  //         });
  //       }
  //     }),
  //     catchError(error => {
  //       console.error('Error fetching claims:', error);
  //       this.dataSource.data = [];
  //       this.totalClaims = 0;
  //       this.snackBar.open('An error occurred while fetching claims.', 'Close', {
  //         duration: 3000,
  //         panelClass: ['snackbar-error']
  //       });
  //       return of({} as ApiResponse<{ items: ClaimStatusResponseDtoForAdmin[], totalCount: number }>);
  //     })
  //   ).subscribe();
  // }
 
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue;
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
 
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 
  updateStatus(claim: ClaimStatusResponseDtoForAdmin, newStatus: string): void {
    if (newStatus === 'Approved') {
      this.handleStatusChange(() => this.adminService.approveClaim(claim.claimId), claim, newStatus);
    } else if (newStatus === 'Rejected') {
      const dialogRef = this.dialog.open(RejectDialogComponent);
      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed) {
          this.handleStatusChange(() => this.adminService.rejectClaim(claim.claimId), claim, newStatus);
        } else {
          this.snackBar.open('Claim rejection cancelled.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-info']
          });
        }
      });
    } else {
      this.snackBar.open('Invalid status action.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    }
  }
 
  private handleStatusChange(
    apiCallFn: () => Observable<ApiResponse<boolean>>,
    claim: ClaimStatusResponseDtoForAdmin,
    newStatus: string
  ): void {
    apiCallFn().pipe(
      tap(response => {
        if (response.isSuccess) {
          claim.status = newStatus;
          this.snackBar.open(`Claim ${claim.claimId} ${newStatus} successfully!`, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.fetchClaims(this.paginator.pageIndex + 1, this.paginator.pageSize);
        } else {
          this.snackBar.open(`Failed to ${newStatus.toLowerCase()} claim ${claim.claimId}: ${response.message}`, 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
        }
      }),
      catchError(error => {
        console.error(`Error updating claim ${claim.claimId}:`, error);
        this.snackBar.open(`An error occurred while updating claim ${claim.claimId}.`, 'Close', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
        return of({ isSuccess: false, message: 'Error', data: false } as ApiResponse<boolean>);
      })
    ).subscribe();
  }
 
  getStatusClass(status: string): { [key: string]: boolean } {
    return {
      'text-success': status === 'Approved',
      'text-warning': status === 'Pending',
      'text-danger': status === 'Rejected'
    };
  }
}
