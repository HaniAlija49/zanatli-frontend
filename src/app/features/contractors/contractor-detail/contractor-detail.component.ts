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
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContractorService } from '../../../core/services/contractor.service';
import { PhotoService, Photo } from '../../../core/services/photo.service';
import { ContractorProfile } from '../../../core/models/contractor.models';
import { CreateJobDialogComponent } from '../../../shared/components/create-job-dialog/create-job-dialog.component';
import { forkJoin } from 'rxjs';
import { ContractorReviewsComponent } from '../../../contractors/contractor-reviews/contractor-reviews.component';
import { AuthService } from '../../../core/services/auth.service';

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
    MatDialogModule,
    MatDividerModule,
    MatTooltipModule,
    ContractorReviewsComponent
  ],
  template: `
    <div class="contractor-detail-container" *ngIf="!isLoading; else loading">
      <button mat-icon-button class="back-btn" [routerLink]="['/contractors']" aria-label="Back to list">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <mat-card class="profile-card" *ngIf="contractor">
        <div class="profile-header">
          <div class="profile-image">
            <img [src]="profilePhoto?.url || 'assets/images/default-profile.png'" alt="Profile Image">
          </div>
          <div class="profile-info">
            <mat-card-header>
              <mat-card-title>{{contractor.fullName}}</mat-card-title>
              <mat-card-subtitle>{{contractor.companyName}}</mat-card-subtitle>
            </mat-card-header>
            <div class="rating" *ngIf="contractor.rating">
              <mat-icon>star</mat-icon>
              <span>{{contractor.rating}} ({{contractor.reviewCount || 0}} reviews)</span>
            </div>
          </div>
        </div>

        <mat-card-content>
          <div class="contact-info-card">
            <div class="section-header">
              <mat-icon>contact_phone</mat-icon>
              <span>Contact Information</span>
            </div>
            <div class="contact-info">
              <div class="location">
                <mat-icon>location_on</mat-icon>
                <span>{{contractor.location}}</span>
              </div>
              <div class="price-level">
                {{ '$'.repeat(contractor.priceLevel) }}
              </div>
              <div class="contact" *ngIf="contractor.phoneNumber">
                <mat-icon>phone</mat-icon>
                <span>{{contractor.phoneNumber}}</span>
              </div>
              <div class="email">
                <mat-icon>email</mat-icon>
                <span>{{contractor.email}}</span>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="bio-section">
            <div class="section-header">
              <mat-icon>info</mat-icon>
              <span>About</span>
            </div>
            <div class="bio-content">
              <p>{{contractor.bio || 'No bio provided'}}</p>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="services-section">
            <div class="section-header">
              <mat-icon>build_circle</mat-icon>
              <span>Services Offered</span>
            </div>
            <div class="services-chips-bg">
              <mat-chip *ngFor="let service of contractor.services" color="primary" selected class="service-chip">
                <span class="chip-content">
                  <mat-icon class="service-icon">build</mat-icon>
                  {{service}}
                </span>
              </mat-chip>
            </div>
          </div>

          <div class="portfolio-section" *ngIf="portfolioPhotos.length > 0">
            <div class="section-header">
              <mat-icon>collections</mat-icon>
              <span>Portfolio</span>
            </div>
            <div class="portfolio-grid">
              <div class="portfolio-item" *ngFor="let photo of portfolioPhotos">
                <img [src]="photo.url" [alt]="'Portfolio image ' + photo.id">
              </div>
            </div>
          </div>

          <div class="actions">
            <!-- Show Create Job Request button only when active role is client -->
            <button *ngIf="isClient" 
                    mat-raised-button 
                    color="primary" 
                    (click)="openCreateJobDialog()" 
                    class="create-job-btn">
              <mat-icon>add</mat-icon>
              Create Job Request
            </button>
            <button mat-stroked-button color="primary" class="contact-btn" *ngIf="contractor.phoneNumber">
              <mat-icon>phone</mat-icon>
              Call
            </button>
            <button mat-stroked-button color="primary" class="contact-btn">
              <mat-icon>message</mat-icon>
              Message
            </button>
          </div>
        </mat-card-content>
      </mat-card>
      <app-contractor-reviews *ngIf="contractor" [contractorId]="contractor.userId"></app-contractor-reviews>
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
      max-width: 900px;
      margin: 0 auto;
      position: relative;
    }

    .back-btn {
      position: absolute;
      top: 1.2rem;
      left: 1.2rem;
      z-index: 2;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: background 0.2s;
    }

    .back-btn:hover {
      background: #e3f2fd;
    }

    .profile-card {
      margin-bottom: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .profile-header {
      display: flex;
      gap: 2rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 12px 12px 0 0;
    }

    .profile-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .profile-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ffc107;
      margin-top: 0.5rem;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .contact-info-card {
      background: #f5faff;
      border-radius: 10px;
      padding: 1.2rem 1.5rem 1.2rem 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.06);
    }

    .contact-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 0.7rem;
    }

    .location, .contact, .email {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
    }

    .location mat-icon, .contact mat-icon, .email mat-icon {
      color: #1976d2;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1976d2;
      margin-bottom: 0.7rem;
    }

    .bio-section {
      margin: 2rem 0;
      padding: 0 1.5rem;
    }

    .bio-content {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1.2rem;
      color: #444;
      font-size: 1.08rem;
      min-height: 2.5em;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .services-section {
      margin: 2rem 0;
      padding: 0 1.5rem;
    }

    .services-chips-bg {
      background: #f5faff;
      border-radius: 8px;
      padding: 1rem 1.2rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.7rem;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.04);
    }

    .service-chip {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      background: #e3f2fd;
      color: #1976d2;
      font-weight: 500;
      font-size: 1.01rem;
    }

    .chip-content {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .service-icon {
      font-size: 18px;
      margin-right: 0.3rem;
      padding: 0;
      vertical-align: middle;
    }

    .portfolio-section {
      margin: 2rem 0;
      padding: 0 1.5rem;
    }

    .portfolio-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .portfolio-item {
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .portfolio-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .actions {
      margin-top: 2rem;
      padding: 0 1.5rem 1.5rem;
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .create-job-btn, .contact-btn {
      padding: 0.5rem 1.5rem;
      font-weight: 600;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
      background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
      color: #fff;
      transition: background 0.2s;
    }

    .create-job-btn mat-icon, .contact-btn mat-icon {
      margin-right: 0.5rem;
    }

    .create-job-btn:hover, .contact-btn:hover {
      background: linear-gradient(90deg, #1565c0 0%, #1976d2 100%);
      color: #fff;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
    }

    .price-level {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4CAF50;
    }

    .price-level mat-icon {
      color: #4CAF50;
    }

    @media (max-width: 768px) {
      .contractor-detail-container {
        padding: 1rem;
      }

      .profile-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 1rem;
      }

      .contact-info {
        grid-template-columns: 1fr;
      }

      .actions {
        flex-direction: column;
        
        button {
          width: 100%;
        }
      }
    }
  `]
})
export class ContractorDetailComponent implements OnInit {
  contractor: ContractorProfile | null = null;
  profilePhoto: Photo | null = null;
  portfolioPhotos: Photo[] = [];
  isLoading = true;
  isClient = false;

