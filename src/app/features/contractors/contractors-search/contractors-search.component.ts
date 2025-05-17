import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContractorService } from '../../../core/services/contractor.service';
import { ContractorProfile } from '../../../core/models/contractor.models';
import { PhotoService, Photo } from '../../../core/services/photo.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-contractors-search',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSelectModule
  ],
  template: `
    <div class="search-container">
      <mat-card class="search-card">
        <mat-card-header>
          <mat-card-title>Find Contractors</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="search-bar-flex">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search</mat-label>
              <input matInput formControlName="search" placeholder="Name, company, or service">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Location</mat-label>
              <input matInput formControlName="location" placeholder="Location">
              <mat-icon matSuffix>location_on</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Price Level</mat-label>
              <mat-select formControlName="priceLevels" multiple>
                <mat-option value="1">$</mat-option>
                <mat-option value="2">$$</mat-option>
                <mat-option value="3">$$$</mat-option>
              </mat-select>
            </mat-form-field>
            <button mat-flat-button color="primary" type="submit" [disabled]="isLoading" class="search-btn">
              <mat-icon>search</mat-icon>
              <span>Search</span>
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <div class="results-container" *ngIf="contractors.length > 0">
        <mat-card *ngFor="let contractor of contractors" class="contractor-card">
          <div class="card-header-flex">
            <div class="profile-img-wrapper">
              <img class="profile-img" [src]="contractorPhotos[contractor.id] || 'assets/images/default-profile.png'" alt="Profile" />
            </div>
            <div class="header-info">
              <div class="name-row">
                <span class="contractor-name">{{contractor.fullName}}</span>
                <span class="company">{{contractor.companyName}}</span>
              </div>
              <div class="rating" *ngIf="contractor.rating">
                <mat-icon>star</mat-icon>
                <span>{{contractor.rating}} <span class="review-count">({{contractor.reviewCount || 0}} reviews)</span></span>
              </div>
              <div class="location-badge">
                <mat-icon>location_on</mat-icon>
                <span>{{contractor.location}}</span>
              </div>
              <div class="price-level">
                <span class="label">Price:</span>
                <span class="value">{{ contractor.priceLevel ? '$'.repeat(contractor.priceLevel) : '-' }}</span>
              </div>
            </div>
          </div>
          <mat-card-content class="card-content-flex">
            <div class="bio" [matTooltip]="contractor.bio" [matTooltipDisabled]="!(contractor.bio && (contractor.bio.length || 0) > 120)">
              {{ (contractor.bio.length || 0) > 120 ? (contractor.bio | slice:0:120) + '...' : contractor.bio }}
            </div>
            <div class="services">
              <mat-chip *ngFor="let service of contractor.services.slice(0,3)" color="primary" selected>
                <span class="chip-content">
              <mat-icon class="service-icon">build</mat-icon>
            {{ service }}
           </span>
              </mat-chip>
              <span *ngIf="contractor.services.length > 3" class="more-services">+{{contractor.services.length - 3}} more</span>
            </div>
          </mat-card-content>
          <div class="actions">
            <a mat-flat-button color="accent" [routerLink]="['/contractors', contractor.id]">
              <mat-icon>visibility</mat-icon>
              View Profile
            </a>
          </div>
        </mat-card>
      </div>

      <div class="no-results" *ngIf="!isLoading && contractors.length === 0">
        <p>No contractors found. Try adjusting your search criteria.</p>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .search-card {
      margin-bottom: 2rem;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    }

    .search-bar-flex {
      display: flex;
      align-items: stretch;
      gap: 1.2rem;
      background: #f5faff;
      border-radius: 12px;
      padding: 1.2rem 1rem 1rem 1rem;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.04);
      flex-wrap: nowrap;
    }
    .search-field {
      flex: 1 1 0;
      min-width: 180px;
      margin-bottom: 0;
    }
    .search-btn {
      height: 56px;
      align-self: stretch;
      font-weight: 600;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
      padding: 0 1.5rem;
      background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
      color: #fff;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      min-width: 120px;
      margin-bottom: 0;
    }
    .search-btn:hover {
      background: linear-gradient(90deg, #1565c0 0%, #1976d2 100%);
      color: #fff;
    }

    .results-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 2rem;
    }

    .contractor-card {
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
      transition: box-shadow 0.2s, transform 0.2s;
      padding-bottom: 1rem;
      background: #fff;
      display: flex;
      flex-direction: column;
      min-height: 320px;
      position: relative;
      height: 100%;
    }
    .contractor-card:hover {
      box-shadow: 0 8px 32px rgba(25, 118, 210, 0.18);
      transform: translateY(-4px) scale(1.02);
    }

    .card-header-flex {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem 1.5rem 0 1.5rem;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 0.8rem;
    }
    .profile-img-wrapper {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
      border: 3px solid #fff;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .profile-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
    .header-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .name-row {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .contractor-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #222;
    }
    .company {
      font-size: 1rem;
      color: #1976d2;
      font-weight: 500;
    }
    .rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ffc107;
      font-size: 1rem;
    }
    .review-count {
      color: #888;
      font-size: 0.95em;
      margin-left: 0.2em;
    }
    .location-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      background: #e3f2fd;
      color: #1976d2;
      border-radius: 12px;
      padding: 0.2rem 0.7rem 0.2rem 0.5rem;
      font-size: 0.98rem;
      margin-top: 0.2rem;
      width: fit-content;
    }
    .price-level {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      background: #e8f5e9;
      color: #4CAF50;
      border-radius: 12px;
      padding: 0.2rem 0.7rem 0.2rem 0.5rem;
      font-size: 0.98rem;
      margin-top: 0.2rem;
      width: fit-content;

      .label {
        color: #666;
        font-weight: 500;
      }

      .value {
        color: #4CAF50;
        font-weight: 600;
      }
    }
    .price-level mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .bio {
      margin: 1.2rem 0 0.7rem 0;
      color: #444;
      font-size: 1.05rem;
      min-height: 2.5em;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .services {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
}

.chip-content {
  display: flex;
  align-items: center; /* ✅ vertical alignment fix */
  gap: 0.3rem;
}

.service-icon {
  font-size: 16px;
  padding-top: 8px;
}
    .more-services {
      color: #1976d2;
      font-weight: 500;
      margin-left: 0.5rem;
      font-size: 0.98rem;
      align-self: center;
    }
    .card-content-flex {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .actions {
      margin-top: auto;
      display: flex;
      justify-content: flex-end;
      padding: 0 1.5rem 1rem 1.5rem;
    }
    .actions a[mat-flat-button] {
      font-weight: 600;
      font-size: 1.05rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
      padding: 0.6rem 1.5rem;
      background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
      color: #fff;
      transition: background 0.2s;
    }
    .actions a[mat-flat-button]:hover {
      background: linear-gradient(90deg, #1565c0 0%, #1976d2 100%);
      color: #fff;
    }
    .no-results {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
    mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }
    @media (max-width: 900px) {
      .results-container {
        grid-template-columns: 1fr;
      }
      .contractor-card {
        min-width: 0;
      }
      .search-bar-flex {
        flex-direction: column;
        gap: 0.7rem;
        flex-wrap: wrap;
      }
      .search-btn {
        width: 100%;
        height: 48px;
        min-width: 0;
      }
    }
    @media (max-width: 600px) {
      .search-container {
        padding: 0.5rem;
      }
      .card-header-flex {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem 0.5rem 0 0.5rem;
      }
      .profile-img-wrapper {
        width: 64px;
        height: 64px;
      }
      .header-info {
        gap: 0.3rem;
      }
      .bio {
        font-size: 0.98rem;
      }
      .actions a[mat-flat-button] {
        font-size: 0.98rem;
        padding: 0.5rem 1rem;
      }
    }
  `]
})
export class ContractorsSearchComponent implements OnInit {
  searchForm: FormGroup;
  contractors: ContractorProfile[] = [];
  contractorPhotos: { [contractorId: number]: string } = {};
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private contractorService: ContractorService,
    private photoService: PhotoService,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      search: [''],
      location: [''],
      priceLevels: [[]]
    });
  }

  ngOnInit() {
    this.loadContractors();
  }

  loadContractors(service?: string, location?: string, priceLevels?: number[]) {
    this.isLoading = true;
    this.contractorService.getContractors(service, location, priceLevels).subscribe({
      next: (contractors) => {
        contractors.forEach(contractor => {
          if (typeof contractor.services === 'string') {
            contractor.services = (contractor.services as string).split(',').map((s: string) => s.trim());
          }
        });
        this.contractors = contractors;
        this.loadProfilePhotos(contractors);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading contractors:', error);
        this.snackBar.open('Error loading contractors. Please try again.', 'Close', {
          duration: 5000
        });
        this.isLoading = false;
      }
    });
  }

  loadProfilePhotos(contractors: ContractorProfile[]) {
    contractors.forEach(contractor => {
      this.photoService.getContractorPhotos(contractor.id).subscribe({
        next: (photos) => {
          const profilePhoto = photos.find(photo => photo.type === 0);
          if (profilePhoto) {
            this.contractorPhotos[contractor.id] = profilePhoto.url;
          }
        },
        error: () => {
          // Ignore photo errors, fallback to default
        }
      });
    });
  }

  onSearch() {
    if (this.searchForm.valid) {
      this.isLoading = true;
      const { search, location, priceLevels } = this.searchForm.value;
      // Use API filtering
      this.loadContractors(search, location, priceLevels);
    }
  }
} 