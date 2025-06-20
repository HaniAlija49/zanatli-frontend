import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ContractorService } from '../../../core/services/contractor.service';
import { ContractorProfile, CreateContractorProfileDto, UpdateContractorProfileDto } from '../../../core/models/contractor.models';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PhotoPreviewComponent } from './photo-preview/photo-preview.component';
import { JobCreateDialogComponent } from '../../client/client-jobs/job-create-dialog.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contractor-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="profile-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{isEditing ? 'Edit Profile' : (profile ? 'My Profile' : 'Create Profile')}}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <!-- Loading State -->
          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>

          <!-- View Mode -->
          <div *ngIf="!isLoading && profile && !isEditing" class="profile-view">
            <div class="profile-header">
              <div class="photo-section">
                <div class="profile-photo-wrapper" (click)="previewPhoto(profilePhotoUrl, 'profile')">
                  <img *ngIf="profilePhotoUrl" [src]="profilePhotoUrl" class="profile-photo" alt="Profile Photo">
                  <div *ngIf="!profilePhotoUrl" class="profile-photo-placeholder">
                    <mat-icon>person</mat-icon>
                  </div>
                </div>
                <input type="file" accept="image/*" (change)="onPhotoSelected($event)" id="profilePhotoInput" hidden>
                <button mat-stroked-button color="primary" (click)="triggerPhotoInput()">
                  {{ profilePhotoUrl ? 'Change Photo' : 'Upload Photo' }}
                </button>
                <mat-spinner *ngIf="isPhotoUploading" diameter="24"></mat-spinner>
              </div>
              <div class="profile-info">
                <h2>{{profile.fullName}}</h2>
                <p class="company-name">{{profile.companyName}}</p>
                <p class="location"><mat-icon>location_on</mat-icon> {{profile.location}}</p>
                <p class="price-level">
                  <span class="label">Price:</span>
                  <span class="value">{{ profile.priceLevel ? '$'.repeat(profile.priceLevel) : '-' }}</span>
                </p>
                <p class="phone" *ngIf="profile.phoneNumber">
                  <mat-icon>phone</mat-icon>
                  {{profile.phoneNumber}}
                </p>
              </div>
            </div>

            <div class="profile-section">
              <h3>About</h3>
              <p>{{profile.bio || 'No bio provided'}}</p>
            </div>

            <div class="profile-section">
              <h3>Services</h3>
              <div class="services-list">
                <mat-chip *ngFor="let service of services">{{service}}</mat-chip>
              </div>
            </div>

            <div class="profile-section">
              <h3>Portfolio</h3>
              <div class="portfolio-images">
                <div *ngFor="let img of portfolioImages" class="portfolio-img-wrapper">
                  <img [src]="img" class="portfolio-img" alt="Portfolio Image" (click)="previewPhoto(img, 'portfolio')">
                  <button mat-icon-button color="warn" (click)="deletePortfolioImage(img)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
                <div class="add-portfolio">
                  <input type="file" accept="image/*" (change)="onPortfolioSelected($event)" id="portfolioInput" hidden>
                  <button mat-stroked-button color="primary" (click)="triggerPortfolioInput()">
                    <mat-icon>add_photo_alternate</mat-icon>
                    Add Image
                  </button>
                  <mat-spinner *ngIf="isPortfolioUploading" diameter="24"></mat-spinner>
                </div>
              </div>
            </div>

            <div class="actions">
              <button mat-raised-button color="primary" (click)="startEditing()">
                <mat-icon>edit</mat-icon>
                Edit Profile
              </button>
              <!-- Only show Request Job button for clients -->
              <button *ngIf="authService.hasRole('client') && !authService.hasRole('contractor')" 
                      mat-raised-button color="accent" 
                      (click)="openJobCreateDialog()">
                <mat-icon>work</mat-icon>
                Request Job
              </button>
            </div>
          </div>

          <!-- Edit/Create Form -->
          <form *ngIf="!isLoading && (!profile || isEditing)" [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="fullName" required>
              <mat-error *ngIf="profileForm.get('fullName')?.hasError('required')">Full name is required</mat-error>
              <mat-error *ngIf="profileForm.get('fullName')?.hasError('minlength')">Full name must be at least 2 characters</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Company Name</mat-label>
              <input matInput formControlName="companyName" required>
              <mat-error *ngIf="profileForm.get('companyName')?.hasError('required')">Company name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Location</mat-label>
              <input matInput formControlName="location" required>
              <mat-error *ngIf="profileForm.get('location')?.hasError('required')">Location is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Bio</mat-label>
              <textarea matInput formControlName="bio" rows="4"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Services (Press Enter or comma to add)</mat-label>
              <mat-chip-grid #chipGrid aria-label="Enter services">
                <mat-chip-row *ngFor="let service of services" (removed)="removeService(service)">
                  {{service}}
                  <button matChipRemove>
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip-row>
                <input placeholder="Add a service..."
                       [matChipInputFor]="chipGrid"
                       [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                       (matChipInputTokenEnd)="addService($event)">
              </mat-chip-grid>
              <mat-hint>Add at least one service by typing and pressing Enter or comma</mat-hint>
              <mat-error *ngIf="profileForm.get('services')?.hasError('required')">At least one service is required</mat-error>
              <mat-error *ngIf="profileForm.get('services')?.hasError('minlength')">At least one service is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Price Level</mat-label>
              <input matInput formControlName="priceLevel" type="number" required min="1" max="3">
              <mat-error *ngIf="profileForm.get('priceLevel')?.hasError('required')">Price level is required</mat-error>
              <mat-error *ngIf="profileForm.get('priceLevel')?.hasError('min')">Price level must be at least 1</mat-error>
              <mat-error *ngIf="profileForm.get('priceLevel')?.hasError('max')">Price level must be at most 3</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Phone Number</mat-label>
              <input matInput formControlName="phoneNumber">
            </mat-form-field>

            <div class="actions">
              <button mat-button type="button" *ngIf="isEditing" (click)="cancelEditing()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || isLoading">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                <span *ngIf="!isLoading">{{isEditing ? 'Update Profile' : 'Create Profile'}}</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
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
    .profile-view {
      padding: 1rem 0;
    }
    .profile-header {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .photo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .profile-photo {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #ccc;
    }
    .profile-photo-placeholder {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background-color: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .profile-photo-placeholder mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #666;
    }
    .profile-info {
      flex: 1;
    }
    .profile-info h2 {
      margin: 0 0 0.5rem 0;
      font-size: 24px;
    }
    .company-name {
      font-size: 18px;
      color: #666;
      margin: 0 0 0.5rem 0;
    }
    .location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      margin: 0;
    }
    .profile-section {
      margin-bottom: 2rem;
    }
    .profile-section h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }
    .services-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .portfolio-images {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }
    .portfolio-img-wrapper {
      position: relative;
      aspect-ratio: 1;
    }
    .portfolio-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #ccc;
    }
    .portfolio-img-wrapper button {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(255,255,255,0.9);
    }
    .add-portfolio {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed #ccc;
      border-radius: 8px;
    }
    mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }
    .profile-photo-wrapper {
      cursor: pointer;
      transition: transform 0.2s;
    }
    .profile-photo-wrapper:hover {
      transform: scale(1.05);
    }
    .portfolio-img {
      cursor: pointer;
      transition: transform 0.2s;
    }
    .portfolio-img:hover {
      transform: scale(1.05);
    }
    .price-level {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      margin: 8px 0;

      .label {
        color: #666;
        font-weight: 500;
      }

      .value {
        color: #4CAF50;
        font-weight: 600;
      }
    }
  `]
})
export class ContractorProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  profile: ContractorProfile | null = null;
  services: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  profilePhotoUrl: string | null = null;
  isPhotoUploading = false;
  portfolioImages: string[] = [];
  isPortfolioUploading = false;
  profileCreated = false;
  selectedFile: File | null = null;
  profileImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private contractorService: ContractorService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private dialog: MatDialog,
    public authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(2)]],
      bio: ['', [Validators.required, Validators.minLength(10)]],
      services: this.fb.control([], {
        validators: [Validators.required, Validators.minLength(1)],
        nonNullable: true
      }),
      priceLevel: [1, [Validators.required, Validators.min(1), Validators.max(3)]],
      phoneNumber: ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.contractorService.getMyProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        if (profile) {
          if (typeof profile.services === 'string') {
            this.services = (profile.services as string).split(',').map(s => s.trim()).filter(Boolean);
          } else {
            this.services = profile.services;
          }
          
          this.profileForm.patchValue({
            fullName: profile.fullName,
            companyName: profile.companyName,
            location: profile.location,
            bio: profile.bio,
            services: this.services,
            priceLevel: profile.priceLevel || 1,
            phoneNumber: profile.phoneNumber || ''
          });
          this.loadProfilePhoto();
          this.loadPortfolioImages();
          this.profileCreated = true;
        } else {
          this.profileForm.reset();
          this.services = [];
          this.profileCreated = false;
          this.profilePhotoUrl = null;
          this.portfolioImages = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.profile = null;
        this.profileCreated = false;
        this.profilePhotoUrl = null;
        this.portfolioImages = [];
        this.isLoading = false;
        this.snackBar.open('Error loading profile. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  startEditing() {
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
    // Reset form to current profile values
    if (this.profile) {
      this.profileForm.patchValue({
        fullName: this.profile.fullName,
        companyName: this.profile.companyName,
        location: this.profile.location,
        bio: this.profile.bio,
        services: this.services,
        priceLevel: this.profile.priceLevel || 1,
        phoneNumber: this.profile.phoneNumber || ''
      });
    }
  }

  loadProfilePhoto() {
    if (!this.profile) {
      this.profilePhotoUrl = null;
      return;
    }

    this.http.get<any[]>(`${environment.apiUrl}/contractors/me/photos`).subscribe({
      next: (photos) => {
        const profilePhoto = photos.find(p => p.type === 0);
        if (profilePhoto) {
          this.profilePhotoUrl = `${environment.apiUrl}/contractors/${this.profile?.id}/photos/${profilePhoto.id}`;
        } else {
          this.profilePhotoUrl = null;
        }
      },
      error: () => {
        this.profilePhotoUrl = null;
      }
    });
  }

  loadPortfolioImages() {
    if (!this.profile) {
      this.portfolioImages = [];
      return;
    }

    this.http.get<any[]>(`${environment.apiUrl}/contractors/me/photos`).subscribe({
      next: (photos) => {
        this.portfolioImages = photos
          .filter(p => p.type === 1)
          .map(p => `${environment.apiUrl}/contractors/${this.profile?.id}/photos/${p.id}`);
      },
      error: () => {
        this.portfolioImages = [];
      }
    });
  }

  triggerPhotoInput() {
    const input = document.getElementById('profilePhotoInput') as HTMLInputElement;
    if (input) input.click();
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);
      this.isPhotoUploading = true;

      this.http.post<any>(`${environment.apiUrl}/contractors/me/photos?type=0`, formData).subscribe({
        next: () => {
          this.snackBar.open('Profile photo uploaded!', 'Close', { duration: 3000 });
          this.loadProfilePhoto();
          this.isPhotoUploading = false;
        },
        error: () => {
          this.snackBar.open('Failed to upload photo.', 'Close', { duration: 3000 });
          this.isPhotoUploading = false;
        }
      });
    }
  }

  triggerPortfolioInput() {
    const input = document.getElementById('portfolioInput') as HTMLInputElement;
    if (input) input.click();
  }

  onPortfolioSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);
      this.isPortfolioUploading = true;

      this.http.post<any>(`${environment.apiUrl}/contractors/me/photos?type=1`, formData).subscribe({
        next: () => {
          this.snackBar.open('Portfolio image uploaded!', 'Close', { duration: 3000 });
          this.loadPortfolioImages();
          this.isPortfolioUploading = false;
        },
        error: () => {
          this.snackBar.open('Failed to upload portfolio image.', 'Close', { duration: 3000 });
          this.isPortfolioUploading = false;
        }
      });
    }
  }

  deletePortfolioImage(photoUrl: string) {
    this.http.delete(`${environment.apiUrl}/contractors/me/photos/${photoUrl.split('/').pop()}`).subscribe({
      next: () => {
        this.snackBar.open('Portfolio image deleted!', 'Close', { duration: 3000 });
        this.loadPortfolioImages();
      },
      error: () => {
        this.snackBar.open('Failed to delete portfolio image.', 'Close', { duration: 3000 });
      }
    });
  }

  addService(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.services.push(value);
      const servicesControl = this.profileForm.get('services');
      if (servicesControl) {
        servicesControl.setValue([...this.services]);
      }
    }
    event.chipInput!.clear();
  }

  removeService(service: string): void {
    const index = this.services.indexOf(service);
    if (index >= 0) {
      this.services.splice(index, 1);
      const servicesControl = this.profileForm.get('services');
      if (servicesControl) {
        servicesControl.setValue([...this.services]);
      }
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const formData = this.profileForm.value;
      
      const data: CreateContractorProfileDto = {
        fullName: formData.fullName,
        companyName: formData.companyName,
        location: formData.location,
        bio: formData.bio,
        services: this.services,
        priceLevel: parseInt(formData.priceLevel, 10),
        phoneNumber: formData.phoneNumber || undefined
      };

      this.contractorService.createProfile(data).subscribe({
        next: (profile) => {
          this.snackBar.open('Profile created successfully!', 'Close', { duration: 5000 });
          this.isLoading = false;
          this.profile = profile;
          this.profileCreated = true;
          this.loadProfile();
        },
        error: () => {
          this.snackBar.open('Error creating profile. Please try again.', 'Close', { duration: 5000 });
          this.isLoading = false;
        }
      });
    }
  }

  previewPhoto(photoUrl: string | null, photoType: 'profile' | 'portfolio'): void {
    if (photoUrl) {
      this.dialog.open(PhotoPreviewComponent, {
        data: { photoUrl, photoType },
        maxWidth: '90vw',
        maxHeight: '90vh',
        panelClass: 'photo-preview-dialog'
      });
    }
  }

  openJobCreateDialog() {
    if (this.profile) {
      this.dialog.open(JobCreateDialogComponent, {
        width: '400px',
        data: { contractorId: this.profile.userId }
      });
    }
  }
} 