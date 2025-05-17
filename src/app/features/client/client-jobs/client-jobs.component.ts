import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { Job, JobStatus } from '../../../core/models/job.models';
import { JobDetailsDialogComponent } from './job-details-dialog.component';
import { ChatDialogComponent } from '../../messages/chat-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-client-jobs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  template: `
    <div class="jobs-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>My Jobs</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <!-- Filters -->
          <div class="filters-container">
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Search</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Search jobs..." #input>
            </mat-form-field>
          </div>

          <!-- Responsive Table for Desktop, Cards for Mobile -->
          <ng-container>
            <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8 jobs-table" *ngIf="!isMobile">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let job">{{job.id}}</td>
              </ng-container>
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Description</th>
                <td mat-cell *matCellDef="let job">{{job.description}}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
                <td mat-cell *matCellDef="let job">
                  <span [ngClass]="getStatusClass(job.status)">
                    {{ getStatusText(job.status) }}
                  </span>
                </td>
              </ng-container>
              <ng-container matColumnDef="preferredDate">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Preferred Date</th>
                <td mat-cell *matCellDef="let job">{{job.preferredDate | date}}</td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let job">
                  <button mat-icon-button color="primary" (click)="openJobDetailsDialog(job)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="navigateToMessages(toNumber(job.id))">
                    <mat-icon>message</mat-icon>
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

              <!-- Row shown when there is no matching data. -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell" colspan="5">
                  <div class="no-data-container">
                    <mat-icon class="no-data-icon">work_off</mat-icon>
                    <h3>No Jobs Found</h3>
                    <p *ngIf="input.value">No jobs matching "{{input.value}}"</p>
                    <p *ngIf="!input.value">You haven't created any jobs yet.</p>
                    <div class="no-data-suggestions" *ngIf="input.value">
                      <p>Try these suggestions:</p>
                      <ul>
                        <li>Check your spelling</li>
                        <li>Try different keywords</li>
                        <li>Remove the search filter</li>
                      </ul>
                    </div>
                    <button mat-flat-button color="primary" routerLink="/contractors" *ngIf="!input.value">
                      <mat-icon>add</mat-icon>
                      Create New Job
                    </button>
                  </div>
                </td>
              </tr>
            </table>

            <!-- Card layout for mobile -->
            <div class="job-card-list" *ngIf="isMobile">
              <ng-container *ngIf="dataSource.filteredData.length > 0; else noDataMobile">
                <mat-card class="job-card" *ngFor="let job of dataSource.filteredData">
                  <div class="job-card-header">
                    <div class="job-card-title">#{{job.id}} - {{job.description}}</div>
                    <span class="job-card-status" [ngClass]="getStatusClass(job.status)">
                      {{ getStatusText(job.status) }}
                    </span>
                  </div>
                  <div class="job-card-row"><b>Preferred Date:</b> {{job.preferredDate | date}}</div>
                  <div class="job-card-actions">
                    <button mat-icon-button color="primary" (click)="openJobDetailsDialog(job)">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button color="accent" (click)="navigateToMessages(toNumber(job.id))">
                      <mat-icon>message</mat-icon>
                    </button>
                  </div>
                </mat-card>
              </ng-container>
              <ng-template #noDataMobile>
                <div class="no-data-container">
                  <mat-icon class="no-data-icon">work_off</mat-icon>
                  <h3>No Jobs Found</h3>
                  <p *ngIf="input.value">No jobs matching "{{input.value}}"</p>
                  <p *ngIf="!input.value">You haven't created any jobs yet.</p>
                  <div class="no-data-suggestions" *ngIf="input.value">
                    <p>Try these suggestions:</p>
                    <ul>
                      <li>Check your spelling</li>
                      <li>Try different keywords</li>
                      <li>Remove the search filter</li>
                    </ul>
                  </div>
                  <button mat-flat-button color="primary" routerLink="/contractors" *ngIf="!input.value">
                    <mat-icon>add</mat-icon>
                    Create New Job
                  </button>
                </div>
              </ng-template>
            </div>

            <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of jobs"></mat-paginator>
          </ng-container>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .jobs-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .jobs-table {
      width: 100%;
    }
    .job-card-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .job-card {
      padding: 1rem;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      background: #fff;
    }
    .job-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .job-card-title {
      font-weight: 600;
      font-size: 1.1rem;
    }
    .job-card-status {
      font-size: 0.95rem;
      font-weight: 500;
    }
    .job-card-row {
      margin-bottom: 0.5rem;
    }
    .job-card-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .filters-container {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    .filter-field {
      flex: 1;
      min-width: 200px;
    }
    .status-pending {
      color: #f57c00;
      font-weight: 500;
    }
    .status-accepted {
      color: #2196f3;
      font-weight: 500;
    }
    .status-declined {
      color: #f44336;
      font-weight: 500;
    }
    .status-completed {
      color: #4caf50;
      font-weight: 500;
    }
    @media (max-width: 800px) {
      .jobs-container {
        padding: 0.5rem;
      }
      .jobs-table {
        display: none;
      }
      .job-card-list {
        display: flex;
      }
      .filters-container {
        flex-direction: column;
      }
      .filter-field {
        width: 100%;
      }
    }
    @media (min-width: 801px) {
      .job-card-list {
        display: none;
      }
    }
    .no-data-container {
      text-align: center;
      padding: 3rem 1rem;
      background: #f8f9fa;
      border-radius: 12px;
      margin: 1rem 0;
    }

    .no-data-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #bdbdbd;
      margin-bottom: 1rem;
    }

    .no-data-container h3 {
      font-size: 1.5rem;
      color: #424242;
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }

    .no-data-container p {
      color: #666;
      font-size: 1.1rem;
      margin: 0 0 1.5rem 0;
    }

    .no-data-suggestions {
      text-align: left;
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin: 1.5rem 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .no-data-suggestions p {
      color: #424242;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .no-data-suggestions ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .no-data-suggestions li {
      color: #666;
      padding: 0.3rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .no-data-suggestions li::before {
      content: '•';
      color: #1976d2;
      font-size: 1.2rem;
    }

    .no-data-container button {
      margin-top: 1rem;
      padding: 0.5rem 1.5rem;
      font-size: 1rem;
    }

    .no-data-container button mat-icon {
      margin-right: 0.5rem;
    }
  `
  ]
})
export class ClientJobsComponent implements OnInit, OnDestroy {
  jobs: Job[] = [];
  displayedColumns: string[] = ['id', 'description', 'status', 'preferredDate', 'actions'];
  isMobile: boolean = false;
  dataSource: MatTableDataSource<Job>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: HTMLInputElement;

  statusMap: Record<string | number, string> = {
    0: 'Pending',
    1: 'Accepted',
    2: 'Declined',
    3: 'Completed',
    'Pending': 'Pending',
    'Accepted': 'Accepted',
    'Declined': 'Declined',
    'Completed': 'Completed'
  };

  constructor(
    private jobService: JobService, 
    private dialog: MatDialog,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.dataSource = new MatTableDataSource<Job>();
    this.breakpointObserver.observe([
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  ngOnInit() {
    this.loadJobs();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
  }

  loadJobs() {
    this.jobService.getClientJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.dataSource.data = jobs;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
      }
    });
  }

  applyFilter(event?: Event) {
    if (event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  openJobDetailsDialog(job: Job) {
    const dialogRef = this.dialog.open(JobDetailsDialogComponent, {
      width: '500px',
      data: { job }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.loadJobs();
      }
    });
  }

  toNumber(value: string | number): number {
    return Number(value);
  }

  navigateToMessages(jobId: number) {
    this.dialog.open(ChatDialogComponent, {
      data: { jobId },
      width: '100%',
      maxWidth: '500px',
      height: '600px',
      maxHeight: '100vh',
      panelClass: 'chat-dialog-container',
      disableClose: false
    });
  }

  getStatusClass(status: number | string): string {
    const statusStr = (this.statusMap[status] || status).toString().toLowerCase();
    return `status-${statusStr}`;
  }

  getStatusText(status: number | string): string {
    return this.statusMap[status] || status.toString();
  }
} 