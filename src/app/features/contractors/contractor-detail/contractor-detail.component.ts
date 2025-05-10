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
    MatTooltipModule
  ],
  template: `
    <div class="contractor-detail-container" *ngIf="!isLoading; else loading">
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
          <div class="contact-info">
            <div class="location">
              <mat-icon>location_on</mat-icon>
              <span>{{contractor.location}}</span>
            </div>
            <div class="contact" *ngIf="contractor.phone">
              <mat-icon>phone</mat-icon>
              <span>{{contractor.phone}}</span>
            </div>
            <div class="email">
              <mat-icon>email</mat-icon>
              <span>{{contractor.email}}</span>
            </div>
          </div>

          <mat-divider></mat-divider>
          
          <div class="bio-section">
            <h3>About</h3>
            <p>{{contractor.bio || 'No bio provided'}}</p>
          </div>

          <mat-divider></mat-divider>

          <div class="services-section">
            <h3>Services Offered</h3>
            <div class="services">
              <mat-chip *ngFor="let service of contractor.services" 
                       color="primary" 
                       selected
                       class="service-chip">
                <mat-icon class="service-icon">build</mat-icon>
                {{service}}
              </mat-chip>
            </div>
          </div>

          <div class="portfolio-section" *ngIf="portfolioPhotos.length > 0">
            <h3>Portfolio</h3>
            <div class="portfolio-grid">
              <div class="portfolio-item" *ngFor="let photo of portfolioPhotos">
                <img [src]="photo.url" [alt]="'Portfolio image ' + photo.id">
              </div>
            </div>
          </div>

          <div class="actions">
            <button mat-raised-button color="primary" (click)="openCreateJobDialog()" class="create-job-btn">
              <mat-icon>add</mat-icon>
              Create Job Request
            </button>
            <button mat-stroked-button color="primary" class="contact-btn" *ngIf="contractor.phone">
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

    .contact-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      margin: 1.5rem 0;
    }

    .location, .contact, .email {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;

      mat-icon {
        color: #1976d2;
      }
    }

    .bio-section, .services-section, .portfolio-section {
      margin: 2rem 0;
      padding: 0 1.5rem;
    }

    h3 {
      color: #333;
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
      font-weight: 500;
    }

    .services {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .service-chip {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      
      .service-icon {
        margin-right: 0.5rem;
        font-size: 18px;
      }
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

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
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
      
      mat-icon {
        margin-right: 0.5rem;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 400px;
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

      .portfolio-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
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

  constructor(
    private route: ActivatedRoute,
    private contractorService: ContractorService,
    private photoService: PhotoService,
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