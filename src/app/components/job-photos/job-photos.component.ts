import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JobPhotoService, JobPhoto } from '../../services/job-photo.service';
import { AuthService } from '../../core/services/auth.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

@Component({
  selector: 'app-job-photos',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="photos-container">
      <!-- Upload Section -->
      <div class="upload-section" *ngIf="isClient">
        <input
          type="file"
          #fileInput
          (change)="onFileSelected($event)"
          accept="image/*"
          style="display: none"
          multiple
        />
        <button
          mat-raised-button
          color="primary"
          (click)="fileInput.click()"
          [disabled]="isUploading"
          matTooltip="Upload photos (max 5MB each)"
        >
          <mat-icon>add_photo_alternate</mat-icon>
          Add Photos
        </button>
        <span class="upload-hint" *ngIf="!isUploading">
          Supported formats: JPG, PNG, GIF
        </span>
      </div>

      <!-- Progress Bar -->
      <mat-progress-bar
        *ngIf="isUploading"
        mode="determinate"
        [value]="uploadProgress"
        class="upload-progress"
      ></mat-progress-bar>

      <!-- Photos Grid -->
      <div class="photos-grid" *ngIf="photos.length > 0">
        <div class="photo-item" *ngFor="let photo of photos">
          <div class="photo-container">
            <img 
              [src]="getPhotoSrc(photo)" 
              [alt]="photo.fileName"
              (error)="handleImageError($event)"
              class="photo-image"
            />
            <div class="photo-overlay" *ngIf="isClient">
              <button
                mat-icon-button
                color="warn"
                class="delete-button"
                (click)="deletePhoto(photo)"
                [disabled]="isUploading"
                matTooltip="Delete photo"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
          <div class="photo-info">
            <span class="photo-name" [matTooltip]="photo.fileName">
              {{ photo.fileName }}
            </span>
            <span class="photo-date">
              {{ photo.uploadedAt | date:'short' }}
            </span>
          </div>
        </div>
      </div>

      <!-- No Photos Message -->
      <div class="no-photos" *ngIf="photos.length === 0 && !isUploading">
        <mat-icon>photo_library</mat-icon>
        <p>No photos uploaded yet</p>
        <span class="upload-hint" *ngIf="isClient">Click the button above to add photos</span>
      </div>
    </div>
  `,
  styles: [`
    .photos-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      background: #fafafa;
      border-radius: 8px;
    }

    .upload-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .upload-hint {
      color: #666;
      font-size: 0.875rem;
    }

    .upload-progress {
      margin: 0.5rem 0;
    }

    .photos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .photo-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .photo-container {
      position: relative;
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      background: #fff;
    }

    .photo-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.2s;
    }

    .photo-container:hover .photo-image {
      transform: scale(1.05);
    }

    .photo-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: flex-end;
      padding: 0.5rem;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .photo-container:hover .photo-overlay {
      opacity: 1;
    }

    .delete-button {
      background: rgba(255, 255, 255, 0.9);
      transition: transform 0.2s;
    }

    .delete-button:hover {
      transform: scale(1.1);
    }

    .photo-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .photo-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .photo-date {
      font-size: 0.75rem;
      color: #666;
    }

    .no-photos {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 2rem;
      background: #fff;
      border-radius: 8px;
      color: #666;
      text-align: center;
    }

    .no-photos mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
    }

    @media (max-width: 600px) {
      .photos-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `]
})
export class JobPhotosComponent implements OnInit {
  @Input({ required: true }) jobId!: string;
  @Input() isNewJob = false;

  photos: JobPhoto[] = [];
  isUploading = false;
  uploadProgress = 0;
  private tempPhotos: File[] = [];
  private isLoading = false;
  isClient = false;

  constructor(
    private jobPhotoService: JobPhotoService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.activeRole$.subscribe(role => {
      this.isClient = role === 'client';
    });

    if (!this.isNewJob) {
      this.loadPhotos();
    }
  }

  loadPhotos() {
    if (this.isLoading) {
      return;
    }
    
    this.isLoading = true;
    this.jobPhotoService.getPhotos(Number(this.jobId)).subscribe({
      next: (photos) => {
        this.photos = photos;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load photos', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const files = Array.from(input.files);
    
    if (!this.validateFiles(files)) {
      return;
    }

    if (this.isNewJob) {
      this.handleNewJobFiles(files);
    } else {
      this.uploadPhotos(files);
    }
  }

  private validateFiles(files: File[]): boolean {
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        this.snackBar.open('Please select only image files', 'Close', { duration: 3000 });
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        this.snackBar.open('Image size should be less than 5MB', 'Close', { duration: 3000 });
        return false;
      }
    }
    return true;
  }

  private handleNewJobFiles(files: File[]) {
    this.tempPhotos.push(...files);
    files.forEach(file => this.createTempPhotoPreview(file));
  }

  private uploadPhotos(files: File[]) {
    this.isUploading = true;
    this.uploadProgress = 0;
    const totalFiles = files.length;
    let completedFiles = 0;

    files.forEach(file => {
      this.jobPhotoService.uploadPhoto(Number(this.jobId), file).subscribe({
        next: (photo) => {
          this.photos.push(photo);
          completedFiles++;
          this.uploadProgress = (completedFiles / totalFiles) * 100;
          
          if (completedFiles === totalFiles) {
            this.isUploading = false;
            this.snackBar.open('Photos uploaded successfully', 'Close', { duration: 3000 });
          }
        },
        error: () => {
          this.isUploading = false;
          this.uploadProgress = 0;
          this.snackBar.open('Failed to upload photos', 'Close', { duration: 3000 });
        }
      });
    });
  }

  private createTempPhotoPreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        const base64Data = (e.target.result as string).split(',')[1];
        this.photos.push({
          id: -1,
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
          data: base64Data,
          contentType: file.type
        });
      }
    };
    reader.readAsDataURL(file);
  }

  deletePhoto(photo: JobPhoto) {
    if (this.isNewJob) {
      this.deleteTempPhoto(photo);
    } else {
      this.deleteServerPhoto(photo);
    }
  }

  private deleteTempPhoto(photo: JobPhoto) {
    const index = this.photos.findIndex(p => p.id === photo.id);
    if (index !== -1) {
      this.photos.splice(index, 1);
      const fileIndex = this.tempPhotos.findIndex((_, i) => i === index);
      if (fileIndex !== -1) {
        this.tempPhotos.splice(fileIndex, 1);
      }
    }
  }

  private deleteServerPhoto(photo: JobPhoto) {
    this.jobPhotoService.deletePhoto(Number(this.jobId), photo.id).subscribe({
      next: () => {
        this.photos = this.photos.filter(p => p.id !== photo.id);
        this.snackBar.open('Photo deleted successfully', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to delete photo', 'Close', { duration: 3000 });
      }
    });
  }

  getPhotoSrc(photo: JobPhoto): string {
    if (!photo.data || !photo.contentType) {
      return '';
    }
    return `data:${photo.contentType};base64,${photo.data}`;
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  getTempPhotos(): File[] {
    return this.tempPhotos;
  }
} 