  constructor(
    private route: ActivatedRoute,
    private contractorService: ContractorService,
    private photoService: PhotoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public authService: AuthService
  ) {
    // Subscribe to activeRole changes
    this.authService.activeRole$.subscribe(role => {
      this.isClient = role === 'client';
    });
  }

  ngOnInit() {
    const contractorId = this.route.snapshot.paramMap.get('id');
    if (contractorId) {
      this.loadContractor(contractorId);
    }
  }

  loadContractor(id: string) {
    this.isLoading = true;
    forkJoin({
      contractor: this.contractorService.getContractorById(id),
      photos: this.photoService.getContractorPhotos(Number(id))
    }).subscribe({
      next: ({ contractor, photos }) => {
        if (typeof contractor.services === 'string') {
          contractor.services = (contractor.services as string).split(',').map(s => s.trim());
        }
        this.contractor = contractor;
        this.profilePhoto = photos.find(photo => photo.type === 0) || null;
        this.portfolioPhotos = photos.filter(photo => photo.type === 1);
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
    
    // Check if active role is client
    if (!this.isClient) {
      this.snackBar.open('Please switch to client role to create job requests.', 'Close', {
        duration: 5000
      });
      return;
    }

    const dialogRef = this.dialog.open(CreateJobDialogComponent, {
      width: '500px',
      data: {
        contractorId: this.contractor.userId,
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