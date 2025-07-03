
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For [(ngModel)]
 
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { AdminService } from '../../admin.service';
 
@Component({
  selector: 'app-agent-assignment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule
  ],
  templateUrl: './agent-assignment-dialog.component.html',
  styleUrl: './agent-assignment-dialog.component.css'
})
export class AgentAssignmentDialogComponent {
  agentId: string = '';
  policyId: string;
  agents: any[] =[];
  error: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<AgentAssignmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { policyId: string },
    private adminService: AdminService
  ) {
    this.policyId = data.policyId;
  }


  ngOnInit(): void{
    this.adminService.getAllAgents(1, 100).subscribe(
      {
        next: (res) => {
          this.agents = res.data?.items || [];
        },
        error: (err) => {
          this.error = 'Failed to load agents.';
        }

      }
    );
  }
 

  

  /**
   * Handles the 'Assign' button click.
   * Simulates agent assignment and closes the dialog.
   */
  assignAgent(): void {
    if(this.agentId)
    {
      this.dialogRef.close({agentId: this.agentId});
    }
    else
    {
      this.error = "Please select an agent.";
    }
  }
 
  /**
   * Handles the 'Cancel' button click.
   * Closes the dialog without any action.
   */
  onCancel(): void {
    this.dialogRef.close(false); // Close dialog without action
  }
}
