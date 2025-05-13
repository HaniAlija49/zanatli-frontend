import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { JobService } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Create New Job</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Description</mat-label>
        <input matInput formControlName="description" required>
        <mat-error *ngIf="form.get('description')?.hasError('required')">Description is required</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Preferred Date</mat-label>
        <input matInput type="date" formControlName="preferredDate" required>
        <mat-error *ngIf="form.get('preferredDate')?.hasError('required')">Preferred date is required</mat-error>
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Contractor ID</mat-label>
        <input matInput formControlName="contractorId" [readonly]="isContractorPreFilled">
      </mat-form-field>
      <div class="actions">
        <button mat-button type="button" (click)="close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Create</button>
      </div>
    </form>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 1rem; }
    .actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
  `]
})
export class JobCreateDialogComponent implements OnInit {
  form: FormGroup;
  isContractorPreFilled = false;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private dialogRef: MatDialogRef<JobCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contractorId?: string } | null,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.isContractorPreFilled = !!(data && data.contractorId);
    this.form = this.fb.group({
      description: ['', Validators.required],
      preferredDate: ['', Validators.required],
      contractorId: [{ value: data?.contractorId || '', disabled: !!data?.contractorId }]
    });
  }

  ngOnInit() {
    // Check if user is a contractor
    if (this.authService.hasRole('contractor')) {
      this.snackBar.open('Contractors cannot create job requests.', 'Close', { duration: 5000 });
      this.dialogRef.close();
      return;
    }

    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      budget: ['', [Validators.required, Validators.min(1)]],
      deadline: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      const preferredDate = value.preferredDate
        ? new Date(value.preferredDate).toISOString()
        : '';
      this.jobService.createJob({
        description: value.description,
        preferredDate,
        contractorId: value.contractorId ? String(value.contractorId) : null
      }).subscribe({
        next: () => this.dialogRef.close('created'),
        error: (err) => alert('Failed to create job: ' + (err?.error?.message || err.message || err))
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
} 