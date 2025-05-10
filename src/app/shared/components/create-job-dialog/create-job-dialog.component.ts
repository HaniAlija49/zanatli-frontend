import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { JobService } from '../../../core/services/job.service';

interface DialogData {
  contractorId: string;
  contractorName: string;
}

@Component({
  selector: 'app-create-job-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>Create Job Request</h2>
    <mat-dialog-content>
      <form [formGroup]="jobForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="4" placeholder="Describe the job requirements"></textarea>
          <mat-error *ngIf="jobForm.get('description')?.hasError('required')">
            Description is required
          </mat-error>
          <mat-error *ngIf="jobForm.get('description')?.hasError('minlength')">
            Description must be at least 10 characters
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Preferred Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="preferredDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="jobForm.get('preferredDate')?.hasError('required')">
            Preferred date is required
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="jobForm.invalid || isLoading">
        Create Request
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class CreateJobDialogComponent {
  jobForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateJobDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private jobService: JobService
  ) {
    this.jobForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(10)]],
      preferredDate: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      this.isLoading = true;
      const jobData = {
        ...this.jobForm.value,
        contractorUserId: this.data.contractorId
      };

      this.jobService.createJob(jobData).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating job:', error);
          this.isLoading = false;
        }
      });
    }
  }
} 