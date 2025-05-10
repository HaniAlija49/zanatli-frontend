import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContractorService } from '../../../core/services/contractor.service';
import { ContractorProfile } from '../../../core/models/contractor.models';
import { CreateJobDialogComponent } from '../../../shared/components/create-job-dialog/create-job-dialog.component';

@Component({
  selector: 'app-contractor-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="contractor-detail-container" *ngIf="!isLoading; else loading">
      <mat-card class="profile-card" *ngIf="contractor">
        <mat-card-header>
          <mat-card-title>{{contractor.fullName}}</mat-card-title>
          <mat-card-subtitle>{{contractor.companyName}}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="location">
            <mat-icon>location_on</mat-icon>
            <span>{{contractor.location}}</span>
          </div>
          
          <div class="bio-section">
            <h3>About</h3>
            <p>{{contractor.bio}}</p>
          </div>

          <div class="services-section">
            <h3>Services</h3>
            <div class="services">
              <mat-chip *ngFor="let service of contractor.services" color="primary" selected>
                {{service}}
              </mat-chip>
            </div>
          </div>

          <div class="actions">
            <button mat-raised-button color="primary" (click)="openCreateJobDialog()">
              <mat-icon>add</mat-icon>
              Create Job Request
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <mat-spinner></mat-spinner>
      </div>
    </ng-template>
  `,
  styles: [`
    .contractor-detail-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-card {
      margin-bottom: 2rem;
    }

    .location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      margin: 1rem 0;
    }

    .bio-section, .services-section {
      margin: 2rem 0;
    }

    h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .services {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .actions {
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
    }
  `]
})
export class ContractorDetailComponent implements OnInit {
  contractor: ContractorProfile | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private contractorService: ContractorService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const contractorId = this.route.snapshot.paramMap.get('id');
    if (contractorId) {
      this.loadContractor(contractorId);
    }
  }

  loadContractor(id: string) {
    this.isLoading = true;
    this.contractorService.getContractorById(id).subscribe({
      next: (contractor) => {
        this.contractor = contractor;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading contractor:', error);
        this.snackBar.open('Error loading contractor details. Please try again.', 'Close', {
          duration: 5000
        });
        this.isLoading = false;
      }
    });
  }

  openCreateJobDialog() {
    if (!this.contractor) return;

    const dialogRef = this.dialog.open(CreateJobDialogComponent, {
      width: '500px',
      data: {
        contractorId: this.contractor.id,
        contractorName: this.contractor.fullName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Job request created successfully!', 'Close', {
          duration: 5000
        });
      }
    });
  }
} 