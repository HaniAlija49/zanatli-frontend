import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { JobService } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { JobPhotosComponent } from '../../../components/job-photos/job-photos.component';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-job-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    JobPhotosComponent,
    MatDialogModule
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ],
  template: `
    <h2 mat-dialog-title>Create New Job</h2>
    <mat-dialog-content>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <input matInput formControlName="description" required>
          <mat-error *ngIf="form.get('description')?.hasError('required')">Description is required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Preferred Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="preferredDate" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="form.get('preferredDate')?.hasError('required')">Preferred date is required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contractor ID</mat-label>
          <input matInput formControlName="contractorId" [readonly]="isContractorPreFilled">
        </mat-form-field>

        <!-- Photos Section -->
        <div class="photos-section">
          <h3 class="section-title">
            <mat-icon>photo_library</mat-icon>
            Photos
          </h3>
          <app-job-photos [jobId]="'new'" [isNewJob]="true"></app-job-photos>
        </div>

        <div class="actions">
          <button mat-button type="button" (click)="close()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Create</button>
        </div>
      </form>
    </mat-dialog-content>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 600px;
    }
    .full-width { 
      width: 100%; 
      margin-bottom: 1rem; 
    }
    .actions { 
      display: flex; 
      justify-content: flex-end; 
      gap: 1rem; 
      margin-top: 1rem; 
    }
    .photos-section {
      margin-top: 1rem;
      margin-bottom: 1rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.1rem;
      font-weight: 500;
      color: #444;
      margin-bottom: 1rem;
    }
    .section-title mat-icon {
      color: #1976d2;
    }
    mat-dialog-content {
      padding: 20px;
    }
  `]
})
export class JobCreateDialogComponent implements OnInit {
  form: FormGroup;
  isContractorPreFilled = false;
  @ViewChild(JobPhotosComponent) photosComponent!: JobPhotosComponent;

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
      preferredDate: [new Date(), Validators.required],
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
  }

  onSubmit() {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      const photos = this.photosComponent?.getTempPhotos() || [];
      
      this.jobService.createJob({
        description: value.description,
        preferredDate: value.preferredDate,
        contractorId: value.contractorId ? String(value.contractorId) : null
      }, photos).subscribe({
        next: () => this.dialogRef.close('created'),
        error: (err) => this.snackBar.open('Failed to create job: ' + (err?.error?.message || err.message || err), 'Close', { duration: 5000 })
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
} 